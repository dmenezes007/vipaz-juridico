/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Tipos e Interfaces do Domínio Jurídico
 */

export type CourtType = 'Vara Cível' | 'Juizado Especial Cível';
export type UfType = 'RJ' | 'SP' | 'MG' | 'BA';
export type AdversePartyNature = 'pj' | 'pf';

export type DocumentPieceType =
  | 'Contestação'
  | 'Agravo de Instrumento'
  | 'Recurso Inominado'
  | 'Apelação'
  | 'Recurso Especial'
  | 'Contraminuta de Agravo de Instrumento'
  | 'Contrarrazões de Recurso Inominado'
  | 'Contrarrazões de Apelação';

export interface DocumentPieceMetadata {
  id: DocumentPieceType;
  label: string;
  description: string;
  isHomologated: boolean;
  stage: 'production' | 'in_development';
}

export type ReajusteModalidade = 'pme' | 'individual';

export interface DisputeObjectSelections {
  // Reajuste Anual
  reajuste_anual?: boolean;
  reajuste_anual_modalidade?: ReajusteModalidade; // 'pme' | 'individual'

  // Reajuste Etário
  reajuste_etario?: boolean;
  reajuste_etario_modalidade?: ReajusteModalidade; // 'pme' | 'individual'

  // Aviso Prévio
  aviso_previo?: boolean;

  // Prêmio Complementar
  premio_complementar?: boolean;

  // Outro
  outro?: boolean;
  outro_descricao?: string;

  // Propriedades retrocompatíveis para o motor de regras
  reajuste_anual_pme?: boolean;
  reajuste_anual_individual?: boolean;
  reajuste_etario_pme?: boolean;
  reajuste_etario_individual?: boolean;
  reajuste_etario_faixa?: boolean;
  reajuste_pme?: boolean;
  reajuste_pme_anual?: boolean;
  reajuste_pme_etario?: boolean;
  reajuste_individual_etario?: boolean;
  aviso_previo_rescisao?: boolean;
  premio_complementar_cobranca?: boolean;
}

export type InjunctionStatus = 'not_requested' | 'denied' | 'granted';
export type MoralDamagesStatus = 'not_claimed' | 'claimed';
export type LegalAidStatus = 'not_requested' | 'challenge' | 'do_not_challenge';
export type LegalAidTarget = 'pf' | 'pj' | 'both';
export type StandingChallengeStatus = 'challenge' | 'do_not_challenge';
export type ClaimValueChallengeStatus = 'challenge' | 'do_not_challenge';
export type PetitionAptitudeStatus = 'challenge' | 'do_not_challenge';
export type PrescriptionTriennialStatus = 'argue' | 'do_not_argue';
export type PrescriptionDecennialStatus = 'argue' | 'do_not_argue';
export type RepetitionStatus = 'not_claimed' | 'simple' | 'double';

export interface LegalFormData {
  // 1. Dados básicos
  process_number: string;
  court_number: string; // apenas numérico
  court_type: CourtType;
  court_regional?: string;
  district: string; // Comarca
  uf: UfType;
  client: string; // Parte representada (ex: SulAmérica Companhia de Seguro Saúde)
  opposing_party: string; // Parte adversa (ex: MG Métodos Gráficos Ltda...)
  executive_summary: string; // Ementa Executiva
  claim_summary: string; // Resumo da Inicial
  controversy_delimitation: string; // Exata Delimitação da Controvérsia

  // 2. Seleções jurídicas
  adverse_party_nature: AdversePartyNature[]; // ['pj', 'pf']
  document_piece: DocumentPieceType;
  dispute_objects: DisputeObjectSelections;

  injunction_status: InjunctionStatus;
  injunction_decision_manifestation?: string;

  moral_damages_status: MoralDamagesStatus;
  moral_damages_manifestation?: string;

  legal_aid_status: LegalAidStatus;
  legal_aid_target?: LegalAidTarget;

  standing_challenge_status: StandingChallengeStatus;
  claim_value_challenge_status: ClaimValueChallengeStatus;
  petition_aptitude_status: PetitionAptitudeStatus;
  prescription_triennial_status: PrescriptionTriennialStatus;
  prescription_decennial_status: PrescriptionDecennialStatus;
  repetition_status: RepetitionStatus;

  // Agravo de Instrumento — contexto e campos assistidos por IA
  appeal_demand_type?: string;
  appeal_main_object?: string;
  appealed_decision?: string;
  appeal_initial_claim?: string;
  appeal_relevant_documents?: string;
  appeal_contractual_documents?: string;
  appeal_procedural_history?: string;
  appeal_specific_instructions?: string;
  appeal_effect_suspensive?: string;
  appeal_mistaken_premise?: string;
  appeal_fumus?: string;
  appeal_periculum?: string;
  appeal_countersecurity?: string;
  appeal_final_requests?: string;

  // Anexo opcional
  source_file?: File | null;
}

export type OperatorType =
  | 'equals'
  | 'not_equals'
  | 'in'
  | 'not_in'
  | 'truthy'
  | 'falsy'
  | 'all'
  | 'any';

export interface RuleCondition {
  field?: string;
  operator: OperatorType;
  value?: unknown;
  conditions?: RuleCondition[];
}

export type ContentType = 'permanent' | 'conditional' | 'variable' | 'derived';

export interface LegalBlock {
  key: string;
  title: string;
  category:
    | 'addressing'
    | 'executive_summary'
    | 'facts'
    | 'controversy'
    | 'injunction'
    | 'preliminary'
    | 'merits'
    | 'prequestioning'
    | 'requests'
    | 'closing';
  order: number;
  contentType: ContentType;
  content: string; // Texto estruturado com marcadores {{VAR}}
  version: string;
  active: boolean;
  variables?: string[];
  condition?: RuleCondition;
  associatedRequestKey?: string;
}

export interface FinalRequestItem {
  key: string;
  label: string; // Ex: "a) preliminar de ilegitimidade ativa"
  order: number;
  contentType: ContentType;
  text: string;
  condition?: RuleCondition;
}

export interface LegalArchitecture {
  id: string;
  documentPiece: DocumentPieceType;
  title: string;
  version: string;
  active: boolean;
  blocks: LegalBlock[];
  finalRequests: FinalRequestItem[];
}

export interface RuleEvaluationResult {
  blockKey: string;
  title: string;
  category: string;
  order: number;
  included: boolean;
  reason: string;
  isAvailable: boolean;
  block?: LegalBlock;
}

export interface RequestEvaluationResult {
  requestKey: string;
  label: string;
  order: number;
  included: boolean;
  reason: string;
  item: FinalRequestItem;
}

export interface ResolvedDocumentAssembly {
  architecture: LegalArchitecture;
  evaluations: RuleEvaluationResult[];
  includedBlocks: LegalBlock[];
  includedRequests: FinalRequestItem[];
  resolvedVariables: Record<string, string>;
  snapshot: {
    formData: Record<string, unknown>;
    appliedRuleKeys: string[];
    includedBlockKeys: string[];
    architectureVersion: string;
    timestamp: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}
