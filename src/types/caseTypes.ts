/**
 * VIPAZ Jurídico — Tipos do Workspace do Caso Jurídico
 * Arquitetura de Produto: CASO -> ANÁLISE -> EVIDÊNCIAS -> ESTRATÉGIA -> PEÇA -> REVISÃO -> DOCUMENTO FINAL
 */

import { LegalFormData } from '../domain/legal-engine/types';

export type CaseTab =
  | 'visao-geral'
  | 'processo'
  | 'documentos'
  | 'analise-juridica'
  | 'estrategia'
  | 'pecas'
  | 'historico';

export interface CaseDocumentItem {
  id: string;
  name: string;
  suggested_classification: string;
  confirmed_classification?: string;
  is_confirmed: boolean;
  file_size: string;
  pages_count: number;
  uploaded_at: string;
  source_origin: 'Autos Eletrônicos' | 'Subsídios da Operadora' | 'Anexo do Advogado';
  file_url?: string;
  download_url?: string;
}

export interface EvidenceSourceLink {
  document_name: string;
  page: number;
  snippet: string;
  context_note?: string;
}

export interface FactualFinding {
  id: string;
  title: string;
  description: string;
  status: 'favorable' | 'unfavorable' | 'neutral';
  evidence_source?: EvidenceSourceLink;
}

export interface LegalAnalysisData {
  case_summary: string;
  relevant_facts: FactualFinding[];
  opposing_claims: Array<{
    id: string;
    claim: string;
    amount?: string;
    basis: string;
    evidence_source?: EvidenceSourceLink;
  }>;
  opposing_arguments: Array<{
    id: string;
    argument: string;
    counter_tactic: string;
    evidence_source?: EvidenceSourceLink;
  }>;
  controversial_issues: string[];
  possible_preliminaries: Array<{
    id: string;
    title: string;
    legal_basis: string;
    applicability: 'alta' | 'media' | 'baixa';
    recommended: boolean;
    evidence_source?: EvidenceSourceLink;
  }>;
  merits_theses: Array<{
    id: string;
    title: string;
    legal_basis: string;
    regulatory_framework: string;
    strength: 'muito_forte' | 'forte' | 'moderada';
    evidence_source?: EvidenceSourceLink;
  }>;
  human_validation_points: string[];
  document_inconsistencies: string[];
}

export type StrategyItemStatus =
  | 'suggested'     // Sugerido pela análise
  | 'requires_val'  // Requer validação
  | 'confirmed'     // Confirmado pelo advogado
  | 'discarded'     // Descartado
  | 'not_applicable'; // Não aplicável

export interface StrategyItem {
  id: string;
  key: string;
  title: string;
  category: 'preliminar' | 'prejudicial' | 'merito' | 'pedido_defensivo';
  description: string;
  status: StrategyItemStatus;
  user_note?: string;
  evidence_source?: EvidenceSourceLink;
  suggested_by_system: boolean;
}

export interface CasePieceItem {
  id: string;
  piece_type: string;
  version: string;
  status: 'draft' | 'in_review' | 'ready' | 'generated' | 'homologated';
  last_updated: string;
  responsible_lawyer: string;
  summary: string;
  docx_available: boolean;
  docx_url?: string;
  generation_job_id?: string;
}

export interface CaseTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'creation' | 'document' | 'analysis' | 'strategy' | 'piece' | 'court_event';
  user_name?: string;
}

export interface LegalCaseWorkspace {
  id: string;
  organization_id: string;
  process_number: string;
  court: string;
  court_type: string;
  court_number: string;
  court_regional?: string;
  district: string;
  uf: string;
  client: string;
  opposing_party: string;
  action_type: string;
  claim_value: string;
  case_status: 'active' | 'in_review' | 'completed' | 'urgent';
  procedural_stage: string;
  relevant_deadline: string;
  last_movement: string;
  injunction_status: 'denied' | 'granted' | 'pending';
  
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
  }>;

  documents: CaseDocumentItem[];
  analysis: LegalAnalysisData;
  strategy_items: StrategyItem[];
  pieces: CasePieceItem[];
  timeline: CaseTimelineEvent[];

  // Dados para integração direta com motor de geração nativo
  formData: LegalFormData;
  generation_job_id?: string;
}
