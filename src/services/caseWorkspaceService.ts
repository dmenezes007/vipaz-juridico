/**
 * VIPAZ Jurídico — Case Workspace Service
 * Centralizador da arquitetura orientada ao Caso Jurídico
 */

import { LegalCaseWorkspace, StrategyItem, CaseDocumentItem, CasePieceItem } from '../types/caseTypes';
import { HOMOLOGATED_CASE_DEFAULTS } from '../domain/legal-engine/formDefinitions';
import { OFFICIAL_HOMOLOGATED_JOB_ID } from './experimentalDocxService';
import { supabase } from '../lib/supabase';
import { generationService } from './generationService';

export const HOMOLOGATED_CASE_WORKSPACE: LegalCaseWorkspace = {
  id: 'case-pme-sulamerica-001',
  organization_id: 'org-caw',
  process_number: '0812345-67.2024.8.19.0001',
  court: '4ª Vara Cível da Comarca da Capital - TJRJ',
  court_type: 'Vara Cível',
  court_number: '4',
  district: 'Capital',
  uf: 'RJ',
  client: 'Sul América Companhia de Seguro Saúde',
  opposing_party: 'Comércio e Serviços Vanguarda Ltda. e outros',
  action_type: 'Procedimento Comum Cível — Revisão Contratual c/c Tutela de Urgência',
  claim_value: 'R$ 84.520,00',
  case_status: 'active',
  procedural_stage: 'Fase Postulatória — Prazo para Contestação',
  relevant_deadline: '15 dias úteis (Termo final em 04/10/2026)',
  last_movement: 'Decisão interlocutória de indeferimento de tutela provisória de urgência',
  injunction_status: 'denied',

  alerts: [
    {
      id: 'alt-1',
      type: 'success',
      title: 'Tutela Provisória Indeferida',
      description: 'O juízo manteve a higidez temporária dos reajustes aplicados pela operadora por ausência de probabilidade do direito autoral.',
    },
    {
      id: 'alt-2',
      type: 'warning',
      title: 'Pluralidade no Polo Passivo / Autoral',
      description: 'Ação movida conjuntamente pela pessoa jurídica estipulante e seus sócios beneficiários pessoa física.',
    },
    {
      id: 'alt-3',
      type: 'info',
      title: 'Prescrição Trienal Operante',
      description: 'Pretensão autoral de restituição abrange parcelas vencidas há mais de 3 anos (Tema 610/STJ).',
    },
  ],

  documents: [
    {
      id: 'doc-1',
      name: 'Autos_Integrais_0812345_67_2024.pdf',
      suggested_classification: 'Autos Eletrônicos Integrais',
      confirmed_classification: 'Autos Eletrônicos Integrais',
      is_confirmed: true,
      file_size: '14.8 MB',
      pages_count: 142,
      uploaded_at: '2026-09-18 10:14',
      source_origin: 'Autos Eletrônicos',
    },
    {
      id: 'doc-2',
      name: 'Peticao_Inicial_com_Anexos.pdf',
      suggested_classification: 'Petição Inicial',
      confirmed_classification: 'Petição Inicial',
      is_confirmed: true,
      file_size: '4.2 MB',
      pages_count: 38,
      uploaded_at: '2026-09-18 10:15',
      source_origin: 'Autos Eletrônicos',
    },
    {
      id: 'doc-3',
      name: 'Decisao_Indeferimento_Tutela.pdf',
      suggested_classification: 'Decisão Judicial (Tutela)',
      confirmed_classification: 'Decisão Judicial (Tutela)',
      is_confirmed: true,
      file_size: '310 KB',
      pages_count: 3,
      uploaded_at: '2026-09-18 10:16',
      source_origin: 'Autos Eletrônicos',
    },
    {
      id: 'doc-4',
      name: 'Apolice_Contrato_Coletivo_PME_14Vidas.pdf',
      suggested_classification: 'Contrato / Apólice Coletiva',
      confirmed_classification: 'Contrato / Apólice Coletiva',
      is_confirmed: true,
      file_size: '2.1 MB',
      pages_count: 26,
      uploaded_at: '2026-09-18 11:00',
      source_origin: 'Subsídios da Operadora',
    },
    {
      id: 'doc-5',
      name: 'Demonstrativo_Sinistralidade_VGC_2021_2024.pdf',
      suggested_classification: 'Estudo Atuarial / Sinistralidade',
      confirmed_classification: 'Estudo Atuarial / Sinistralidade',
      is_confirmed: true,
      file_size: '1.4 MB',
      pages_count: 12,
      uploaded_at: '2026-09-18 11:02',
      source_origin: 'Subsídios da Operadora',
    },
    {
      id: 'doc-6',
      name: 'Historico_Notificacoes_e_Boletos.pdf',
      suggested_classification: 'Comprovantes e Notificações',
      confirmed_classification: 'Comprovantes e Notificações',
      is_confirmed: true,
      file_size: '890 KB',
      pages_count: 8,
      uploaded_at: '2026-09-18 11:05',
      source_origin: 'Subsídios da Operadora',
    },
  ],

  analysis: {
    case_summary:
      'Ação revisional ajuizada por sociedade empresária de pequeno porte e seus sócios em face da operadora, visando desconstituir os reajustes anuais aplicados ao contrato coletivo PME nos anos de 2021 a 2024, além de repetição em dobro dos valores pagos e indenização por danos morais.',
    relevant_facts: [
      {
        id: 'fact-1',
        title: 'Natureza Coletiva Empresarial Legítima',
        description:
          'Contrato coletivo estipulado por pessoa jurídica (PME) para cobertura de 14 vidas (sócios e dependentes/colaboradores), regido pelas normas de pooling e regras atuariais da ANS.',
        status: 'favorable',
        evidence_source: {
          document_name: 'Apolice_Contrato_Coletivo_PME_14Vidas.pdf',
          page: 4,
          snippet: 'Cláusula 3ª: O presente plano coletivo empresarial destina-se ao grupo estipulante com 14 beneficiários inscritos.',
          context_note: 'Afastamento de equiparação a plano individual.',
        },
      },
      {
        id: 'fact-2',
        title: 'Regularidade da Notificação Prévia de Reajuste',
        description:
          'Os percentuais de reajuste foram expressamente informados à estipulante com antecedência mínima de 30 dias à data-base.',
        status: 'favorable',
        evidence_source: {
          document_name: 'Historico_Notificacoes_e_Boletos.pdf',
          page: 2,
          snippet: 'Comunicação anual expedida à estipulante detalhando índice de sinistralidade do grupamento de contratos coletivos.',
        },
      },
      {
        id: 'fact-3',
        title: 'Pagamento Regular e Ausência de Negativação',
        description:
          'A estipulante manteve a quitação dos boletos e nenhum beneficiário teve a cobertura suspensa ou o nome inscrito em cadastros desabonadores.',
        status: 'favorable',
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 12,
          snippet: 'Não houve suspensão dos serviços médicos hospitalares nem corte no atendimento dos beneficiários.',
        },
      },
    ],
    opposing_claims: [
      {
        id: 'claim-1',
        claim: 'Revisão dos reajustes anuais e fixação segundo o índice da ANS para planos individuais',
        amount: 'R$ 54.520,00',
        basis: 'Alegada abusividade dos percentuais e equiparação a plano individual (falso coletivo).',
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 24,
          snippet: 'Requer a declaração de nulidade dos reajustes anuais de 2021 a 2024 e aplicação supletiva do índice FIPE/ANS de planos individuais.',
        },
      },
      {
        id: 'claim-2',
        claim: 'Repetição de indébito em dobro',
        amount: 'R$ 68.400,00',
        basis: 'Art. 42, parágrafo único do CDC.',
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 25,
          snippet: 'Condenação da ré à devolução em dobro de todas as quantias vertidas a maior nos últimos cinco anos.',
        },
      },
      {
        id: 'claim-3',
        claim: 'Indenização por danos morais',
        amount: 'R$ 30.000,00',
        basis: 'Alegado abalo emocional e ameaça à continuidade do plano de saúde da família.',
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 26,
          snippet: 'Fixação de indenização extrapatrimonial no valor de R$ 10.000,00 para cada um dos 3 autores pessoas físicas.',
        },
      },
    ],
    opposing_arguments: [
      {
        id: 'arg-1',
        argument: 'Contrato teria caráter "falso coletivo" por abranger membros da mesma entidade familiar.',
        counter_tactic:
          'Demonstrar contratação livre por pessoa jurídica ativa, benefício tributário da empresa e inviabilidade de aplicação dos limites estritos de planos individuais.',
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 15,
          snippet: 'Argumenta que por ser empresa familiar, o contrato deveria seguir regras de planos individuais.',
        },
      },
      {
        id: 'arg-2',
        argument: 'Falta de clareza no cálculo atuarial do reajuste por sinistralidade.',
        counter_tactic:
          'Juntar estudo técnico atuarial do grupamento (RN 565 ANS) comprovando lisura metodológica.',
      },
    ],
    controversial_issues: [
      'Validade dos percentuais de reajuste técnico anual em contrato coletivo empresarial com menos de 30 vidas;',
      'Inaplicabilidade dos índices de planos individuais à modalidade coletiva conforme tese vinculante do STJ;',
      'Prazo prescricional trienal incidente sobre a pretensão de restituição de valores;',
      'Descabimento de dano moral por mera controvérsia de reajuste contratual com manutenção de atendimento.',
    ],
    possible_preliminaries: [
      {
        id: 'prel-1',
        title: 'Ilegitimidade Ativa dos Sócios Pessoa Física para Pleitear Devolução de Mensalidades',
        legal_basis: 'Art. 17 e 18 do CPC / Contrato estipulado exclusivamente pela Pessoa Jurídica',
        applicability: 'alta',
        recommended: true,
        evidence_source: {
          document_name: 'Apolice_Contrato_Coletivo_PME_14Vidas.pdf',
          page: 2,
          snippet: 'Estipulante contratual: Comércio e Serviços Vanguarda Ltda. Titular pagadora exclusiva dos boletos.',
        },
      },
      {
        id: 'prel-2',
        title: 'Impugnação à Gratuidade de Justiça (Pessoa Jurídica e Sócios)',
        legal_basis: 'Art. 99 e 100 do CPC / Súmula 481 do STJ',
        applicability: 'alta',
        recommended: true,
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 30,
          snippet: 'Pedido de gratuidade fundado em simples declaração, sem juntada de balanço contábil ou IRPF dos sócios.',
        },
      },
      {
        id: 'prel-3',
        title: 'Impugnação ao Valor da Causa',
        legal_basis: 'Art. 292, II do CPC / Valor atribuído em desacordo com a somatória dos pedidos',
        applicability: 'alta',
        recommended: true,
        evidence_source: {
          document_name: 'Peticao_Inicial_com_Anexos.pdf',
          page: 28,
          snippet: 'Valor dado à causa de R$ 84.520,00 não coincide com a soma da repetição em dobro com a indenização moral.',
        },
      },
    ],
    merits_theses: [
      {
        id: 'tese-1',
        title: 'Legalidade dos Reajustes em Planos Coletivos e Livre Negociação / Pooling ANS',
        legal_basis: 'Resolução Normativa ANS nº 565/2022 / Temas Repetitivos do STJ',
        regulatory_framework: 'ANS e Lei nº 9.656/1998',
        strength: 'muito_forte',
        evidence_source: {
          document_name: 'Demonstrativo_Sinistralidade_VGC_2021_2024.pdf',
          page: 5,
          snippet: 'Cálculo unificado da sinistralidade do grupamento de contratos com menos de 30 vidas (RN 565/ANS).',
        },
      },
      {
        id: 'tese-2',
        title: 'Prescrição Trienal das Parcelas Reclamadas (Tema 610/STJ)',
        legal_basis: 'Art. 206, § 3º, IV do CC / Tema 610 do STJ',
        regulatory_framework: 'Jurisprudência Vinculante do STJ',
        strength: 'muito_forte',
      },
      {
        id: 'tese-3',
        title: 'Inadmissibilidade de Repetição em Dobro (Inexistência de Má-Fé e Engano Justificável)',
        legal_basis: 'Art. 42, § único do CDC / EAREsp 600.663/RS do STJ',
        regulatory_framework: 'Corte Especial do STJ',
        strength: 'muito_forte',
      },
      {
        id: 'tese-4',
        title: 'Inocorrência de Dano Moral por Discussão de Cláusula Econômica',
        legal_basis: 'Súmula 75 do TJRJ / Jurisprudência consolidada do STJ',
        regulatory_framework: 'Dano Moral Inexistente',
        strength: 'forte',
      },
    ],
    human_validation_points: [
      'Confirmar se a empresa efetuou a juntada de balanço contábil ou declarações de faturamento nos últimos 30 dias;',
      'Verificar se os autores pessoas físicas possuem boletos quitados em conta corrente pessoal ou se a quitação foi integralmente da pessoa jurídica;',
      'Validar se houve termo aditivo específico na data de renovação contratual de 2023.',
    ],
    document_inconsistencies: [
      'Divergência entre o valor da causa indicado na inicial e a somatória dos pedidos de restituição e danos morais;',
      'Ausência de comprovante de hipossuficiência econômica da pessoa jurídica demandante.',
    ],
  },

  strategy_items: [
    {
      id: 'strat-1',
      key: 'standing_challenge_block',
      title: 'Ilegitimidade Ativa dos Sócios para Pleito Repetitório',
      category: 'preliminar',
      description: 'Arguição de ausência de pertinência subjetiva dos beneficiários pessoa física em relação a pagamentos efetuados pela PJ estipulante.',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-2',
      key: 'legal_aid_pf_block',
      title: 'Impugnação à Gratuidade de Justiça dos Autores PF',
      category: 'preliminar',
      description: 'Sócio de sociedade empresária contratante de plano premium com alto padrão de vida declarado.',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-3',
      key: 'legal_aid_pj_block',
      title: 'Impugnação à Gratuidade de Justiça da Pessoa Jurídica',
      category: 'preliminar',
      description: 'Aplicação da Súmula 481 do STJ ante a ausência de prova cabal de impossibilidade financeira da empresa.',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-4',
      key: 'claim_value_challenge_block',
      title: 'Impugnação ao Valor da Causa',
      category: 'preliminar',
      description: 'Adequação do valor da causa ao benefício econômico e somatório integral dos pedidos (art. 292 do CPC).',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-5',
      key: 'prescription_triennial_block',
      title: 'Prescrição Trienal das Mensalidades Pagas há Mais de 3 Anos',
      category: 'prejudicial',
      description: 'Extinção parcial com resolução de mérito das parcelas anteriores ao triênio prescricional (Tema 610/STJ).',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-6',
      key: 'merits_age_readjustment_block',
      title: 'Higidez e Licitude do Reajuste Anual por Pooling (RN 565 ANS)',
      category: 'merito',
      description: 'Defesa da legitimidade atuarial do reajuste em contrato coletivo empresarial com menos de 30 vidas.',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-7',
      key: 'repetition_double_block',
      title: 'Improcedência da Repetição em Dobro do Indébito',
      category: 'merito',
      description: 'Ausência comprovada de má-fé e cobrança amparada em cláusula contratual expressa e regulação da ANS.',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-8',
      key: 'moral_damages_block',
      title: 'Inocorrência de Dano Moral',
      category: 'merito',
      description: 'Mera controvérsia de reajuste sem recusa de atendimento médico ou inclusão em cadastros restritivos.',
      status: 'confirmed',
      suggested_by_system: true,
    },
    {
      id: 'strat-9',
      key: 'sucumbencia_integral',
      title: 'Condenação Integral da Parte Autora em Custas e Sucumbência',
      category: 'pedido_defensivo',
      description: 'Fixação de sucumbência sobre o valor atualizado da causa sem limitação de fase.',
      status: 'confirmed',
      suggested_by_system: true,
    },
  ],

  pieces: [
    {
      id: 'piece-001',
      piece_type: 'Contestação',
      version: 'v2.1',
      status: 'ready',
      last_updated: '2026-09-21 04:15',
      responsible_lawyer: 'Dr. José Antônio Martins (OAB/RJ 114.760)',
      summary: 'Peça defensiva completa com 4 preliminares, prejudicial de prescrição trienal, mérito regulatório e pedidos estruturados.',
      docx_available: true,
      generation_job_id: OFFICIAL_HOMOLOGATED_JOB_ID,
    },
  ],

  timeline: [
    {
      id: 'time-1',
      date: '2026-09-18 10:14',
      title: 'Caso Criado no VIPAZ Jurídico',
      description: 'Importação e segmentação dos autos do processo eletrônico nº 0812345-67.2024.8.19.0001.',
      type: 'creation',
      user_name: 'Sistema VIPAZ',
    },
    {
      id: 'time-2',
      date: '2026-09-18 10:16',
      title: '6 Documentos Processuais Classificados',
      description: 'Autos principais, petição inicial, decisão e subsídios atuariais foram vinculados ao caso.',
      type: 'document',
      user_name: 'Sistema VIPAZ',
    },
    {
      id: 'time-3',
      date: '2026-09-18 11:20',
      title: 'Análise Jurídica Concluída',
      description: 'Mapeamento fático, identificação de pedidos da parte autora e delimitação dos pontos controvertidos.',
      type: 'analysis',
      user_name: 'Análise Estratégica VIPAZ',
    },
    {
      id: 'time-4',
      date: '2026-09-19 14:30',
      title: 'Estratégia Processual Validada pelo Advogado',
      description: 'Confirmação de 4 preliminares, prescrição trienal e teses de mérito com foco na RN 565 da ANS.',
      type: 'strategy',
      user_name: 'Dr. José Antônio Martins',
    },
    {
      id: 'time-5',
      date: '2026-09-20 16:45',
      title: 'Contestação Estruturada Pronta para Revisão',
      description: 'Minuta homologada e contrato documental sincronizado para emissão DOCX final.',
      type: 'piece',
      user_name: 'Dr. José Antônio Martins',
    },
  ],

  formData: {
    ...HOMOLOGATED_CASE_DEFAULTS,
    process_number: '0812345-67.2024.8.19.0001',
    court_number: '4',
    court_type: 'Vara Cível',
    court_regional: '',
    district: 'Capital',
    uf: 'RJ',
    client: 'Sul América Companhia de Seguro Saúde',
    opposing_party: 'Comércio e Serviços Vanguarda Ltda. e outros',
    executive_summary: HOMOLOGATED_CASE_DEFAULTS.executive_summary,
    claim_summary: HOMOLOGATED_CASE_DEFAULTS.claim_summary,
    controversy_delimitation: HOMOLOGATED_CASE_DEFAULTS.controversy_delimitation,
    adverse_party_nature: ['pj', 'pf'],
    document_piece: 'Contestação',
    dispute_objects: {
      reajuste_anual: true,
      reajuste_anual_modalidade: 'pme',
      reajuste_etario: false,
      reajuste_etario_modalidade: 'pme',
      aviso_previo: false,
      premio_complementar: false,
      outro: false,
      outro_descricao: '',
    },
    injunction_status: 'denied',
    moral_damages_status: 'claimed',
    legal_aid_status: 'challenge',
    legal_aid_target: 'both',
    standing_challenge_status: 'challenge',
    claim_value_challenge_status: 'challenge',
    petition_aptitude_status: 'do_not_challenge',
    prescription_triennial_status: 'argue',
    prescription_decennial_status: 'do_not_argue',
    repetition_status: 'double',
  },
  generation_job_id: OFFICIAL_HOMOLOGATED_JOB_ID,
};

class CaseWorkspaceService {
  private activeCase: LegalCaseWorkspace = { ...HOMOLOGATED_CASE_WORKSPACE };

  getCaseById(caseId?: string): LegalCaseWorkspace {
    return this.activeCase;
  }

  updateStrategyItemStatus(itemId: string, status: StrategyItem['status']) {
    this.activeCase.strategy_items = this.activeCase.strategy_items.map((item) => {
      if (item.id === itemId) {
        return { ...item, status };
      }
      return item;
    });

    // Sincroniza dinamicamente as decisões estratégicas do advogado com o formData do caso
    const stratMap = Object.fromEntries(
      this.activeCase.strategy_items.map((i) => [i.key, i.status])
    );

    const standingAccepted = stratMap['standing_challenge_block'] === 'confirmed' || stratMap['standing_challenge_block'] === 'suggested';
    const aidPfAccepted = stratMap['legal_aid_pf_block'] === 'confirmed' || stratMap['legal_aid_pf_block'] === 'suggested';
    const aidPjAccepted = stratMap['legal_aid_pj_block'] === 'confirmed' || stratMap['legal_aid_pj_block'] === 'suggested';
    const claimValAccepted = stratMap['claim_value_challenge_block'] === 'confirmed' || stratMap['claim_value_challenge_block'] === 'suggested';
    const prescripTriAccepted = stratMap['prescription_triennial_block'] === 'confirmed' || stratMap['prescription_triennial_block'] === 'suggested';

    this.activeCase.formData = {
      ...this.activeCase.formData,
      standing_challenge_status: standingAccepted ? 'challenge' : 'do_not_challenge',
      legal_aid_status: (aidPfAccepted || aidPjAccepted) ? 'challenge' : 'do_not_challenge',
      legal_aid_target: (aidPfAccepted && aidPjAccepted) ? 'both' : aidPfAccepted ? 'pf' : 'pj',
      claim_value_challenge_status: claimValAccepted ? 'challenge' : 'do_not_challenge',
      prescription_triennial_status: prescripTriAccepted ? 'argue' : 'do_not_argue',
    };
  }

  updateDocumentClassification(docId: string, confirmedClassification: string) {
    this.activeCase.documents = this.activeCase.documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          confirmed_classification: confirmedClassification,
          is_confirmed: true,
        };
      }
      return doc;
    });
  }

  addDocument(doc: CaseDocumentItem) {
    this.activeCase.documents = [doc, ...this.activeCase.documents];
  }

  async listCasesForOrganization(orgId: string): Promise<LegalCaseWorkspace[]> {
    return [this.activeCase];
  }
}

export const caseWorkspaceService = new CaseWorkspaceService();
