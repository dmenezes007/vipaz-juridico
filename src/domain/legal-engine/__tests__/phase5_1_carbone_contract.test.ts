/**
 * VIPAZ JURÍDICO — FASE 5.1
 * SUÍTE DE TESTES: CORREÇÃO CIRÚRGICA DO CONTRATO DE DADOS VIPAZ -> CARBONE
 *
 * Validações Obrigatórias:
 * 1. payload mantém organization_id
 * 2. mantém generation_job_id
 * 3. mantém filename
 * 4. mantém process_number
 * 5. processo.numero corresponde ao process_number
 * 6. partes são corretamente mapeadas (cliente, representada, parte_adversa)
 * 7. custom_texts.ementa_executiva corresponde ao bloco correto
 * 8. custom_texts.resumo_inicial corresponde ao bloco correto
 * 9. custom_texts.delimitacao_controv corresponde ao bloco correto
 * 10. flags refletem presença real dos blocos
 * 11. bloco excluído não é artificialmente recriado
 * 12. blocks continua presente
 * 13. blocks permanece ordenado
 * 14. blocos corresponde aos mesmos conteúdos de blocks
 * 15. nenhum conteúdo jurídico é reescrito
 * 16. pedidos preservam request_key
 * 17. pedidos preservam numeração resolvida
 * 18. não há duplicação de títulos
 * 19. não há chamadas OpenAI/Gemini
 * 20. não há chamadas diretas ao n8n durante testes unitários
 * 21. serialização é determinística
 * 22. mesmo input produz JSON documental idêntico
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  assembleDocumentFromSnapshot,
  getPhase41HomologatedSnapshot,
  OFFICIAL_HOMOLOGATED_JOB_ID,
} from '../../../services/experimentalDocxService';
import {
  buildCawDocxPayload,
  getBlockContent,
  hasBlock,
} from '../documentPayloadMapper';

const TEST_ORG_ID = 'd3b07384-d113-494b-9c8e-04f7b4c65e89';
const TEST_JOB_ID = OFFICIAL_HOMOLOGATED_JOB_ID;

console.log('\n=============================================================');
console.log('VIPAZ JURÍDICO — FASE 5.1: CONTRATO DE DADOS CARBONE');
console.log('=============================================================\n');

async function runPhase51Tests() {
  let passedTests = 0;

  // Montagem preliminar do caso homologado
  const snapshot = getPhase41HomologatedSnapshot();
  const assembled = await assembleDocumentFromSnapshot(snapshot, { recalculateArchitecture: true });

  const payload = buildCawDocxPayload({
    assembly: assembled.assembly,
    organization_id: TEST_ORG_ID,
    generation_job_id: TEST_JOB_ID,
    filename: assembled.filename,
  });

  // -------------------------------------------------------------
  // TESTE 1: payload mantém organization_id
  // -------------------------------------------------------------
  console.log('[TESTE 1] Validação de organization_id...');
  assert.strictEqual(payload.organization_id, TEST_ORG_ID, 'organization_id deve coincidir com o tenant');
  passedTests++;
  console.log('  ✓ [TESTE 1] 1. payload mantém organization_id');

  // -------------------------------------------------------------
  // TESTE 2: payload mantém generation_job_id
  // -------------------------------------------------------------
  console.log('[TESTE 2] Validação de generation_job_id...');
  assert.strictEqual(payload.generation_job_id, TEST_JOB_ID, 'generation_job_id deve coincidir');
  passedTests++;
  console.log('  ✓ [TESTE 2] 2. payload mantém generation_job_id');

  // -------------------------------------------------------------
  // TESTE 3: payload mantém filename
  // -------------------------------------------------------------
  console.log('[TESTE 3] Validação de filename...');
  assert.strictEqual(payload.filename, 'VIPAZ_Contestacao_0802491-32.2024.8.19.0001.docx', 'filename deve seguir o padrão homologado');
  passedTests++;
  console.log('  ✓ [TESTE 3] 3. payload mantém filename');

  // -------------------------------------------------------------
  // TESTE 4: payload mantém process_number
  // -------------------------------------------------------------
  console.log('[TESTE 4] Validação de process_number...');
  assert.strictEqual(payload.process_number, '0802491-32.2024.8.19.0001', 'process_number deve ser preservado');
  passedTests++;
  console.log('  ✓ [TESTE 4] 4. payload mantém process_number');

  // -------------------------------------------------------------
  // TESTE 5: processo.numero corresponde ao process_number
  // -------------------------------------------------------------
  console.log('[TESTE 5] Validação de processo.numero e dados do juízo...');
  assert(payload.processo, 'Objeto processo deve existir');
  assert.strictEqual(payload.processo.numero, payload.process_number, 'processo.numero deve corresponder a process_number');
  assert.strictEqual(payload.processo.uf, 'RJ', 'processo.uf deve ser RJ');
  assert(payload.processo.orgao_julgador, 'processo.orgao_julgador deve estar preenchido');
  assert(payload.processo.comarca, 'processo.comarca deve estar preenchida');
  passedTests++;
  console.log('  ✓ [TESTE 5] 5. processo.numero corresponde ao process_number');

  // -------------------------------------------------------------
  // TESTE 6: partes são corretamente mapeadas
  // -------------------------------------------------------------
  console.log('[TESTE 6] Validação do mapeamento de partes...');
  assert(payload.partes, 'Objeto partes deve existir');
  assert.strictEqual(payload.partes.cliente, 'Sul América Companhia de Seguro Saúde', 'partes.cliente correto');
  assert.strictEqual(payload.partes.representada, 'Sul América Companhia de Seguro Saúde', 'partes.representada correto');
  assert(payload.partes.parte_adversa.includes('MG Métodos Gráficos'), 'partes.parte_adversa preenchida');
  passedTests++;
  console.log('  ✓ [TESTE 6] 6. partes são corretamente mapeadas');

  // -------------------------------------------------------------
  // TESTE 7: custom_texts.ementa_executiva corresponde ao bloco correto
  // -------------------------------------------------------------
  console.log('[TESTE 7] Validação de custom_texts.ementa_executiva...');
  const execBlock = payload.blocks.find((b) => b.key === 'executive_summary_block');
  assert(execBlock, 'executive_summary_block deve estar nos blocks');
  assert.strictEqual(payload.custom_texts.ementa_executiva, execBlock.content, 'ementa_executiva deve coincidir com content do bloco');
  passedTests++;
  console.log('  ✓ [TESTE 7] 7. custom_texts.ementa_executiva corresponde ao bloco correto');

  // -------------------------------------------------------------
  // TESTE 8: custom_texts.resumo_inicial corresponde ao bloco correto
  // -------------------------------------------------------------
  console.log('[TESTE 8] Validação de custom_texts.resumo_inicial...');
  const claimBlock = payload.blocks.find((b) => b.key === 'claim_summary_block');
  assert(claimBlock, 'claim_summary_block deve estar nos blocks');
  assert.strictEqual(payload.custom_texts.resumo_inicial, claimBlock.content, 'resumo_inicial deve coincidir com content do bloco');
  passedTests++;
  console.log('  ✓ [TESTE 8] 8. custom_texts.resumo_inicial corresponde ao bloco correto');

  // -------------------------------------------------------------
  // TESTE 9: custom_texts.delimitacao_controv corresponde ao bloco correto
  // -------------------------------------------------------------
  console.log('[TESTE 9] Validação de custom_texts.delimitacao_controv...');
  const controvBlock = payload.blocks.find((b) => b.key === 'controversy_delimitation_block');
  assert(controvBlock, 'controversy_delimitation_block deve estar nos blocks');
  assert.strictEqual(payload.custom_texts.delimitacao_controv, controvBlock.content, 'delimitacao_controv deve coincidir com content do bloco');
  passedTests++;
  console.log('  ✓ [TESTE 9] 9. custom_texts.delimitacao_controv corresponde ao bloco correto');

  // -------------------------------------------------------------
  // TESTE 10: flags refletem presença real dos blocos
  // -------------------------------------------------------------
  console.log('[TESTE 10] Validação de flags booleanas de presença...');
  assert(payload.flags, 'Objeto flags deve existir');
  // No caso homologado: prescrição trienal está incluída, decenal não está incluída
  assert.strictEqual(payload.flags.prescricao_trienal, true, 'prescricao_trienal deve ser true');
  assert.strictEqual(payload.flags.prescricao_decenal, false, 'prescricao_decenal deve ser false');
  assert.strictEqual(payload.flags.ilegitimidade_ativa, true, 'ilegitimidade_ativa deve ser true');
  assert.strictEqual(payload.flags.dano_moral, true, 'dano_moral deve ser true');
  // No caso homologado, a repetição é em dobro (repetition_status: 'double')
  assert.strictEqual(payload.flags.repeticao_dobro, true, 'repeticao_dobro deve ser true');
  assert.strictEqual(payload.flags.repeticao_simples, false, 'repeticao_simples deve ser false');
  assert.strictEqual(payload.flags.tutela_indefer, true, 'tutela_indefer deve ser true');
  assert.strictEqual(payload.flags.tutela_deferida, false, 'tutela_deferida deve ser false');
  passedTests++;
  console.log('  ✓ [TESTE 10] 10. flags refletem presença real dos blocos');

  // -------------------------------------------------------------
  // TESTE 11: bloco excluído não é artificialmente recriado
  // -------------------------------------------------------------
  console.log('[TESTE 11] Validação de ausência segura de bloco excluído...');
  assert.strictEqual(payload.flags.prescricao_decenal, false, 'prescricao_decenal é false');
  assert.strictEqual(payload.blocos['prescription_decennial_block'], undefined, 'bloco prescricao_decenal não deve existir no mapa blocos');
  assert.strictEqual(payload.blocks.some((b) => b.key === 'prescription_decennial_block'), false, 'bloco prescricao_decenal não deve existir no array blocks');
  assert.strictEqual(getBlockContent(payload.blocks, 'prescription_decennial_block'), '', 'getBlockContent para bloco ausente retorna vazio');
  passedTests++;
  console.log('  ✓ [TESTE 11] 11. bloco excluído não é artificialmente recriado');

  // -------------------------------------------------------------
  // TESTE 12: `blocks` continua presente
  // -------------------------------------------------------------
  console.log('[TESTE 12] Validação da permanência de blocks...');
  assert(Array.isArray(payload.blocks), 'blocks deve ser array');
  assert.strictEqual(payload.blocks.length, 28, 'blocks deve conter 28 blocos homologados');
  passedTests++;
  console.log('  ✓ [TESTE 12] 12. blocks continua presente');

  // -------------------------------------------------------------
  // TESTE 13: `blocks` permanece ordenado
  // -------------------------------------------------------------
  console.log('[TESTE 13] Validação da ordem sequencial de blocks...');
  for (let i = 1; i < payload.blocks.length; i++) {
    assert(payload.blocks[i].order >= payload.blocks[i - 1].order, `Ordem de blocks deve ser crescente (${payload.blocks[i-1].order} <= ${payload.blocks[i].order})`);
  }
  passedTests++;
  console.log('  ✓ [TESTE 13] 13. blocks permanece ordenado');

  // -------------------------------------------------------------
  // TESTE 14: `blocos` corresponde aos mesmos conteúdos de `blocks`
  // -------------------------------------------------------------
  console.log('[TESTE 14] Validação de fidelidade entre blocos e blocks...');
  assert(payload.blocos, 'Objeto blocos deve existir');
  for (const block of payload.blocks) {
    assert.strictEqual(payload.blocos[block.key], block.content, `Conteúdo do bloco ${block.key} deve ser idêntico em blocos e blocks`);
  }
  passedTests++;
  console.log('  ✓ [TESTE 14] 14. blocos corresponde aos mesmos conteúdos de blocks');

  // -------------------------------------------------------------
  // TESTE 15: nenhum conteúdo jurídico é reescrito
  // -------------------------------------------------------------
  console.log('[TESTE 15] Validação de integridade dos conteúdos homologados...');
  const pruBlock = payload.blocks.find((b) => b.key === 'merits_pru_regulatory_restriction_block');
  assert(pruBlock, 'merits_pru_regulatory_restriction_block deve existir');
  assert(pruBlock.content.includes('RN nº 565/2022'), 'Conteúdo do PRU deve conter menção à RN 565/2022');
  assert(pruBlock.content.includes('Luís Roberto Barroso'), 'Conteúdo do PRU deve conter citação doutrinária');
  passedTests++;
  console.log('  ✓ [TESTE 15] 15. nenhum conteúdo jurídico é reescrito');

  // -------------------------------------------------------------
  // TESTE 16: pedidos preservam request_key
  // -------------------------------------------------------------
  console.log('[TESTE 16] Validação de request_key em pedidos...');
  assert(Array.isArray(payload.pedidos), 'pedidos deve ser array');
  assert.strictEqual(payload.pedidos.length, 14, 'pedidos deve conter 14 itens');
  assert.strictEqual(payload.pedidos[0].request_key, 'req_standing', 'Primeiro pedido deve ter request_key req_standing');
  assert.strictEqual(payload.pedidos[1].request_key, 'req_legal_aid', 'Segundo pedido deve ter request_key req_legal_aid');
  passedTests++;
  console.log('  ✓ [TESTE 16] 16. pedidos preservam request_key');

  // -------------------------------------------------------------
  // TESTE 17: pedidos preservam numeração resolvida
  // -------------------------------------------------------------
  console.log('[TESTE 17] Validação da numeração contínua em pedidos...');
  assert(payload.pedidos[0].label.startsWith('a)'), 'Primeiro pedido deve ter label a)');
  assert(payload.pedidos[1].label.startsWith('b)'), 'Segundo pedido deve ter label b)');
  assert(payload.pedidos[2].label.startsWith('c)'), 'Terceiro pedido deve ter label c)');
  passedTests++;
  console.log('  ✓ [TESTE 17] 17. pedidos preservam numeração resolvida');

  // -------------------------------------------------------------
  // TESTE 18: não há duplicação de títulos
  // -------------------------------------------------------------
  console.log('[TESTE 18] Validação de não duplicação de títulos nos blocos...');
  for (const block of payload.blocks) {
    // Se o bloco começa com o próprio título, certifique-se de que não foi duplicado (ex: "TITULO\nTITULO")
    if (block.content.startsWith(block.title)) {
      const remainder = block.content.slice(block.title.length).trim();
      assert(!remainder.startsWith(block.title), `Bloco ${block.key} não deve duplicar título consecutivamente`);
    }
  }
  passedTests++;
  console.log('  ✓ [TESTE 18] 18. não há duplicação de títulos');

  // -------------------------------------------------------------
  // TESTE 19: não há chamadas OpenAI/Gemini
  // -------------------------------------------------------------
  console.log('[TESTE 19] Validação de ausência de chamadas a OpenAI/Gemini no mapper...');
  const mapperFile = fs.readFileSync(path.resolve(process.cwd(), 'src/domain/legal-engine/documentPayloadMapper.ts'), 'utf8');
  assert(!/import.*['"]openai['"]/i.test(mapperFile), 'Mapper não deve importar openai');
  assert(!/import.*['"]@google\/genai['"]/i.test(mapperFile), 'Mapper não deve importar google genai');
  assert(!/generateContent|ChatOpenAI/i.test(mapperFile), 'Mapper não deve invocar geração por IA');
  passedTests++;
  console.log('  ✓ [TESTE 19] 19. não há chamadas OpenAI/Gemini');

  // -------------------------------------------------------------
  // TESTE 20: não há chamadas diretas ao n8n durante testes unitários
  // -------------------------------------------------------------
  console.log('[TESTE 20] Validação de isolamento do n8n nos testes unitários...');
  // O mapper é função pura: não executa fetch, não abre sockets, não chama n8n
  assert(!/fetch\(/i.test(mapperFile), 'documentPayloadMapper é uma função pura e não realiza chamadas fetch');
  passedTests++;
  console.log('  ✓ [TESTE 20] 20. não há chamadas diretas ao n8n durante testes unitários');

  // -------------------------------------------------------------
  // TESTE 21: serialização é determinística
  // -------------------------------------------------------------
  console.log('[TESTE 21] Validação de determinismo da serialização...');
  const payloadSecondRun = buildCawDocxPayload({
    assembly: assembled.assembly,
    organization_id: TEST_ORG_ID,
    generation_job_id: TEST_JOB_ID,
    filename: assembled.filename,
  });
  assert.deepStrictEqual(payload.processo, payloadSecondRun.processo, 'processo idêntico');
  assert.deepStrictEqual(payload.partes, payloadSecondRun.partes, 'partes idênticas');
  assert.deepStrictEqual(payload.flags, payloadSecondRun.flags, 'flags idênticas');
  assert.deepStrictEqual(payload.custom_texts, payloadSecondRun.custom_texts, 'custom_texts idênticos');
  assert.deepStrictEqual(payload.pedidos, payloadSecondRun.pedidos, 'pedidos idênticos');
  passedTests++;
  console.log('  ✓ [TESTE 21] 21. serialização é determinística');

  // -------------------------------------------------------------
  // TESTE 22: mesmo input produz JSON documental idêntico
  // -------------------------------------------------------------
  console.log('[TESTE 22] Validação de igualdade exata do JSON documental (excluindo created_at/generated_at)...');
  const json1 = JSON.parse(JSON.stringify(payload));
  const json2 = JSON.parse(JSON.stringify(payloadSecondRun));
  // normaliza timestamps de geração para teste de igualdade estrutural
  json1.created_at = 'NORMALIZED';
  json2.created_at = 'NORMALIZED';
  json1.metadata.generated_at = 'NORMALIZED';
  json2.metadata.generated_at = 'NORMALIZED';
  assert.deepStrictEqual(json1, json2, 'JSON documental é rigorosamente idêntico');
  passedTests++;
  console.log('  ✓ [TESTE 22] 22. mesmo input produz JSON documental idêntico');

  console.log('\n=============================================================');
  console.log(`FASE 5.1: TODOS OS ${passedTests} TESTES PASSARAM COM SUCESSO!`);
  console.log('Contrato de dados VIPAZ -> Carbone corrigido e validado.');
  console.log('=============================================================\n');
}

runPhase51Tests().catch((err) => {
  console.error('\n❌ FALHA NA SUÍTE DE TESTES DA FASE 5.1:\n', err);
  process.exit(1);
});
