/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Fase 4.1: Correção Cirúrgica da Arquitetura e Renumeração Dinâmica dos Requerimentos
 * 
 * 20 Testes Obrigatórios:
 * 1. Bloco permanente do PRU está presente no catálogo de blocos.
 * 2. Bloco permanente do PRU possui status/classificação permanente.
 * 3. Bloco permanente do PRU é resolvido como incluído no caso homologado.
 * 4. Ordem forense do bloco do PRU fica após impossibilidade de transmutação e antes de suppressio/surrectio.
 * 5. Coexistência harmônica entre o bloco regulatório do PRU e a tese de legalidade atuarial do agrupamento.
 * 6. Bloco sem texto final exibe marcador [CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO — merits_pru_regulatory_restriction_block].
 * 7. Requerimentos finais são reordenados/renumerados sem 'buracos' de letras.
 * 8. Sequência principal de pedidos é estritamente contínua (a, b, c, d...).
 * 9. Se a preliminar 'c' for excluída, o próximo pedido vira 'c)'.
 * 10. Se a preliminar 'd' for excluída, o mérito assume a letra imediatamente subsequente contínua.
 * 11. Os subpedidos do mérito acompanham dinamicamente a letra do pedido principal de mérito.
 * 12. Se o mérito for 'd)', os subpedidos são 'd.1)', 'd.2)', 'd.3)'...
 * 13. Se o mérito for 'e)', os subpedidos são 'e.1)', 'e.2)', 'e.3)'...
 * 14. Exclusão de dano moral não deixa buraco na numeração dos subpedidos do mérito.
 * 15. Exclusão de repetição de indébito não deixa buraco na numeração dos subpedidos do mérito.
 * 16. Os pedidos de prova, prequestionamento, sucumbência e intimações continuam a sequência sem salto.
 * 17. O request_key não é modificado pela renumeração visual.
 * 18. A renumeração não quebra o snapshot original da Fase 3.
 * 19. A renumeração é refletida no texto final gerado do DOCX.
 * 20. Não há chamada de OpenAI, n8n ou geração de PDF nesta suíte.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import {
  CONTESTACAO_BLOCKS,
  CONTESTACAO_FINAL_REQUESTS,
} from '../data/contestacao/blocks';
import {
  renumberRequests,
  resolveLegalArchitecture,
} from '../architectureResolver';
import { ruleEngine } from '../ruleEngine';
import { HOMOLOGATED_CASE_DEFAULTS } from '../formDefinitions';
import {
  getOfficialHomologatedSnapshot,
  getPhase41HomologatedSnapshot,
  assembleDocumentFromSnapshot,
  experimentalDocxService,
  buildDeterministicDocxFilename,
} from '../../../services/experimentalDocxService';
import { PersistedLegalCaseInput } from '../caseDataMapper';
import { FinalRequestItem, LegalFormData } from '../types';

let passedTests = 0;
let failedTests = 0;

async function runTest(testName: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ [TESTE ${passedTests + 1}] ${testName}`);
    passedTests++;
  } catch (error: unknown) {
    console.error(`  ✗ FALHA EM: ${testName} ->`, error instanceof Error ? error.message : error);
    failedTests++;
  }
}

async function runSuite() {
  console.log('\n--- VIPAZ JURÍDICO: SUÍTE DE TESTES DA FASE 4.1 (ARQUITETURA & RENUMERAÇÃO) ---');

  const baseSnapshot = getOfficialHomologatedSnapshot();
  const phase41Snapshot = getPhase41HomologatedSnapshot();

  // 1. Bloco permanente do PRU está presente no catálogo de blocos
  await runTest('1. Bloco permanente do PRU está presente no catálogo de blocos', () => {
    const pruBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_pru_regulatory_restriction_block'
    );
    assert(pruBlock !== undefined, 'Bloco merits_pru_regulatory_restriction_block deve existir em CONTESTACAO_BLOCKS');
    assert(
      pruBlock.title === 'DA LEGALIDADE REGULATÓRIA DO PRU E DA RESTRIÇÃO DO ÍNDICE INDIVIDUAL À SANÇÃO ADMINISTRATIVA EXCEPCIONAL',
      'Título do bloco do PRU regulatório deve coincidir exatamente com a matriz'
    );
  });

  // 2. Bloco permanente do PRU possui status/classificação permanente
  await runTest('2. Bloco permanente do PRU possui status/classificação permanente', () => {
    const pruBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_pru_regulatory_restriction_block'
    );
    assert(pruBlock, 'Bloco deve existir');
    assert(pruBlock.contentType === 'permanent', 'contentType do bloco deve ser "permanent"');
    assert(pruBlock.active === true, 'Bloco deve estar ativo');
    assert(pruBlock.category === 'merits', 'Categoria deve ser merits');
  });

  // 3. Bloco permanente do PRU é resolvido como incluído no caso homologado
  await runTest('3. Bloco permanente do PRU é resolvido como incluído no caso homologado', () => {
    const evalRes = ruleEngine.evaluate(HOMOLOGATED_CASE_DEFAULTS);
    const includedKeys = evalRes.assembly.includedBlocks.map((b) => b.key);
    assert(
      includedKeys.includes('merits_pru_regulatory_restriction_block'),
      'merits_pru_regulatory_restriction_block deve constar nos blocos incluídos da avaliação'
    );
  });

  // 4. Ordem forense do bloco do PRU fica após impossibilidade de transmutação e antes de suppressio/surrectio
  await runTest('4. Ordem forense do bloco do PRU fica após impossibilidade de transmutação e antes de suppressio/surrectio', () => {
    const transmutacaoBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_transmutation_impossibility_block'
    )!;
    const pruBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_pru_regulatory_restriction_block'
    )!;
    const supressioBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_supressio_surrectio_block'
    )!;

    assert(transmutacaoBlock, 'transmutacaoBlock deve existir');
    assert(pruBlock, 'pruBlock deve existir');
    assert(supressioBlock, 'supressioBlock deve existir');

    assert(
      transmutacaoBlock.order < pruBlock.order,
      `Ordem de transmutação (${transmutacaoBlock.order}) deve ser menor que a do PRU (${pruBlock.order})`
    );
    assert(
      pruBlock.order < supressioBlock.order,
      `Ordem do PRU (${pruBlock.order}) deve ser menor que a de suppressio (${supressioBlock.order})`
    );
    assert(pruBlock.order === 175, 'Ordem exata do bloco regulatório deve ser 175');
  });

  // 5. Coexistência harmônica entre o bloco regulatório do PRU e a tese de legalidade atuarial do agrupamento
  await runTest('5. Coexistência harmônica entre o bloco regulatório do PRU e a tese de legalidade atuarial do agrupamento', () => {
    const regPruBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_pru_regulatory_restriction_block'
    );
    const atuarialPruBlock = CONTESTACAO_BLOCKS.find(
      (b) => b.key === 'merits_pru_legality_block'
    );

    assert(regPruBlock !== undefined, 'Bloco regulatório do PRU deve coexistir');
    assert(atuarialPruBlock !== undefined, 'Bloco atuarial do PRU deve coexistir');
    assert(regPruBlock.key !== atuarialPruBlock.key, 'Chaves devem ser distintas');
    assert(regPruBlock.order < atuarialPruBlock.order, 'Bloco regulatório (175) precede o bloco atuarial (190)');

    const evalRes = ruleEngine.evaluate(HOMOLOGATED_CASE_DEFAULTS);
    const includedKeys = evalRes.assembly.includedBlocks.map((b) => b.key);
    assert(includedKeys.includes('merits_pru_regulatory_restriction_block'), 'Regulatório incluído');
    assert(includedKeys.includes('merits_pru_legality_block'), 'Atuarial incluído');
  });

  // 6. Bloco sem texto final exibe marcador [CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO — key]
  await runTest('6. Bloco sem texto final exibe marcador [CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO — key]', () => {
    // Testa o mecanismo determinístico de salvaguarda quando um bloco não tem conteúdo no catálogo
    const mockSnapshotWithEmptyBlock: PersistedLegalCaseInput = {
      ...phase41Snapshot,
      resolved_architecture: {
        ...phase41Snapshot.resolved_architecture,
        included_blocks: [
          ...phase41Snapshot.resolved_architecture.included_blocks,
          {
            block_key: 'unhomologated_test_sample_block',
            included: true,
            reason: 'Bloco de teste sem homologação',
            trigger: 'test_trigger',
            content_status: 'available',
          },
        ],
      },
    };

    const assemblyRes = assembleDocumentFromSnapshot(mockSnapshotWithEmptyBlock);
    assert(
      assemblyRes.unhomologatedBlocks.includes('unhomologated_test_sample_block'),
      'Bloco sem conteúdo deve ser registrado na auditoria unhomologatedBlocks'
    );
    const assembledPru = assemblyRes.assembly.includedBlocks.find(
      (b) => b.key === 'unhomologated_test_sample_block'
    );
    assert(assembledPru, 'Bloco de teste não homologado deve ser incluído');
    assert(
      assembledPru.content.includes('[CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO — unhomologated_test_sample_block]'),
      'Montagem do DOCX deve preservar o marcador honesto de conteúdo não homologado'
    );
  });

  // 7. Requerimentos finais são reordenados/renumerados sem 'buracos' de letras
  await runTest('7. Requerimentos finais são reordenados/renumerados sem "buracos" de letras', () => {
    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot);
    const requests = assemblyRes.assembly.includedRequests;

    // Extrai prefixos de letras dos pedidos principais
    const mainLetters: string[] = [];
    requests.forEach((r) => {
      const match = r.text.match(/^([a-z])\)/);
      if (match) {
        mainLetters.push(match[1]);
      }
    });

    // Garante que não há buracos: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    for (let i = 0; i < mainLetters.length; i++) {
      const expectedLetter = String.fromCharCode(97 + i);
      assert(
        mainLetters[i] === expectedLetter,
        `Letra na posição ${i} deve ser "${expectedLetter}", obtido: "${mainLetters[i]}"`
      );
    }
  });

  // 8. Sequência principal de pedidos é estritamente contínua (a, b, c, d...)
  await runTest('8. Sequência principal de pedidos é estritamente contínua (a, b, c, d...)', () => {
    const sampleRequests: FinalRequestItem[] = [
      { key: 'req_standing', label: 'a) Ilegitimidade', order: 10, contentType: 'conditional', text: 'a) acolhimento ilegitimidade' },
      { key: 'req_legal_aid', label: 'b) Gratuidade', order: 20, contentType: 'conditional', text: 'b) impugnação gratuidade' },
      { key: 'req_claim_value', label: 'c) Valor da Causa', order: 30, contentType: 'conditional', text: 'c) impugnação valor' },
      { key: 'req_merits_head', label: 'g) Mérito', order: 70, contentType: 'permanent', text: 'g) improcedência total' },
      { key: 'req_selic', label: 'h) Selic', order: 80, contentType: 'conditional', text: 'h) taxa selic' },
    ];

    const renumbered = renumberRequests(sampleRequests);
    assert(renumbered[0].text.startsWith('a)'), 'Primeiro deve ser a)');
    assert(renumbered[1].text.startsWith('b)'), 'Segundo deve ser b)');
    assert(renumbered[2].text.startsWith('c)'), 'Terceiro deve ser c)');
    assert(renumbered[3].text.startsWith('d)'), 'Quarto (mérito) deve assumir d), sem salto para g');
    assert(renumbered[4].text.startsWith('e)'), 'Quinto (selic) deve assumir e), sem salto para h');
  });

  // 9. Se a preliminar 'c' for excluída, o próximo pedido vira 'c)'
  await runTest('9. Se a preliminar "c" for excluída, o próximo pedido vira "c)"', () => {
    // Caso com ilegitimidade (a), gratuidade (b), sem valor da causa (c excluído), e prescrição trienal
    const requestsWithoutC: FinalRequestItem[] = [
      { key: 'req_standing', label: 'a) Ilegitimidade', order: 10, contentType: 'conditional', text: 'a) ilegitimidade' },
      { key: 'req_legal_aid', label: 'b) JG', order: 20, contentType: 'conditional', text: 'b) jg' },
      { key: 'req_prescription_triennial', label: 'e) Prescrição', order: 50, contentType: 'conditional', text: 'e) prescrição trienal' },
    ];

    const renumbered = renumberRequests(requestsWithoutC);
    assert(renumbered[0].text.startsWith('a)'), 'Pedido 1 vira a)');
    assert(renumbered[1].text.startsWith('b)'), 'Pedido 2 vira b)');
    assert(renumbered[2].text.startsWith('c)'), 'Prescrição deve virar c) contínuo sem saltar');
  });

  // 10. Se a preliminar 'd' for excluída, o mérito assume a letra imediatamente subsequente contínua
  await runTest('10. Se a preliminar "d" for excluída, o mérito assume a letra imediatamente subsequente contínua', () => {
    // Supondo pedidos a, b, c ativos, d excluído, mérito vem em seguida
    const requestsWithoutD: FinalRequestItem[] = [
      { key: 'req_standing', label: 'a) Preliminar A', order: 10, contentType: 'conditional', text: 'a) preliminar a' },
      { key: 'req_legal_aid', label: 'b) Preliminar B', order: 20, contentType: 'conditional', text: 'b) preliminar b' },
      { key: 'req_claim_value', label: 'c) Preliminar C', order: 30, contentType: 'conditional', text: 'c) preliminar c' },
      { key: 'req_merits_head', label: 'g) Mérito', order: 70, contentType: 'permanent', text: 'g) mérito' },
    ];

    const renumbered = renumberRequests(requestsWithoutD);
    assert(renumbered[3].text.startsWith('d)'), 'Mérito assume imediatamente d)');
  });

  // 11. Os subpedidos do mérito acompanham dinamicamente a letra do pedido principal de mérito
  await runTest('11. Os subpedidos do mérito acompanham dinamicamente a letra do pedido principal de mérito', () => {
    const requestsWithMerits: FinalRequestItem[] = [
      { key: 'req_standing', label: 'a) Preliminar', order: 10, contentType: 'conditional', text: 'a) preliminar' },
      { key: 'req_merits_head', label: 'g) Mérito', order: 70, contentType: 'permanent', text: 'g) a fim de:' },
      { key: 'req_merits_pme_validity', label: 'g.1) Validade', order: 71, contentType: 'conditional', text: '   g.1) validade contratual' },
      { key: 'req_merits_pru_legality', label: 'g.2) PRU', order: 72, contentType: 'conditional', text: '   g.2) legalidade do pru' },
    ];

    const renumbered = renumberRequests(requestsWithMerits);
    assert(renumbered[1].text.startsWith('b)'), 'Mérito principal virou b)');
    assert(renumbered[2].text.trim().startsWith('b.1)'), `Subpedido 1 virou b.1), obtido: ${renumbered[2].text}`);
    assert(renumbered[3].text.trim().startsWith('b.2)'), `Subpedido 2 virou b.2), obtido: ${renumbered[3].text}`);
  });

  // 12. Se o mérito for 'd)', os subpedidos são 'd.1)', 'd.2)', 'd.3)'...
  await runTest('12. Se o mérito for "d)", os subpedidos são "d.1)", "d.2)", "d.3)"...', () => {
    const requestsD: FinalRequestItem[] = [
      { key: 'req_standing', label: 'a) Item', order: 10, contentType: 'conditional', text: 'a) texto' },
      { key: 'req_legal_aid', label: 'b) Item', order: 20, contentType: 'conditional', text: 'b) texto' },
      { key: 'req_claim_value', label: 'c) Item', order: 30, contentType: 'conditional', text: 'c) texto' },
      { key: 'req_merits_head', label: 'g) Mérito', order: 70, contentType: 'permanent', text: 'g) cabeçalho' },
      { key: 'req_merits_pme_validity', label: 'g.1) PME', order: 71, contentType: 'conditional', text: '   g.1) pme' },
      { key: 'req_merits_pru_legality', label: 'g.2) PRU', order: 72, contentType: 'conditional', text: '   g.2) pru' },
      { key: 'req_merits_repetition', label: 'g.3) Repetição', order: 73, contentType: 'conditional', text: '   g.3) repetição' },
    ];

    const renumbered = renumberRequests(requestsD);
    assert(renumbered[3].text.startsWith('d)'), 'Mérito deve ser d)');
    assert(renumbered[4].text.trim().startsWith('d.1)'), 'Primeiro subpedido deve ser d.1)');
    assert(renumbered[5].text.trim().startsWith('d.2)'), 'Segundo subpedido deve ser d.2)');
    assert(renumbered[6].text.trim().startsWith('d.3)'), 'Terceiro subpedido deve ser d.3)');
  });

  // 13. Se o mérito for 'e)', os subpedidos são 'e.1)', 'e.2)', 'e.3)'...
  await runTest('13. Se o mérito for "e)", os subpedidos são "e.1)", "e.2)", "e.3)"...', () => {
    // Caso padrão homologado: a (standing), b (legal_aid), c (claim_value), d (triennial), e (mérito)
    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot);
    const meritsHead = assemblyRes.assembly.includedRequests.find((r) => r.key === 'req_merits_head')!;
    const meritsPme = assemblyRes.assembly.includedRequests.find((r) => r.key === 'req_merits_pme_validity')!;
    const meritsPru = assemblyRes.assembly.includedRequests.find((r) => r.key === 'req_merits_pru_legality')!;
    const meritsRep = assemblyRes.assembly.includedRequests.find((r) => r.key === 'req_merits_repetition')!;
    const meritsMoral = assemblyRes.assembly.includedRequests.find((r) => r.key === 'req_merits_moral_damages')!;

    assert(meritsHead.text.startsWith('e)'), `Mérito deve ser e), obtido: ${meritsHead.text.substring(0, 5)}`);
    assert(meritsPme.text.trim().startsWith('e.1)'), `PME deve ser e.1), obtido: ${meritsPme.text.trim().substring(0, 6)}`);
    assert(meritsPru.text.trim().startsWith('e.2)'), `PRU deve ser e.2), obtido: ${meritsPru.text.trim().substring(0, 6)}`);
    assert(meritsRep.text.trim().startsWith('e.3)'), `Repetição deve ser e.3), obtido: ${meritsRep.text.trim().substring(0, 6)}`);
    assert(meritsMoral.text.trim().startsWith('e.4)'), `Dano moral deve ser e.4), obtido: ${meritsMoral.text.trim().substring(0, 6)}`);
  });

  // 14. Exclusão de dano moral não deixa buraco na numeração dos subpedidos do mérito
  await runTest('14. Exclusão de dano moral não deixa buraco na numeração dos subpedidos do mérito', () => {
    const requestsWithoutMoral: FinalRequestItem[] = [
      { key: 'req_merits_head', label: 'e) Mérito', order: 70, contentType: 'permanent', text: 'e) cabeçalho' },
      { key: 'req_merits_pme_validity', label: 'e.1) PME', order: 71, contentType: 'conditional', text: '   e.1) pme' },
      { key: 'req_merits_pru_legality', label: 'e.2) PRU', order: 72, contentType: 'conditional', text: '   e.2) pru' },
      { key: 'req_merits_repetition', label: 'e.3) Repetição', order: 73, contentType: 'conditional', text: '   e.3) repetição' },
      // dano moral excluído
      { key: 'req_selic', label: 'f) Selic', order: 80, contentType: 'conditional', text: 'f) selic' },
    ];

    const renumbered = renumberRequests(requestsWithoutMoral);
    assert(renumbered[0].text.startsWith('a)'), 'Mérito vira a)');
    assert(renumbered[1].text.trim().startsWith('a.1)'), 'PME vira a.1)');
    assert(renumbered[2].text.trim().startsWith('a.2)'), 'PRU vira a.2)');
    assert(renumbered[3].text.trim().startsWith('a.3)'), 'Repetição vira a.3)');
    assert(renumbered[4].text.startsWith('b)'), 'Selic subsequente assume b) contínuo sem saltos');
  });

  // 15. Exclusão de repetição de indébito não deixa buraco na numeração dos subpedidos do mérito
  await runTest('15. Exclusão de repetição de indébito não deixa buraco na numeração dos subpedidos do mérito', () => {
    const requestsWithoutRepetition: FinalRequestItem[] = [
      { key: 'req_merits_head', label: 'e) Mérito', order: 70, contentType: 'permanent', text: 'e) cabeçalho' },
      { key: 'req_merits_pme_validity', label: 'e.1) PME', order: 71, contentType: 'conditional', text: '   e.1) pme' },
      { key: 'req_merits_pru_legality', label: 'e.2) PRU', order: 72, contentType: 'conditional', text: '   e.2) pru' },
      // repetição excluída
      { key: 'req_merits_moral_damages', label: 'e.4) Dano moral', order: 74, contentType: 'conditional', text: '   e.4) dano moral' },
    ];

    const renumbered = renumberRequests(requestsWithoutRepetition);
    assert(renumbered[1].text.trim().startsWith('a.1)'), 'Subpedido 1 é a.1)');
    assert(renumbered[2].text.trim().startsWith('a.2)'), 'Subpedido 2 é a.2)');
    assert(renumbered[3].text.trim().startsWith('a.3)'), 'Dano moral deve ser renumerado para a.3), sem buraco');
  });

  // 16. Os pedidos de prova, prequestionamento, sucumbência e intimações continuam a sequência sem salto
  await runTest('16. Os pedidos de prova, prequestionamento, sucumbência e intimações continuam a sequência sem salto', () => {
    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot);
    const requests = assemblyRes.assembly.includedRequests;

    const selic = requests.find((r) => r.key === 'req_selic')!;
    const provas = requests.find((r) => r.key === 'req_provas')!;
    const preq = requests.find((r) => r.key === 'req_prequestionamento')!;
    const suc = requests.find((r) => r.key === 'req_sucumbencia')!;
    const pub = requests.find((r) => r.key === 'req_publicacoes')!;

    assert(selic.text.startsWith('f)'), `Selic deve ser f), obtido: ${selic.text.substring(0, 5)}`);
    assert(provas.text.startsWith('g)'), `Provas deve ser g), obtido: ${provas.text.substring(0, 5)}`);
    assert(provas.text.includes('g.1)'), `Subitem interno provas deve ser g.1)`);
    assert(provas.text.includes('g.2)'), `Subitem interno provas deve ser g.2)`);
    assert(preq.text.startsWith('h)'), `Prequestionamento deve ser h), obtido: ${preq.text.substring(0, 5)}`);
    assert(suc.text.startsWith('i)'), `Sucumbência deve ser i), obtido: ${suc.text.substring(0, 5)}`);
    assert(pub.text.startsWith('j)'), `Publicações deve ser j), obtido: ${pub.text.substring(0, 5)}`);
  });

  // 17. O request_key não é modificado pela renumeração visual
  await runTest('17. O request_key não é modificado pela renumeração visual', () => {
    const originalRequests: FinalRequestItem[] = [...CONTESTACAO_FINAL_REQUESTS];
    const renumbered = renumberRequests(originalRequests);

    for (let i = 0; i < originalRequests.length; i++) {
      assert(
        renumbered[i].key === originalRequests[i].key,
        `request_key na posição ${i} deve ser idêntico: ${originalRequests[i].key}`
      );
      assert(
        renumbered[i].order === originalRequests[i].order,
        `order na posição ${i} deve ser idêntico: ${originalRequests[i].order}`
      );
    }
  });

  // 18. A renumeração não quebra o snapshot original da Fase 3
  await runTest('18. A renumeração não quebra o snapshot original da Fase 3', () => {
    const snapshotBefore = JSON.stringify(baseSnapshot);
    const assemblyRes = assembleDocumentFromSnapshot(baseSnapshot);
    const snapshotAfter = JSON.stringify(baseSnapshot);

    assert(snapshotBefore === snapshotAfter, 'Snapshot original em memória não deve sofrer mutação');
    assert(
      baseSnapshot.resolved_architecture.linked_requests.length === 14,
      'Snapshot original continua com exatamente 14 pedidos'
    );
    assert(
      assemblyRes.linkedRequestsCount === 14,
      'Documento montado preserva exatamente 14 pedidos'
    );
  });

  // 19. A renumeração é refletida no texto final gerado do DOCX
  await runTest('19. A renumeração é refletida no texto final gerado do DOCX', async () => {
    const result = await experimentalDocxService.generatePhase41Docx(baseSnapshot);
    assert(result.success === true, 'Geração do DOCX Fase 4.1 deve ter sucesso');
    assert(result.filename.includes('_F4-1.docx'), `Nome do arquivo deve conter sufixo _F4-1: ${result.filename}`);
    assert(result.includedBlocksCount === 28, `Fase 4.1 deve conter 28 blocos incluídos, obtido: ${result.includedBlocksCount}`);
    assert(result.linkedRequestsCount === 14, `Fase 4.1 deve conter 14 pedidos vinculados, obtido: ${result.linkedRequestsCount}`);

    // Verifica que a variável REQUESTS_ITEMS_TEXT na montagem possui as letras contínuas
    const reqText = result.assembly.resolvedVariables['REQUESTS_ITEMS_TEXT'];
    assert(typeof reqText === 'string' && reqText.length > 0, 'REQUESTS_ITEMS_TEXT deve estar preenchido');
    assert(reqText.includes('a) o acolhimento da preliminar'), 'Deve conter a)');
    assert(reqText.includes('b) o acolhimento da impugnação'), 'Deve conter b)');
    assert(reqText.includes('c) o acolhimento da impugnação'), 'Deve conter c)');
    assert(reqText.includes('d) o acolhimento e a decretação da prescrição'), 'Deve conter d)');
    assert(reqText.includes('e) o julgamento de total improcedência'), 'Deve conter e)');
    assert(reqText.includes('e.1) declarar a validade'), 'Deve conter e.1)');
    assert(reqText.includes('e.2) reconhecer a estrita legalidade'), 'Deve conter e.2)');
    assert(reqText.includes('e.3) rechaçar o pleito'), 'Deve conter e.3)');
    assert(reqText.includes('e.4) rejeitar o pleito'), 'Deve conter e.4)');
    assert(reqText.includes('f) a aplicação das disposições da Lei nº 14.905/2024'), 'Deve conter f)');
    assert(reqText.includes('g) o deferimento da produção de todos os meios de prova'), 'Deve conter g)');
    assert(reqText.includes('h) a manifestação explícita e fundamentada'), 'Deve conter h)');
    assert(reqText.includes('i) a condenação integral da empresa demandante'), 'Deve conter i)');
    assert(reqText.includes('j) a veiculação de todas as publicações'), 'Deve conter j)');
  });

  // 20. Não há chamada de OpenAI, n8n ou geração de PDF nesta suíte
  await runTest('20. Não há chamada de OpenAI, n8n ou geração de PDF nesta suíte', () => {
    const serviceContent = fs.readFileSync('src/services/experimentalDocxService.ts', 'utf-8');
    const resolverContent = fs.readFileSync('src/domain/legal-engine/architectureResolver.ts', 'utf-8');
    const blocksContent = fs.readFileSync('src/domain/legal-engine/data/contestacao/blocks.ts', 'utf-8');

    assert(!/import\s+.*from\s+['"]openai['"]/.test(serviceContent), 'Nenhum import de SDK OpenAI em service');
    assert(!/fetch\s*\(\s*.*n8n/i.test(serviceContent), 'Nenhuma chamada fetch para n8n em service');
    assert(!/pdfkit|jspdf|html2pdf/i.test(serviceContent), 'Nenhuma biblioteca de PDF em service');

    assert(!/import\s+.*from\s+['"]openai['"]/.test(resolverContent), 'Nenhum import de OpenAI em resolver');
    assert(!/fetch\s*\(\s*.*n8n/i.test(resolverContent), 'Nenhum webhook n8n em resolver');

    assert(!/import\s+.*from\s+['"]openai['"]/.test(blocksContent), 'Nenhum import de OpenAI em blocks');
    assert(!/fetch\s*\(\s*.*n8n/i.test(blocksContent), 'Nenhum webhook n8n em blocks');
  });

  console.log('\n==================================================');
  console.log(`TOTAL DE TESTES DA FASE 4.1 APROVADOS: ${passedTests}/20`);
  if (failedTests > 0) {
    console.error(`TOTAL DE TESTES REPROVADOS: ${failedTests}`);
    process.exit(1);
  }
  console.log('==================================================\n');
}

runSuite().catch((err) => {
  console.error('Erro fatal executando a suíte da Fase 4.1:', err);
  process.exit(1);
});
