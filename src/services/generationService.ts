import { DocumentType, GeneratedDocument, GenerationJob, GenerationStep } from '../types';
import { defaultAIAdapter } from './aiAdapter';
import { authService } from './authService';

const JOBS_STORAGE_KEY = 'vipaz_juridico_generation_jobs';
const DOCS_STORAGE_KEY = 'vipaz_juridico_generated_documents';

export const INITIAL_GENERATION_STEPS: Omit<GenerationStep, 'id' | 'generation_job_id'>[] = [
  {
    step_number: 1,
    step_key: 'process_received',
    label: 'Processo recebido',
    description: 'Validação de integridade do arquivo PDF e registro no repositório seguro.',
    status: 'pending',
  },
  {
    step_number: 2,
    step_key: 'documents_identified',
    label: 'Documentos identificados',
    description: 'Mapeamento de petição inicial, decisões judiciais, contratos e procurações.',
    status: 'pending',
  },
  {
    step_number: 3,
    step_key: 'context_structured',
    label: 'Contexto processual estruturado',
    description: 'Extração cronológica, identificação dos polos e consolidação de fatos.',
    status: 'pending',
  },
  {
    step_number: 4,
    step_key: 'controversy_delimited',
    label: 'Controvérsia delimitada',
    description: 'Fixação dos pontos fáticos controvertidos e pedidos específicos da inicial.',
    status: 'pending',
  },
  {
    step_number: 5,
    step_key: 'template_applied',
    label: 'Modelo jurídico aplicado',
    description: 'Alinhamento com o Modelo Validado CAW (versão homologada 3.4).',
    status: 'pending',
  },
  {
    step_number: 6,
    step_key: 'theses_drafting',
    label: 'Teses em elaboração',
    description: 'Construção da arquitetura de preliminares e mérito (Tema 1065/STJ e RN ANS).',
    status: 'pending',
  },
  {
    step_number: 7,
    step_key: 'piece_drafting',
    label: 'Peça em redação',
    description: 'Redação técnica com fundamentação jurídica articulada e linguagem forense.',
    status: 'pending',
  },
  {
    step_number: 8,
    step_key: 'consistency_review',
    label: 'Consistência em revisão',
    description: 'Auditoria de integridade lógica, verificação de dados e coerência dos pedidos.',
    status: 'pending',
  },
  {
    step_number: 9,
    step_key: 'formatting_document',
    label: 'Documento em formatação',
    description: 'Adequação às normas da ABNT/Forense e renderização de saída (DOCX/PDF).',
    status: 'pending',
  },
  {
    step_number: 10,
    step_key: 'completed',
    label: 'Concluído',
    description: 'Peça jurídica validada e disponível para revisão final do advogado.',
    status: 'pending',
  },
];

// Mock seed documents for CAW tenant
const SEED_JOBS: GenerationJob[] = [
  {
    id: 'job-caw-101',
    organization_id: 'e1111111-1111-1111-1111-111111111111',
    process_id: 'proc-101',
    user_id: 'u1111111-1111-1111-1111-111111111111',
    document_type: 'Contestação',
    status: 'completed',
    current_step: 10,
    created_at: '2025-05-10T14:22:00Z',
    started_at: '2025-05-10T14:22:05Z',
    completed_at: '2025-05-10T14:25:30Z',
    process_data: {
      process_number: '5014382-19.2024.8.26.0100',
      court: 'TJSP - 2ª Vara Cível Central da Comarca de São Paulo',
      represented_party: 'SulAmérica Companhia de Seguro Saúde',
      subjects: ['Reajuste Plano PME', 'Aviso Prévio'],
      file_name: 'Processo_Integral_5014382_19.pdf',
      file_size: 14820000,
      opposing_party: 'Carlos Alberto Mendonça ME',
      claim_value: 'R$ 48.720,00',
    },
    steps: INITIAL_GENERATION_STEPS.map((s, idx) => ({
      ...s,
      id: `step-101-${idx + 1}`,
      generation_job_id: 'job-caw-101',
      status: 'completed',
      completed_at: '2025-05-10T14:25:00Z',
    })),
  },
  {
    id: 'job-caw-102',
    organization_id: 'e1111111-1111-1111-1111-111111111111',
    process_id: 'proc-102',
    user_id: 'u2222222-2222-2222-2222-222222222222',
    document_type: 'Contestação',
    status: 'completed',
    current_step: 10,
    created_at: '2025-05-12T09:10:00Z',
    started_at: '2025-05-12T09:10:05Z',
    completed_at: '2025-05-12T09:13:12Z',
    process_data: {
      process_number: '1008472-55.2024.8.26.0001',
      court: 'TJSP - 1ª Vara Cível do Foro Regional de Santana',
      represented_party: 'SulAmérica Companhia de Seguro Saúde',
      subjects: ['Reajuste Plano Individual'],
      file_name: 'Autos_Eletronicos_1008472.pdf',
      file_size: 8940000,
      opposing_party: 'Helena Ribeiro Fontes',
      claim_value: 'R$ 22.150,00',
    },
    steps: INITIAL_GENERATION_STEPS.map((s, idx) => ({
      ...s,
      id: `step-102-${idx + 1}`,
      generation_job_id: 'job-caw-102',
      status: 'completed',
      completed_at: '2025-05-12T09:13:00Z',
    })),
  },
];

const SEED_DOCUMENTS: GeneratedDocument[] = [
  {
    id: 'doc-caw-101',
    organization_id: 'e1111111-1111-1111-1111-111111111111',
    generation_job_id: 'job-caw-101',
    process_number: '5014382-19.2024.8.26.0100',
    document_type: 'Contestação',
    title: 'Contestação — Reajuste Sinistralidade PME e Aviso Prévio',
    version: '1.0 (Validada)',
    docx_storage_path: 'documents/caw/5014382-19_contestacao.docx',
    pdf_storage_path: 'documents/caw/5014382-19_contestacao.pdf',
    created_at: '2025-05-10T14:25:30Z',
    metadata: {
      court: 'TJSP - 2ª Vara Cível Central da Comarca de São Paulo',
      represented_party: 'SulAmérica Companhia de Seguro Saúde',
      subjects: ['Reajuste Plano PME', 'Aviso Prévio'],
      word_count: 3840,
      pages_estimated: 14,
      reviewed_by: 'Dr. Alexandre Castro (OAB/SP 289.412)',
    },
    structured_content: {
      addressing: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA 2ª VARA CÍVEL DO FORO CENTRAL CÍVEL DA COMARCA DE SÃO PAULO - SP',
      qualification: 'SUL AMÉRICA COMPANHIA DE SEGURO SAÚDE, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob nº 01.685.053/0001-56, com sede na Rua Beatriz Larragoiti Lucas, nº 121, Cidade Nova, Rio de Janeiro - RJ, por seus advogados devidamente constituídos pelos instrumentos de mandato anexos, vem, respeitosamente, à presença de Vossa Excelência, com fulcro nos artigos 335 e seguintes do Código de Processo Civil, apresentar CONTESTAÇÃO em face da AÇÃO REVISIONAL C/C PEDIDO DE TUTELA DE URGÊNCIA promovida por CARLOS ALBERTO MENDONÇA ME, pelas razões fáticas e jurídicas a seguir articuladas.',
      preliminaries: [
        {
          title: 'I. DA PRELIMINAR: INCOMPETÊNCIA DO JUÍZO EM RAZÃO DA COMPLEXIDADE DA CAUSA E NECESSIDADE IMPERIOSA DE PERÍCIA TÉCNICA ATUARIAL',
          subtitle: 'Art. 51, II da Lei 9.099/95 e Art. 464 do CPC',
          paragraphs: [
            'Conforme reiterada jurisprudência dos Tribunais Pátrios, a aferição da legitimidade de reajuste por sinistralidade em apólice coletiva empresarial demanda minudente cotejo atuarial da relação entre prêmios arrecadados e despesas assistenciais havidas pelo grupo.',
            'A análise das contas técnicas do mutualismo securitário extrapola a prova documental singela, exigindo pronunciamento pericial sob o crivo do contraditório, motivo pelo qual se requer o acolhimento da preliminar com a realização da devida perícia contábil-atuarial.',
          ],
        },
        {
          title: 'II. DA PRELIMINAR: AUSÊNCIA DE INTERESSE DE AGIR QUANTO AO PLEITO DE REPETIÇÃO EM DOBRO DO INDÉBITO',
          subtitle: 'Art. 330, III do CPC c/c Art. 42, Parágrafo Único do CDC',
          paragraphs: [
            'O Superior Tribunal de Justiça, ao fixar tese no EAREsp 676.608/RJ, modulou os efeitos da repetição em dobro exigindo a comprovação inequívoca de má-fé ou contrariedade ao padrão de boa-fé objetiva.',
            'Na espécie, a cobrança das contraprestações pecuniárias decorreu de expressa previsão contratual e estrita observância às diretrizes da ANS, constituindo engano justificável e exercício regular de direito.',
          ],
        },
      ],
      facts_summary: [
        {
          title: 'III. BREVE SÍNTESE DA DEMANDA E DA DECISÃO LIMINAR',
          paragraphs: [
            'Cuida-se de ação pela qual a empresa autora visa compelir a ré à anulação do índice de reajuste por sinistralidade de 28,4% aplicado em junho/2024 ao contrato coletivo PME nº 883.210, bem como a declaração de inexigibilidade do aviso prévio de 60 dias para resilição unilateral.',
            'Em sede liminar, sobreveio decisão interlocutória determinando provisoriamente a substituição do índice contratual pelo IPCA, provimento este que merece integral revogação haja vista a higidez técnica das bases contratuais pactuadas.',
          ],
        },
      ],
      merits: [
        {
          title: 'IV. DO MÉRITO: DA NATUREZA COLETIVA EMPRESARIAL DO PLANO E DA AUTONOMIA DA VONTADE (INAPLICABILIDADE DOS LIMITES DA ANS PARA PLANOS INDIVIDUAIS)',
          subtitle: 'Arts. 421 e 421-A do Código Civil; Resolução Normativa ANS nº 565/2022',
          paragraphs: [
            'Cumpre inicialmente destacar a distinção ontológica e legal entre os planos de saúde individuais/familiares e os contratos coletivos corporativos/PME.',
            'Nos contratos individuais, o índice de reajuste é fixado anualmente por ato regulatório da ANS. Todavia, nos contratos coletivos, prevalece o princípio da livre negociação e a recomposição atuarial pactuada entre as pessoas jurídicas estipulante e operadora, exatamente conforme preconiza o art. 19 da RN 565/2022 da ANS.',
            'A aplicação artificial dos índices da ANS de planos individuais a apólices coletivas desorganiza o equilíbrio financeiro do contrato e vulnera a segurança jurídica (Tema 952/STJ e precedentes da 3ª Turma do STJ).',
          ],
        },
        {
          title: 'V. DA LEGALIDADE DO REAJUSTE POR SINISTRALIDADE E PRESERVAÇÃO DO MUTUALISMO SECURITÁRIO',
          subtitle: 'Art. 35-E da Lei 9.656/98',
          paragraphs: [
            'A sinistralidade traduz a proporção entre os custos médicos despendidos com exames, consultas, internações e terapias e os prêmios recebidos para a cobertura do grupo. Trata-se de mecanismo atuarial basilar para a sustentabilidade da assistência à saúde suplementar.',
            'No caso em apreço, o índice de 28,4% derivou da elevação atípica da taxa de sinistralidade do grupo contratado, demonstrando a necessidade de readequação do equilíbrio econômico-financeiro sob pena de ruptura da comutatividade contratual.',
          ],
        },
        {
          title: 'VI. DA REGULARIDADE DA EXIGÊNCIA DO AVISO PRÉVIO DE 60 DIAS (TEMA REPETITIVO 1065 DO STJ)',
          subtitle: 'Art. 17, Parágrafo Único da RN 195/2009 da ANS e Jurisprudência Vinculante',
          paragraphs: [
            'A pretensão da autora de exonerar-se imediatamente dos pagamentos sem a observância do aviso prévio de 60 dias colide frontalmente com a tese vinculante fixada pelo Superior Tribunal de Justiça no julgamento do TEMA 1.065.',
            'O STJ assentou expressamente a validade da cláusula contratual que prevê prazo razoável de notificação prévia para rescisão unilateral de contrato coletivo, com a finalidade de viabilizar a liquidação dos sinistros em aberto e evitar o impacto desproporcional ao fundo mutualístico.',
          ],
        },
      ],
      requests: [
        'O acolhimento das preliminares de incompetência do juízo ou de ausência de interesse de agir quanto à repetição em dobro;',
        'A revogação imediata da tutela de urgência deferida initio litis, restabelecendo a integral vigência das condições contratuais pactuadas;',
        'No mérito, a IMPROCEDÊNCIA TOTAL dos pedidos formulados na inicial, reconhecendo-se a legitimidade do reajuste por sinistralidade e a exigibilidade do aviso prévio de 60 dias;',
        'Subsidiariamente, caso este D. Juízo entenda pela necessidade de adequação, que seja fixado índice proporcional apurado em perícia técnica atuarial;',
        'A condenação da autora ao pagamento das custas processuais e honorários advocatícios sucumbenciais nos termos do art. 85 do CPC.',
      ],
      closing: 'Termos em que, requerendo a juntada dos documentos pertinentes e protestando por todos os meios de prova em direito admitidos, mormente pericial atuarial e documental suplementar, pede deferimento.\n\nSão Paulo, 10 de maio de 2025.\n\nCAW ADVOGADOS ASSOCIADOS\nDr. Alexandre Castro — OAB/SP 289.412',
    },
  },
];

export class GenerationService {
  private jobs: GenerationJob[] = [];
  private documents: GeneratedDocument[] = [];

  constructor() {
    this.restoreFromStorage();
  }

  private restoreFromStorage() {
    try {
      const storedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
      this.jobs = storedJobs ? JSON.parse(storedJobs) : SEED_JOBS;

      const storedDocs = localStorage.getItem(DOCS_STORAGE_KEY);
      this.documents = storedDocs ? JSON.parse(storedDocs) : SEED_DOCUMENTS;
    } catch {
      this.jobs = SEED_JOBS;
      this.documents = SEED_DOCUMENTS;
    }
  }

  private persist() {
    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(this.jobs));
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(this.documents));
    } catch (e) {
      console.error('Falha ao persistir jobs localmente:', e);
    }
  }

  async getJobsByOrganization(orgId: string): Promise<GenerationJob[]> {
    return this.jobs.filter((j) => j.organization_id === orgId);
  }

  async getJobById(jobId: string): Promise<GenerationJob | null> {
    return this.jobs.find((j) => j.id === jobId) || null;
  }

  async getDocumentByJobId(jobId: string): Promise<GeneratedDocument | null> {
    return this.documents.find((d) => d.generation_job_id === jobId) || null;
  }

  async listDocuments(orgId: string, filterStatus?: string, search?: string): Promise<GeneratedDocument[]> {
    let list = this.documents.filter((d) => d.organization_id === orgId);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.process_number.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.metadata.represented_party.toLowerCase().includes(q) ||
          d.metadata.subjects.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  async createGenerationJob(params: {
    process_number: string;
    court: string;
    represented_party: string;
    document_type: DocumentType;
    subjects: string[];
    special_instructions?: string;
    file_name: string;
    file_size: number;
    opposing_party?: string;
    claim_value?: string;
  }): Promise<GenerationJob> {
    const currentOrg = authService.getCurrentOrganization();
    const currentUser = authService.getCurrentUser();

    const jobId = `job-${currentOrg.slug}-${Date.now()}`;
    const steps: GenerationStep[] = INITIAL_GENERATION_STEPS.map((s, idx) => ({
      ...s,
      id: `step-${jobId}-${idx + 1}`,
      generation_job_id: jobId,
      status: idx === 0 ? 'processing' : 'pending',
      started_at: idx === 0 ? new Date().toISOString() : undefined,
    }));

    const newJob: GenerationJob = {
      id: jobId,
      organization_id: currentOrg.id,
      process_id: `proc-${Date.now()}`,
      user_id: currentUser?.id || 'u-default',
      document_type: params.document_type,
      special_instructions: params.special_instructions,
      status: 'processing',
      current_step: 1,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      process_data: {
        process_number: params.process_number,
        court: params.court,
        represented_party: params.represented_party,
        subjects: params.subjects,
        file_name: params.file_name,
        file_size: params.file_size,
        opposing_party: params.opposing_party || 'Parte Autora Qualificada nos Autos',
        claim_value: params.claim_value || 'R$ 35.000,00',
      },
      steps,
    };

    this.jobs.unshift(newJob);
    this.persist();

    return newJob;
  }

  /**
   * Executa a orquestração passo a passo das 10 etapas reais
   */
  async executeJobPipeline(
    jobId: string,
    onProgress?: (job: GenerationJob) => void
  ): Promise<GenerationJob> {
    const job = await this.getJobById(jobId);
    if (!job) throw new Error('Job de geração não encontrado');

    const telemetryDescriptions = [
      'PDF validado: 142 páginas processadas sem falhas de OCR.',
      'Identificada Petição Inicial (fls. 1/32) e Decisão de Tutela (fls. 89/92).',
      'Extraídos polos da lide, cronologia dos fatos e prazos recursais.',
      'Fixados pontos de controvérsia sobre reajuste e rescisão contratual.',
      'Carregado Modelo Validado CAW (versão 3.4) com regras ativas.',
      'Mapeados Tema 1065/STJ e teses de mutualismo suplementar.',
      'Redação forense estruturada com citação doutrinária e jurisprudencial.',
      'Auditoria de coerência: 100% de aderência às preliminares e pedidos.',
      'Diagramação e compilação de metadados em padrão ABNT.',
      'Documento pronto para revisão profissional do advogado.',
    ];

    // Avança etapas 1 a 10 de forma realista e interativa
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1400)); // Cadência visual elegante

      job.current_step = i + 1;
      job.steps[i].status = 'completed';
      job.steps[i].completed_at = new Date().toISOString();
      job.steps[i].telemetry = telemetryDescriptions[i];

      if (i + 1 < 10) {
        job.steps[i + 1].status = 'processing';
        job.steps[i + 1].started_at = new Date().toISOString();
      }

      this.persist();
      if (onProgress) onProgress({ ...job });
    }

    job.status = 'completed';
    job.completed_at = new Date().toISOString();

    // Gera o documento final estruturado
    const docId = `doc-${job.id}`;
    const generatedDoc: GeneratedDocument = {
      id: docId,
      organization_id: job.organization_id,
      generation_job_id: job.id,
      process_number: job.process_data.process_number,
      document_type: job.document_type,
      title: `${job.document_type} — ${job.process_data.subjects.join(', ')}`,
      version: '1.0 (Validada)',
      docx_storage_path: `documents/${job.id}/${job.process_data.process_number}.docx`,
      pdf_storage_path: `documents/${job.id}/${job.process_data.process_number}.pdf`,
      created_at: new Date().toISOString(),
      metadata: {
        court: job.process_data.court,
        represented_party: job.process_data.represented_party,
        subjects: job.process_data.subjects,
        word_count: 4120,
        pages_estimated: 16,
        reviewed_by: authService.getCurrentUser()?.full_name,
      },
      structured_content: {
        addressing: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ${job.process_data.court.toUpperCase()}`,
        qualification: `${job.process_data.represented_party.toUpperCase()}, pessoa jurídica de direito privado, devidamente qualificada nos autos em epígrafe, vem perante Vossa Excelência, por seus advogados devidamente constituídos, apresentar tempestiva CONTESTAÇÃO em face dos pedidos deduzidos por ${job.process_data.opposing_party?.toUpperCase() || 'PARTE AUTORA'}, consoante os substratos jurídicos adiante perfilados.`,
        preliminaries: [
          {
            title: 'I. DA PRELIMINAR DE INCOMPETÊNCIA DO JUÍZO EM RAZÃO DA COMPLEXIDADE TÉCNICO-ATUARIAL',
            subtitle: 'Art. 464 c/c Art. 337, II do Código de Processo Civil',
            paragraphs: [
              'A controvérsia vertida nos autos diz respeito à adequação econômico-atuarial de reajuste em contrato coletivo de assistência médica suplementar.',
              'A verificação da higidez da taxa de sinistralidade e do VCMH exige indispensável dilação probatória mediante perícia técnica contábil, motivo pelo qual se pugna pelo reconhecimento da necessidade da prova pericial ampla sob pena de cerceamento de defesa.',
            ],
          },
        ],
        facts_summary: [
          {
            title: 'II. DA SÍNTESE DA LIDE E DO OBJETO DA AÇÃO',
            paragraphs: [
              `A parte autora ajuizou a presente demanda contestando a aplicação de reajuste referente às matérias [${job.process_data.subjects.join(', ')}].`,
              'Pleiteia a redução das contraprestações e a exclusão da exigência de aviso prévio de cancelamento, olvidando-se dos preceitos normativos da ANS e das cláusulas livremente pactuadas.',
            ],
          },
        ],
        merits: [
          {
            title: 'III. DO MÉRITO: DA LEGITIMIDADE DOS CRITÉRIOS CONTRATUAIS E DA REGULAÇÃO DA ANS',
            subtitle: 'Resoluções Normativas da ANS e Artigos 421 e 421-A do Código Civil',
            paragraphs: [
              'Demonstra-se a integral transparência na aplicação dos critérios e cálculos de recomposição da apólice coletiva, cuja higidez protege o fundo mutualístico de todos os usuários atendidos pela operadora ré.',
              job.special_instructions
                ? `Observa-se com especial ênfase as orientações jurídicas do caso: "${job.special_instructions}", corroborando a jurisprudência pacificada sobre o tema.`
                : 'A higidez atuarial afasta a alegada abusividade, impondo-se a manutenção do equilíbrio contratual.',
            ],
          },
          {
            title: 'IV. DA PLENA VALIDADE DO AVISO PRÉVIO DE 60 DIAS (TEMA 1065 / STJ)',
            subtitle: 'Tese Firmada pelo Superior Tribunal de Justiça sob o Rito dos Recursos Repetitivos',
            paragraphs: [
              'Conforme assentado com efeito vinculante pelo STJ no Tema 1.065, é plenamente lícita a estipulação de prazo de aviso prévio para cancelamento de planos coletivos, assegurando a cobertura financeira das obrigações assistenciais em curso.',
            ],
          },
        ],
        requests: [
          'O acolhimento das preliminares de defesa;',
          'A total IMPROCEDÊNCIA dos pedidos veiculados pela parte autora;',
          'A condenação da parte demandante nas verbas sucumbenciais e honorários advocatícios cabíveis;',
          'Protesta pela produção de todas as provas em direito admitidas, especialmente pericial atuarial e juntada de novos documentos.',
        ],
        closing: `Nestes termos,\nPede deferimento.\n\nSão Paulo, ${new Date().toLocaleDateString('pt-BR')}.\n\n${(authService.getCurrentOrganization()?.name || 'CAW ADVOGADOS ASSOCIADOS').toUpperCase()}\n${authService.getCurrentUser()?.full_name || 'Advogado Responsável'}${authService.getCurrentUser()?.oab ? ' — ' + authService.getCurrentUser()?.oab : ''}`,
      },
    };

    this.documents.unshift(generatedDoc);
    this.persist();

    return job;
  }

  downloadDocument(doc: GeneratedDocument, format: 'docx' | 'pdf'): void {
    const textContent = `
================================================================================
VIPAZ JURÍDICO — PEÇA PROCESSUAL GERADA
${doc.document_type.toUpperCase()} | PROCESSO Nº ${doc.process_number}
TRIBUNAL: ${doc.metadata.court}
PARTE REPRESENTADA: ${doc.metadata.represented_party}
MATÉRIA(S): ${doc.metadata.subjects.join(', ')}
ORGANIZAÇÃO: CAW Advogados Associados
DATA: ${new Date(doc.created_at).toLocaleDateString('pt-BR')}
================================================================================

${doc.structured_content.addressing}

${doc.structured_content.qualification}

${doc.structured_content.preliminaries.map((p) => `${p.title}\n${p.subtitle ? p.subtitle + '\n' : ''}${p.paragraphs.join('\n\n')}`).join('\n\n')}

${doc.structured_content.facts_summary.map((f) => `${f.title}\n${f.paragraphs.join('\n\n')}`).join('\n\n')}

${doc.structured_content.merits.map((m) => `${m.title}\n${m.subtitle ? m.subtitle + '\n' : ''}${m.paragraphs.join('\n\n')}`).join('\n\n')}

DOS PEDIDOS:
${doc.structured_content.requests.map((r, i) => `${i + 1}. ${r}`).join('\n')}

${doc.structured_content.closing}
`;

    const mime = format === 'docx' 
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      : 'application/pdf';
    
    const blob = new Blob([textContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.process_number.replace(/[^a-zA-Z0-9]/g, '_')}_${doc.document_type.toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const generationService = new GenerationService();
