/**
 * VIPAZ Jurídico — Legal Intelligence Engine v1
 *
 * Canonical, provider-agnostic representation of a legal matter.
 * This layer is intentionally isolated from UI, n8n, Carbone and the
 * deterministic document assembler. It is the contract between future agents.
 */

export type EvidenceStatus = 'alleged' | 'proven' | 'disputed' | 'unknown';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type InjunctionDecision = 'not_requested' | 'requested_not_decided' | 'granted' | 'denied';
export type ContractType = 'individual' | 'collective_business' | 'collective_membership' | 'unknown';

export interface SourceLocator {
  documentId: string;
  documentName?: string;
  page?: number;
  event?: string;
  excerpt?: string;
}

export interface SourcedValue<T> {
  value: T;
  status: EvidenceStatus;
  confidence: ConfidenceLevel;
  sources: SourceLocator[];
}

export interface CaseParty {
  name: string;
  role: 'plaintiff' | 'defendant' | 'third_party' | 'unknown';
  nature?: 'person' | 'company' | 'unknown';
}

export interface LegalFact {
  id: string;
  statement: string;
  status: EvidenceStatus;
  confidence: ConfidenceLevel;
  sources: SourceLocator[];
  tags?: string[];
}

export interface EvidenceItem {
  id: string;
  kind: 'petition' | 'decision' | 'contract' | 'invoice' | 'expert_report' | 'medical' | 'other';
  description: string;
  sources: SourceLocator[];
}

export interface LegalClaim {
  id: string;
  description: string;
  category?: string;
  amount?: string;
  sources: SourceLocator[];
}

export interface LegalIssue {
  id: string;
  description: string;
  tags?: string[];
  sources: SourceLocator[];
}

export interface CaseLegalModel {
  schemaVersion: '1.0';
  identification: {
    processNumber: SourcedValue<string>;
    court?: SourcedValue<string>;
    parties: CaseParty[];
  };
  proceduralState: {
    injunction: InjunctionDecision;
    injunctionComplianceProven: boolean;
    injunctionSources: SourceLocator[];
  };
  contract: {
    type: ContractType;
    executionDate?: SourcedValue<string>;
    adaptedToLaw9656?: SourcedValue<boolean>;
    product?: SourcedValue<string>;
    beneficiaryCount?: SourcedValue<number>;
  };
  claims: LegalClaim[];
  facts: LegalFact[];
  evidence: EvidenceItem[];
  legalIssues: LegalIssue[];
  uncertainties: string[];
  provenance: {
    sourceDocumentIds: string[];
    generatedAt: string;
    analyzerVersion: string;
  };
}

export interface CaseLegalModelValidation {
  valid: boolean;
  blockers: string[];
  warnings: string[];
}

export function validateCaseLegalModel(model: CaseLegalModel): CaseLegalModelValidation {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!model.identification.processNumber.value.trim()) blockers.push('process_number_missing');
  if (model.identification.processNumber.sources.length === 0) blockers.push('process_number_without_source');
  if (model.provenance.sourceDocumentIds.length === 0) blockers.push('source_documents_missing');

  if (
    (model.proceduralState.injunction === 'granted' || model.proceduralState.injunction === 'denied') &&
    model.proceduralState.injunctionSources.length === 0
  ) {
    blockers.push('injunction_decision_without_source');
  }

  if (model.proceduralState.injunctionComplianceProven && model.proceduralState.injunction !== 'granted') {
    blockers.push('injunction_compliance_without_granted_injunction');
  }

  for (const fact of model.facts) {
    if (fact.status === 'proven' && fact.sources.length === 0) {
      blockers.push(`proven_fact_without_source:${fact.id}`);
    }
    if (fact.confidence === 'high' && fact.sources.length === 0) {
      warnings.push(`high_confidence_without_source:${fact.id}`);
    }
  }

  for (const claim of model.claims) {
    if (claim.sources.length === 0) warnings.push(`claim_without_source:${claim.id}`);
  }

  return { valid: blockers.length === 0, blockers, warnings };
}
