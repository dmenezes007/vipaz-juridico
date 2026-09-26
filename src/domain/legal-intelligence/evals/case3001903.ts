import assert from 'node:assert/strict';
import type { CaseLegalModel } from '../caseLegalModel';

export interface EvalExpectation {
  id: string;
  description: string;
  test(model: CaseLegalModel): boolean;
}

export interface EvalReport {
  caseId: string;
  passed: number;
  total: number;
  failures: Array<{ id: string; description: string }>;
}

export function evaluateCaseModel(
  caseId: string,
  model: CaseLegalModel,
  expectations: EvalExpectation[],
): EvalReport {
  const failures = expectations
    .filter((expectation) => !expectation.test(model))
    .map(({ id, description }) => ({ id, description }));

  return {
    caseId,
    passed: expectations.length - failures.length,
    total: expectations.length,
    failures,
  };
}

function factMatches(model: CaseLegalModel, pattern: RegExp) {
  return model.facts.some((fact) => pattern.test(fact.statement));
}

function claimMatches(model: CaseLegalModel, pattern: RegExp) {
  return model.claims.some((claim) => pattern.test([claim.description, claim.amount].filter(Boolean).join(' ')));
}

export const CASE_3001903_EXPECTATIONS: EvalExpectation[] = [
  { id: 'process_number', description: 'identifica o processo', test: (m) => m.identification.processNumber.value === '3001903-61.2026.8.19.0209' },
  { id: 'individual_contract', description: 'classifica contrato individual', test: (m) => m.contract.type === 'individual' },
  { id: 'execution_1997', description: 'identifica contratação em 1997', test: (m) => /1997/.test(m.contract.executionDate?.value || '') },
  { id: 'not_adapted', description: 'identifica contrato não adaptado à Lei 9.656/1998', test: (m) => m.contract.adaptedToLaw9656?.value === false },
  { id: 'age_band', description: 'identifica controvérsia de faixa etária', test: (m) => m.legalIssues.some((i) => /faixa etária|etári/i.test(i.description)) || factMatches(m, /faixa etária|etári/i) },
  { id: 'us_847_73', description: 'identifica 847,73 US', test: (m) => factMatches(m, /847[,.]73/) },
  { id: 'us_1126_79', description: 'identifica 1.126,79 US', test: (m) => factMatches(m, /1[.]?126[,.]79/) },
  { id: 'five_percent_72', description: 'identifica cláusula de 5% a partir de 72 anos', test: (m) => factMatches(m, /5\s*%/) && factMatches(m, /72\s*anos/) },
  { id: 'moral_damages', description: 'identifica pedido de danos morais', test: (m) => claimMatches(m, /danos? morais?/i) },
  { id: 'moral_amount', description: 'identifica R$ 20.000,00', test: (m) => claimMatches(m, /20[.]?000[,.]00/) },
  { id: 'injunction_not_decided', description: 'não inventa decisão de tutela', test: (m) => m.proceduralState.injunction === 'requested_not_decided' },
  { id: 'no_injunction_compliance', description: 'não afirma cumprimento de tutela inexistente', test: (m) => m.proceduralState.injunctionComplianceProven === false },
];

export function assertEvalReport(report: EvalReport) {
  assert.equal(
    report.failures.length,
    0,
    `Eval ${report.caseId}: ${report.passed}/${report.total}. Falhas: ${report.failures.map((f) => f.id).join(', ')}`,
  );
}
