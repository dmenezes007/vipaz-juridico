import type { Request, Response } from 'express';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { CaseAnalyst } from '../domain/legal-intelligence/caseAnalyst';

function header(req: Request, name: string) {
  const value = (req as any)?.headers?.[name.toLowerCase()] ?? '';
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

type AuthContext = {
  client: SupabaseClient;
  user: User;
};

async function authenticatedContext(req: Request): Promise<AuthContext | null> {
  const auth = header(req, 'authorization');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!token || !url || !anon) return null;

  const client = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return { client, user: data.user };
}

async function authorizeCaseScope(
  auth: AuthContext,
  organizationId: string,
  processId: string,
  sourceDocumentIds: string[],
) {
  // These reads intentionally use the caller's JWT. Supabase RLS remains the
  // source of truth for tenant isolation; no service-role bypass is used.
  const { data: membership, error: membershipError } = await auth.client
    .from('organization_members')
    .select('organization_id,user_id')
    .eq('organization_id', organizationId)
    .eq('user_id', auth.user.id)
    .maybeSingle();

  if (membershipError || !membership) return { authorized: false as const, reason: 'organization' };

  const { data: process, error: processError } = await auth.client
    .from('processes')
    .select('id,organization_id')
    .eq('id', processId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (processError || !process) return { authorized: false as const, reason: 'process' };

  const { data: documents, error: documentsError } = await auth.client
    .from('source_documents')
    .select('id,organization_id,process_id')
    .eq('organization_id', organizationId)
    .eq('process_id', processId)
    .in('id', sourceDocumentIds);

  if (documentsError || !documents || documents.length !== sourceDocumentIds.length) {
    return { authorized: false as const, reason: 'documents' };
  }

  const authorizedIds = new Set(documents.map((document) => String(document.id)));
  if (sourceDocumentIds.some((id) => !authorizedIds.has(id))) {
    return { authorized: false as const, reason: 'documents' };
  }

  return { authorized: true as const };
}

export async function handleCaseAnalysis(req: Request, res: Response) {
  try {
    if (process.env.LEGAL_INTELLIGENCE_ENGINE_ENABLED !== 'true') {
      return res.status(503).json({ error: 'Legal Intelligence Engine ainda não habilitado.' });
    }

    const auth = await authenticatedContext(req);
    if (!auth) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }

    const body = req.body || {};
    const organizationId = String(body.organization_id || '').trim();
    const processId = String(body.matter_id || '').trim();
    const documentPiece = String(body.document_piece || '').trim();
    const sourceMaterial = String(body.source_material || '').trim();
    const sourceDocumentIds = Array.isArray(body.source_document_ids)
      ? [...new Set(body.source_document_ids.map(String).map((id: string) => id.trim()).filter(Boolean))]
      : [];

    if (!organizationId || !processId || !documentPiece || !sourceMaterial || sourceDocumentIds.length === 0) {
      return res.status(400).json({ error: 'Contexto documental insuficiente para análise.' });
    }

    if (sourceMaterial.length > 2_000_000) {
      return res.status(413).json({ error: 'Material textual excede o limite permitido para esta etapa.' });
    }

    const scope = await authorizeCaseScope(auth, organizationId, processId, sourceDocumentIds);
    if (!scope.authorized) {
      // Deliberately avoid revealing whether another tenant's resource exists.
      return res.status(403).json({ error: 'Acesso ao contexto processual não autorizado.' });
    }

    // IMPORTANT: sourceMaterial is still transitional client-supplied text.
    // The engine remains disabled by default until server-side extraction from
    // the authorized source_documents above replaces this input.
    const { OpenAiCaseAnalystProvider } = await import('./openAiCaseAnalystProvider.js');
    const analyst = new CaseAnalyst(new OpenAiCaseAnalystProvider());
    const result = await analyst.run({
      organizationId,
      matterId: processId,
      documentPiece,
      sourceDocumentIds,
      sourceMaterial,
    });

    if (!result.validation.valid) {
      return res.status(422).json({
        error: 'A análise foi bloqueada pelos controles de proveniência.',
        validation: result.validation,
        trace: result.trace,
      });
    }

    return res.json(result);
  } catch (error) {
    console.error('[VIPAZ][LegalIntelligence][CaseAnalyst]', error);
    return res.status(500).json({ error: 'Não foi possível concluir a análise estruturada do caso.' });
  }
}
