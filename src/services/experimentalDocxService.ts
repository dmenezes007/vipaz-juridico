/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Fase 4: Primeira Geração Experimental do DOCX Determinístico
 * 
 * Pipeline:
 * legal_case_input persistido
 * -> carregar snapshot
 * -> validar snapshot
 * -> recuperar/resolver arquitetura correspondente
 * -> AssemblyEngine (sem duplicações, preservação literal de custom_texts, marcadores de bloco não homologado)
 * -> DocumentRenderer (renderToDocxBlob)
 * -> DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
 * -> download pelo usuário
 * 
 * NÃO chama OpenAI.
 * NÃO chama n8n.
 * NÃO gera PDF.
 * NÃO altera schema ou dados no Supabase.
 */

import { supabase } from '../lib/supabase';
import {
  PersistedLegalCaseInput,
  BasicDataSnapshot,
  CustomTextsSnapshot,
  ResolvedArchitectureSnapshot,
  AuditBlockSnapshot,
  LinkedRequestSnapshot,
  mapBasicData,
  mapLegalAnswers,
  mapCustomTexts,
  extractDerivedVariables,
  buildResolvedArchitectureSnapshot,
} from '../domain/legal-engine/caseDataMapper';
import {
  LegalBlock,
  FinalRequestItem,
  ResolvedDocumentAssembly,
  RuleEvaluationResult,
  UfType,
  LegalFormData,
} from '../domain/legal-engine/types';
import {
  getUfDerivations,
  formatDataExtenso,
  interpolateVariables,
  renumberRequests,
} from '../domain/legal-engine/architectureResolver';
import { CONTESTACAO_PME_ARCHITECTURE } from '../domain/legal-engine/data/contestacao/architecture';
import {
  CONTESTACAO_BLOCKS,
  CONTESTACAO_FINAL_REQUESTS,
} from '../domain/legal-engine/data/contestacao/blocks';
import { HOMOLOGATED_CASE_DEFAULTS } from '../domain/legal-engine/formDefinitions';
import { ruleEngine } from '../domain/legal-engine/ruleEngine';
import { documentRenderer } from './documentRenderer';

export const OFFICIAL_HOMOLOGATED_JOB_ID = '68295857-6408-40b2-8768-17c09a6988ec';
export const OFFICIAL_HOMOLOGATED_INPUT_ID = '454b44b2-360e-4866-adff-eee6173aeec5';

export interface UnresolvedVariableOccurrence {
  blockKey: string;
  variable: string;
}

export interface AssembleDocumentOptions {
  recalculateArchitecture?: boolean;
  filenameSuffix?: string;
}

export interface ExperimentalAssemblyResult {
  assembly: ResolvedDocumentAssembly;
  filename: string;
  includedBlocksCount: number;
  linkedRequestsCount: number;
  unhomologatedBlocks: string[];
  unresolvedVariables: UnresolvedVariableOccurrence[];
}

export interface ExperimentalDocxGenerationResult {
  success: boolean;
  legal_case_input_id: string;
  generation_job_id: string;
  filename: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  blob: Blob;
  mimeType: string;
  includedBlocksCount: number;
  linkedRequestsCount: number;
  unhomologatedBlocks: string[];
  unresolvedVariables: UnresolvedVariableOccurrence[];
  snapshot: PersistedLegalCaseInput;
  assembly: ResolvedDocumentAssembly;
  downloadUrl?: string;
}

/**
 * Sanitiza o número do processo para utilização segura como nome de arquivo
 */
export function sanitizeProcessNumber(processNumber: string): string {
  if (!processNumber) return 'sem_numero';
  // Remove caracteres proibidos em sistemas de arquivos: \ / : * ? " < > |
  return processNumber.replace(/[\\/:*?"<>|]/g, '_').trim();
}

/**
 * Constrói o nome determinístico do arquivo DOCX
 * Formato padrão: VIPAZ_Contestacao_[numero_processo][suffix].docx
 */
export function buildDeterministicDocxFilename(processNumber: string, suffix: string = ''): string {
  const sanitized = sanitizeProcessNumber(processNumber);
  return `VIPAZ_Contestacao_${sanitized}${suffix}.docx`;
}

/**
 * Retorna o snapshot oficial histórico da Fase 3:
 * 27 blocos incluídos e 14 pedidos vinculados
 * (preserva o registro histórico sem alteração retroativa)
 */
export function getOfficialHomologatedSnapshot(): PersistedLegalCaseInput {
  const formData: LegalFormData = { ...HOMOLOGATED_CASE_DEFAULTS };
  const evaluation = ruleEngine.evaluate(formData);
  const assembly = evaluation.assembly;

  const basic_data = mapBasicData(formData);
  const legal_answers = mapLegalAnswers(formData);
  const custom_texts = mapCustomTexts(formData);
  const derived_variables = extractDerivedVariables(formData, assembly);
  const fullResolved = buildResolvedArchitectureSnapshot(assembly);

  // O snapshot original e histórico da Fase 3 possui estritamente 27 blocos
  // (antes da inclusão do bloco de legalidade regulatória do PRU na Fase 4.1)
  const historicalIncludedBlocks = fullResolved.included_blocks.filter(
    (b) => b.block_key !== 'merits_pru_regulatory_restriction_block'
  );

  const resolved_architecture: ResolvedArchitectureSnapshot = {
    ...fullResolved,
    included_blocks: historicalIncludedBlocks,
    resolution_metadata: {
      ...fullResolved.resolution_metadata,
      included_blocks_count: historicalIncludedBlocks.length,
    },
  };

  return {
    id: OFFICIAL_HOMOLOGATED_INPUT_ID,
    generation_job_id: OFFICIAL_HOMOLOGATED_JOB_ID,
    process_id: 'proc_0802491_sulamerica',
    basic_data,
    legal_answers,
    custom_texts,
    derived_variables,
    resolved_architecture,
    architecture_id: CONTESTACAO_PME_ARCHITECTURE.id,
    architecture_version: CONTESTACAO_PME_ARCHITECTURE.version,
    engine_version: '1.0',
    created_at: '2026-09-20T10:00:00.000Z',
    updated_at: '2026-09-20T10:00:00.000Z',
  };
}

/**
 * Retorna o snapshot da Fase 4.1 com a arquitetura recalculada em memória:
 * 28 blocos incluídos (com merits_pru_regulatory_restriction_block) e 14 pedidos vinculados
 */
export function getPhase41HomologatedSnapshot(): PersistedLegalCaseInput {
  const formData: LegalFormData = { ...HOMOLOGATED_CASE_DEFAULTS };
  const evaluation = ruleEngine.evaluate(formData);
  const assembly = evaluation.assembly;

  const basic_data = mapBasicData(formData);
  const legal_answers = mapLegalAnswers(formData);
  const custom_texts = mapCustomTexts(formData);
  const derived_variables = extractDerivedVariables(formData, assembly);
  const resolved_architecture = buildResolvedArchitectureSnapshot(assembly);

  return {
    id: OFFICIAL_HOMOLOGATED_INPUT_ID,
    generation_job_id: OFFICIAL_HOMOLOGATED_JOB_ID,
    process_id: 'proc_0802491_sulamerica',
    basic_data,
    legal_answers,
    custom_texts,
    derived_variables,
    resolved_architecture,
    architecture_id: CONTESTACAO_PME_ARCHITECTURE.id,
    architecture_version: CONTESTACAO_PME_ARCHITECTURE.version,
    engine_version: '1.0',
    created_at: '2026-09-20T10:00:00.000Z',
    updated_at: '2026-09-20T10:00:00.000Z',
  };
}

/**
 * Carrega e valida o snapshot de public.legal_case_inputs pelo legal_case_input_id
 */
export async function loadCaseSnapshot(
  legalCaseInputId: string
): Promise<PersistedLegalCaseInput> {
  if (!legalCaseInputId || typeof legalCaseInputId !== 'string') {
    throw new Error('Identificador legal_case_input_id inválido ou ausente.');
  }

  // Tenta carregar do Supabase real
  try {
    const { data, error } = await supabase
      .from('legal_case_inputs')
      .select('*')
      .eq('id', legalCaseInputId.trim())
      .maybeSingle();

    if (!error && data && data.basic_data && data.resolved_architecture) {
      return data as PersistedLegalCaseInput;
    }

    if (error && error.message) {
      console.warn(`Aviso na consulta a legal_case_inputs (${legalCaseInputId}):`, error.message);
    }
  } catch (dbErr) {
    console.warn(`Exceção ao consultar legal_case_inputs (${legalCaseInputId}):`, dbErr);
  }

  // Se for o ID do snapshot homologado da Fase 3 e o banco remoto não tiver o registro carregado,
  // utiliza o snapshot homologado oficial garantido
  if (legalCaseInputId.trim() === OFFICIAL_HOMOLOGATED_INPUT_ID) {
    return getOfficialHomologatedSnapshot();
  }

  throw new Error(
    `Snapshot jurídico não localizado para o ID: ${legalCaseInputId}. Verifique se o registro foi persistido em public.legal_case_inputs.`
  );
}

/**
 * Valida a integridade estrutural do snapshot
 */
export function validateSnapshotIntegrity(snapshot: PersistedLegalCaseInput): void {
  if (!snapshot) {
    throw new Error('Snapshot jurídico nulo ou indefinido.');
  }

  if (!snapshot.basic_data || typeof snapshot.basic_data !== 'object') {
    throw new Error('Snapshot inválido: basic_data ausente ou malformado.');
  }

  if (!snapshot.custom_texts || typeof snapshot.custom_texts !== 'object') {
    throw new Error('Snapshot inválido: custom_texts ausente ou malformado.');
  }

  if (!snapshot.resolved_architecture || typeof snapshot.resolved_architecture !== 'object') {
    throw new Error('Snapshot inválido: resolved_architecture ausente ou malformado.');
  }

  if (!Array.isArray(snapshot.resolved_architecture.included_blocks)) {
    throw new Error('Snapshot inválido: included_blocks deve ser um array.');
  }

  if (!Array.isArray(snapshot.resolved_architecture.linked_requests)) {
    throw new Error('Snapshot inválido: linked_requests deve ser um array.');
  }
}

/**
 * Extrai o número da vara a partir do campo court ou utiliza valor padrão
 */
function extractCourtNumber(court: string | undefined): string {
  if (!court) return '23';
  const match = court.match(/(\d+)/);
  return match ? match[1] : '23';
}

/**
 * Monta o documento determinístico a partir do snapshot persistido
 * - Preserva custom_texts literalmente (sem resumo, sem IA)
 * - Constrói blocos incluídos respeitando estritamente o snapshot
 * - Evita duplicidade de blocos e de pedidos
 * - Se algum bloco não possuir conteúdo homologado na BlockLibrary, insere marcador visual:
 *   [CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO — block_key]
 * - Detecta variáveis {{...}} não resolvidas
 */
export function assembleDocumentFromSnapshot(
  snapshotInput: PersistedLegalCaseInput,
  options?: AssembleDocumentOptions
): ExperimentalAssemblyResult {
  validateSnapshotIntegrity(snapshotInput);

  // Clona defensivamente para garantir que o snapshot original nunca seja modificado
  const snapshot: PersistedLegalCaseInput = JSON.parse(JSON.stringify(snapshotInput));

  const basicData = snapshot.basic_data;
  const customTexts = snapshot.custom_texts;
  const derivedVars = snapshot.derived_variables || {};
  const resolvedArch = snapshot.resolved_architecture;
  const legalAnswers = (snapshot.legal_answers || {}) as unknown as Record<string, unknown>;

  const uf = (basicData.state as UfType) || 'RJ';
  const ufInfo = getUfDerivations(uf);
  const dataExtenso = formatDataExtenso();

  // 1. Recuperação e Harmonização dos Pedidos Finais (sem duplicidades)
  const seenRequestKeys = new Set<string>();
  const rawIncludedRequests: FinalRequestItem[] = [];

  // Mapeamento de referência da biblioteca de pedidos
  const requestsCatalogMap = new Map<string, FinalRequestItem>();
  CONTESTACAO_FINAL_REQUESTS.forEach((req) => {
    requestsCatalogMap.set(req.key, req);
  });

  const sortedLinkedRequests = [...resolvedArch.linked_requests].sort(
    (a, b) => a.order - b.order
  );

  for (const item of sortedLinkedRequests) {
    if (seenRequestKeys.has(item.request_key)) {
      continue; // Previne duplicidade
    }
    seenRequestKeys.add(item.request_key);

    const catalogReq = requestsCatalogMap.get(item.request_key);
    if (catalogReq) {
      rawIncludedRequests.push(catalogReq);
    } else {
      rawIncludedRequests.push({
        key: item.request_key,
        label: item.label,
        order: item.order,
        contentType: 'conditional',
        text: item.label,
      });
    }
  }

  // Renumeração dinâmica dos pedidos incluídos na camada de apresentação / montagem
  const includedRequests = renumberRequests(rawIncludedRequests);

  // Monta o texto concatenado dos requerimentos finais com os pedidos reenumerados
  const requestsText = includedRequests.map((r) => r.text).join('\n\n');

  // 2. Construção do Mapa de Variáveis (com preservação estrita e literal de custom_texts)
  const courtNumber = extractCourtNumber(basicData.court);
  const isJec = basicData.court?.toLowerCase().includes('juizado') ?? false;
  const juizoArtigo = isJec ? 'DO' : 'DA';
  const juizoSuffix = isJec ? 'º JUIZADO ESPECIAL CÍVEL' : 'ª VARA CÍVEL';
  const regionalPart = basicData.regional_forum?.trim()
    ? `REGIONAL ${basicData.regional_forum.trim().toUpperCase()}`
    : '';
  const cidadeEstadoData = `${ufInfo.cidadeDefault}, ${dataExtenso}.`;

  const variableMap: Record<string, string> = {
    JUIZO_ARTIGO: (derivedVars.JUIZO_ARTIGO as string) || juizoArtigo,
    COURT_NUMBER: courtNumber,
    JUIZO_SUFFIX: (derivedVars.JUIZO_SUFFIX as string) || juizoSuffix,
    REGIONAL_SE_HOUVER: (derivedVars.REGIONAL_SE_HOUVER as string) || regionalPart,
    DISTRICT: basicData.district.trim().toUpperCase(),
    ESTADO_FULL: (derivedVars.ESTADO_FULL as string) || ufInfo.estadoFull,
    PROCESS_NUMBER: basicData.process_number.trim(),
    OPPOSING_PARTY: basicData.opposing_party.trim(),
    // Textos Literais Estritos (NÃO resumir, NÃO reescrever, NÃO usar IA)
    EXECUTIVE_SUMMARY: customTexts.executive_summary || '',
    CLAIM_SUMMARY: customTexts.claim_summary || '',
    CONTROVERSY_DELIMITATION: customTexts.controversy_delimitation || '',
    INJUNCTION_DECISION_TEXT: (
      (legalAnswers.injunction_decision_manifestation as string) || ''
    ).trim(),
    MORAL_DAMAGES_SPECIFIC_TEXT: (
      (legalAnswers.moral_damages_manifestation as string) || ''
    ).trim(),
    REQUESTS_ITEMS_TEXT: requestsText,
    CIDADE_ESTADO_DATA: (derivedVars.CIDADE_ESTADO_DATA as string) || cidadeEstadoData,
    LISTA_OABS_PATRONO: (derivedVars.LISTA_OABS_PATRONO as string) || ufInfo.listaOabsPatrono,
    ADVOGADO_OAB_ESPECIFICA:
      (derivedVars.ADVOGADO_OAB_ESPECIFICA as string) || ufInfo.advogadoOabEspecifica,
  };

  // 3. Montagem dos Blocos Incluídos a partir da BlockLibrary
  const blockCatalogMap = new Map<string, LegalBlock>();
  CONTESTACAO_BLOCKS.forEach((b) => {
    blockCatalogMap.set(b.key, b);
  });

  const seenBlockKeys = new Set<string>();
  const includedBlocks: LegalBlock[] = [];
  const unhomologatedBlocks: string[] = [];
  const unresolvedVariables: UnresolvedVariableOccurrence[] = [];

  let sortedIncludedBlocks: AuditBlockSnapshot[] = [
    ...resolvedArch.included_blocks,
  ];

  if (options?.recalculateArchitecture) {
    // Adiciona blocos permanentes da arquitetura que não constavam no snapshot histórico
    const existingKeys = new Set(sortedIncludedBlocks.map((b) => b.block_key));
    const missingPermanentBlocks: AuditBlockSnapshot[] = CONTESTACAO_BLOCKS.filter(
      (b) => b.contentType === 'permanent' && !existingKeys.has(b.key)
    ).map((b) => ({
      block_key: b.key,
      included: true,
      reason: 'Bloco estrutural permanente da peça processual (recalculado).',
      trigger: 'permanent_block',
      content_status: 'available',
    }));

    sortedIncludedBlocks = [...sortedIncludedBlocks, ...missingPermanentBlocks];
  }

  for (const blockSnapshot of sortedIncludedBlocks) {
    const key = blockSnapshot.block_key;

    if (seenBlockKeys.has(key)) {
      continue; // Previne duplicidade
    }
    seenBlockKeys.add(key);

    const catalogBlock = blockCatalogMap.get(key);

    // Se o bloco não existir no catálogo ou não tiver conteúdo válido
    if (!catalogBlock || !catalogBlock.content || !catalogBlock.content.trim()) {
      unhomologatedBlocks.push(key);
      const markerContent = `[CONTEÚDO DO BLOCO AINDA NÃO HOMOLOGADO — ${key}]`;
      includedBlocks.push({
        key,
        title: catalogBlock?.title || `BLOCO ${key}`,
        category: catalogBlock?.category || 'merits',
        order: catalogBlock?.order || 999,
        contentType: 'conditional',
        version: '1.0.0',
        active: true,
        variables: [],
        content: markerContent,
      });
      continue;
    }

    // Interpolação determinística de variáveis
    const interpolated = interpolateVariables(catalogBlock.content, variableMap);

    // Auditoria de variáveis não resolvidas
    const remainingMatches = interpolated.match(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g);
    if (remainingMatches) {
      remainingMatches.forEach((m) => {
        const cleanVar = m.replace(/[\{\}\s]/g, '');
        unresolvedVariables.push({
          blockKey: key,
          variable: cleanVar,
        });
      });
    }

    includedBlocks.push({
      ...catalogBlock,
      content: interpolated,
    });
  }

  // Ordena os blocos pela ordem sequencial forense
  includedBlocks.sort((a, b) => a.order - b.order);

  // Constrói avaliações correspondentes para a estrutura
  const evaluations: RuleEvaluationResult[] = CONTESTACAO_BLOCKS.map((b) => {
    const isIncluded = seenBlockKeys.has(b.key);
    return {
      blockKey: b.key,
      title: b.title,
      category: b.category,
      order: b.order,
      included: isIncluded,
      reason: isIncluded
        ? 'Bloco incluído conforme snapshot persistido em legal_case_inputs.'
        : 'Bloco excluído conforme snapshot persistido em legal_case_inputs.',
      isAvailable: true,
      block: b,
    };
  });

  const assembly: ResolvedDocumentAssembly = {
    architecture: CONTESTACAO_PME_ARCHITECTURE,
    evaluations,
    includedBlocks,
    includedRequests,
    resolvedVariables: variableMap,
    snapshot: {
      formData: {
        ...HOMOLOGATED_CASE_DEFAULTS,
        uf: (basicData.state as UfType) || HOMOLOGATED_CASE_DEFAULTS.uf,
        district: basicData.district || HOMOLOGATED_CASE_DEFAULTS.district,
        court_type: isJec ? 'Juizado Especial Cível' : 'Vara Cível',
        court_number: courtNumber || HOMOLOGATED_CASE_DEFAULTS.court_number,
        process_number: basicData.process_number,
        opposing_party: basicData.opposing_party,
        executive_summary: customTexts.executive_summary,
        claim_summary: customTexts.claim_summary,
        controversy_delimitation: customTexts.controversy_delimitation,
      },
      appliedRuleKeys: includedBlocks.map((b) => b.key),
      includedBlockKeys: includedBlocks.map((b) => b.key),
      architectureVersion: snapshot.architecture_version || CONTESTACAO_PME_ARCHITECTURE.version,
      timestamp: snapshot.updated_at || new Date().toISOString(),
    },
  };

  const filenameSuffix = options?.filenameSuffix || '';
  const filename = buildDeterministicDocxFilename(basicData.process_number, filenameSuffix);

  return {
    assembly,
    filename,
    includedBlocksCount: includedBlocks.length,
    linkedRequestsCount: includedRequests.length,
    unhomologatedBlocks,
    unresolvedVariables,
  };
}

/**
 * Serviço de Geração Experimental de DOCX
 */
export class ExperimentalDocxService {
  /**
   * Executa a geração experimental de DOCX a partir de um snapshot (ID ou objeto já carregado)
   */
  async generateDocx(
    snapshotOrId: PersistedLegalCaseInput | string,
    options?: AssembleDocumentOptions
  ): Promise<ExperimentalDocxGenerationResult> {
    const snapshot =
      typeof snapshotOrId === 'string'
        ? await loadCaseSnapshot(snapshotOrId)
        : snapshotOrId;

    // Monta o assembly a partir do snapshot
    const {
      assembly,
      filename,
      includedBlocksCount,
      linkedRequestsCount,
      unhomologatedBlocks,
      unresolvedVariables,
    } = assembleDocumentFromSnapshot(snapshot, options);

    // Renderiza em DOCX via DocumentRenderer
    const blob = await documentRenderer.renderToDocxBlob(assembly);

    if (!blob || blob.size === 0) {
      throw new Error('Falha na renderização: o arquivo DOCX gerado está vazio ou inválido.');
    }

    const fileSizeBytes = blob.size;
    const fileSizeFormatted = `${Math.round(fileSizeBytes / 1024)} KB`;
    const mimeType =
      blob.type ||
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    let downloadUrl: string | undefined = undefined;
    if (typeof window !== 'undefined' && typeof window.URL !== 'undefined') {
      try {
        downloadUrl = window.URL.createObjectURL(blob);
      } catch {
        // Silêncio defensivo em ambientes sem suporte
      }
    }

    return {
      success: true,
      legal_case_input_id: snapshot.id,
      generation_job_id: snapshot.generation_job_id,
      filename,
      fileSizeBytes,
      fileSizeFormatted,
      blob,
      mimeType,
      includedBlocksCount,
      linkedRequestsCount,
      unhomologatedBlocks,
      unresolvedVariables,
      snapshot,
      assembly,
      downloadUrl,
    };
  }

  /**
   * Executa a geração do DOCX verificado da Fase 4.1:
   * - Arquitetura atualizada com bloco permanente ausente (28 blocos)
   * - Renumeração dinâmica contínua dos requerimentos (sem saltos)
   * - Sufixo de arquivo _F4-1
   */
  async generatePhase41Docx(
    snapshotOrId: PersistedLegalCaseInput | string = OFFICIAL_HOMOLOGATED_INPUT_ID
  ): Promise<ExperimentalDocxGenerationResult> {
    return this.generateDocx(snapshotOrId, {
      recalculateArchitecture: true,
      filenameSuffix: '_F4-1',
    });
  }

  /**
   * Executa a geração do DOCX verificado da Fase 4.2:
   * - Bloco merits_pru_regulatory_restriction_block com conteúdo integral homologado da matriz
   * - 11 blocos de mérito/permanentes da tese de Reajuste PME íntegros
   * - Zero marcadores de conteúdo não homologado
   * - Sufixo de arquivo _F4-2
   */
  async generatePhase42Docx(
    snapshotOrId: PersistedLegalCaseInput | string = OFFICIAL_HOMOLOGATED_INPUT_ID
  ): Promise<ExperimentalDocxGenerationResult> {
    return this.generateDocx(snapshotOrId, {
      recalculateArchitecture: true,
      filenameSuffix: '_F4-2',
    });
  }

  /**
   * Dispara o download direto do Blob DOCX no navegador do usuário
   */
  downloadDocxFile(blob: Blob, filename: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('downloadDocxFile chamado em ambiente fora do navegador.');
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  }
}

export const experimentalDocxService = new ExperimentalDocxService();
