/**
 * VIPAZ Jurídico — AI Layer Abstraction (Adapter Pattern)
 * 
 * Desacoplamento arquitetural para orquestração de Inteligência Artificial.
 * Permite plugar diferentes provedores (OpenAI, Claude, Gemini, modelos locais ou serviços dedicados de orquestração jurídica)
 * sem necessidade de alterar a interface de usuário ou a camada de persistência.
 */

export interface LegalCaseContext {
  processNumber: string;
  court: string;
  author: string;
  defendant: string;
  claimValue?: string;
  subjects: string[];
  initialPetitionSummary: string;
  judicialDecisions?: string[];
  documentsFound: string[];
}

export interface LegalThesesPlan {
  preliminaries: Array<{
    code: string;
    title: string;
    basis: string;
    applicable: boolean;
  }>;
  meritTheses: Array<{
    code: string;
    title: string;
    legalBasis: string[];
    argumentativeCore: string;
  }>;
}

export interface ConsistencyAuditResult {
  passed: boolean;
  score: number; // 0 to 100
  checks: Array<{
    name: string;
    status: 'pass' | 'warning' | 'fail';
    details: string;
  }>;
}

export interface AIOrchestratorAdapter {
  name: string;
  extractProcessContext(pdfBufferOrPath: string | Blob): Promise<LegalCaseContext>;
  delimitControversy(context: LegalCaseContext): Promise<string[]>;
  selectTheses(context: LegalCaseContext, templateRules?: Record<string, unknown>): Promise<LegalThesesPlan>;
  generateDraftSection(sectionName: string, context: LegalCaseContext, theses: LegalThesesPlan): Promise<string[]>;
  auditConsistency(draftContent: Record<string, unknown>, rules?: Record<string, unknown>): Promise<ConsistencyAuditResult>;
}

/**
 * MockAdapter para o MVP e desenvolvimento seguro.
 * Não envia dados confidenciais a serviços externos, simulando o pipeline real com fidelidade jurídica para a CAW e saúde suplementar.
 */
export class MockLegalAIAdapter implements AIOrchestratorAdapter {
  name = 'VIPAZ Jurídico Core Mock Adapter (v1.0)';

  async extractProcessContext(file: string | Blob): Promise<LegalCaseContext> {
    // Simula extração contextual de alta fidelidade
    return {
      processNumber: '5014382-19.2024.8.26.0100',
      court: 'TJSP - 2ª Vara Cível do Foro Central Cível da Comarca da Capital',
      author: 'Carlos Alberto Mendonça ME',
      defendant: 'SulAmérica Companhia de Seguro Saúde',
      claimValue: 'R$ 48.720,00',
      subjects: ['Reajuste Plano PME', 'Aviso Prévio'],
      initialPetitionSummary:
        'A parte autora impugna reajuste por sinistralidade de 28,4% aplicado em apólice coletiva PME (Plano Empresarial Especial), alegando ausência de memória de cálculo atuarial individualizada e exigência abusiva de aviso prévio de 60 dias para cancelamento.',
      judicialDecisions: [
        'Decisão liminar deferindo suspensão parcial do reajuste, fixando provisoriamente índice IPCA.',
      ],
      documentsFound: [
        'Petição Inicial (fls. 01/32)',
        'Contrato Coletivo PME nº 883.210 (fls. 33/74)',
        'Comprovantes de Cobrança e Notificação (fls. 75/88)',
        'Decisão Interlocutória de Deferimento de Tutela (fls. 89/92)',
      ],
    };
  }

  async delimitControversy(context: LegalCaseContext): Promise<string[]> {
    return [
      'Validade da cláusula contratual de reajuste por sinistralidade em contratos coletivos empresariais PME (Resolução Normativa ANS nº 565/2022).',
      'Inaplicabilidade dos índices estipulados pela ANS para planos individuais aos contratos coletivos.',
      'Licitude da exigência do aviso prévio contratual de 60 dias (Tema 1065/STJ e RN ANS nº 195/2009).',
      'Revogação da tutela de urgência deferida por ausência de probabilidade do direito e perigo de dano reverso à operadora.',
    ];
  }

  async selectTheses(context: LegalCaseContext, templateRules?: Record<string, unknown>): Promise<LegalThesesPlan> {
    return {
      preliminaries: [
        {
          code: 'PRE-01',
          title: 'Da Incompetência do Juizado Especial Cível por Necessidade de Perícia Contábil-Atuarial Complexa',
          basis: 'Art. 51, II da Lei 9.099/95 e Art. 98, I da CF/88',
          applicable: false,
        },
        {
          code: 'PRE-02',
          title: 'Da Falta de Interesse de Agir quanto à Devolução em Dobro',
          basis: 'Art. 42 do CDC c/c Art. 17 do CPC',
          applicable: true,
        },
      ],
      meritTheses: [
        {
          code: 'MER-01',
          title: 'Da Natureza Coletiva Empresarial do Contrato e Autonomia Privada',
          legalBasis: ['Art. 421 e 421-A do Código Civil', 'RN 565/2022 da ANS'],
          argumentativeCore:
            'Tratando-se de apólice coletiva empresarial, há paridade negocial entre as pessoas jurídicas contratantes, inexistindo a hipossuficiência presumida típica das relações consumeristas individuais.',
        },
        {
          code: 'MER-02',
          title: 'Da Regularidade e Transparência do Reajuste por Sinistralidade (Variação de Custos Médico-Hospitalares)',
          legalBasis: ['Art. 35-E da Lei 9.656/98', 'Jurisprudência uníssona da 3ª e 4ª Turmas do STJ'],
          argumentativeCore:
            'O índice de sinistralidade reflete o desequilíbrio atuarial decorrente do aumento expressivo da utilização dos serviços médicos pelos beneficiários do grupo segurado, sob pena de inviabilizar o fundo mutualístico.',
        },
        {
          code: 'MER-03',
          title: 'Da Legalidade do Aviso Prévio de 60 Dias para Rescisão Contratual',
          legalBasis: ['Tema 1065 do STJ', 'Art. 17 da RN 195/2009 da ANS'],
          argumentativeCore:
            'O STJ pacificou no Tema Repetitivo 1.065 a validade da exigência de notificação prévia de 60 dias para rescisão unilateral de contrato coletivo, garantindo a recomposição dos custos assistenciais prestados.',
        },
      ],
    };
  }

  async generateDraftSection(sectionName: string, context: LegalCaseContext, theses: LegalThesesPlan): Promise<string[]> {
    return [
      `A parte ré, devidamente qualificada, rechaça os argumentos deduzidos na exordial quanto ao ponto [${sectionName}].`,
      'Demonstra-se cabalmente a observância estrita aos normativos da Agência Nacional de Saúde Suplementar (ANS) e à jurisprudência consolidada do Superior Tribunal de Justiça.',
    ];
  }

  async auditConsistency(draftContent: Record<string, unknown>, rules?: Record<string, unknown>): Promise<ConsistencyAuditResult> {
    return {
      passed: true,
      score: 98,
      checks: [
        { name: 'Aderência ao Modelo Homologado CAW', status: 'pass', details: 'Todos os tópicos estruturais da versão 3.4 foram preenchidos rigorosamente.' },
        { name: 'Correspondência de Partes e Processo', status: 'pass', details: 'Conferido com o espelho do TJSP e procuração nos autos.' },
        { name: 'Validação da Legislação e Temas do STJ', status: 'pass', details: 'Tema 1065/STJ e RN 565 ANS validados e citados com precisão.' },
        { name: 'Controle de Consistência dos Pedidos', status: 'pass', details: 'Pedidos subsidiários coerentes com as preliminares e mérito impugnado.' },
      ],
    };
  }
}

export const defaultAIAdapter = new MockLegalAIAdapter();
