/**
 * VIPAZ JURÍDICO — FASE 4.2
 * SUÍTE DE TESTES DE INTEGRIDADE DA BLOCKLIBRARY: CONTESTAÇÃO + REAJUSTE PME
 *
 * Valida determinísticamente:
 * 1. Presença dos 11 blocos permanentes/essenciais de Reajuste PME
 * 2. Unicidade de cada block_key
 * 3. Classificação permanente / inclusão garantida para Contestação + Reajuste PME
 * 4. Ordem relativa estrita entre os 11 blocos
 * 5. Conteúdo não vazio para cada um dos 11 blocos
 * 6. Inexistência de marcador de conteúdo não homologado nesses 11 blocos após a correção
 * 7. Fidelidade e integridade do conteúdo de merits_pru_regulatory_restriction_block da matriz
 * 8. Coexistência dos dois blocos distintos relacionados ao PRU
 * 9. Ausência de duplicidade na montagem resolvida
 * 10. Preservação integral dos request_keys
 * 11. Preservação da renumeração dinâmica contínua dos requerimentos da Fase 4.1
 * 12. Geração determinística do DOCX F4-2 (VIPAZ_Contestacao_..._F4-2.docx)
 * 13. Isolamento: Nenhuma dependência externa, OpenAI, n8n ou PDF
 */

import assert from 'node:assert';
import fs from 'node:fs';
import { CONTESTACAO_BLOCKS } from '../data/contestacao/blocks';
import { CONTESTACAO_PME_ARCHITECTURE } from '../data/contestacao/architecture';
import { ruleEngine } from '../ruleEngine';
import { HOMOLOGATED_CASE_DEFAULTS } from '../formDefinitions';
import {
  assembleDocumentFromSnapshot,
  experimentalDocxService,
  getOfficialHomologatedSnapshot,
  getPhase41HomologatedSnapshot,
} from '../../../services/experimentalDocxService';
import { PersistedLegalCaseInput } from '../caseDataMapper';

// Os 11 blocos permanentes da arquitetura Contestação + Reajuste PME
export const PERMANENT_11_BLOCK_KEYS = [
  'merits_pme_robustness_block',
  'merits_contract_validity_block',
  'merits_transmutation_impossibility_block',
  'merits_pru_regulatory_restriction_block',
  'merits_supressio_surrectio_block',
  'merits_pru_legality_block',
  'merits_technical_proof_block',
  'merits_systemic_consequences_block',
  'merits_borrowed_proof_block',
  'merits_selic_block',
  'prequestioning_block',
] as const;

export const EXPECTED_TITLES_MAP: Record<string, string> = {
  merits_pme_robustness_block:
    'DA HIGIDEZ TÉCNICO-REGULATÓRIA DO PLANO COLETIVO DE PEQUENO PORTE (PME): A ANTIGUIDADE DA EMPRESA ESTIPULANTE COMO PROVA DA INEXISTÊNCIA DE "VÍNCULO DE FACHADA"',
  merits_contract_validity_block:
    'DA VALIDADE DO CONTRATO COLETIVO EMPRESARIAL E DA INEXISTÊNCIA DE “FALSO COLETIVO”',
  merits_transmutation_impossibility_block:
    'DA IMPOSSIBILIDADE DE TRANSMUTAÇÃO CONTRATUAL E DA BOA-FÉ OBJETIVA',
  merits_pru_regulatory_restriction_block:
    'DA LEGALIDADE REGULATÓRIA DO PRU E DA RESTRIÇÃO DO ÍNDICE INDIVIDUAL À SANÇÃO ADMINISTRATIVA EXCEPCIONAL',
  merits_supressio_surrectio_block:
    'DA CONSOLIDAÇÃO DO PACTO PELA BOA-FÉ TEMPORAL: SUPPRESSIO E SURRECTIO',
  merits_pru_legality_block:
    'DA LEGALIDADE DO AGRUPAMENTO DE CONTRATOS E DO PERCENTUAL DE REAJUSTE ÚNICO (PRU)',
  merits_technical_proof_block:
    'DA PROVA TÉCNICA E ATUARIAL DOS REAJUSTES',
  merits_systemic_consequences_block:
    'DAS CONSEQUÊNCIAS SISTÊMICAS: MUTUALISMO, EQUILÍBRIO ATUARIAL E EFEITO FREE-RIDER',
  merits_borrowed_proof_block:
    'DA PROVA EMPRESTADA E DA PERÍCIA ATUARIAL SUBSIDIÁRIA',
  merits_selic_block:
    'DA INCIDÊNCIA EXCLUSIVA DA TAXA SELIC EM EVENTUAL CONDENAÇÃO, SOB A ÓTICA DO TEMA 1.368 DO STJ',
  prequestioning_block:
    'DO PREQUESTIONAMENTO QUALIFICADO',
};

const baseSnapshot = getOfficialHomologatedSnapshot();

async function runSuite(): Promise<void> {
  console.log('--- VIPAZ JURÍDICO: SUÍTE DE TESTES DA FASE 4.2 (INTEGRIDADE DA BLOCKLIBRARY) ---\n');
  let passedTests = 0;
  let failedTests = 0;

  async function runTest(name: string, fn: () => void | Promise<void>): Promise<void> {
    try {
      await fn();
      console.log(`  ✓ [TESTE ${passedTests + 1}] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ✗ [TESTE ${passedTests + failedTests + 1} FALHOU] ${name}`);
      console.error('   ', err);
      failedTests++;
    }
  }

  // 1. Presença dos 11 blocos essenciais/permanentes de Reajuste PME no catálogo
  await runTest('1. Presença de todos os 11 blocos permanentes de Reajuste PME no catálogo', () => {
    for (const key of PERMANENT_11_BLOCK_KEYS) {
      const found = CONTESTACAO_BLOCKS.find((b) => b.key === key);
      assert(found !== undefined, `Bloco ${key} deve estar presente no catálogo CONTESTACAO_BLOCKS`);
      assert(found.title && found.title.length > 0, `Bloco ${key} deve ter título não vazio`);
    }
  });

  // 2. Unicidade de cada block_key
  await runTest('2. Unicidade estrita de cada block_key entre os 11 blocos e no catálogo', () => {
    const keysSet = new Set<string>();
    for (const key of PERMANENT_11_BLOCK_KEYS) {
      assert(!keysSet.has(key), `Chave ${key} não pode estar duplicada entre os 11 blocos`);
      keysSet.add(key);
    }

    const catalogKeys = new Set<string>();
    for (const block of CONTESTACAO_BLOCKS) {
      assert(!catalogKeys.has(block.key), `Chave ${block.key} duplicada no catálogo geral`);
      catalogKeys.add(block.key);
    }
  });

  // 3. Classificação e ativação dos 11 blocos na arquitetura Contestação + Reajuste PME
  await runTest('3. Classificação permanente e ativação garantida para Contestação + Reajuste PME', () => {
    // 3.1 merits_pru_regulatory_restriction_block, merits_selic_block e prequestioning_block são permanent
    const regPru = CONTESTACAO_BLOCKS.find((b) => b.key === 'merits_pru_regulatory_restriction_block')!;
    const selic = CONTESTACAO_BLOCKS.find((b) => b.key === 'merits_selic_block')!;
    const preq = CONTESTACAO_BLOCKS.find((b) => b.key === 'prequestioning_block')!;

    assert(regPru.contentType === 'permanent', 'merits_pru_regulatory_restriction_block deve ser permanent');
    assert(selic.contentType === 'permanent', 'merits_selic_block deve ser permanent');
    assert(preq.contentType === 'permanent', 'prequestioning_block deve ser permanent');

    // 3.2 Na resolução do caso PME, todos os 11 blocos são ativados e incluídos
    const evalRes = ruleEngine.evaluate(HOMOLOGATED_CASE_DEFAULTS);
    const includedKeys = new Set(evalRes.assembly.includedBlocks.map((b) => b.key));

    for (const key of PERMANENT_11_BLOCK_KEYS) {
      assert(includedKeys.has(key), `Bloco ${key} deve estar incluído na avaliação de Reajuste PME`);
    }
  });

  // 4. Ordem relativa estrita entre os 11 blocos
  await runTest('4. Ordem relativa sequencial estrita entre os 11 blocos', () => {
    const blocks11 = PERMANENT_11_BLOCK_KEYS.map((key) => {
      const b = CONTESTACAO_BLOCKS.find((item) => item.key === key);
      assert(b, `Bloco ${key} deve existir`);
      return b;
    });

    for (let i = 0; i < blocks11.length - 1; i++) {
      const current = blocks11[i];
      const next = blocks11[i + 1];
      assert(
        current.order < next.order,
        `Ordem de ${current.key} (${current.order}) deve ser estritamente menor que ${next.key} (${next.order})`
      );
    }

    // Posição exata do bloco regulatório do PRU
    const transmutacao = blocks11[2]; // merits_transmutation_impossibility_block (170)
    const pruReg = blocks11[3]; // merits_pru_regulatory_restriction_block (175)
    const supressio = blocks11[4]; // merits_supressio_surrectio_block (180)

    assert(transmutacao.order === 170, 'Impossibilidade de transmutação deve ter ordem 170');
    assert(pruReg.order === 175, 'PRU regulatório deve ter ordem 175');
    assert(supressio.order === 180, 'Suppressio/surrectio deve ter ordem 180');
  });

  // 5. Conteúdo não vazio para cada um dos 11 blocos
  await runTest('5. Conteúdo não vazio e substancial para cada um dos 11 blocos', () => {
    for (const key of PERMANENT_11_BLOCK_KEYS) {
      const b = CONTESTACAO_BLOCKS.find((item) => item.key === key)!;
      assert(b.content !== undefined && b.content !== null, `Conteúdo de ${key} não pode ser nulo`);
      const trimmed = b.content.trim();
      assert(trimmed.length > 150, `Conteúdo de ${key} deve ter pelo menos 150 caracteres, obtido ${trimmed.length}`);
    }
  });

  // 6. Inexistência de marcador de conteúdo não homologado nesses 11 blocos após a correção
  await runTest('6. Inexistência do marcador "[CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO" em todos os 11 blocos', () => {
    const unhomologatedMarker = '[CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO';
    for (const key of PERMANENT_11_BLOCK_KEYS) {
      const b = CONTESTACAO_BLOCKS.find((item) => item.key === key)!;
      assert(
        !b.content.includes(unhomologatedMarker),
        `Bloco ${key} não deve conter o marcador de não homologado: ${b.content.slice(0, 100)}`
      );
    }
  });

  // 7. Fidelidade e integridade do conteúdo de merits_pru_regulatory_restriction_block da matriz
  await runTest('7. Fidelidade e integralidade do conteúdo de merits_pru_regulatory_restriction_block extraído da matriz', () => {
    const pruBlock = CONTESTACAO_BLOCKS.find((b) => b.key === 'merits_pru_regulatory_restriction_block')!;

    // Título
    assert(
      pruBlock.content.includes(
        'DA LEGALIDADE REGULATÓRIA DO PRU E DA RESTRIÇÃO DO ÍNDICE INDIVIDUAL À SANÇÃO ADMINISTRATIVA EXCEPCIONAL'
      ),
      'Deve conter o título homologado'
    );

    // Marcos regulatórios expressos
    assert(pruBlock.content.includes('artigo 22 da RN nº 557/2022 da ANS'), 'Deve conter RN 557/2022');
    assert(pruBlock.content.includes('RN nº 565/2022'), 'Deve conter RN 565/2022');
    assert(pruBlock.content.includes('seleção de riscos'), 'Deve conter menção à seleção de riscos');

    // Citações doutrinárias de Luís Roberto Barroso
    assert(pruBlock.content.includes('Luís Roberto Barroso'), 'Deve citar o jurista Luís Roberto Barroso');
    assert(pruBlock.content.includes('dilema regulatório insolúvel'), 'Deve conter dilema regulatório insolúvel');
    assert(pruBlock.content.includes('cherry-picking regulatório'), 'Deve conter cherry-picking regulatório');
    assert(pruBlock.content.includes('venire contra factum proprium'), 'Deve conter venire contra factum proprium');
    assert(pruBlock.content.includes('nemo auditur propriam turpitudinem allegans'), 'Deve conter nemo auditur');

    // Consequencialismo e LINDB
    assert(pruBlock.content.includes('LINDB, art. 20'), 'Deve conter LINDB art. 20');
    assert(pruBlock.content.includes('proteção que desprotege'), 'Deve conter a tese da proteção que desprotege');
    assert(pruBlock.content.includes('KPMG e Deloitte'), 'Deve conter auditorias independentes');
  });

  // 8. Coexistência dos dois blocos distintos relacionados ao PRU
  await runTest('8. Coexistência dos dois blocos distintos de PRU (regulatório 175 e atuarial 190)', () => {
    const regBlock = CONTESTACAO_BLOCKS.find((b) => b.key === 'merits_pru_regulatory_restriction_block')!;
    const atuarialBlock = CONTESTACAO_BLOCKS.find((b) => b.key === 'merits_pru_legality_block')!;

    assert(regBlock.key !== atuarialBlock.key, 'Chaves devem ser estritamente distintas');
    assert(regBlock.order === 175, 'Bloco regulatório deve ser ordem 175');
    assert(atuarialBlock.order === 190, 'Bloco atuarial deve ser ordem 190');
    assert(regBlock.content !== atuarialBlock.content, 'Conteúdos devem ser distintos');
    assert(
      atuarialBlock.title === 'DA LEGALIDADE DO AGRUPAMENTO DE CONTRATOS E DO PERCENTUAL DE REAJUSTE ÚNICO (PRU)',
      'Título do bloco atuarial correto'
    );
  });

  // 9. Ausência de duplicidade na montagem resolvida
  await runTest('9. Ausência de duplicidade de blocos na montagem resolvida', () => {
    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot, { recalculateArchitecture: true });
    const seen = new Set<string>();
    for (const b of assemblyRes.assembly.includedBlocks) {
      assert(!seen.has(b.key), `Bloco ${b.key} duplicado na montagem documental!`);
      seen.add(b.key);
    }

    for (const key of PERMANENT_11_BLOCK_KEYS) {
      assert(seen.has(key), `Bloco permanente ${key} deve estar na montagem`);
    }
  });

  // 10. Preservação integral dos request_keys
  await runTest('10. Preservação integral dos request_keys originais da biblioteca de pedidos', () => {
    const expectedHomologatedRequestKeys = [
      'req_standing',
      'req_legal_aid',
      'req_claim_value',
      'req_prescription_triennial',
      'req_merits_head',
      'req_merits_pme_validity',
      'req_merits_pru_legality',
      'req_merits_repetition',
      'req_selic',
      'req_provas',
      'req_prequestionamento',
      'req_sucumbencia',
      'req_publicacoes',
    ];

    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot, { recalculateArchitecture: true });
    const includedReqKeys = assemblyRes.assembly.includedRequests.map((r) => r.key);

    for (const rk of expectedHomologatedRequestKeys) {
      assert(includedReqKeys.includes(rk), `request_key ${rk} deve ser preservado na montagem`);
    }
  });

  // 11. Preservação da renumeração dinâmica contínua dos requerimentos da Fase 4.1
  await runTest('11. Preservação da renumeração contínua sem saltos no texto de requerimentos', () => {
    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot, { recalculateArchitecture: true });
    const reqText = assemblyRes.assembly.resolvedVariables['REQUESTS_ITEMS_TEXT'];

    assert(typeof reqText === 'string' && reqText.length > 0, 'REQUESTS_ITEMS_TEXT deve estar preenchido');
    assert(reqText.includes('a) o acolhimento da preliminar'), 'Deve iniciar com a)');
    assert(reqText.includes('b) o acolhimento da impugnação'), 'Deve continuar com b)');
    assert(reqText.includes('c) o acolhimento da impugnação'), 'Deve continuar com c)');
    assert(reqText.includes('d) o acolhimento e a decretação da prescrição'), 'Deve continuar com d)');
    assert(reqText.includes('e) o julgamento de total improcedência'), 'Deve continuar com e)');
    assert(reqText.includes('e.1) declarar a validade'), 'Subitem e.1)');
    assert(reqText.includes('e.2) reconhecer a estrita legalidade'), 'Subitem e.2)');
    assert(reqText.includes('e.3) rechaçar o pleito'), 'Subitem e.3)');
    assert(reqText.includes('f) a aplicação das disposições da Lei nº 14.905/2024'), 'Deve continuar com f)');
    assert(reqText.includes('g) o deferimento da produção de todos os meios de prova'), 'Deve continuar com g)');
    assert(reqText.includes('h) a manifestação explícita e fundamentada'), 'Deve continuar com h)');
    assert(reqText.includes('i) a condenação integral da empresa demandante'), 'Deve continuar com i)');
    assert(reqText.includes('j) a veiculação de todas as publicações'), 'Deve continuar com j)');
  });

  // 12. Geração determinística do DOCX F4-2
  await runTest('12. Geração de DOCX F4-2 com 0 blocos não homologados e sufixo _F4-2', async () => {
    const result = await experimentalDocxService.generatePhase42Docx(baseSnapshot);

    assert(result.success === true, 'Geração de DOCX deve ter sucesso');
    assert(
      result.filename === 'VIPAZ_Contestacao_0802491-32.2024.8.19.0001_F4-2.docx',
      `Nome do arquivo deve ser VIPAZ_Contestacao_0802491-32.2024.8.19.0001_F4-2.docx, obtido: ${result.filename}`
    );
    assert(result.fileSizeBytes > 30000, `Arquivo deve ter tamanho válido > 30KB: ${result.fileSizeBytes} bytes`);
    assert(result.unhomologatedBlocks.length === 0, `unhomologatedBlocks deve ser vazio: ${result.unhomologatedBlocks.join(', ')}`);
    assert(result.includedBlocksCount === 28, `Deveria conter 28 blocos incluídos: ${result.includedBlocksCount}`);

    // Verifica que o bloco do PRU regulatório está incluído no DOCX gerado sem marcador
    const pruIncluded = result.assembly.includedBlocks.find(
      (b) => b.key === 'merits_pru_regulatory_restriction_block'
    );
    assert(pruIncluded !== undefined, 'merits_pru_regulatory_restriction_block deve estar no assembly do DOCX');
    assert(
      !pruIncluded.content.includes('[CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO'),
      'Bloco não pode conter marcador de não homologado no assembly do DOCX'
    );
    assert(
      pruIncluded.content.includes('DA LEGALIDADE REGULATÓRIA DO PRU E DA RESTRIÇÃO DO ÍNDICE INDIVIDUAL'),
      'Bloco deve conter o texto homologado da matriz no DOCX'
    );
  });

  // 13. Isolamento: Nenhuma chamada a OpenAI, n8n ou PDF
  await runTest('13. Não há chamadas a OpenAI, n8n ou geração de PDF', () => {
    const serviceSrc = fs.readFileSync('src/services/experimentalDocxService.ts', 'utf-8');
    const blocksSrc = fs.readFileSync('src/domain/legal-engine/data/contestacao/blocks.ts', 'utf-8');

    assert(!/import\s+.*from\s+['"]openai['"]/.test(serviceSrc), 'Sem SDK OpenAI em service');
    assert(!/fetch\s*\(\s*.*n8n/i.test(serviceSrc), 'Sem webhook n8n em service');
    assert(!/pdfkit|jspdf|html2pdf/i.test(serviceSrc), 'Sem biblioteca de PDF em service');

    assert(!/import\s+.*from\s+['"]openai['"]/.test(blocksSrc), 'Sem OpenAI em blocks');
    assert(!/fetch\s*\(\s*.*n8n/i.test(blocksSrc), 'Sem n8n em blocks');
  });

  console.log('\n==================================================');
  console.log(`TOTAL DE TESTES DA FASE 4.2 APROVADOS: ${passedTests}/13`);
  if (failedTests > 0) {
    console.error(`TOTAL DE TESTES REPROVADOS: ${failedTests}`);
    process.exit(1);
  }
  console.log('==================================================\n');
}

runSuite().catch((err) => {
  console.error('Erro fatal executando a suíte da Fase 4.2:', err);
  process.exit(1);
});
