import { Agent, run } from '@openai/agents';
import type { CaseAnalystProvider, CaseAnalysisInput } from '../domain/legal-intelligence/caseAnalyst';
import type { CaseLegalModel } from '../domain/legal-intelligence/caseLegalModel';
import {
  CaseAnalystOutputSchema,
  type CaseAnalystStructuredOutput,
} from '../domain/legal-intelligence/caseLegalModelSchema';

const INSTRUCTIONS = `Você é o Case Analyst do VIPAZ Jurídico.

Sua única função é converter material processual fornecido em um modelo factual estruturado e rastreável.

REGRAS ABSOLUTAS:
- Não redija peça jurídica e não escolha estratégia defensiva.
- Não invente fatos, datas, valores, documentos, decisões, precedentes ou fundamentos.
- Diferencie rigorosamente alegação, prova, controvérsia e desconhecimento.
- Um fato só pode receber status "proven" quando houver suporte documental identificável no material.
- Toda afirmação "proven" deve apontar pelo menos uma source.
- Toda decisão de tutela concedida ou indeferida deve apontar a source correspondente.
- injunctionComplianceProven somente pode ser true se houver prova documental do cumprimento e a tutela tiver sido concedida.
- Se o pedido de tutela existir, mas não houver decisão localizada, use "requested_not_decided".
- Não conclua que documento ausente não existe; registre a incerteza.
- Use apenas documentId pertencente à lista fornecida na execução.
- O campo excerpt deve ser curto e servir apenas para localização/proveniência.
- Não faça pesquisa jurídica externa nesta etapa.
- Não exponha raciocínio interno.
`;

function createAgent() {
  return new Agent({
    name: 'VIPAZ Case Analyst',
    instructions: INSTRUCTIONS,
    model: process.env.OPENAI_LEGAL_MODEL || 'gpt-5.6-sol',
    outputType: CaseAnalystOutputSchema,
  });
}

function buildInput(input: CaseAnalysisInput) {
  return [
    `Peça processual pretendida: ${input.documentPiece}`,
    `IDs de documentos autorizados: ${input.sourceDocumentIds.join(', ')}`,
    '',
    'MATERIAL PROCESSUAL:',
    input.sourceMaterial,
  ].join('\n');
}

export class OpenAiCaseAnalystProvider implements CaseAnalystProvider {
  async analyze(input: CaseAnalysisInput): Promise<CaseLegalModel> {
    if (!process.env.OPENAI_API_KEY) throw new Error('openai_api_key_missing');

    const result = await run(createAgent(), buildInput(input), {
      maxTurns: 4,
    });

    const output = result.finalOutput as CaseAnalystStructuredOutput | undefined;
    if (!output) throw new Error('case_analyst_empty_output');

    // Execution-owned provenance is never delegated to the model.
    return {
      schemaVersion: '1.0',
      ...output,
      provenance: {
        sourceDocumentIds: [...input.sourceDocumentIds],
        generatedAt: new Date().toISOString(),
        analyzerVersion: 'openai-agents-case-analyst-1.0.0',
      },
    };
  }
}
