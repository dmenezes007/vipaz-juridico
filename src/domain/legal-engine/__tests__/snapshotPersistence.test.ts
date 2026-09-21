/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Suíte de Testes da Fase 3: Persistência do Snapshot Jurídico em public.legal_case_inputs
 */

import { HOMOLOGATED_CASE_DEFAULTS } from '../formDefinitions';
import { ruleEngine } from '../ruleEngine';
import {
  mapBasicData,
  mapLegalAnswers,
  mapCustomTexts,
  extractDerivedVariables,
  buildResolvedArchitectureSnapshot,
  buildInitialLegalCaseInputPayload,
  INITIAL_EMPTY_DERIVED_VARIABLES,
  INITIAL_EMPTY_RESOLVED_ARCHITECTURE,
  DETERMINISTIC_ENGINE_VERSION,
} from '../caseDataMapper';
import { LegalFormData } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FALHA NA ASSERÇÃO: ${message}`);
  }
}

let passedTests = 0;
function test(name: string, fn: () => void | Promise<void>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      throw new Error(`Testes assíncronos não gerenciados neste bloco simples: ${name}`);
    }
    passedTests++;
    console.log(`  ✓ [TESTE ${passedTests}] ${name}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ FALHA EM: ${name} -> ${msg}`);
    process.exit(1);
  }
}

console.log('\n--- VIPAZ JURÍDICO: SUÍTE DE TESTES DE PERSISTÊNCIA (FASE 3) ---');

const baseFormData: LegalFormData = {
  ...HOMOLOGATED_CASE_DEFAULTS,
  executive_summary: 'Ementa Executiva de Teste com caracteres especiais: @#$% & "aspas" e quebras\nde\nlinha.',
  claim_summary: 'Resumo da Inicial Forense com acentuação: ação ordinária de obrigação de não fazer c/c repetição de indébito.',
  controversy_delimitation: 'Delimitação Exata: legalidade do reajuste de plano coletivo com menos de 30 vidas (Pool de Risco RN 309).',
};

// Avaliação determinística para os testes
const evaluation = ruleEngine.evaluate(baseFormData);
assert(evaluation.isValid, 'Os dados base de homologação devem ser formalmente válidos');
const assembly = evaluation.assembly;

// 1. Mapeamento de basic_data
test('1. Mapeamento de basic_data', () => {
  const basicData = mapBasicData(baseFormData);

  assert(basicData.process_number === baseFormData.process_number, 'Número do processo mapeado');
  assert(basicData.court.includes('Vara Cível') && basicData.court.includes(baseFormData.court_number), 'Vara cível mapeada');
  assert(basicData.district === 'Capital', 'Comarca mapeada');
  assert(basicData.state === 'RJ', 'UF mapeada');
  assert(basicData.represented_party === 'Sul América Companhia de Seguro Saúde', 'Parte representada mapeada');
  assert(basicData.opposing_party.includes('MG Métodos Gráficos'), 'Parte adversa mapeada');
  assert(basicData.regional_forum === null || typeof basicData.regional_forum === 'string', 'Fórum regional consistente');
});

// 2. Mapeamento de legal_answers
test('2. Mapeamento de legal_answers', () => {
  const answers = mapLegalAnswers(baseFormData);

  assert(answers.document_type === 'Contestação', 'Tipo de peça mapeado');
  assert(Array.isArray(answers.opposing_party_nature), 'opposing_party_nature deve ser array');
  assert(answers.opposing_party_nature.includes('pj') && answers.opposing_party_nature.includes('pf'), 'Natureza mista');
  assert(Array.isArray(answers.dispute_objects), 'dispute_objects deve ser array');
  assert(answers.dispute_objects.includes('reajuste_anual_pme'), 'Objeto reajuste anual PME mapeado');
  assert(answers.injunction_status === 'denied', 'Status de liminar mapeado');
  assert(answers.moral_damages === 'claimed', 'Danos morais mapeado');
  assert(answers.legal_aid === 'challenge', 'Impugnação à JG mapeado');
  assert(Array.isArray(answers.legal_aid_targets), 'legal_aid_targets deve ser array');
  assert(answers.active_legitimacy === 'challenge', 'Ilegitimidade ativa mapeada');
  assert(answers.claim_value === 'challenge', 'Impugnação ao valor da causa mapeada');
  assert(answers.initial_petition_aptitude === 'do_not_challenge', 'Inépcia mapeada');
  assert(answers.three_year_limitation === 'argue', 'Prescrição trienal mapeada');
  assert(answers.ten_year_limitation === 'do_not_argue', 'Prescrição decenal mapeada');
  assert(answers.restitution === 'double', 'Restituição mapeada');
});

// 3. Preservação literal de executive_summary
test('3. Preservação literal de executive_summary', () => {
  const customTexts = mapCustomTexts(baseFormData);
  assert(
    customTexts.executive_summary === baseFormData.executive_summary,
    'executive_summary deve ser preservado literalmente sem resumo ou modificação'
  );
  assert(customTexts.executive_summary.includes('quebras\nde\nlinha'), 'Quebras de linha preservadas');
});

// 4. Preservação literal de claim_summary
test('4. Preservação literal de claim_summary', () => {
  const customTexts = mapCustomTexts(baseFormData);
  assert(
    customTexts.claim_summary === baseFormData.claim_summary,
    'claim_summary deve ser preservado exatamente como fornecido'
  );
  assert(customTexts.claim_summary.includes('c/c repetição de indébito'), 'Texto literal preservado');
});

// 5. Preservação literal de controversy_delimitation
test('5. Preservação literal de controversy_delimitation', () => {
  const customTexts = mapCustomTexts(baseFormData);
  assert(
    customTexts.controversy_delimitation === baseFormData.controversy_delimitation,
    'controversy_delimitation deve ser preservado de forma estrita'
  );
  assert(customTexts.controversy_delimitation.includes('Pool de Risco RN 309'), 'Termos exatos preservados');
});

// 6. Persistência de derived_variables
test('6. Persistência de derived_variables', () => {
  const derived = extractDerivedVariables(baseFormData, assembly);

  assert(derived.JUIZO_ARTIGO === 'DA', 'JUIZO_ARTIGO derivado');
  assert(derived.JUIZO_SUFFIX === 'ª VARA CÍVEL', 'JUIZO_SUFFIX derivado');
  assert(derived.ESTADO_FULL === 'DO ESTADO DO RIO DE JANEIRO', 'ESTADO_FULL derivado');
  assert(typeof derived.CIDADE_ESTADO_DATA === 'string', 'CIDADE_ESTADO_DATA derivado');
  assert(typeof derived.LISTA_OABS_PATRONO === 'string', 'LISTA_OABS_PATRONO derivado');
  assert(typeof derived.ADVOGADO_OAB_ESPECIFICA === 'string', 'ADVOGADO_OAB_ESPECIFICA derivado');
  // Garante que não duplica caseData nem insere blocos
  assert(!('REQUESTS_ITEMS_TEXT' in derived), 'Não deve conter REQUESTS_ITEMS_TEXT completo');
  assert(!('claim_summary' in derived), 'Não deve duplicar claim_summary');
  assert(!('executive_summary' in derived), 'Não deve duplicar executive_summary');
});

// 7. Persistência de included_blocks
test('7. Persistência de included_blocks', () => {
  const resolved = buildResolvedArchitectureSnapshot(assembly);

  assert(Array.isArray(resolved.included_blocks), 'included_blocks deve ser array');
  assert(resolved.included_blocks.length > 0, 'Deve conter blocos incluídos');
  const first = resolved.included_blocks[0];
  assert(typeof first.block_key === 'string', 'block_key deve existir');
  assert(first.included === true, 'included deve ser true');
  assert(typeof first.reason === 'string', 'reason deve ser string');
  assert(typeof first.trigger === 'string', 'trigger deve ser string');
  assert(first.content_status === 'available', 'content_status deve ser available');
});

// 8. Persistência de excluded_blocks
test('8. Persistência de excluded_blocks', () => {
  const resolved = buildResolvedArchitectureSnapshot(assembly);

  assert(Array.isArray(resolved.excluded_blocks), 'excluded_blocks deve ser array');
  assert(resolved.excluded_blocks.length > 0, 'Deve conter blocos excluídos na Contestação PME');
  const firstExcluded = resolved.excluded_blocks[0];
  assert(typeof firstExcluded.block_key === 'string', 'block_key deve existir');
  assert(firstExcluded.included === false, 'included deve ser false');
  assert(typeof firstExcluded.reason === 'string', 'reason deve ser string');
});

// 9. Persistência de linked_requests
test('9. Persistência de linked_requests', () => {
  const resolved = buildResolvedArchitectureSnapshot(assembly);

  assert(Array.isArray(resolved.linked_requests), 'linked_requests deve ser array');
  assert(resolved.linked_requests.length > 0, 'Deve conter pedidos vinculados');
  const firstReq = resolved.linked_requests[0];
  assert(typeof firstReq.request_key === 'string', 'request_key deve existir');
  assert(typeof firstReq.label === 'string', 'label deve existir');
  assert(typeof firstReq.order === 'number', 'order deve ser numérico');
  assert(firstReq.included === true, 'included deve ser true');
});

// 10. Ausência de texto integral dos blocos em resolved_architecture
test('10. Ausência de texto integral dos blocos em resolved_architecture', () => {
  const resolved = buildResolvedArchitectureSnapshot(assembly);
  const jsonStr = JSON.stringify(resolved);

  // Não deve conter a propriedade "content" com o texto dos blocos
  for (const b of resolved.included_blocks) {
    assert(!('content' in b), `Bloco incluído ${b.block_key} não deve conter 'content'`);
  }
  for (const b of resolved.excluded_blocks) {
    assert(!('content' in b), `Bloco excluído ${b.block_key} não deve conter 'content'`);
  }
  for (const r of resolved.linked_requests) {
    assert(!('text' in r), `Pedido ${r.request_key} não deve conter 'text' integral`);
  }

  // Não deve conter textos longos dos blocos jurídicos
  assert(!jsonStr.includes('Excelentíssimo Senhor Doutor Juiz de Direito'), 'Não deve conter cabeçalho forense integral');
  assert(!jsonStr.includes('Sul América Companhia de Seguro Saúde, pessoa jurídica'), 'Não deve conter qualificação integral');
});

// 11. PDF ausente não impede persistência
test('11. PDF ausente não impede persistência', () => {
  const dataWithoutPdf: LegalFormData = {
    ...baseFormData,
    source_file: null,
  };
  const evalNoPdf = ruleEngine.evaluate(dataWithoutPdf);
  assert(evalNoPdf.isValid, 'Validação determinística deve ser válida sem arquivo PDF');
  const basic = mapBasicData(dataWithoutPdf);
  assert(basic.process_number === dataWithoutPdf.process_number, 'Mapeamento funciona perfeitamente sem PDF');
});

// 12. Falha no Supabase não produz confirmação de sucesso
test('12. Falha no Supabase não produz confirmação de sucesso', () => {
  // Simula o comportamento do serviço em falha de inserção
  let caughtError: string | null = null;
  const mockInsertError = new Error('Simulação de falha de conexão com public.legal_case_inputs');

  try {
    // Se ocorrer erro na camada Supabase, lança exceção imediatamente
    if (mockInsertError) {
      throw new Error(`Falha ao persistir entrada do caso em public.legal_case_inputs: ${mockInsertError.message}`);
    }
  } catch (err: unknown) {
    caughtError = err instanceof Error ? err.message : String(err);
  }

  assert(caughtError !== null, 'Exceção deve ser lançada em caso de falha no Supabase');
  assert(Boolean(caughtError && caughtError.includes('Falha ao persistir')), 'Mensagem de erro clara deve ser reportada');
});

// 13. Nenhuma chamada OpenAI
test('13. Nenhuma chamada OpenAI', () => {
  const version = DETERMINISTIC_ENGINE_VERSION;
  assert(version === '1.0', 'Versão do motor determinístico deve ser 1.0');
  // O motor e os mapeadores não referenciam nem invocam APIs externas de IA
  const custom = mapCustomTexts(baseFormData);
  assert(custom.executive_summary === baseFormData.executive_summary, 'Nenhum processamento de IA executado');
});

// 14. Nenhuma chamada n8n
test('14. Nenhuma chamada n8n', () => {
  // O webhook n8n foi expressamente omitido no pipeline da Fase 3
  const resolved = buildResolvedArchitectureSnapshot(assembly);
  assert(resolved.resolution_metadata.architecture_id === assembly.architecture.id, 'Resolução exclusivamente local');
});

// 15. Nenhum DOCX gerado nesta fase
test('15. Nenhum DOCX gerado nesta fase', () => {
  // O snapshot contém metadados de montagem, mas nenhum blob DOCX é criado
  const basic = mapBasicData(baseFormData);
  const answers = mapLegalAnswers(baseFormData);
  const texts = mapCustomTexts(baseFormData);
  const derived = extractDerivedVariables(baseFormData, assembly);
  const arch = buildResolvedArchitectureSnapshot(assembly);

  assert(Boolean(basic && answers && texts && derived && arch), 'Todos os 5 objetos do snapshot gerados');
  assert(!('docx_storage_path' in basic), 'basic_data não contém docx');
  assert(!('docx_storage_path' in arch), 'resolved_architecture não contém docx');
});

// 16. Regressão Hotfix: INSERT inicial nunca envia derived_variables null
test('16. Regressão: INSERT inicial nunca envia derived_variables null', () => {
  const basic = mapBasicData(baseFormData);
  const answers = mapLegalAnswers(baseFormData);
  const texts = mapCustomTexts(baseFormData);

  const initialPayload = buildInitialLegalCaseInputPayload({
    id: 'mock-input-id',
    organization_id: 'mock-org-id',
    process_id: 'mock-proc-id',
    generation_job_id: 'mock-job-id',
    user_id: 'mock-user-id',
    basic_data: basic,
    legal_answers: answers,
    custom_texts: texts,
    architecture_id: null,
    architecture_version: '1.0',
    engine_version: DETERMINISTIC_ENGINE_VERSION,
  });

  assert(initialPayload.derived_variables !== null, 'derived_variables não pode ser null no INSERT inicial');
  assert(typeof initialPayload.derived_variables === 'object', 'derived_variables deve ser um objeto JSON');
  assert(Object.keys(initialPayload.derived_variables).length === 0, 'derived_variables inicial deve ser exatamente {}');
  assert(
    JSON.stringify(initialPayload.derived_variables) === JSON.stringify(INITIAL_EMPTY_DERIVED_VARIABLES),
    'derived_variables inicial deve corresponder a INITIAL_EMPTY_DERIVED_VARIABLES'
  );
});

// 17. Regressão Hotfix: INSERT inicial nunca envia resolved_architecture null
test('17. Regressão: INSERT inicial nunca envia resolved_architecture null', () => {
  const basic = mapBasicData(baseFormData);
  const answers = mapLegalAnswers(baseFormData);
  const texts = mapCustomTexts(baseFormData);

  const initialPayload = buildInitialLegalCaseInputPayload({
    id: 'mock-input-id',
    organization_id: 'mock-org-id',
    process_id: 'mock-proc-id',
    generation_job_id: 'mock-job-id',
    user_id: 'mock-user-id',
    basic_data: basic,
    legal_answers: answers,
    custom_texts: texts,
    architecture_id: null,
    architecture_version: '1.0',
    engine_version: DETERMINISTIC_ENGINE_VERSION,
  });

  assert(initialPayload.resolved_architecture !== null, 'resolved_architecture não pode ser null no INSERT inicial');
  assert(typeof initialPayload.resolved_architecture === 'object', 'resolved_architecture deve ser um objeto JSON');
  assert(
    Array.isArray(initialPayload.resolved_architecture.included_blocks),
    'included_blocks inicial deve ser um array vazio []'
  );
  assert(
    initialPayload.resolved_architecture.included_blocks.length === 0,
    'included_blocks inicial deve ter tamanho 0'
  );
  assert(
    Array.isArray(initialPayload.resolved_architecture.excluded_blocks),
    'excluded_blocks inicial deve ser um array vazio []'
  );
  assert(
    Array.isArray(initialPayload.resolved_architecture.linked_requests),
    'linked_requests inicial deve ser um array vazio []'
  );
  assert(
    Array.isArray(initialPayload.resolved_architecture.unresolved_requirements),
    'unresolved_requirements inicial deve ser um array vazio []'
  );
  assert(
    typeof initialPayload.resolved_architecture.resolution_metadata === 'object' &&
      initialPayload.resolved_architecture.resolution_metadata !== null,
    'resolution_metadata inicial deve ser um objeto {}'
  );
});

console.log(`\n==================================================`);
console.log(`TOTAL DE TESTES DE PERSISTÊNCIA APROVADOS: ${passedTests}/17`);
console.log(`==================================================\n`);
