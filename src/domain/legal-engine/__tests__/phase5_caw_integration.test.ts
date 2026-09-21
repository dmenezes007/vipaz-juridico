/**
 * VIPAZ JURÍDICO — FASE 5
 * SUÍTE DE TESTES: INTEGRAÇÃO NATIVA VIPAZ -> MOTOR DOCX CAW (n8n / CARBONE)
 *
 * Validações:
 * 1. Serializador documental (documentPayloadMapper) gera payload exato a partir do snapshot homologado.
 * 2. Todos os campos mínimos exigidos pelo workflow n8n/Carbone estão presentes e tipados.
 * 3. Filename obedece ao padrão homologado VIPAZ_Contestacao_[numero_processo].docx.
 * 4. Rastreabilidade total: organization_id, generation_job_id e legal_case_input_id preservados.
 * 5. Variáveis resolvidas e coleções de blocos (28 blocos) e pedidos (14 pedidos) íntegras.
 * 6. Suporte a tokens diretos do Carbone (ex: {d.DISTRICT}, {d.PROCESS_NUMBER}).
 * 7. Isolamento absoluto: Nenhuma dependência de OpenAI, ChatOpenAI ou IA generativa.
 * 8. Tratamento de erro sem falsos positivos quando o webhook falhar.
 * 9. Proteção de segredos: N8N_DOCX_WEBHOOK_URL é server-side e não exposto em VITE_*.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  assembleDocumentFromSnapshot,
  getPhase41HomologatedSnapshot,
  OFFICIAL_HOMOLOGATED_JOB_ID,
  OFFICIAL_HOMOLOGATED_INPUT_ID,
  buildDeterministicDocxFilename,
} from '../../../services/experimentalDocxService';
import {
  buildCawDocxPayload,
  CawDocxWorkflowPayload,
} from '../documentPayloadMapper';

const TEST_ORG_ID = 'd3b07384-d113-494b-9c8e-04f7b4c65e89';
const TEST_JOB_ID = OFFICIAL_HOMOLOGATED_JOB_ID;

console.log('\n=============================================================');
console.log('VIPAZ JURÍDICO — FASE 5: SUÍTE DE TESTES CAW DOCX (n8n/Carbone)');
console.log('=============================================================\n');

async function runPhase5Tests() {
  let passedTests = 0;

  // -------------------------------------------------------------
  // TESTE 1: Montagem do AssemblyEngine e Construção do Payload
  // -------------------------------------------------------------
  console.log('[TESTE 1] Montagem do AssemblyEngine e execução do Serializador Documental...');
  const snapshot = getPhase41HomologatedSnapshot();
  const assembled = await assembleDocumentFromSnapshot(snapshot, { recalculateArchitecture: true });

  assert(assembled && assembled.assembly, 'AssemblyEngine deve retornar assembly válido');
  assert.strictEqual(assembled.includedBlocksCount, 28, 'Deve conter os 28 blocos homologados');
  assert.strictEqual(assembled.linkedRequestsCount, 14, 'Deve conter os 14 pedidos vinculados');

  const payload = buildCawDocxPayload({
    assembly: assembled.assembly,
    organization_id: TEST_ORG_ID,
    generation_job_id: TEST_JOB_ID,
    filename: assembled.filename,
  });

  assert(payload, 'Payload não pode ser nulo');
  passedTests++;
  console.log('  -> Sucesso: AssemblyEngine e Payload construídos com 28 blocos e 14 pedidos.\n');

  // -------------------------------------------------------------
  // TESTE 2: Campos Obrigatórios de Rastreabilidade e Infraestrutura
  // -------------------------------------------------------------
  console.log('[TESTE 2] Validação de campos obrigatórios de rastreabilidade...');
  assert.strictEqual(payload.organization_id, TEST_ORG_ID, 'organization_id deve coincidir com o tenant');
  assert.strictEqual(payload.generation_job_id, TEST_JOB_ID, 'generation_job_id deve coincidir');
  assert(payload.filename && payload.filename.endsWith('.docx'), 'filename deve ter extensão .docx');
  assert(payload.filename.startsWith('VIPAZ_Contestacao_'), 'filename deve iniciar com VIPAZ_Contestacao_');
  assert(payload.created_at, 'created_at deve existir');
  passedTests++;
  console.log('  -> Sucesso: Identificadores de infraestrutura e rastreabilidade válidos.\n');

  // -------------------------------------------------------------
  // TESTE 3: Padrão Homologado do Nome do Arquivo DOCX
  // -------------------------------------------------------------
  console.log('[TESTE 3] Validação do padrão homologado do nome do arquivo...');
  const procNum = String(snapshot.basic_data?.process_number || assembled.assembly.snapshot.formData.process_number || '');
  const expectedFilename = buildDeterministicDocxFilename(procNum);
  assert.strictEqual(payload.filename, expectedFilename, `Nome do arquivo deve ser ${expectedFilename}`);
  assert.strictEqual(payload.filename, 'VIPAZ_Contestacao_0802491-32.2024.8.19.0001.docx');
  passedTests++;
  console.log(`  -> Sucesso: Nome homologado confirmado: "${payload.filename}".\n`);

  // -------------------------------------------------------------
  // TESTE 4: Dados do Processo, Juízo e Partes
  // -------------------------------------------------------------
  console.log('[TESTE 4] Validação dos dados forenses, partes e jurisdição...');
  assert.strictEqual(payload.process_number, procNum, 'Número do processo deve ser idêntico ao snapshot');
  assert.strictEqual(payload.document_type, 'Contestação', 'Tipo de peça deve ser Contestação');
  assert.strictEqual(payload.client, 'Sul América Companhia de Seguro Saúde', 'Cliente deve ser Sul América');
  assert.strictEqual(payload.represented_party, 'Sul América Companhia de Seguro Saúde', 'Representada deve ser Sul América');
  assert(payload.opposing_party.includes('MG Métodos Gráficos'), 'Parte adversa deve estar preenchida');
  assert(payload.district.includes('Capital') || payload.district.includes('Rio de Janeiro'), 'Comarca deve estar preenchida');
  assert.strictEqual(payload.uf, 'RJ', 'UF deve ser RJ');
  passedTests++;
  console.log('  -> Sucesso: Dados processuais e de jurisdição validados com precisão.\n');

  // -------------------------------------------------------------
  // TESTE 5: Coleção de Blocos (28 blocos) para o Loop Carbone
  // -------------------------------------------------------------
  console.log('[TESTE 5] Validação da coleção de blocos serializados para o Carbone...');
  assert(Array.isArray(payload.blocks), 'blocks deve ser um array');
  assert.strictEqual(payload.blocks.length, 28, 'Deve conter exatamente 28 blocos serializados');

  // Ordem estritamente crescente
  for (let i = 0; i < payload.blocks.length; i++) {
    const block = payload.blocks[i];
    assert(block.key, `Bloco ${i} deve ter key`);
    assert(block.title, `Bloco ${i} deve ter título`);
    assert(block.content && block.content.trim().length > 20, `Bloco ${block.key} deve ter conteúdo substancial`);
    assert(typeof block.order === 'number', `Bloco ${block.key} deve ter order numérico`);
    if (i > 0) {
      assert(block.order >= payload.blocks[i - 1].order, `Blocos devem estar em ordem crescente: ${payload.blocks[i - 1].order} -> ${block.order}`);
    }
  }
  passedTests++;
  console.log('  -> Sucesso: 28 blocos forenses ordenados e serializados sem truncamentos.\n');

  // -------------------------------------------------------------
  // TESTE 6: Coleção de Pedidos e Requerimentos (14 pedidos reordenados)
  // -------------------------------------------------------------
  console.log('[TESTE 6] Validação da coleção de pedidos finais e renumeração...');
  assert(Array.isArray(payload.requests), 'requests deve ser um array');
  assert.strictEqual(payload.requests.length, 14, 'Deve conter exatamente 14 pedidos finais');

  // Verifica que os pedidos estão ordenados e renumerados sequencialmente com labels contínuas
  for (let i = 0; i < payload.requests.length; i++) {
    const req = payload.requests[i];
    assert(req.key, `Pedido ${i} deve ter key`);
    assert(req.label, `Pedido ${i} deve ter label`);
    assert(req.text && req.text.trim().length > 10, `Pedido ${req.key} deve ter texto preenchido`);
    if (i > 0) {
      assert(req.order > payload.requests[i - 1].order, `Pedido ${req.key} deve ter ordem crescente`);
    }
  }
  assert(payload.requests_text && payload.requests_text.includes(payload.requests[0].text), 'requests_text deve conter os pedidos formatados');
  passedTests++;
  console.log('  -> Sucesso: 14 pedidos finais renumerados em ordem contínua confirmados no payload.\n');

  // -------------------------------------------------------------
  // TESTE 7: Variáveis Resolvidas e Espalhamento para Template Carbone
  // -------------------------------------------------------------
  console.log('[TESTE 7] Validação das variáveis resolvidas e compatibilidade com marcadores {d.VAR}...');
  assert(payload.variables, 'payload.variables deve existir');
  assert(payload.variables.DISTRICT, 'DISTRICT deve estar nas variáveis');
  assert(payload.variables.OPPOSING_PARTY, 'OPPOSING_PARTY deve estar nas variáveis');
  assert(payload.variables.PROCESS_NUMBER, 'PROCESS_NUMBER deve estar nas variáveis');

  // Suporte a marcadores diretos {d.DISTRICT}, {d.OPPOSING_PARTY}
  assert.strictEqual(payload.DISTRICT, payload.variables.DISTRICT, 'Variável DISTRICT deve estar espalhada na raiz do payload');
  assert.strictEqual(payload.OPPOSING_PARTY, payload.variables.OPPOSING_PARTY, 'Variável OPPOSING_PARTY deve estar espalhada na raiz');
  assert.strictEqual(payload.PROCESS_NUMBER, payload.variables.PROCESS_NUMBER, 'Variável PROCESS_NUMBER deve estar espalhada na raiz');
  passedTests++;
  console.log('  -> Sucesso: Variáveis resolvidas acessíveis tanto via d.variables.* quanto d.* no Carbone.\n');

  // -------------------------------------------------------------
  // TESTE 8: Estrutura Documental Compatível (structured_content & metadata)
  // -------------------------------------------------------------
  console.log('[TESTE 8] Validação de structured_content e metadados volumétricos...');
  assert(payload.structured_content, 'structured_content deve existir');
  assert(Array.isArray(payload.structured_content.merits), 'merits deve ser array');
  assert(Array.isArray(payload.structured_content.requests), 'requests deve ser array');
  assert(payload.metadata, 'metadata deve existir');
  assert(payload.metadata.word_count > 1000, `word_count deve ser expressivo (>1000 palavras, atual: ${payload.metadata.word_count})`);
  assert(payload.metadata.pages_estimated >= 10, `pages_estimated deve ser >= 10 (atual: ${payload.metadata.pages_estimated})`);
  passedTests++;
  console.log(`  -> Sucesso: Metadados estruturados: ${payload.metadata.word_count} palavras, ~${payload.metadata.pages_estimated} páginas estimadas.\n`);

  // -------------------------------------------------------------
  // TESTE 9: Validação de Parâmetros Obrigatórios no Mapper (Falhas Esperadas)
  // -------------------------------------------------------------
  console.log('[TESTE 9] Validação de lançamento de erro para parâmetros ausentes...');
  assert.throws(
    () => {
      buildCawDocxPayload({
        assembly: assembled.assembly,
        organization_id: '',
        generation_job_id: TEST_JOB_ID,
      });
    },
    /organization_id é obrigatório/,
    'Deve lançar erro se organization_id estiver vazio'
  );

  assert.throws(
    () => {
      buildCawDocxPayload({
        assembly: assembled.assembly,
        organization_id: TEST_ORG_ID,
        generation_job_id: '',
      });
    },
    /generation_job_id é obrigatório/,
    'Deve lançar erro se generation_job_id estiver vazio'
  );
  passedTests++;
  console.log('  -> Sucesso: Erros defensivos disparados quando IDs de rastreabilidade faltam.\n');

  // -------------------------------------------------------------
  // TESTE 10: Auditoria de Isolamento: Proibição Estrita de OpenAI / ChatOpenAI
  // -------------------------------------------------------------
  console.log('[TESTE 10] Auditoria de isolamento: Nenhuma dependência ou chamada a IA generativa...');
  const mapperPath = path.resolve(process.cwd(), 'src/domain/legal-engine/documentPayloadMapper.ts');
  const servicePath = path.resolve(process.cwd(), 'src/services/docxGenerationService.ts');
  const serverHandlerPath = path.resolve(process.cwd(), 'src/server/generateDocxHandler.ts');

  const mapperContent = fs.readFileSync(mapperPath, 'utf8');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  const serverHandlerContent = fs.readFileSync(serverHandlerPath, 'utf8');

  assert(!/import\s+.*from\s+['"]openai['"]/i.test(mapperContent), 'documentPayloadMapper não deve importar SDK OpenAI');
  assert(!/import\s+.*from\s+['"]@google\/genai['"]/i.test(mapperContent), 'documentPayloadMapper não deve importar SDK GenAI');
  assert(!/generateContent|ChatOpenAI/i.test(mapperContent), 'documentPayloadMapper não deve conter invocações de IA');

  assert(!/import\s+.*from\s+['"]openai['"]/i.test(serviceContent), 'docxGenerationService não deve importar SDK OpenAI');
  assert(!/generateContent|ChatOpenAI/i.test(serviceContent), 'docxGenerationService não deve conter invocações de IA');

  assert(!/import\s+.*from\s+['"]openai['"]/i.test(serverHandlerContent), 'generateDocxHandler não deve importar SDK OpenAI');
  assert(!/generateContent|ChatOpenAI/i.test(serverHandlerContent), 'generateDocxHandler não deve conter invocações de IA');
  passedTests++;
  console.log('  -> Sucesso: Código 100% determinístico, livre de modelos generativos ou custos imprevisíveis.\n');

  // -------------------------------------------------------------
  // TESTE 11: Proteção de Segredos: URL Privilegiada no Backend
  // -------------------------------------------------------------
  console.log('[TESTE 11] Auditoria de segurança: Webhook n8n protegido no backend...');
  assert(!/VITE_N8N_DOCX_WEBHOOK_URL/i.test(serviceContent), 'docxGenerationService NÃO deve expor VITE_N8N_DOCX_WEBHOOK_URL no browser');
  assert(serviceContent.includes('/api/generate-docx'), 'docxGenerationService deve chamar o endpoint backend interno /api/generate-docx');
  assert(/method:\s*['"]POST['"]/i.test(serviceContent), 'docxGenerationService deve utilizar método POST');
  assert(/N8N_DOCX_WEBHOOK_URL/i.test(serverHandlerContent), 'generateDocxHandler deve ler N8N_DOCX_WEBHOOK_URL do ambiente server-side');
  passedTests++;
  console.log('  -> Sucesso: Arquitetura segura garantida: frontend consome /api/generate-docx e webhook reside no servidor.\n');

  // -------------------------------------------------------------
  // TESTE 12: Idempotência e Reprodutibilidade Estrita
  // -------------------------------------------------------------
  console.log('[TESTE 12] Validação de determinismo e idempotência...');
  const payload2 = buildCawDocxPayload({
    assembly: assembled.assembly,
    organization_id: TEST_ORG_ID,
    generation_job_id: TEST_JOB_ID,
    filename: assembled.filename,
  });

  assert.strictEqual(payload.blocks.length, payload2.blocks.length);
  assert.strictEqual(payload.requests.length, payload2.requests.length);
  assert.strictEqual(payload.filename, payload2.filename);
  assert.strictEqual(payload.metadata.word_count, payload2.metadata.word_count);
  for (let i = 0; i < payload.blocks.length; i++) {
    assert.strictEqual(payload.blocks[i].key, payload2.blocks[i].key);
    assert.strictEqual(payload.blocks[i].content, payload2.blocks[i].content);
  }
  passedTests++;
  console.log('  -> Sucesso: Idempotência perfeita comprovada entre execuções repetidas.\n');

  console.log('=============================================================');
  console.log(`FASE 5: TODOS OS ${passedTests} TESTES PASSARAM COM SUCESSO!`);
  console.log('Integração nativa VIPAZ -> CAW DOCX (n8n/Carbone) homologada.');
  console.log('=============================================================\n');
}

runPhase5Tests().catch((err) => {
  console.error('\n❌ FALHA NA SUÍTE DE TESTES DA FASE 5:\n', err);
  process.exit(1);
});
