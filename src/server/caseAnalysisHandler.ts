import type { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { CaseAnalyst } from '../domain/legal-intelligence/caseAnalyst';

function header(req: Request, name: string) {
  const value = (req as any)?.headers?.[name.toLowerCase()] ?? '';
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

async function authenticated(req: Request) {
  const auth = header(req, 'authorization');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!token || !url || !anon) return false;

  const client = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser();
  return !error && Boolean(data.user);
}

export async function handleCaseAnalysis(req: Request, res: Response) {
  try {
    if (process.env.LEGAL_INTELLIGENCE_ENGINE_ENABLED !== 'true') {
      return res.status(503).json({ error: 'Legal Intelligence Engine ainda não habilitado.' });
    }
    if (!(await authenticated(req))) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }

    const body = req.body || {};
    const organizationId = String(body.organization_id || '').trim();
    const documentPiece = String(body.document_piece || '').trim();
    const sourceMaterial = String(body.source_material || '').trim();
    const sourceDocumentIds = Array.isArray(body.source_document_ids)
      ? body.source_document_ids.map(String).filter(Boolean)
      : [];

    if (!organizationId || !documentPiece || !sourceMaterial || sourceDocumentIds.length === 0) {
      return res.status(400).json({ error: 'Contexto documental insuficiente para análise.' });
    }

    // Provider is loaded only after auth + feature flag. No OpenAI runtime is
    // initialized in the browser or during disabled production flows.
    const { OpenAiCaseAnalystProvider } = await import('./openAiCaseAnalystProvider.js');
    const analyst = new CaseAnalyst(new OpenAiCaseAnalystProvider());
    const result = await analyst.run({
      organizationId,
      matterId: body.matter_id ? String(body.matter_id) : undefined,
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
