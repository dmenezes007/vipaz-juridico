import {
  type CaseLegalModel,
  type CaseLegalModelValidation,
  validateCaseLegalModel,
} from './caseLegalModel';

export const CASE_ANALYST_VERSION = '1.0.0';

export interface CaseAnalysisInput {
  sourceDocumentIds: string[];
  documentPiece: string;
  organizationId: string;
  matterId?: string;
  /** Text/extraction is supplied by a server-side document tool. Never trust browser summaries as evidence. */
  sourceMaterial: string;
}

export interface CaseAnalysisResult {
  model: CaseLegalModel;
  validation: CaseLegalModelValidation;
  trace: {
    analyzer: 'case-analyst';
    version: string;
    startedAt: string;
    completedAt: string;
  };
}

/**
 * Provider boundary for the Case Analyst.
 *
 * Phase 5.1 deliberately keeps the legal domain independent from a model vendor.
 * The OpenAI Agents runtime will implement this interface server-side. This prevents
 * UI/n8n/Carbone coupling and lets legal evals exercise the canonical model directly.
 */
export interface CaseAnalystProvider {
  analyze(input: CaseAnalysisInput): Promise<CaseLegalModel>;
}

export class CaseAnalyst {
  constructor(private readonly provider: CaseAnalystProvider) {}

  async run(input: CaseAnalysisInput): Promise<CaseAnalysisResult> {
    if (!input.organizationId.trim()) throw new Error('organization_id_required');
    if (!input.documentPiece.trim()) throw new Error('document_piece_required');
    if (input.sourceDocumentIds.length === 0) throw new Error('source_document_required');
    if (!input.sourceMaterial.trim()) throw new Error('source_material_required');

    const startedAt = new Date().toISOString();
    const model = await this.provider.analyze(input);

    // Provenance cannot be silently detached from the documents supplied to the run.
    const supplied = new Set(input.sourceDocumentIds);
    for (const id of model.provenance.sourceDocumentIds) {
      if (!supplied.has(id)) throw new Error(`unexpected_source_document:${id}`);
    }

    const validation = validateCaseLegalModel(model);
    const completedAt = new Date().toISOString();

    return {
      model,
      validation,
      trace: {
        analyzer: 'case-analyst',
        version: CASE_ANALYST_VERSION,
        startedAt,
        completedAt,
      },
    };
  }
}
