/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Fase 5: Serializador Documental para o Motor DOCX CAW (n8n / Carbone)
 * 
 * Responsabilidade Estrita:
 * Transforma a saída já homologada do AssemblyEngine no JSON documental
 * esperado pelo workflow de produção do n8n (Carbone DOCX).
 * 
 * Regras Estritas:
 * - NÃO duplica regras jurídicas.
 * - NÃO altera textos ou teses.
 * - NÃO utiliza IA generativa ou chamadas a OpenAI.
 * - Preserva campos obrigatórios: organization_id, generation_job_id, filename,
 *   e toda a estrutura documental consumida pelo template Carbone.
 */

import { ResolvedDocumentAssembly } from './types';
import { buildDeterministicDocxFilename } from '../../services/experimentalDocxService';
import { formatDataExtenso } from './architectureResolver';

export interface CawDocxWorkflowPayload {
  // Metadados de rastreabilidade e infraestrutura
  organization_id: string;
  generation_job_id: string;
  filename: string;

  // Identificação do processo e partes (top-level preservados para retrocompatibilidade)
  process_number: string;
  document_type: string;
  client: string;
  represented_party: string;
  opposing_party: string;

  // Juízo e foro
  court: string;
  district: string;
  uf: string;
  architecture_version: string;
  created_at: string;

  // ====================================================================
  // CONTRATO DOCUMENTAL CARBONE (FASE 5.1 & FASE 5.2 - TEMPLATE CAW v2)
  // ====================================================================

  // Identificação processual semântica
  processo: {
    numero: string;
    orgao_julgador: string;
    comarca: string;
    uf: string;
  };

  // Endereçamento direto e territorial ao juízo
  enderecamento: string;

  // Partes semânticas
  partes: {
    cliente: string;
    representada: string;
    parte_adversa: string;
  };

  // Textos personalizados / variáveis contextuais
  custom_texts: {
    ementa_executiva: string;
    resumo_inicial: string;
    delimitacao_controv: string;
    tutela_indef: string;
    tutela_indeferida: string;
    tutela_deferida: string;
    dano_moral: string;
    [key: string]: string;
  };

  // Flags booleanas derivadas estritamente da inclusão de blocos e contexto
  flags: {
    tutela_indef: boolean;
    tutela_indefer: boolean;
    tutela_indeferida: boolean;
    tutela_deferida: boolean;
    tem_preliminares: boolean;
    ilegitimidade_ativa: boolean;
    gratuidade_impugnada: boolean;
    gratuidade_pf: boolean;
    gratuidade_pj: boolean;
    valor_causa: boolean;
    inepcia_inicial: boolean;
    prescricao_trienal: boolean;
    prescricao_decenal: boolean;
    repeticao_pleiteada: boolean;
    repeticao_simples: boolean;
    repeticao_dobro: boolean;
    dano_moral: boolean;
    reajuste_etario: boolean;
    mostrar_bruna: boolean;
    [key: string]: boolean;
  };

  // Mapa semântico de blocos por chave { [key]: content }
  blocos: Record<string, string>;

  // Blocos estruturados da peça processual (com ordem forense e conteúdo resolvido)
  blocks: Array<{
    key: string;
    title: string;
    category: string;
    order: number;
    content: string;
  }>;

  // Pedidos no contrato Carbone
  pedidos: Array<{
    request_key: string;
    key: string;
    label: string;
    order: number;
    text: string;
    content: string;
    children: any[];
  }>;

  // Fechamento da peça (Template CAW v2)
  fechamento: {
    local_data: string;
    oab_sob_numero: string;
    oab_assinatura: string;
    sucumbencia: string;
    cidade_data: string;
    local: string;
    data: string;
    texto_completo: string;
    content: string;
    [key: string]: unknown;
  };

  // Pedidos e requerimentos finais reordenados (retrocompatibilidade)
  requests: Array<{
    key: string;
    label: string;
    order: number;
    text: string;
  }>;
  requests_text: string;

  // Mapa de variáveis resolvidas
  variables: Record<string, string>;

  // Conteúdo estruturado para compatibilidade
  structured_content: {
    addressing: string;
    qualification: string;
    preliminaries: string[];
    facts_summary: string[];
    merits: string[];
    requests: string[];
    closing: string;
  };

  // Metadados forenses e volumetria
  metadata: {
    court: string;
    represented_party: string;
    opposing_party: string;
    subjects: string[];
    word_count: number;
    pages_estimated: number;
    generated_at: string;
  };

  // Suporte flexível a marcadores diretos do Carbone (ex: {d.PROCESS_NUMBER})
  [key: string]: unknown;
}

export interface DocumentPayloadMapperParams {
  assembly: ResolvedDocumentAssembly;
  organization_id: string;
  generation_job_id: string;
  filename?: string;
}

/**
 * Função utilitária determinística para recuperar o conteúdo de um bloco resolvido por chave.
 * NÃO avalia condições jurídicas — apenas localiza o bloco incluído e retorna seu content literal.
 */
export function getBlockContent(
  blocks: Array<{ key: string; content: string }>,
  key: string
): string {
  const found = blocks.find((b) => b.key === key);
  return found?.content || '';
}

/**
 * Função utilitária determinística para verificar se um bloco está incluído na montagem.
 * NÃO avalia condições jurídicas — apenas valida presença em blocks.
 */
export function hasBlock(
  blocks: Array<{ key: string }>,
  key: string
): boolean {
  return blocks.some((b) => b.key === key);
}

/**
 * Resolve a expressão de endereçamento territorial e jurisdicional conforme a UF e tipo de juízo
 */
export function resolveTerritorialEnderecamento(params: {
  courtType?: string;
  courtNumber?: string;
  courtRegional?: string;
  courtTypeCustom?: string;
  district?: string;
  uf?: string;
}): string {
  const ufUpper = (params.uf || 'RJ').trim().toUpperCase();
  let estadoExpr = 'DO ESTADO DO RIO DE JANEIRO';
  if (ufUpper === 'SP') estadoExpr = 'DO ESTADO DE SÃO PAULO';
  else if (ufUpper === 'MG') estadoExpr = 'DO ESTADO DE MINAS GERAIS';
  else if (ufUpper === 'BA') estadoExpr = 'DO ESTADO DA BAHIA';

  const courtType = (params.courtType || 'Vara Cível').trim();
  const isJec = courtType.toLowerCase().includes('juizado');
  const isOther = courtType === 'Outro';
  const courtNum = (params.courtNumber || '').trim();

  const regionalRaw = params.courtRegional?.trim().toUpperCase() || '';
  const regionalPart = regionalRaw
    ? ` ${/^(FORO|SUBSEÇÃO|REGIONAL)/.test(regionalRaw) ? regionalRaw : `FORO REGIONAL ${regionalRaw}`}`
    : '';

  const rawDistrict = (params.district || 'CAPITAL').trim().toUpperCase();
  let comarcaStr = rawDistrict;
  if (rawDistrict === 'CAPITAL') {
    comarcaStr = 'DA CAPITAL';
  } else if (!rawDistrict.startsWith('DE ') && !rawDistrict.startsWith('DA ') && !rawDistrict.startsWith('DO ')) {
    comarcaStr = `DE ${rawDistrict}`;
  }

  if (isOther) {
    const custom = String((params as any).courtTypeCustom || '').trim().toUpperCase();
    return `DOUTO JUÍZO ${custom}${regionalPart} DA COMARCA ${comarcaStr} ${estadoExpr}`.replace(/\s+/g, ' ').trim();
  }

  if (isJec) {
    const numPrefix = courtNum ? `${courtNum}º ` : '';
    return `DOUTO JUÍZO DO ${numPrefix}JUIZADO ESPECIAL CÍVEL${regionalPart} DA COMARCA ${comarcaStr} ${estadoExpr}`;
  } else {
    const numPrefix = courtNum ? `${courtNum}ª ` : '';
    return `DOUTO JUÍZO DE DIREITO DA ${numPrefix}VARA CÍVEL${regionalPart} DA COMARCA ${comarcaStr} ${estadoExpr}`;
  }
}

/**
 * Retorna as informações exatas da OAB do Dr. José Antônio Martins para a UF
 */
export function getOabJoseAntonioMartins(uf: string): {
  oab_sob_numero: string;
  oab_assinatura: string;
} {
  const ufUpper = (uf || 'RJ').trim().toUpperCase();
  switch (ufUpper) {
    case 'SP':
      return {
        oab_sob_numero: 'OAB/SP sob o nº 340.639',
        oab_assinatura: 'OAB/SP 340.639',
      };
    case 'MG':
      return {
        oab_sob_numero: 'OAB/MG sob o nº 122.535',
        oab_assinatura: 'OAB/MG 122.535',
      };
    case 'BA':
      return {
        oab_sob_numero: 'OAB/BA sob o nº 31.341',
        oab_assinatura: 'OAB/BA 31.341',
      };
    case 'RJ':
    default:
      return {
        oab_sob_numero: 'OAB/RJ sob o nº 114.760',
        oab_assinatura: 'OAB/RJ 114.760',
      };
  }
}

/**
 * Retorna a cidade padrão para encerramento documental conforme a UF
 */
export function getCidadePorUf(uf: string): string {
  const ufUpper = (uf || 'RJ').trim().toUpperCase();
  switch (ufUpper) {
    case 'SP':
      return 'São Paulo – SP';
    case 'MG':
      return 'Belo Horizonte – MG';
    case 'BA':
      return 'Salvador – BA';
    case 'RJ':
    default:
      return 'Rio de Janeiro – RJ';
  }
}

/**
 * Retorna o texto determinístico de sucumbência diferenciado para Vara Cível vs Juizado Especial Cível
 */
export function getSucumbenciaText(courtType?: string): string {
  const isJec = (courtType || '').toLowerCase().includes('juizado');
  if (isJec) {
    return 'a condenação integral da parte demandante ao pagamento das despesas processuais e dos honorários advocatícios de sucumbência em favor dos patronos desta operadora, calculados sobre o valor atualizado da causa, em caso de eventual remessa destes autos à apreciação das instâncias recursais competentes';
  }
  return 'a condenação integral da parte demandante ao pagamento das despesas processuais e dos honorários advocatícios de sucumbência em favor dos patronos desta operadora, calculados sobre o valor atualizado da causa';
}

/**
 * Verifica deterministicamente se pelo menos um dos blocos preliminares ou prejudiciais condicionais foi incluído
 */
export function hasAnyPreliminar(blocks: Array<{ key: string }>): boolean {
  const PRELIMINARY_CONDITIONAL_KEYS = [
    'standing_challenge_block',
    'legal_aid_pf_block',
    'legal_aid_pj_block',
    'claim_value_challenge_block',
    'petition_aptitude_block',
    'prescription_triennial_block',
    'prescription_decennial_block',
  ];
  return PRELIMINARY_CONDITIONAL_KEYS.some((key) => hasBlock(blocks, key));
}

/**
 * Constrói o payload documental para envio ao webhook n8n do CAW DOCX
 */
export function buildCawDocxPayload(params: DocumentPayloadMapperParams): CawDocxWorkflowPayload {
  const { organization_id, generation_job_id } = params;
  const assembly: ResolvedDocumentAssembly = (params.assembly as any)?.assembly || params.assembly;

  if (!organization_id || !organization_id.trim()) {
    throw new Error('organization_id é obrigatório para construção do payload documental.');
  }

  if (!generation_job_id || !generation_job_id.trim()) {
    throw new Error('generation_job_id é obrigatório para construção do payload documental.');
  }

  const formData = (assembly?.snapshot?.formData || {}) as Record<string, any>;
  const variables = (assembly?.resolvedVariables || {}) as Record<string, string>;

  const processNumber = String(
    formData.process_number ||
    variables.PROCESS_NUMBER ||
    ''
  ).trim();

  const client = String(
    formData.client ||
    'Sul América Companhia de Seguro Saúde'
  ).trim();

  const opposingParty = String(
    formData.opposing_party ||
    variables.OPPOSING_PARTY ||
    ''
  ).trim();

  const district = String(
    formData.district ||
    variables.DISTRICT ||
    ''
  ).trim();

  const uf = String(formData.uf || 'RJ');
  const court = formData.court_type
    ? `${formData.court_type} ${formData.court_number || ''}ª - Comarca de ${district}/${uf}`
    : String(variables.JUIZO_SUFFIX || 'Vara Cível');

  const defaultFilename = buildDeterministicDocxFilename(processNumber);
  const finalFilename = params.filename && params.filename.trim()
    ? params.filename.trim()
    : defaultFilename;

  // Blocos com ordenação sequencial forense
  const serializedBlocks = [...assembly.includedBlocks]
    .sort((a, b) => a.order - b.order)
    .map((block) => ({
      key: block.key,
      title: block.title,
      category: block.category,
      order: block.order,
      content: block.content,
    }));

  // Pedidos e requerimentos com ordenação
  const serializedRequests = [...assembly.includedRequests]
    .sort((a, b) => a.order - b.order)
    .map((req) => ({
      key: req.key,
      label: req.label,
      order: req.order,
      text: req.text,
    }));

  const requestsText = variables.REQUESTS_ITEMS_TEXT ||
    serializedRequests.map((r) => r.text).join('\n\n');

  // Estimativa volumétrica
  const totalWords = serializedBlocks.reduce(
    (acc, b) => acc + (b.content ? b.content.split(/\s+/).filter(Boolean).length : 0),
    0
  );
  const estimatedPages = Math.max(1, Math.ceil(totalWords / 350));

  const preliminariesTitles = serializedBlocks
    .filter((b) => b.category === 'preliminary')
    .map((b) => b.title);

  const meritsTitles = serializedBlocks
    .filter((b) => b.category === 'merits')
    .map((b) => b.title);

  const nowIso = new Date().toISOString();

  // ====================================================================
  // CONTRATO DOCUMENTAL CARBONE (FASE 5.1 & FASE 5.2 - TEMPLATE CAW v2)
  // ====================================================================

  // 1. Processo semântico
  const regionalRawLabel = formData.court_regional ? String(formData.court_regional).trim() : '';
  const regionalLabel = regionalRawLabel
    ? ' ' + (/^(foro|subseção|regional)/i.test(regionalRawLabel) ? regionalRawLabel : 'Foro Regional ' + regionalRawLabel)
    : '';
  const orgaoJulgador = formData.court_type
    ? (formData.court_type === 'Juizado Especial Cível'
        ? `${formData.court_number || ''}º Juizado Especial Cível${regionalLabel}`.trim()
        : formData.court_type === 'Vara Cível'
          ? `${formData.court_number || ''}ª Vara Cível${regionalLabel}`.trim()
          : `${formData.court_type_custom || ''}${regionalLabel}`.trim())
    : court;

  const processo = {
    numero: processNumber,
    orgao_julgador: orgaoJulgador,
    comarca: district,
    uf,
  };

  // 2. Endereçamento territorial e jurisdicional determinístico
  const enderecamento = resolveTerritorialEnderecamento({
    courtType: formData.court_type,
    courtNumber: formData.court_number,
    courtRegional: formData.court_regional,
    courtTypeCustom: formData.court_type_custom,
    district,
    uf,
  });

  // 3. Partes semânticas
  const partes = {
    cliente: client,
    representada: client,
    parte_adversa: opposingParty,
  };

  // 4. Custom texts derivados exclusivamente dos blocos incluídos
  const tutelaIndefText = getBlockContent(serializedBlocks, 'injunction_denied_block');
  const customTexts = {
    ementa_executiva: getBlockContent(serializedBlocks, 'executive_summary_block'),
    resumo_inicial: getBlockContent(serializedBlocks, 'claim_summary_block'),
    delimitacao_controv: getBlockContent(serializedBlocks, 'controversy_delimitation_block'),
    tutela_indef: tutelaIndefText,
    tutela_indeferida: tutelaIndefText,
    tutela_deferida: getBlockContent(serializedBlocks, 'injunction_granted_block'),
    dano_moral: getBlockContent(serializedBlocks, 'moral_damages_block'),
  };

  // 5. Flags booleanas derivadas estritamente da presença real dos blocos e contexto
  const tutelaIndefFlag = hasBlock(serializedBlocks, 'injunction_denied_block');
  const flags = {
    tutela_indef: tutelaIndefFlag,
    tutela_indefer: tutelaIndefFlag, // retrocompatibilidade Fase 5.1
    tutela_indeferida: tutelaIndefFlag,
    tutela_deferida: hasBlock(serializedBlocks, 'injunction_granted_block'),
    tem_preliminares: hasAnyPreliminar(serializedBlocks),
    ilegitimidade_ativa: hasBlock(serializedBlocks, 'standing_challenge_block'),
    gratuidade_impugnada: hasBlock(serializedBlocks, 'legal_aid_pf_block') || hasBlock(serializedBlocks, 'legal_aid_pj_block'),
    gratuidade_pf: hasBlock(serializedBlocks, 'legal_aid_pf_block'),
    gratuidade_pj: hasBlock(serializedBlocks, 'legal_aid_pj_block'),
    valor_causa: hasBlock(serializedBlocks, 'claim_value_challenge_block'),
    inepcia_inicial: hasBlock(serializedBlocks, 'petition_aptitude_block'),
    prescricao_trienal: hasBlock(serializedBlocks, 'prescription_triennial_block'),
    prescricao_decenal: hasBlock(serializedBlocks, 'prescription_decennial_block'),
    repeticao_pleiteada: hasBlock(serializedBlocks, 'repetition_simple_block') || hasBlock(serializedBlocks, 'repetition_double_block'),
    repeticao_simples: hasBlock(serializedBlocks, 'repetition_simple_block'),
    repeticao_dobro: hasBlock(serializedBlocks, 'repetition_double_block'),
    dano_moral: hasBlock(serializedBlocks, 'moral_damages_block'),
    reajuste_etario: hasBlock(serializedBlocks, 'merits_age_readjustment_block'),
    mostrar_bruna: uf.trim().toUpperCase() === 'MG',
  };

  // 6. Mapa semântico de blocos por chave
  const blocos: Record<string, string> = {};
  for (const b of serializedBlocks) {
    blocos[b.key] = b.content;
  }

  // 7. Coleção de pedidos formatada para o template Carbone
  const pedidos = serializedRequests.map((req) => ({
    request_key: req.key,
    key: req.key,
    label: req.label,
    order: req.order,
    text: req.text,
    content: req.text,
    children: [] as any[],
  }));

  // 8. Fechamento estruturado (Template CAW v2)
  const oabInfo = getOabJoseAntonioMartins(uf);
  const sucumbenciaText = getSucumbenciaText(formData.court_type);
  const localData = `${getCidadePorUf(uf)}, ${variables.DATA_EXTENSO || formatDataExtenso()}.`;
  const closingContent = getBlockContent(serializedBlocks, 'closing_block');

  const fechamento = {
    local_data: localData,
    oab_sob_numero: oabInfo.oab_sob_numero,
    oab_assinatura: oabInfo.oab_assinatura,
    sucumbencia: sucumbenciaText,
    // Retrocompatibilidade Fase 5.1
    cidade_data: variables.CIDADE_ESTADO_DATA || localData,
    local: district || getCidadePorUf(uf),
    data: variables.DATA_EXTENSO || formatDataExtenso(),
    texto_completo: closingContent,
    content: closingContent,
  };

  const payload: CawDocxWorkflowPayload = {
    // Identificadores de infraestrutura e tenant
    organization_id: organization_id.trim(),
    generation_job_id: generation_job_id.trim(),
    filename: finalFilename,

    // Identificação processual top-level (retrocompatibilidade)
    process_number: processNumber,
    document_type: String(formData.document_piece || 'Contestação'),
    client,
    represented_party: client,
    opposing_party: opposingParty,

    // Dados de jurisdição
    court,
    district,
    uf,
    architecture_version: assembly.architecture.version || '1.0.0',
    created_at: nowIso,

    // Contrato semântico Carbone (Fase 5.1)
    processo,
    enderecamento,
    partes,
    custom_texts: customTexts as any,
    flags: flags as any,
    blocos,
    pedidos,
    fechamento,

    // Coleções para o Carbone iterar em loops de template (retrocompatibilidade)
    blocks: serializedBlocks,
    requests: serializedRequests,
    requests_text: requestsText,

    // Mapa de variáveis resolvidas
    variables,

    // Conteúdo estruturado para compatibilidade retroativa
    structured_content: {
      addressing: variables.DISTRICT || district,
      qualification: client,
      preliminaries: preliminariesTitles,
      facts_summary: [
        String(variables.CLAIM_SUMMARY || formData.claim_summary || ''),
      ].filter(Boolean),
      merits: meritsTitles,
      requests: serializedRequests.map((r) => r.label),
      closing: variables.CIDADE_ESTADO_DATA || '',
    },

    // Metadados analíticos
    metadata: {
      court,
      represented_party: client,
      opposing_party: opposingParty,
      subjects: ['Reajuste PME'],
      word_count: totalWords,
      pages_estimated: estimatedPages,
      generated_at: nowIso,
    },

    // Espalhamento de variáveis para acesso direto do template Carbone: {d.VAR_NAME}
    ...variables,
  };

  return payload;
}
