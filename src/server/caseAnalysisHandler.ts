import type { Request, Response } from 'express';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { CaseAnalyst } from '../domain/legal-intelligence/caseAnalyst';
import {
  loadCaseSourceBundle,
  type AuthorizedSourceDocument,
} from './caseSourceLoader';

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
  // Reads use the caller's JWT. RLS remains the source of truth for tenant
  // isolation; this endpoint never uses a service-role bypass.
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
    .select('id,organization_id,process_id,file_name,storage_path,mime_type')
    .eq('organization_id', organizationId)
    .eq('process_id', processId)
    .in('id', sourceDocumentIds);

  if (documentsError || !documents || documents.length !== sourceDocumentIds.length) {
    return { authorized: false as const, reason: 'documents' };
  }

  const byId = new Map(documents.map((document) => [String(document.id), document]));
  if (sourceDocumentIds.some((id) => !byId.has(id))) {
    return { authorized: false as const, reason: 'documents' };
  }

  const authorizedDocuments: AuthorizedSourceDocument[] = sourceDocumentIds.map((id) => {
    const document = byId.get(id)!;
    return {
      id: String(document.id),
      fileName: String(document.file_name || id),
      mimeType: String(document.mime_type || ''),
      storagePath: String(document.storage_path || ''),
    };
  });

  return { authorized: true as const, documents: authorizedDocuments };
}

function sourceLoadHttpError(error: unknown) {
  const code = error instanceof Error ? error.message : String(error);
  if (code === 'source_document_too_large') {
    return { status: 413, error: 'Os autos excedem o limite seguro desta etapa de análise.' };
  }
  if (code.startsWith('source_pdf_extractor_not_configured:')) {
    return {
      status: 503,
      error: 'Extração server-side de PDF ainda não configurada. A análise permaneceu bloqueada com segurança.',
    };
  }
  if (code.startsWith('source_document_type_not_supported:')) {
    return { status: 415, error: 'Tipo de documento ainda não suportado pelo Case Analyst.' };
  }
  if (code.startsWith('source_document_download_failed:') || code.startsWith('source_document_empty:')) {
    return { status: 422, error: 'Não foi possível obter material probatório utilizável dos documentos autorizados.' };
  }
  return null;
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
    const sourceDocumentIds = Array.isArray(body.source_document_ids)
      ? [...new Set(body.source_document_ids.map(String).map((id: string) => id.trim()).filter(Boolean))]
      : [];

    // source_material is deliberately ignored. Evidentiary text must originate
    // server-side from source_documents already authorized for this tenant/case.
    if (!organizationId || !processId || !documentPiece || sourceDocumentIds.length === 0) {
      return res.status(400).json({ error: 'Contexto documental insuficiente para análise.' });
    }

    const scope = await authorizeCaseScope(auth, organizationId, processId, sourceDocumentIds);
    if (!scope.authorized) {
      return res.status(403).json({ error: 'Acesso ao contexto processual não autorizado.' });
    }

    let sourceMaterial: string;
    try {
      const bundle = await loadCaseSourceBundle(auth.client, scope.documents);
      sourceMaterial = bundle.sourceMaterial;
    } catch (error) {
      const mapped = sourceLoadHttpError(error);
      if (mapped) return res.status(mapped.status).json({ error: mapped.error });
      throw error;
    }

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
