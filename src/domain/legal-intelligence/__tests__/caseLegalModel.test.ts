import assert from 'node:assert/strict';
import { CaseAnalyst, type CaseAnalystProvider, type CaseLegalModel } from '../index';

const source = {
  documentId: 'autos-3001903',
  documentName: 'autos.pdf',
  page: 10,
};

const model: CaseLegalModel = {
  schemaVersion: '1.0',
  identification: {
    processNumber: {
      value: '3001903-61.2026.8.19.0209',
      status: 'proven',
      confidence: 'high',
      sources: [source],
    },
    parties: [
      { name: 'Lucio de Souza Almeida', role: 'plaintiff', nature: 'person' },
      { name: 'Sul América Companhia de Seguro Saúde', role: 'defendant', nature: 'company' },
    ],
  },
  proceduralState: {
    injunction: 'requested_not_decided',
    injunctionComplianceProven: false,
    injunctionSources: [source],
  },
  contract: {
    type: 'individual',
    executionDate: { value: '1997-06', status: 'proven', confidence: 'high', sources: [source] },
    adaptedToLaw9656: { value: false, status: 'proven', confidence: 'high', sources: [source] },
  },
  claims: [
    { id: 'moral-damages', description: 'Indenização por danos morais', amount: 'R$ 20.000,00', sources: [source] },
  ],
  facts: [
    {
      id: 'age-band-us',
      statement: 'A quantidade de US passou de 847,73 para 1.126,79 na faixa questionada.',
      status: 'proven',
      confidence: 'high',
      sources: [source],
      tags: ['age_band', 'service_unit'],
    },
    {
      id: 'five-percent-clause',
      statement: 'O contrato prevê aumentos anuais cumulativos de 5% a partir dos 72 anos.',
      status: 'proven',
      confidence: 'high',
      sources: [source],
      tags: ['age_band', 'elderly'],
    },
  ],
  evidence: [],
  legalIssues: [
    { id: 'age-band', description: 'Validade do reajuste por faixa etária em contrato antigo não adaptado.', sources: [source] },
  ],
  uncertainties: ['Não foi localizada decisão sobre o pedido de tutela no material usado neste teste.'],
  provenance: {
    sourceDocumentIds: ['autos-3001903'],
    generatedAt: new Date().toISOString(),
    analyzerVersion: 'fixture-1',
  },
};

const provider: CaseAnalystProvider = { async analyze() { return model; } };

async function main() {
  const analyst = new CaseAnalyst(provider);
  const result = await analyst.run({
    sourceDocumentIds: ['autos-3001903'],
    documentPiece: 'Contestação',
    organizationId: 'org-test',
    sourceMaterial: 'fixture controlado para avaliação estrutural',
  });

  assert.equal(result.validation.valid, true);
  assert.equal(result.model.contract.type, 'individual');
  assert.equal(result.model.contract.adaptedToLaw9656?.value, false);
  assert.equal(result.model.proceduralState.injunction, 'requested_not_decided');
  assert.equal(result.model.proceduralState.injunctionComplianceProven, false);
  assert.ok(result.model.facts.some((f) => f.id === 'age-band-us'));
  assert.ok(result.model.facts.some((f) => f.id === 'five-percent-clause'));

  const invalid: CaseLegalModel = structuredClone(model);
  invalid.facts[0].sources = [];
  const invalidProvider: CaseAnalystProvider = { async analyze() { return invalid; } };
  const invalidResult = await new CaseAnalyst(invalidProvider).run({
    sourceDocumentIds: ['autos-3001903'],
    documentPiece: 'Contestação',
    organizationId: 'org-test',
    sourceMaterial: 'fixture',
  });
  assert.equal(invalidResult.validation.valid, false);
  assert.ok(invalidResult.validation.blockers.includes('proven_fact_without_source:age-band-us'));

  console.log('✓ Legal Intelligence CaseLegalModel — provenance and guardrail tests passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
