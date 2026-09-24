import assert from 'node:assert/strict';
import { CaseAnalystOutputSchema } from '../caseLegalModelSchema';

const valid = {
  identification: {
    processNumber: {
      value: '3001903-61.2026.8.19.0209',
      status: 'proven',
      confidence: 'high',
      sources: [{ documentId: 'autos-3001903', page: 1 }],
    },
    parties: [],
  },
  proceduralState: {
    injunction: 'requested_not_decided',
    injunctionComplianceProven: false,
    injunctionSources: [{ documentId: 'autos-3001903', page: 20 }],
  },
  contract: { type: 'individual' },
  claims: [],
  facts: [],
  evidence: [],
  legalIssues: [],
  uncertainties: ['Decisão de tutela não localizada no material fornecido.'],
};

assert.equal(CaseAnalystOutputSchema.safeParse(valid).success, true);

const invalid = structuredClone(valid);
invalid.proceduralState.injunction = 'invented';
assert.equal(CaseAnalystOutputSchema.safeParse(invalid).success, false);

console.log('✓ Case Analyst structured-output contract passed');
