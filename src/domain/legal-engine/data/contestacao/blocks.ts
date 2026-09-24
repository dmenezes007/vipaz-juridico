/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Biblioteca de Blocos Jurídicos Homologados: Contestação Reajuste PME (SulAmérica)
 * Fonte: Documento Homologado CAW Advogados Associados (46 páginas)
 */

import { LegalBlock, FinalRequestItem } from '../../types.js';

export const CONTESTACAO_BLOCKS: LegalBlock[] = [
  // ====================================================================
  // 1. ENDEREÇAMENTO E QUALIFICAÇÃO
  // ====================================================================
  {
    key: 'addressing_and_qualification',
    title: 'ENDEREÇAMENTO E QUALIFICAÇÃO DAS PARTES',
    category: 'addressing',
    order: 10,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    variables: [
      'JUIZO_ARTIGO',
      'COURT_NUMBER',
      'JUIZO_SUFFIX',
      'REGIONAL_SE_HOUVER',
      'DISTRICT',
      'ESTADO_FULL',
      'PROCESS_NUMBER',
      'OPPOSING_PARTY',
    ],
    content: `DOUTO JUÍZO DE DIREITO {{JUIZO_ARTIGO}} {{COURT_NUMBER}}{{JUIZO_SUFFIX}} {{REGIONAL_SE_HOUVER}} DA COMARCA DE {{DISTRICT}} {{ESTADO_FULL}}.

Processo nº {{PROCESS_NUMBER}}

SUL AMÉRICA COMPANHIA DE SEGURO SAÚDE (“SULAMÉRICA”), sociedade empresária anônima inscrita no Cadastro Nacional de Pessoas Jurídicas (CNPJ) sob o nº 01.685.053/0001-56, com sede na Capital do Estado do Rio de Janeiro, na Rua do Passeio, nº 42 – 6º pavimento, Centro, CEP 20021-290, por seus advogados que subscrevem a presente peça, vem à presença de Vossa Excelência apresentar sua CONTESTAÇÃO à pretensão deflagrada por {{OPPOSING_PARTY}}, pelas razões de fato e direito arguidas a seguir.`,
  },

  // ====================================================================
  // 2. EMENTA EXECUTIVA
  // ====================================================================
  {
    key: 'executive_summary_block',
    title: 'EMENTA EXECUTIVA',
    category: 'executive_summary',
    order: 20,
    contentType: 'variable',
    version: '1.0.0',
    active: true,
    variables: ['EXECUTIVE_SUMMARY'],
    content: `{{EXECUTIVE_SUMMARY}}`,
  },

  // ====================================================================
  // 3. RESUMO DA INICIAL
  // ====================================================================
  {
    key: 'claim_summary_block',
    title: 'DO RESUMO DA INICIAL',
    category: 'facts',
    order: 30,
    contentType: 'variable',
    version: '1.0.0',
    active: true,
    variables: ['CLAIM_SUMMARY'],
    content: `DO RESUMO DA INICIAL

{{CLAIM_SUMMARY}}`,
  },

  // ====================================================================
  // 4. EXATA DELIMITAÇÃO DA CONTROVÉRSIA
  // ====================================================================
  {
    key: 'controversy_delimitation_block',
    title: 'DA EXATA DELIMITAÇÃO DA CONTROVÉRSIA',
    category: 'controversy',
    order: 40,
    contentType: 'variable',
    version: '1.0.0',
    active: true,
    variables: ['CONTROVERSY_DELIMITATION'],
    content: `DA EXATA DELIMITAÇÃO DA CONTROVÉRSIA

{{CONTROVERSY_DELIMITATION}}`,
  },

  // ====================================================================
  // 5. TUTELA DE URGÊNCIA (CONDICIONAIS)
  // ====================================================================
  {
    key: 'injunction_denied_block',
    title: 'DO IRRETOCÁVEL INDEFERIMENTO DA TUTELA DE URGÊNCIA',
    category: 'injunction',
    order: 50,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'injunction_status',
      operator: 'equals',
      value: 'denied',
    },
    content: `DO IRRETOCÁVEL INDEFERIMENTO DA TUTELA DE URGÊNCIA

Ao apreciar o pedido liminar formulado pelos autores, este respeitável juízo agiu com irretocável prudência e irrepreensível acerto técnico ao decidir pelo indeferimento da tutela de urgência.

A fundamentação de piso converge de forma cirúrgica para a jurisprudência das Câmaras Cíveis de Direito Privado e, de modo especial, para os enunciados da jurisprudência consolidada sobre a matéria. A concessão de tutelas provisórias de urgência em ações de natureza revisional financeira, que suspendem de forma casuística os reajustes de aniversário baseados em sinistralidade e VCMH, acarreta uma lesão irreversível à base atuarial e à liquidez de todo o fundo mútuo.

Com efeito, carecem os autos dos requisitos cumulativos esculpidos no art. 300 do CPC. A probabilidade do direito resta completamente esvaziada, uma vez que a agência reguladora ANS impõe regimes jurídicos e metodologias de faturamento absolutamente distintos entre planos individuais e coletivos. Permitir o recálculo provisório unilateral com base em limites de contratos individuais burlar-se-ia a regulamentação setorial, forçando um desequilíbrio financeiro severo de caráter irreversível (art. 300, § 3º, CPC).

Desta face, a manutenção do indeferimento da liminar é medida de justiça que resguarda a boa-fé objetiva, prestigia a intervenção mínima e impede o perigo de dano reverso, cujos custos médicos gerados pelas vidas sob lide seriam socializados entre os demais integrantes do pool de risco que cumprem diligentemente suas faturas comerciais.`,
  },

  {
    key: 'injunction_granted_block',
    title: 'DA IMPERIOSA REVOGAÇÃO DA TUTELA DE URGÊNCIA CONCEDIDA',
    category: 'injunction',
    order: 51,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'injunction_status',
      operator: 'equals',
      value: 'granted',
    },
    content: `DA IMPERIOSA REVOGAÇÃO DA TUTELA DE URGÊNCIA CONCEDIDA

A respeitável decisão interlocutória proferida, com o devido e máximo respeito a este douto juízo, padece de manifesto equívoco jurídico e fático ao conceder a tutela de urgência inibitória e suspensiva em favor da autora.

A concessão do provimento sumário violou frontalmente os requisitos cumulativos impositivos estabelecidos no artigo 300 do Código de Processo Civil, carecendo a lide de verossimilhança das alegações e probabilidade do direito.

Primeiramente, a decisão em referência promoveu inadmissível hibridismo contratual ao determinar a substituição coercitiva dos reajustes de sinistralidade e custos setoriais do produto corporativo pelos limitadores exclusivos de planos individuais da ANS.

Ao assim decidir, o douto juízo violou a autonomia da vontade e criou por via judicial uma terceira modalidade de contratação (lex tertia), vedada pelo Egrégio Superior Tribunal de Justiça sob a farta jurisprudência do REsp nº 2.233.632/SP.

O contrato entabulado é genuinamente coletivo PME, cuja precificação mutual baseia-se no pool de risco e cujo reajuste linear foi legitimamente apurado com amparo nas regras cogentes dos artigos 37 e 38 da RN nº 565/2022 da ANS.

Ademais, a antecipação de tutela impôs gravoso perigo de dano reverso e irreversibilidade contra a seguradora ré (CPC, art. 300, § 3º).

Compelir a operadora a restabelecer faturamentos de anos pretéritos a valores drasticamente reduzidos asfixia as receitas reguladas e as provisões técnicas impositivas exigidas pela autarquia governamental, expondo a risco de liquidez todo o mutualismo que sustenta a cobertura assistencial dos demais segurados.

A seguradora permanece vinculada à assunção solitária da totalidade dos sinistros de alta complexidade da autora, enquanto recebe um prêmio flagrantemente deficitário e dissociado do risco real, gerando intolerável quebra de sinalagma contratual cível.

Portanto, resta imperativa a sustação da liminar ou sua imediata revogação em juízo de mérito saneador, bem como a completa extinção ou redução drástica de eventual astreinte estipulada.`,
  },

  // ====================================================================
  // 6. DAS PRELIMINARES E PREJUDICIAIS DE MÉRITO (CABEÇALHO)
  // ====================================================================
  {
    key: 'preliminaries_intro_block',
    title: 'DAS PRELIMINARES E PREJUDICIAIS DE MÉRITO (INTRODUÇÃO)',
    category: 'preliminary',
    order: 60,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      operator: 'any',
      conditions: [
        { field: 'standing_challenge_status', operator: 'equals', value: 'challenge' },
        { field: 'legal_aid_status', operator: 'equals', value: 'challenge' },
        { field: 'claim_value_challenge_status', operator: 'equals', value: 'challenge' },
        { field: 'petition_aptitude_status', operator: 'equals', value: 'challenge' },
        { field: 'prescription_triennial_status', operator: 'equals', value: 'argue' },
        { field: 'prescription_decennial_status', operator: 'equals', value: 'argue' },
      ],
    },
    content: `DAS PRELIMINARES E PREJUDICIAIS DE MÉRITO

Antes de adentrar ao cerne do mérito da controvérsia e debater a legalidade dos reajustes previstos contratualmente, faz-se imperiosa a arguição de matérias preliminares e prejudiciais de mérito, cujo acolhimento imediato é medida de rigor técnico para o regular saneamento e estabilização da relação processual, com fulcro nos artigos 337 e 354 do Código de Processo Civil.`,
  },

  // 6.1 ILEGITIMIDADE ATIVA
  {
    key: 'standing_challenge_block',
    title: 'DA MANIFESTA ILEGITIMIDADE ATIVA AD CAUSAM DE BENEFICIÁRIOS INDIVIDUALMENTE CONSIDERADOS',
    category: 'preliminary',
    order: 70,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'standing_challenge_status',
      operator: 'equals',
      value: 'challenge',
    },
    associatedRequestKey: 'req_standing',
    content: `DA MANIFESTA ILEGITIMIDADE ATIVA AD CAUSAM DE BENEFICIÁRIOS INDIVIDUALMENTE CONSIDERADOS

De forma proemial e obstando o próprio exame de mérito da lide patrimonial instaurada, cumpre demonstrar a manifesta ilegitimidade da pessoa física demandante para figurar no polo ativo da presente demanda.

A legitimidade das partes consubstancia condição da ação e matéria de ordem pública, passível de reconhecimento a qualquer tempo e grau de jurisdição, exigindo a demonstração de vínculo de pertinência subjetiva inafastável entre os autores e o objeto do direito pleiteado.

No caso, a parte autora, na singela condição de beneficiária/segurada, ingressa em juízo para discutir estritamente as cláusulas financeiras de um contrato de assistência à saúde firmado sob a modalidade Coletiva Empresarial (PME), formulando, por conseguinte, pedido de repetição de indébito dos valores que reputa cobrados a maior.

Ocorre que, por expressa disposição normativa e estrutural do microssistema de saúde suplementar, a relação jurídica de direito material de natureza patrimonial e financeira no plano corporativo estabelece-se única e exclusivamente entre a operadora de saúde (demandada) e a pessoa jurídica estipulante.

Nesse cenário de contratação corporativa, evidencia-se a absoluta ausência de responsabilidade financeira primária direta entre esta seguradora e a pessoa física do beneficiário.

As faturas, a administração da apólice, o controle de custos e as cobranças dos prêmios reajustados são emitidos e exigidos direta e exclusivamente em face do Cadastro Nacional de Pessoa Jurídica (CNPJ) da estipulante, em rigorosa conformidade com o instrumento firmado e com as regras de governança instituídas pelas Resoluções Normativas nº 509/2022 e 557/2022 da ANS.

Dessa forma, a pretensão de revisão de índices de reajuste e de devolução pecuniária ostenta inegável natureza patrimonial e divisível, sendo a pessoa jurídica contratante a titular originária da apólice, a única responsável financeira e, por corolário lógico, a única parte que detém interesse e capacidade postulatória autônoma para pleitear a revisão da engenharia financeira do contrato em juízo.

Ao ingressarem com a presente lide revisional sem a presença da pessoa jurídica titular da avença, os beneficiários postulam a defesa de direito alheio em nome próprio, conduta expressamente vedada pelo artigo 18 do Código de Processo Civil.

Para eliminar qualquer margem de dúvida sobre a matéria, o Superior Tribunal de Justiça (STJ) traçou uma distinção cirúrgica e definitiva acerca da legitimidade ativa em contratos corporativos.

No paradigmático julgamento do REsp nº 2.036.758/SP, de relatoria do saudoso Ministro Paulo de Tarso Sanseverino, a Corte Cidadã cravou que, nas demandas relativas a coberturas assistenciais (negativas de tratamento), o beneficiário ostenta legitimidade; contudo, quando a pretensão versar sobre a revisão de cláusulas financeiras e repetição de indébito, a legitimidade ativa pertence de forma exclusiva à pessoa jurídica estipulante.

Se os prêmios são faturados contra a pessoa jurídica, que assumiu os ônus da pactuação e do pagamento, não há pertinência jurídica na pretensão de pessoas físicas isoladas postularem a devolução de verbas que institucionalmente não desembolsaram em face da operadora.

Sendo a estipulante a única titular do poder de representação e de gestão da apólice, cabendo-lhe auditar os custos e livremente anuir aos reajustes para a solvência do grupo, a ausência de sua integração no polo ativo fulmina a viabilidade da lide.

Diante do exposto, restando patenteada a ausência de pertinência subjetiva e a intransponível ilegitimidade ativa ad causam do beneficiário pessoa física para pleitear a anulação de cláusulas financeiras e a repetição de indébito de um contrato interempresarial do qual não são os signatários patrimoniais diretos, requer-se o imediato acolhimento desta preliminar, decretando-se a extinção do processo sem resolução do mérito, em obediência estrita ao que preconiza o artigo 485, inciso VI, do Código de Processo Civil.`,
  },

  // 6.2 GRATUIDADE DE JUSTIÇA - PESSOA FÍSICA
  {
    key: 'legal_aid_pf_block',
    title: 'DA IMPUGNAÇÃO AO BENEFÍCIO DA GRATUIDADE DE JUSTIÇA (PESSOA FÍSICA)',
    category: 'preliminary',
    order: 80,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      operator: 'all',
      conditions: [
        { field: 'legal_aid_status', operator: 'equals', value: 'challenge' },
        { field: 'is_pf_legal_aid_targeted', operator: 'equals', value: true },
      ],
    },
    associatedRequestKey: 'req_legal_aid',
    content: `DA IMPUGNAÇÃO AO BENEFÍCIO DA GRATUIDADE DE JUSTIÇA

Embora este respeitável juízo tenha deferido preteritamente os benefícios da assistência judiciária gratuita à parte autora, fundamentando-se na comprovação de renda e em sua condição de provedora do lar, a referida benesse comporta e exige imediata impugnação por esta operadora, impondo-se a sua revogação.

Inicialmente, cumpre resgatar a premissa constitucional de que o acesso gratuito à jurisdição não constitui um vetor absoluto ou despido de contrapartidas. O artigo 5º, inciso LXXIV, da Constituição Federal é categórico ao balizar que o Estado prestará assistência jurídica integral e gratuita apenas àqueles que comprovarem insuficiência de recursos. A redação do texto constitucional é cogente e restritiva: exige-se a prova material da necessidade, e não a mera alegação declaratória.

Diante do evidente déficit normativo do Código de Processo Civil quanto à fixação de balizas numéricas, impõe-se a integração sistemática do ordenamento por meio do diálogo das fontes. Nesse sentido, a legislação trabalhista (artigo 790, §§ 3º e 4º, da CLT) afastou a presunção absoluta de pobreza, limitando o benefício automático àqueles que percebem até 40% do limite máximo dos benefícios do RGPS.

Mais do que isso, essa exata linha de calibração macroeconômica foi chancelada pelo Supremo Tribunal Federal no julgamento da ADI nº 80. Na referida ação de controle de constitucionalidade, o Ministro Gilmar Mendes fixou a legitimidade da adoção de critérios objetivos para a aferição da hipossuficiência, estabelecendo que a presunção relativa de insuficiência de recursos deve se limitar ao patamar de renda mensal igual ou inferior a R$ 5.000,00 (cinco mil reais).

Como a própria decisão liminar reconheceu, a renda da parte demandante suplanta essa cifra de R$ 5.000,00. Portanto, em estrito diálogo com o precedente do STF na ADI 80, autores com rendimentos superiores ao teto estabelecido não gozam de presunção, incumbindo-lhes o ônus dinâmico de provar cabalmente a impossibilidade de custeio do processo, mediante apresentação de imposto de renda, faturas de cartão de crédito e extratos bancários pormenorizados.

É imperioso destacar que o Superior Tribunal de Justiça (STJ) recentemente afetou a matéria sob a sistemática dos recursos repetitivos (Tema 1.178), chancelando a urgência na discussão sobre a legitimidade da adoção de critérios objetivos (parâmetros numéricos) para a aferição da hipossuficiência formulada por pessoa natural.

Ademais, o custeio de um plano de saúde privado suplementar consubstancia despesa absolutamente incompatível com a alegada miserabilidade jurídica, elidindo a presunção de hipossuficiência financeira. Não pode ser considerada "pessoa pobre e necessitada" uma parte que possui renda que a mantém significativamente acima da linha de pobreza estipulada pelas cortes superiores.

Diante do exposto, requer seja acolhida a presente impugnação (artigo 337, inciso XIII, do CPC) para revogar a gratuidade de justiça preteritamente concedida à parte demandante, determinando-se o imediato recolhimento das custas iniciais no prazo de lei, sob pena de indeferimento da inicial, cancelamento da distribuição e extinção do feito sem resolução de mérito, nos termos do artigo 290 do Código de Processo Civil.`,
  },

  // 6.3 GRATUIDADE DE JUSTIÇA - PESSOA JURÍDICA
  {
    key: 'legal_aid_pj_block',
    title: 'DA IMPUGNAÇÃO AO BENEFÍCIO DA GRATUIDADE DE JUSTIÇA POR INCOMPATIBILIDADE FINANCEIRA DA EMPRESA ESTIPULANTE E EXIGÊNCIA CONSTITUCIONAL DE COMPROVAÇÃO EFETIVA',
    category: 'preliminary',
    order: 85,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      operator: 'all',
      conditions: [
        { field: 'legal_aid_status', operator: 'equals', value: 'challenge' },
        { field: 'is_pj_legal_aid_targeted', operator: 'equals', value: true },
      ],
    },
    associatedRequestKey: 'req_legal_aid',
    content: `DA IMPUGNAÇÃO AO BENEFÍCIO DA GRATUIDADE DE JUSTIÇA POR INCOMPATIBILIDADE FINANCEIRA DA EMPRESA ESTIPULANTE E EXIGÊNCIA CONSTITUCIONAL DE COMPROVAÇÃO EFETIVA

A decisão proferida por este respeitável juízo deferiu os benefícios da assistência judiciária gratuita à empresa autora, com a ressalva acerca das penalidades cabíveis em caso de falsidade da declaração de hipossuficiência.

Contudo, tal concessão precária comporta e exige imediata revogação, visto que a benesse foi outorgada em manifesta dissonância com os rigorosos parâmetros probatórios exigidos para o deferimento a pessoas jurídicas.

Ao contrário do que ocorre com as pessoas naturais, cujo estado de pobreza processual goza de presunção legal relativa por força do artigo 99, § 3º, do Código de Processo Civil, a concessão da gratuidade a entes corporativos condiciona-se à efetiva e cabal comprovação de sua hipossuficiência econômica.

Essa exigência de prova material para as empresas é matéria superada e pacificada no âmbito do Superior Tribunal de Justiça, que assentou diretriz vinculante sobre o tema mediante a edição da Súmula nº 481, a qual dispõe:

"Faz jus ao benefício da justiça gratuita a pessoa jurídica com ou sem fins lucrativos que demonstrar sua impossibilidade de arcar com os encargos processuais."

No caso em tela, a empresa contratante limitou-se a deduzir pedido genérico em sua petição inicial, furtando-se ao dever incontornável de instruir a exordial com a documentação contábil ou financeira indispensável para evidenciar a miserabilidade alegada.

Para se desincumbir satisfatoriamente do ônus probatório que lhe cabia (artigo 99, § 2º, do CPC), incumbia à pessoa jurídica trazer aos autos balanços patrimoniais atualizados, Demonstrações de Resultado de Exercício (DRE) ou declarações de Imposto de Renda que atestassem de forma robusta e cristalina a insuficiência de liquidez e o comprometimento severo de seu capital.

A total orfandade probatória quanto à real saúde financeira da empresa afasta, em definitivo, qualquer possibilidade de manutenção do benefício deferido liminarmente. A simples menção à hipossuficiência em abstrato não substitui a comprovação documental do estado de penúria, especialmente quando se trata de empresa que, até data recente, suportava os prêmios mensais de um contrato de saúde suplementar na modalidade coletiva empresarial.

Inexistindo provas contundentes de vulnerabilidade econômica, a isenção de custas processuais torna-se indevida, deturpando a finalidade do instituto e onerando indevidamente a máquina judiciária.

Diante de todo o exposto, impugna-se formalmente a concessão da gratuidade de justiça à pessoa jurídica demandante, com fulcro no artigo 337, inciso XIII, do Código de Processo Civil. Requer-se, então, o acolhimento da presente impugnação para revogar a benesse outrora deferida, com a imediata intimação da parte autora para que promova o recolhimento integral das custas iniciais e da taxa judiciária no prazo legal, sob pena de cancelamento da distribuição (artigo 290 do CPC) e consequente extinção do feito sem resolução de mérito.`,
  },

  // 6.4 VALOR DA CAUSA
  {
    key: 'claim_value_challenge_block',
    title: 'DA IMPUGNAÇÃO AO VALOR DA CAUSA EM OBRIGAÇÕES DE TRATO SUCESSIVO',
    category: 'preliminary',
    order: 90,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'claim_value_challenge_status',
      operator: 'equals',
      value: 'challenge',
    },
    associatedRequestKey: 'req_claim_value',
    content: `DA IMPUGNAÇÃO AO VALOR DA CAUSA EM OBRIGAÇÕES DE TRATO SUCESSIVO

A parte autora atribuiu à presente demanda valor inadequado ao proveito econômico pleiteado, divorciando-se por completo da realidade e da complexidade econômica da lide.

É imperioso destacar que a fixação do valor da causa não constitui mera formalidade fiscal ou burocrática, mas sim vetor essencial que estabiliza o rito processual, define os parâmetros de eventual sucumbência e baliza o correto recolhimento das taxas judiciárias.

A lide instaurada versa precipuamente sobre a pretensão de declaração de nulidade de cláusulas financeiras e o recálculo de reajustes aplicados a uma relação jurídica de trato sucessivo, cujas prestações renovam-se e protraem-se continuadamente no tempo.

Tratando-se de pretensão revisional cumulada com repetição de indébito na forma simples ou em dobro em contratos de longa duração, o diploma processual civil impõe uma métrica matemática cogente e inflexível para a quantificação da lide.

Por força normativa, o valor da causa deve corresponder rigorosamente à soma da diferença das parcelas vencidas (isto é, o indébito retroativo efetivamente pleiteado, já considerada a prescrição) acrescida de 12 (doze) parcelas vincendas, calculadas exclusivamente sobre a exata diferença mensal entre o prêmio contratual cobrado pela operadora e o valor decorrente do índice pretendido pela parte autora, em irrestrita observância ao que preceitua o artigo 292, §§ 1º e 2º, do Código de Processo Civil.

A estipulação de um valor artificialmente subestimado consubstancia expediente abusivo e anômalo, desenhado deliberadamente para burlar o recolhimento regular da taxa judiciária inicial e para esvaziar o princípio da responsabilidade patrimonial atrelado aos riscos da sucumbência.

Cumpre ressaltar que a exatidão do valor da causa traduz autêntica matéria de ordem pública, devendo o magistrado corrigi-lo de ofício sempre que verificar a sua absoluta desconexão com o proveito econômico perseguido pela parte demandante, nos termos do artigo 292, § 3º, do Código de Processo Civil.

Diante do exposto e da manifesta inobservância do regramento processual aplicável às obrigações de trato sucessivo, requer o acolhimento da presente impugnação para que este respeitável juízo determine a imediata retificação de ofício do valor atribuído à causa, recalculando-o sobre o somatório real do histórico de repetição de indébito e das doze diferenças vincendas correspondentes aos reajustes impugnados, procedendo-se à consequente intimação da parte autora para complementar integralmente as custas processuais iniciais, sob pena de indeferimento da exordial, cancelamento da distribuição e extinção do feito sem resolução de mérito, ex vi do artigo 290 do Código de Processo Civil.`,
  },

  // 6.5 INÉPCIA DA PETIÇÃO INICIAL
  {
    key: 'petition_aptitude_block',
    title: 'DA INÉPCIA DA PETIÇÃO INICIAL POR AUSÊNCIA DE DISCRIMINAÇÃO TÉCNICA DE OBRIGAÇÕES',
    category: 'preliminary',
    order: 100,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'petition_aptitude_status',
      operator: 'equals',
      value: 'challenge',
    },
    associatedRequestKey: 'req_petition_aptitude',
    content: `DA INÉPCIA DA PETIÇÃO INICIAL POR AUSÊNCIA DE DISCRIMINAÇÃO TÉCNICA DE OBRIGAÇÕES

O ordenamento processual civil estabelece pressupostos rigorosos para a admissibilidade de demandas que visam à revisão de cláusulas financeiras.

O artigo 320 do Código de Processo Civil determina que a petição inicial deve ser instruída com os documentos indispensáveis à propositura da ação.

Complementando tal exigência, o artigo 330, § 2º, do mesmo diploma processual impõe que, nas ações que tenham por objeto a revisão de obrigações decorrentes de contrato, incumbe à parte autora, sob pena de inépcia, quantificar o valor incontroverso e discriminar especificamente as obrigações contratuais que pretende controverter.

Na hipótese, a parte demandante se limitou a deduzir impugnações absolutamente genéricas e abstratas contra os reajustes aplicados à apólice coletiva empresarial (PME). A exordial ancora-se em uma narrativa desprovida de qualquer liame técnico regulatório, limitando-se a comparar singelamente os reajustes técnicos aplicados no âmbito do contrato coletivo aos tetos tarifários definidos pela ANS exclusivamente para a modalidade individual.

A parte autora omitiu por completo a apresentação de uma planilha analítica de evolução do débito e o cálculo discriminado do valor financeiro que efetivamente entende devido para subsidiar o seu pedido de repetição de indébito.

A ausência destes elementos essenciais inviabiliza o pleno exercício do contraditório por esta operadora e impede este douto juízo de exercer o controle de legalidade sobre as cláusulas de indexação financeira, impossibilitando a aferição concreta da propalada abusividade. Trata-se, inegavelmente, de vício formal insanável por mera conjectura.

Diante da inequívoca deficiência técnica da exordial, requer-se a extinção do feito sem resolução do mérito, com fulcro no artigo 485, inciso I, combinado com o artigo 330, § 2º, e com o parágrafo único do artigo 321, todos do Código de Processo Civil, ante o manifesto descumprimento dos requisitos legais de admissibilidade da demanda revisional, visto que a parte autora deixou de quantificar o valor incontroverso e de discriminar adequadamente as obrigações controvertidas.`,
  },

  // 6.6 PRESCRIÇÃO TRIENAL (TEMA 610/STJ)
  {
    key: 'prescription_triennial_block',
    title: 'DA PRESCRIÇÃO TRIENAL DA PRETENSÃO DE RESTITUIÇÃO DE VALORES (TEMA 610 DO STJ)',
    category: 'preliminary',
    order: 110,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'prescription_triennial_status',
      operator: 'equals',
      value: 'argue',
    },
    associatedRequestKey: 'req_prescription_triennial',
    content: `DA PRESCRIÇÃO TRIENAL DA PRETENSÃO DE RESTITUIÇÃO DE VALORES (TEMA 610 DO STJ)

Ainda em sede preliminar e prejudicial de mérito, na remota hipótese de superação das teses estruturais e processuais outrora delineadas — o que se admite apenas em homenagem ao princípio da eventualidade e ao irrenunciável dever de cautela defensiva —, cumpre invocar e consolidar a incontornável barreira da prescrição trienal incidente sobre o pleito de repetição de indébito formulado pela parte autora.

Consoante se extrai da petição inicial, a parte autora busca a revisão dos índices de reajuste aplicados à apólice coletiva empresarial e a consequente repetição das diferenças dos valores pagos a maior ao longo dos últimos ciclos de faturamento.

Ocorre que a pretensão condenatória de restituição se encontra, em parte, inapelavelmente fulminada pela prescrição trienal no que tange aos pagamentos efetuados antes do triênio legal que antecedeu a propositura da demanda.

O ordenamento jurídico pátrio, por intermédio da regra específica estatuída no artigo 206, § 3º, inciso IV, do Código Civil, estabelece de forma impositiva que prescreve em 3 (três) anos a pretensão de ressarcimento por suposto enriquecimento sem causa.

A matéria, inclusive, encontra-se exaustivamente pacificada sob a sistemática dos precedentes obrigatórios pelo Egrégio Superior Tribunal de Justiça.

Ao apreciar a questão no julgamento do Tema Repetitivo 610 (REsp nº 1.360.969/RS), a Corte Cidadã cravou a diretriz vinculante de que o prazo prescricional aplicável à pretensão de restituição de valores em demandas revisionais de contratos de assistência à saúde restringe-se, invariavelmente, ao triênio legal.

A tese fixada pela Corte Superior tem eficácia erga omnes e efeito vinculante (art. 927, III, do CPC):

"Na vigência dos contratos de plano ou de seguro de assistência à saúde, a pretensão condenatória decorrente da declaração de nulidade de cláusula de reajuste nele prevista prescreve em 20 anos (art. 177 do CC/1916) ou em 3 anos (art. 206, § 3º, IV, do CC/2002), observada a regra de transição do art. 2.028 do CC/2002."

O exame dos registros eletrônicos oficiais de autuação deste feito atesta, de forma indene de dúvidas, a data em que a presente petição inicial foi distribuída ao Poder Judiciário.

Mediante simples operação cronológica retroativa a partir deste marco temporal imutável, constata-se matematicamente que toda e qualquer mensalidade, fatura ou diferença de prêmio vencida e adimplida em momento anterior aos três anos que precedem a data de distribuição da ação encontra-se prescrita.

É juridicamente inviável reavivar a discussão financeira de prêmios já consumidos e integralmente liquidados para o custeio da assistência médica em ciclos passados e acobertados pela estabilidade do decurso do tempo.

Diante de todo o exposto, restando cristalina e incontroversa a delimitação cronológica da pretensão ressarcitória, postula a SulAmérica o imediato reconhecimento da incidência da prescrição trienal, requerendo a extinção do feito com resolução do mérito em relação a todos os valores e parcelas retroativas pleiteadas que sejam anteriores ao triênio que antecedeu a distribuição da demanda, com supedâneo direto no artigo 487, inciso II, do Código de Processo Civil, combinado com o artigo 206, § 3º, inciso IV, do Código Civil, e em estrita subordinação ao comando normativo e vinculante exarado no Tema Repetitivo 610 do Egrégio Superior Tribunal de Justiça.`,
  },

  // 6.7 PRESCRIÇÃO DECENAL
  {
    key: 'prescription_decennial_block',
    title: 'DA PRESCRIÇÃO DECENAL DA PRETENSÃO DE REVISÃO DE CLÁUSULAS CONTRATUAIS',
    category: 'preliminary',
    order: 120,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'prescription_decennial_status',
      operator: 'equals',
      value: 'argue',
    },
    associatedRequestKey: 'req_prescription_decennial',
    content: `DA PRESCRIÇÃO DECENAL DA PRETENSÃO DE REVISÃO DE CLÁUSULAS CONTRATUAIS

A estipulante pleiteia a declaração de abusividade e o recálculo da cadeia de reajustes anuais técnicos aplicados a um contrato de trato sucessivo e de longa duração.

Conquanto a pretensão de repetição de indébito (devolução pecuniária) se submeta ao prazo trienal — conforme exaustivamente demonstrado no tópico precedente —, faz-se necessário estabelecer um limite temporal intransponível também para a pretensão revisional do contrato em si.

Cumpre traçar uma inafastável distinção dogmática frequentemente negligenciada: a pretensão de rever e recalcular a matriz financeira de uma cláusula contratual encontra barreira no prazo prescricional ordinário decenal, estatuído no artigo 205 do Código Civil.

A partir do faturamento de cada ciclo de reajuste anual por sinistralidade e VCMH (o fato gerador da suposta violação), nasce imediata e concretamente para a parte contratante a pretensão de promover a revisão daquela cobrança, deflagrando-se o cômputo prescricional. Trata-se da irrestrita aplicação do princípio da actio nata, expressamente consagrado no artigo 189 do diploma civilista.

Consequentemente, a letargia da estipulante em impugnar a metodologia atuarial de reajuste por período superior a 10 (dez) anos fulmina a própria pretensão de revisar a cláusula retroativamente àquele marco. O silêncio prolongado convalida a métrica implementada, sendo juridicamente absurda a tese de "nulidade absoluta imprescritível" para tentar desconstituir bases matemáticas que já garantiram coberturas de riscos de mais de uma década atrás.

Essa exata clivagem técnico-temporal foi recentemente reafirmada de maneira didática pelo Egrégio Tribunal de Justiça do Estado de São Paulo em caso idêntico envolvendo esta operadora:

"A pretensão revisional de cláusula do contrato de plano de saúde cumulada com pedido de repetição de indébito deve observar o prazo prescricional ordinário (artigos 205 do Código Civil de 2002). O prazo trienal refere-se à pretensão condenatória de devolução de valores, sendo este o único ponto da tese fixada no julgamento do Tema 610, do STJ. — (TJSP; ED Cível nº 1011303-58.2023.8.26.0011/50000; 9ª Câmara de Direito Privado; Rel. Des. Edson Luiz de Queiroz; j. 06/04/2026)."

Alterar o índice-base ou a metodologia formadora de prêmios de forma retroativa ilimitada causa um déficit financeiro nefasto e irreparável ao fundo mútuo de saúde suplementar, na medida em que exige o recálculo de recursos que já foram integralmente consumidos, diluídos e liquidados no custeio assistencial dos sinistros da própria época. É manifestamente inviável que a revisão processual das mensalidades retroceda e atinja períodos estabilizados anteriores ao decênio legal.

Diante do exposto, impõe-se a decretação da prescrição decenal da pretensão revisional em si (art. 205 do CC), requerendo-se que os efeitos de eventual e remota procedência do pedido limitem-se estritamente ao período não atingido por esta prescrição ordinária.

Tal medida obstará, de forma cogente, que qualquer revisão das bases contratuais e da metodologia financeira retroceda além do decênio legal contado retroativamente da distribuição da ação, assegurando-se a segurança jurídica e a estabilização atuarial da apólice.`,
  },

  // 6.8 DIÁLOGO DAS FONTES (CDC EM MATÉRIA REGULADA)
  {
    key: 'sources_dialogue_block',
    title: 'DA APLICAÇÃO COORDENADA DO CDC EM MATÉRIA REGULADA: DO DIÁLOGO DAS FONTES',
    category: 'preliminary',
    order: 130,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA APLICAÇÃO COORDENADA DO CDC EM MATÉRIA REGULADA: DO DIÁLOGO DAS FONTES

Embora o Código de Defesa do Consumidor (CDC) seja aplicável aos contratos de planos de saúde, conforme a inteligência da Súmula nº 608 do Superior Tribunal de Justiça, a sua incidência não pode ocorrer de forma isolada, desordenada ou com o escopo de destruir o arcabouço normativo setorial.

A pretensão da exordial de invocar as regras gerais consumeristas de forma cega, pretendendo desfigurar retroativamente o equilíbrio econômico do reajuste atuarialmente pactuado, carece de amparo dogmático e sistêmico.

Conforme pacificado pelo Supremo Tribunal Federal (STF), a relação entre o ordenamento consumerista e as regras técnicas editadas pelas agências reguladoras deve ser obrigatoriamente regida pela teoria do Diálogo das Fontes.

Esta teoria impõe uma aplicação simultânea, coordenada e sistemática das normas, de modo a preservar a coerência do ordenamento jurídico e assegurar a proteção da arquitetura e da comutatividade do agrupamento compulsório de contratos (pool de risco), o qual é determinado de forma cogente pela RN nº 565/2022 da Agência Nacional de Saúde Suplementar (ANS).

A desconsideração de regras contratuais e cálculos técnicos, motivada pela aplicação genérica do conceito de vulnerabilidade na comparação de índices, gera a "proteção que desprotege". Esse efeito adverso e prejudicial ao próprio consumidor é detalhado no parecer do Ministro Luís Roberto Barroso:

"Veja-se, nessa linha, que os precedentes que reconhecem a equiparação de planos coletivos de poucas vidas aos planos individuais para fins de aplicação do teto de reajuste da ANS, além de juridicamente equivocados, terminam, em última análise, por desproteger os consumidores. Isso porque provocam a disrupção do mercado, a diminuição da oferta, o aumento geral nos preços e a potencial exclusão de certas categorias de usuários. (...) O Superior Tribunal de Justiça já decidiu, com acerto, pela incidência do Código de Defesa do Consumidor sobre os contratos de planos de saúde (Súmula STJ nº 608). No entanto, a aplicação do CDC não elimina, mas convive com a regulação técnica da Agência Nacional de Saúde Suplementar. Essa dupla incidência normativa é regida pela teoria do diálogo das fontes, que estrutura a aplicação simultânea, coordenada e complementar de conjuntos normativos diversos, evitando tanto a exclusão quanto a sobreposição indevida de regimes. Como já reconheceu o STF, 'há de existir, pois, uma coerência entre os ordenamentos consumerista e setorial, sob pena de cair por terra a noção de sistematicidade do direito'."

Invocando o entendimento da Suprema Corte, não se pode admitir que as regras de proteção ao indivíduo sejam utilizadas como subterfúgio para desfigurar retroativamente a essência de um contrato coletivo PME regularmente celebrado e gerido sob as rígidas premissas do mutualismo.

A parte autora utilizou a estrutura coletiva empresarial para acessar um plano de saúde substancialmente mais vantajoso em sua origem — com ampla rede assistencial e tarifas reduzidas — e, agora, busca o Poder Judiciário para impor o teto dos reajustes individuais sobre a sua apólice, violando a segurança jurídica, a boa-fé objetiva (artigos 421 e 422 do Código Civil) e a legítima confiança que orienta os negócios de longo curso.

O Excelso STF, no julgamento do paradigma RE nº 590.415, rechaçou de forma veemente e definitiva a postura oportunista daquele que adere a um regime jurídico, aufere todos os benefícios econômicos dele decorrentes e, posteriormente, adota conduta oposta para eximir-se de suas legítimas contrapartidas financeiras.

A transparência e a lisura da operadora ré encontram-se cabalmente demonstradas pelo arcabouço probatório pré-constituído encartado aos autos, materializado pelo fornecimento das Condições Gerais perfeitamente legíveis da apólice e chancelado pelos densos relatórios contábeis elaborados por firmas de auditoria independentes de prestígio global (KPMG e Deloitte), que auditam e validam anualmente a regularidade e a lisura matemática da variação de custos do pool garantidor.

Sendo assim, requer o acolhimento da presente preliminar para fixar o entendimento de que as normas do Código de Defesa do Consumidor não podem ser aplicadas de forma abstrata e genérica para transmudar a natureza do contrato coletivo interempresarial, devendo a análise do presente litígio restringir-se estritamente à verificação do cumprimento dos parâmetros normativos da ANS e à imprescindível produção de prova técnico-atuarial para a constatação de eventual abusividade concreta.`,
  },

  // ====================================================================
  // 7. DO MÉRITO
  // ====================================================================
  {
    key: 'merits_intro_block',
    title: 'DO MÉRITO (PREMISSAS FUNDAMENTAIS)',
    category: 'merits',
    order: 140,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    content: `DO MÉRITO

No mérito, a improcedência decorre da conjugação de quatro premissas: o contrato coletivo empresarial é válido; o PRU decorre de imposição regulatória da ANS; os reajustes possuem lastro técnico e atuarial; e a revisão individualizada desestrutura o mutualismo da carteira.`,
  },

  // 7.1 HIGIDEZ TÉCNICO-REGULATÓRIA PME E ANTIGUIDADE
  {
    key: 'merits_pme_robustness_block',
    title: 'DA HIGIDEZ TÉCNICO-REGULATÓRIA DO PLANO COLETIVO DE PEQUENO PORTE (PME): A ANTIGUIDADE DA EMPRESA ESTIPULANTE COMO PROVA DA INEXISTÊNCIA DE "VÍNCULO DE FACHADA"',
    category: 'merits',
    order: 150,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA HIGIDEZ TÉCNICO-REGULATÓRIA DO PLANO COLETIVO DE PEQUENO PORTE (PME): A ANTIGUIDADE DA EMPRESA ESTIPULANTE COMO PROVA DA INEXISTÊNCIA DE "VÍNCULO DE FACHADA"

A alegação de "falso coletivo" formulada pela parte autora carece de qualquer lastro de realidade e base jurídica.

O principal vetor de identificação de fraudes na contratação de planos coletivos empresariais de pequeno porte — fartamente debatido na jurisprudência — é a criação de "empresas de fachada" ou MEIs constituídas exclusivamente para a burla do regime individual, cuja existência jurídica é efêmera ou simulada.

No caso concreto, contudo, a pessoa jurídica estipulante opera há longos anos, com regular e ininterrupta atividade econômica. A higidez temporal e a longevidade da pessoa jurídica contratante constituem prova inequívoca e irrefutável de sua substancialidade material.

Não se trata de um artifício formal ou de um "vínculo de conveniência" arquitetado casuisticamente para a contratação do plano de saúde, mas sim de uma sociedade comercial consolidada no mercado, que validamente buscou o mercado de saúde suplementar para estender a proteção assistencial ao seu quadro societário e respectivos dependentes legais.

O decurso do tempo consolida o negócio jurídico e expurga qualquer presunção de vício de consentimento ou de simulação (arts. 167 e 178 do Código Civil).

Admitir a tese de "falso coletivo" em uma apólice vinculada a uma empresa real, operante e longeva equivaleria a instituir uma insegurança jurídica sistêmica, permitindo que qualquer contrato corporativo de pequeno porte fosse unilateralmente desconfigurado pelo beneficiário sempre que o reajuste atuarial não lhe fosse conveniente.

Resta evidente, portanto, que a pretensão da parte autora viola o princípio da boa-fé objetiva (art. 422 do CC) sob a vertente do venire contra factum proprium. A parte autora usufruiu, por anos a fio, das nítidas vantagens comerciais do regime coletivo empresarial (carências mitigadas, preços de entrada substancialmente inferiores aos planos individuais e ampla rede credenciada).

Pretender, agora, desqualificar a natureza de um contrato cujos bônus aproveitou por longo período constitui manifesto abuso de direito e tentativa de enriquecimento sem causa, o que é expressamente vedado pelo ordenamento jurídico pátrio.`,
  },

  // 7.2 VALIDADE DO CONTRATO E INEXISTÊNCIA DE FALSO COLETIVO
  {
    key: 'merits_contract_validity_block',
    title: 'DA VALIDADE DO CONTRATO COLETIVO EMPRESARIAL E DA INEXISTÊNCIA DE “FALSO COLETIVO”',
    category: 'merits',
    order: 160,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA VALIDADE DO CONTRATO COLETIVO EMPRESARIAL E DA INEXISTÊNCIA DE “FALSO COLETIVO”

A pretensão da parte autora de transmudar, por via judicial, as premissas do plano coletivo empresarial (PME) para que receba tratamento próprio dos planos individuais viola a força obrigatória dos contratos e a autonomia privada que regem as relações interempresariais.

O contrato de assistência à saúde consubstancia-se em um negócio jurídico eminentemente oneroso e sinalagmático, validamente celebrado de forma correspectiva entre a operadora ré e a pessoa jurídica estipulante.

Cumpre destacar, desde já, que a relação obrigacional e financeira nos planos coletivos empresariais (PME) estabelece-se precipuamente entre a seguradora e a pessoa jurídica contratante, e não diretamente e de forma autônoma com as pessoas físicas beneficiárias.

O Colendo Superior Tribunal de Justiça já sedimentou, de longa data, que a relação entre a empresa estipulante e a seguradora ostenta caráter eminentemente comercial, não sendo aplicável automaticamente a presunção de hipossuficiência do microssistema consumerista pelo simples fato de o objeto envolver cobertura securitária.

Tratando-se de relação paritária e simétrica, a intervenção judicial deve ser mínima, prevalecendo a força obrigatória dos contratos interempresariais e a autonomia da vontade delineada nos artigos 421 e 421-A do Código Civil.

Ao subscrever a proposta e perfectibilizar o vínculo, a empresa estipulante o fez de forma estritamente livre, consciente e autônoma, optando deliberadamente pelo modelo coletivo empresarial motivada pelas nítidas vantagens inerentes a este ecossistema: mensalidades substancialmente mais módicas e condições comerciais muito mais atrativas do que as ofertadas nos planos individuais disponíveis no mercado.

Diante da validade do negócio jurídico originário e da força vinculante do pacto corporativo celebrado entre agentes capazes, requer-se a preservação das disposições contratuais que regem a avença, sem prejuízo do exame específico da boa-fé objetiva e do comportamento contraditório em tópico próprio. Firmada a natureza interempresarial da avença, passa-se ao enfrentamento da tese central da inicial, consistente na tentativa de qualificar o contrato como suposto “falso coletivo”.`,
  },

  // 7.3 IMPOSSIBILIDADE DE TRANSMUTAÇÃO CONTRATUAL E BOA-FÉ OBJETIVA
  {
    key: 'merits_transmutation_impossibility_block',
    title: 'DA IMPOSSIBILIDADE DE TRANSMUTAÇÃO CONTRATUAL E DA BOA-FÉ OBJETIVA',
    category: 'merits',
    order: 170,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA IMPOSSIBILIDADE DE TRANSMUTAÇÃO CONTRATUAL E DA BOA-FÉ OBJETIVA

A pretensão da parte autora de desqualificar a natureza jurídica do plano coletivo empresarial para impor de forma artificial o teto de reajuste dos planos individuais — sob a genérica alegação de "falso coletivo" em virtude do reduzido número de vidas ou da composição familiar do grupo — configura manifesto oportunismo e total subversão das bases contratuais, econômicas e regulatórias do setor.

O ordenamento setorial, por meio das resoluções da Agência Nacional de Saúde Suplementar (ANS), autoriza expressamente a contratação de planos coletivos por empresários individuais e microempresas, inclusive para a proteção de seus respectivos grupos familiares. Logo, as características fáticas de quantidade reduzida de vidas ou o vínculo consanguíneo entre os beneficiários não constituem qualquer indício de irregularidade, tratando-se de opção de consumo perfeitamente legal e chancelada pelo órgão regulador.

Soma-se a isso o fato de que a recusa imotivada ou a exclusão preventiva de beneficiários elegíveis configuraria flagrante ilegalidade por parte da operadora. O artigo 3º da Lei nº 9.656/98, em perfeita simetria com a Súmula Normativa nº 19 da ANS, veda de forma peremptória a prática de seleção de riscos ou qualquer conduta discriminatória na contratação e manutenção de planos de saúde suplementar.

Portanto, se o contrato autorizava a inclusão de dependentes diretos e o parentesco foi formalmente demonstrado, a pronta inclusão dos beneficiários era um dever jurídico intransponível da operadora. Exigir que a ré proibisse o ingresso dessas pessoas para tentar manter a apólice estritamente "empresarial" significaria impor-lhe o descumprimento deliberado do pacto e a violação de normas cogentes de direito público, o que ensejaria a aplicação de severas penalidades administrativas e multas pecuniárias pelo órgão regulador.

A aceitação regular do núcleo familiar decorre, assim, do respeito absoluto à legalidade e ao pactuado, o que afasta de forma definitiva qualquer indício de fraude, simulação ou ardil por parte desta operadora.

A requalificação de um plano formalmente coletivo como individual por via de canais interpretativos viola, de modo frontal, o núcleo essencial da legalidade e da separação de poderes (art. 2º e art. 5º, II da CF). O legislador ordinário operou uma clara e legítima delegação de competência normativa e fiscalizatória à autarquia especial (Leis nº 9.656/98 e nº 9.961/2000), atribuindo à agência técnica a exclusiva missão de balancear a sustentabilidade atuarial do mercado de saúde suplementar. Invadir essa competência para alterar casuisticamente a natureza do pacto significa neutralizar a reserva de administração e transformar indevidamente o Judiciário em gestor atuarial do sistema, conforme brilhantemente concluiu o Ministro Luís Roberto Barroso:

"(...) Como visto, no caso dos planos coletivos com menos de 30 beneficiários, tal regulação contempla mecanismo específico para lidar com a maior vulnerabilidade do consumidor, preservar o mutualismo e evitar oscilações abruptas de sinistralidade: o agrupamento obrigatório de todos os contratos da mesma natureza da operadora. Assim, os reajustes decorrem de critérios técnicos previamente definidos em contrato, segundo parâmetros estabelecidos pela agência, vinculados à sinistralidade e à dinâmica do risco compartilhado entre o pool. A simples comparação com índices de planos individuais não é adequada, nem suficiente para caracterizar abusividade, sob pena de se desconsiderar a natureza e a função dos diferentes modelos contratuais."

A necessidade de autocontenção judicial ganha ainda mais relevo ao se analisar o impacto prático e a arquitetura financeira de cada modalidade. Nos planos individuais, o teto da autarquia dissocia parcialmente o preço da sinistralidade real, deslocando o risco atuarial para a gestão interna da operadora — o que, historicamente, motivou o desequilíbrio econômico crônico e a baixa comercialização desse produto pelas grandes companhias no mercado de varejo. Por outro lado, nos planos coletivos PME (de até 29 vidas), há um alinhamento direto entre custos e prêmios; essa dinâmica opera de forma protetiva e coletiva por meio do pool de risco (o agrupamento obrigatório de contratos), conforme determinado pelos artigos 37 e 38 da RN nº 565/2022 da ANS.

A impossibilidade de transmutação mecânica de regimes foi categoricamente pacificada pelo Superior Tribunal de Justiça no julgamento do REsp nº 2.233.632/SP (Quarta Turma, Rel. Min. Marco Buzzi, julgado em 30/09/2025, DJe de 02/10/2025), cuja ementa vinculante veda o hibridismo contratual:

"Os contratos coletivos, independentemente do número de beneficiários, têm forma de custeio diferente dos contratos individuais/familiares. Também os reajustes são diferenciados, sendo que somente os contratos individuais/familiares submetem-se aos índices aprovados pela ANS. (...) Independentemente do número de beneficiários, não é correto permitir que as partes beneficiadas com a contratação na forma coletiva, que via de regra tem valor mensal inferior, na sequência busquem a aplicação de índices de reajustes da modalidade individual previamente estabelecidos pela ANS, em prejuízo ao equilíbrio atuarial do contrato."

No mesmo sentido firma-se o REsp nº 1.553.013/SP (Rel. Min. Ricardo Villas Bôas Cueva), assentando que a precificação entre as modalidades é intrinsecamente diversa e não pode ser desfigurada, sob pena de violar a segurança jurídica e a comutatividade contratual.

Por consequência lógica e intransponível à higidez do contrato coletivo já demonstrada, pugna-se pelo imediato indeferimento de qualquer pleito de transmutação do contrato ou de substituição compulsória dos reajustes pelos índices anuais divulgados pela ANS exclusivos para a modalidade individual/familiar. É fato notório e incontroverso no mercado de saúde suplementar que a SulAmérica não comercializa planos de saúde na modalidade individual ou familiar desde o ano de 2005. Sendo assim, qualquer determinação judicial que acolhesse a tese autoral e impusesse à operadora a transmutação da relação contratual para um plano individual obrigaria a companhia ré a incorrer em flagrante infração administrativa perante a própria agência reguladora.

A impossibilidade absoluta de se impor à operadora a criação forçada de um vínculo não comercializado em seu portfólio para chancelar a esdrúxula tese do "falso coletivo" foi recentemente chancelada pelo Superior Tribunal de Justiça no Recurso Especial nº 2.180.820/MG (Relator Ministro Marco Buzzi, decisão de 19/12/2025):

"Isso porque o STJ firmou entendimento de que, embora a Resolução CONSU n. 19/1999 preveja a oferta de planos individuais em casos de cancelamento de planos coletivos, a operadora não está obrigada a disponibilizar tal modalidade na hipótese de não comercializar esse tipo de produto no mercado. Obrigá-la a criar um produto em sua carteira violaria os princípios da livre iniciativa e do equilíbrio atuarial."`,
  },

  // 7.3.1 LEGALIDADE REGULATÓRIA DO PRU E RESTRIÇÃO DO ÍNDICE INDIVIDUAL À SANÇÃO ADMINISTRATIVA EXCEPCIONAL
  {
    key: 'merits_pru_regulatory_restriction_block',
    title: 'DA LEGALIDADE REGULATÓRIA DO PRU E DA RESTRIÇÃO DO ÍNDICE INDIVIDUAL À SANÇÃO ADMINISTRATIVA EXCEPCIONAL',
    category: 'merits',
    order: 175,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    content: `DA LEGALIDADE REGULATÓRIA DO PRU E DA RESTRIÇÃO DO ÍNDICE INDIVIDUAL À SANÇÃO ADMINISTRATIVA EXCEPCIONAL

O marco regulatório setorial impõe às operadoras privadas a estrita vedação à prática de seleção de riscos no momento da entrada, conforme dita o artigo 22 da RN nº 557/2022 da ANS.

Se a microempresa ou o empresário individual preenche os requisitos formais de constituição, a operadora está legalmente impedida de recusar a contratação do plano.

Torna-se um absoluto contrassenso jurídico penalizar a SulAmérica pelo simples cumprimento de uma ordem regulatória cogente que a obrigou a aceitar o ingresso do grupo familiar no canal corporativo PME.

A chancela judicial à tese do "falso coletivo" em hipóteses tais acaba por enclausurar a operadora em um verdadeiro dilema:
1. Se cumpre a ordem normativa cogente e aceita o ingresso do pequeno grupo familiar, é posteriormente penalizada pelo Poder Judiciário, que transmuda retroativamente a natureza do pacto para reduzir o preço;
2. Se, por outro lado, recusa a contratação para se blindar contra futuros litígios, é severamente autuada pela agência reguladora por prática ilícita de seleção de risco.

Trata-se de manifesto contrassenso jurídico penalizar o contratado pelo estrito e fiel cumprimento de um dever legal.

O risco sistêmico dessa assimetria interpretativa foi mapeado de forma cirúrgica pelo parecerista Luís Roberto Barroso, ao asseverar que a tese do "falso coletivo" empurra a operadora para um beco sem saída normativo:

"Com uma agravante que coloca a operadora diante de um dilema regulatório insolúvel. Para evitar o risco de que determinado contrato seja posteriormente caracterizado pelo Judiciário como 'falso coletivo', teria de recusar a contratação de planos de saúde em situações admitidas pela regulação por exemplo, quando os sócios são familiares. Tal conduta, contudo, violaria norma expressa da ANS e poderia caracterizar a prática vedada da seleção de riscos (...)".

Nessa linha, cumpre destacar que a própria ANS apenas autoriza a equiparação do contrato coletivo ao individual em cenários de estrita irregularidade formal de elegibilidade ou, sob a égide da RN nº 565/2022, como uma medida de sanção regulatória excepcional e punitiva.

Essa penalidade compulsória sobre os contratos coletivos de até 29 vidas destina-se apenas às hipóteses em que a operadora incorre em graves infrações de transparência, tais como:
1. Deixar de divulgar o Percentual de Reajuste Único (PRU) em seu portal eletrônico de forma clara e acessível;
2. Deixar de informar à ANS o índice calculado dentro dos prazos regulamentares estipulados; ou
3. Aplicar percentual divergente daquele publicamente apurado para o pool de risco.

Essa penalidade administrativa destina-se única e exclusivamente às operadoras inadimplentes que descumprem os deveres formais de transparência.

Não se trata, portanto, de uma faculdade do consumidor, de uma opção tarifária alternativa ou de um direito subjetivo revisional, mas sim de uma reprimenda de natureza obrigatória definida pela autarquia.

Para afastar qualquer alegação de abuso, a operadora demonstra de forma clara nos autos a total regularidade do reajuste por meio de várias provas concretas:
* A regularidade do contrato coletivo empresarial: demonstrada mediante a apresentação do ato constitutivo da empresa estipulante e das condições gerais da apólice, comprovando que o regime corporativo foi pactuado com clareza;
* A quantidade de vidas e composição do grupo: delimitada pelos relatórios de faturamento que comprovam possuir a empresa menos de 30 beneficiários, justificando legalmente a sua inserção no agrupamento;
* A comprovação do vínculo dos dependentes: evidenciada pelos documentos comprobatórios de parentesco apresentados no ato da inclusão, demonstrando que a elegibilidade decorreu de previsão contratual legítima;
* O percentual único do agrupamento: evidenciado pelo histórico de reajustes da carteira PME (anexo), que mostra que o índice aplicado ao contrato da parte autora foi exatamente o mesmo estendido a todas as outras empresas do pool de riscos, cumprindo com a equidade e solidariedade que o sistema mutualista exige;
* A memória de cálculo e a metodologia utilizada: detalhada na nota técnica atuarial juntada aos autos, que discrimina perfeitamente como o índice foi apurado com base nos custos e na sinistralidade global do grupo, conferindo total transparência à base atuarial do reajuste;
* A divulgação do índice e a comunicação prévia: comprovadas pela publicação do percentual anual no site/portal eletrônico da operadora e pelo envio de notificação e aviso prévio ao contratante, respeitando rigorosamente os prazos mínimos de antecedência exigidos pela ANS.

O agrupamento foi devidamente formado, o PRU foi publicamente divulgado e reportado, e os dados de sinistralidade e custos foram plenamente auditados por pareceres independentes de prestígio internacional (KPMG e Deloitte).

A produção dessa prova atuarial de conformidade afasta o caráter abstrato das alegações regulatórias e consolida a lisura e a suficiência informativa do reajuste debatido.

Por oportuno, impõe-se destacar que o ônus de provar qualquer espécie de simulação, fraude ou pretendida “artificialidade” na instituição do vínculo empresarial recai de forma exclusiva sobre a parte autora, por força do artigo 373, I, do CPC.

Para que se desconstitua a apólice corporativa regularmente celebrada, é imperiosa a apresentação de prova robusta e concreta de que houve efetivo vício na criação ou manutenção da relação societária ou no ato da contratação.

A simples diferença aritmética entre o teto regulatório dos planos individuais e o reajuste aplicado à modalidade coletiva PME não possui o condão de transferir este ônus probatório, tampouco serve como indício presuntivo de fraude, visto tratar-se de uma comparação equívoca entre grandezas técnicas e regimes de custeio inteiramente heterogêneos.

Não havendo qualquer omissão, vício ou infração praticada pela operadora — fato este inclusive corroborado pelos laudos periciais anexos, nos quais diversos peritos judiciais, em casos idênticos, já realizaram rigorosas diligências e validaram categoricamente a integral higidez e idoneidade da base histórica da SulAmérica —, inexiste fundamento jurídico para que o Poder Judiciário aplique uma penalidade administrativa reversa a uma empresa em estrita conformidade com as normas do setor.

A imposição forçada do índice individual fora das hipóteses punitivas da ANS esvazia a autonomia da vontade e viola a livre iniciativa e a livre concorrência (art. 170, caput e IV da CF).

A mesma pretensão revisional também viola a boa-fé objetiva, pois a parte autora busca manter as vantagens econômicas e assistenciais do plano coletivo empresarial, mas afastar apenas seus ônus técnicos e regulatórios.

O comportamento processual e contratual do beneficiário traduz-se em uma tentativa de instrumentalização do aparato judicial para obter vantagens econômicas assimétricas, o que contamina a integridade ética da lide.

Para compreender a ilicitude da postura da parte autora, a dinâmica de sua conduta deve ser dividida em dois momentos cronológicos diametralmente opostos:
* O comportamento primário (factum proprium): a parte autora, de forma totalmente livre, consciente e voluntária, utilizou-se do vínculo com uma pessoa jurídica (CNPJ) para aderir a um plano coletivo empresarial (PME). Ao fazê-lo, extraiu imediatamente todos os bônus operacionais e comerciais dessa modalidade: mensalidades iniciais substancialmente mais módicas, isenção ou mitigação severa de carências e acesso a uma rede de atendimento expressivamente mais ampla. Essa conduta inicial foi plenamente apta a gerar na operadora a legítima expectativa de estabilidade técnica do regime eleito.
* O comportamento posterior (a insurgência judicial): após usufruir por ciclos sucessivos das benesses exclusivas do canal corporativo, a parte autora aciona a máquina judiciária para expurgar de forma unilateral o ônus técnico e regulatório do produto (o reajuste por pool de risco), pleiteando a aplicação do teto tarifário individual determinado pela ANS.

Não é legítimo, tampouco aceitável que, no momento do reajuste pelo pool de riscos, se alegue um "vínculo artificial" apenas para fugir dos custos e exigir o teto de reajuste restrito aos planos individuais.

Esse descompasso comportamental configura a expressão exata do venire contra factum proprium.

O ordenamento jurídico proíbe que uma parte adote uma conduta inicial legítima, desperte na outra uma justa confiança e, posteriormente, adote um comportamento inverso para se esquivar de suas contrapartidas obrigacionais.

Ao mapear este exato desvio ético, Luís Roberto Barroso adverte que o beneficiário atua de forma a romper com os padrões mínimos de lealdade e coerência:

"[O beneficiário] passa a usufruir das vantagens próprias desse regime contratual, como mensalidades iniciais geralmente mais acessíveis, maior diversidade de operadoras ofertantes e redes assistenciais mais amplas. (...) Posteriormente, porém, o mesmo beneficiário sustenta em juízo que o vínculo que permitiu a contratação seria meramente formal ou artificial, buscando desconstituir seletivamente apenas os ônus do regime coletivo, em especial o regime de reajustes, mas sem renunciar às suas vantagens econômicas e assistenciais. (...) Trata-se, sem margem a dúvida, de contradição objetiva incompatível com o padrão de lealdade e coerência exigido pela boa-fé objetiva."

A tentativa de transmudar o plano coletivo empresarial em individual para aplicar o teto da ANS configura verdadeiro artifício que atrai o que o eminente jurista, em seu parecer, denomina de "cherry-picking regulatório":

"Em termos econômicos, essa estratégia corresponde ao cherry-picking regulatório: a seleção oportunista e assimétrica das regras mais favoráveis de regimes jurídicos distintos, sem assumir as contrapartidas que sustentam o equilíbrio do sistema."

Em termos jurídicos e econômicos, essa postura configura um hibridismo utilitarista: a escolha seletiva e oportunista das regras mais favoráveis de regimes jurídicos distintos, retendo os preços de entrada e a ampla rede assistencial do plano empresarial, mas exigindo os limites de reajuste do plano individual sem assumir as bases atuariais que dão sustentabilidade ao ecossistema de saúde.

Chancelar tal entendimento criaria uma inadmissível lex tertia pela via judicial, validando mecanismo que permitiria ao usuário desfrutar benefícios mais amplos de um regime e custos menores de outro, sem arcar com as contrapartidas que dão sustentabilidade ao sistema.

Ademais, ao estruturar sua causa de pedir na alegação de que a apólice PME constitui um "falso coletivo" — sob o pretexto de que o contrato conta com um número reduzido de vidas e é composto por integrantes do mesmo núcleo familiar —, a parte autora atrai contra si a aplicação imediata do milenar brocardo nemo auditur propriam turpitudinem allegans (ninguém pode se beneficiar da própria torpeza).

Os planos coletivos de pequeno porte compostos por grupos reduzidos ou arranjos familiares constituem uma modalidade de contratação perfeitamente legítima, expressamente autorizada e regulada pela ANS (arts. 5º, § 1º e 9º da RN nº 557/2022).

Se a parte autora utilizou a sua própria realidade microempresarial para preencher os requisitos formais de elegibilidade e ingressar no plano coletivo, obtendo tarifas menores, não pode agora converter essa mesmíssima situação de facto numa suposta "fraude" para se esquivar dos reajustes.

Chancelar tamanha contradição comprometeria a métrica de boa-fé delineada pelo doutrinador Barroso:

"(...) ao afirmarem que a pessoa jurídica que espontaneamente constituíram para se beneficiarem das vantagens dos planos coletivos constitui um “falso coletivo”, os usuários que assim procedem violam dois conteúdos essenciais da boa-fé objetiva: a vedação do comportamento contraditório (venire contra factum proprium) e a proibição de invocar a própria irregularidade em seu favor (nemo auditur propriam turpitudinem allegans). (...) quem escolhe, espontaneamente, um determinado modelo contratual, praticando os atos necessários à sua celebração, não pode pretender alterá-lo para fórmula diversa, infirmando sua própria conduta e imputando a ela impropriedade."

Com a devida vênia, permitir que o demandante utilize as características da sua própria empresa ou família para desconstituir retroativamente as regras de custeio do pool de risco significaria premiar a contradição ética e o oportunismo contratual.

Sob a ótica do consequencialismo jurídico e da Análise Econômica do Direito (LINDB, art. 20), intervenções paternalistas baseadas em mera "compaixão social" isolada, que reduzem preços por simples distorções aritméticas com o índice individual, provocam o paradoxo da "proteção que desprotege". Conforme assevera o ilustre parecerista, o assistencialismo judicial dissociado de evidências penaliza quem cumpre a regulação e desestrutura a totalidade do mercado de consumo:

"(...) quando a defesa do consumidor não é baseada em evidências, mas em compaixão social, os agentes econômicos passam a operar levando mais em conta o risco jurídico do que a eficiência social. Tem-se aí a proteção ilusória, que desequilibra o mercado e desprotege a maioria."`,
  },

  // 7.4 SUPRESSIO E SURRECTIO
  {
    key: 'merits_supressio_surrectio_block',
    title: 'DA CONSOLIDAÇÃO DO PACTO PELA BOA-FÉ TEMPORAL: SUPRESSIO E SURRECTIO',
    category: 'merits',
    order: 180,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA CONSOLIDAÇÃO DO PACTO PELA BOA-FÉ TEMPORAL: SUPRESSIO E SURRECTIO

Além das consequências sistêmicas da pretensão autoral, a própria dinâmica contratual mantida entre as partes também impede a revisão retroativa dos reajustes, por força dos institutos parcelares da boa-fé objetiva.

O comportamento da parte autora, que adimpliu pontualmente e de forma continuada os prêmios reajustados por sinistralidade e variação de custos (VCMH) ao longo de diversos ciclos anuais sem qualquer ressalva ou oposição administrativa prévia, consolidou a metodologia técnica no tempo.

Sob a égide do Direito Civil contemporâneo, opera-se a supressio do pretenso direito de impugnar retroativamente as bases contratuais, dada a legítima expectativa de estabilidade gerada na operadora de saúde.

Simetricamente a esse fenômeno, incide a figura da surrectio, consolidando de forma inafastável o modelo coletivo e o mutualismo praticado de comum acordo pelas partes ao longo da execução contínua do contrato.

Permitir a desconstituição judicial de reajustes perfectibilizados, cobrados com lastro em cláusulas expressas e aceitos tacitamente pelo reiterado pagamento, seria fulminar a segurança jurídica e ignorar a consolidação das situações fáticas pelo decurso do tempo. Alterar o índice de forma retroativa causa um déficit financeiro irreparável ao fundo mútuo, exaurindo recursos que já foram consumidos e liquidados no custeio dos sinistros da própria época.

Por consequência, requer-se o julgamento de total improcedência dos pedidos revisionais retroativos e restitutórios formulados, em razão da consolidação histórica da metodologia atuarial pelo adimplemento continuado e sem oposição por diversos ciclos anuais, operando-se os institutos da supressio e da surrectio para resguardar a estabilidade do pacto, nos termos do artigo 421 do Código Civil, o que impede de forma cabal a invalidação retroativa do histórico tarifário chancelado pelas partes.`,
  },

  // 7.5 LEGALIDADE DO AGRUPAMENTO (POOL DE RISCO) E PRU
  {
    key: 'merits_pru_legality_block',
    title: 'DA LEGALIDADE DO AGRUPAMENTO DE CONTRATOS E DO PERCENTUAL DE REAJUSTE ÚNICO (PRU)',
    category: 'merits',
    order: 190,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA LEGALIDADE DO AGRUPAMENTO DE CONTRATOS E DO PERCENTUAL DE REAJUSTE ÚNICO (PRU)

Afastada a tentativa de transmutação do contrato e preservada a sua natureza coletiva empresarial, cumpre examinar o mecanismo regulatório que disciplina os reajustes dos contratos com até 29 vidas: o agrupamento obrigatório e o respectivo Percentual de Reajuste Único (PRU).

Por essa razão, a normatização setorial, hoje materializada nos artigos 37 e 38 da Resolução Normativa nº 565/2022 da ANS, estabelece que é obrigatório às operadoras de planos privados de assistência à saúde formar um agrupamento com todos os seus contratos coletivos com menos de trinta beneficiários para a extração da métrica que será aplicada a esse mesmo agrupamento.

Por imperativo normativo e matemático, o cálculo do reajuste aplicável a essa carteira não constitui um ato de arbítrio ou de conveniência unilateral da operadora ré, mas sim a estrita aplicação de uma equação rigorosa e complexa que resulta na apuração do Percentual de Reajuste Único (PRU).

Este percentual linear é obtido mediante a ponderação simultânea de dois fatores dinâmicos apurados globalmente em todo o pool: o Índice de Variação de Custos Médico-Hospitalares (VCMH), que mede a evolução real da inflação médica e o aumento da frequência de utilização tecnológica no setor, e o Índice de Reajuste por Sinistralidade (IRS). O IRS, por sua vez, reflete a relação direta entre o total de despesas assistenciais e as receitas de prêmios de todo o agrupamento de contratos, confrontando esse resultado com a sinistralidade referencial (ponto de equilíbrio) preestabelecida no patamar técnico de 65%.

Portanto, o reajuste linear do pool visa garantir a solvência e a sustentabilidade econômica do fundo mútuo, sendo inviável a sua desconstituição judicial por meras presunções.

O funcionamento da saúde suplementar estrutura-se fundamentalmente sobre o mutualismo e a solidariedade financeira entre os participantes. Para que o fundo mútuo seja solvente e preserve sua liquidez frente à álea contratual, a exigência de submissão do contrato da parte autora ao índice unificado do agrupamento não é, portanto, uma faculdade, mas uma obrigação imposta à SulAmérica.

Desvincular um microcoletivo de sua base de risco originária para beneficiá-lo individualmente com índices inferiores aplicáveis a naturezas jurídicas estranhas à sua contratação romperia a integridade da equação mutualística e representaria uma infração regulatória severa por parte da seguradora.

Ante a absoluta higidez deste regime, requer-se seja julgado totalmente improcedente o pedido autoral, reconhecendo-se a estrita legalidade do modelo de agrupamento compulsório e a regularidade atuarial do cálculo do Percentual de Reajuste Único (PRU) linearmente aplicado a todo o pool de risco de até 29 vidas, em estrita obediência aos preceitos dos artigos 37 e 38 da RN nº 565/2022 da ANS.`,
  },

  // 7.6 REAJUSTE ETÁRIO (TEMAS 952 E 1.016 DO STJ)
  {
    key: 'merits_age_readjustment_block',
    title: 'DA VALIDADE DO REAJUSTE POR FAIXA ETÁRIA - TEMAS 952 E 1.016 DO STJ',
    category: 'merits',
    order: 200,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_age_readjustment_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA VALIDADE DO REAJUSTE POR FAIXA ETÁRIA - TEMAS 952 E 1.016 DO STJ

A parte autora questiona, de forma genérica e desprovida de lastro técnico, a validade dos reajustes por mudança de faixa etária aplicados aos beneficiários da apólice.

Contudo, o reajuste etário consubstancia mecanismo atuarial basilar e indispensável para a preservação do equilíbrio econômico-financeiro do fundo mutual, operando em regime de repartição simples.

É de natural constatação que a longevidade e o avanço da idade afetam diretamente o custo da assistência à saúde, havendo uma correlação inafastável entre o incremento da faixa etária e o aumento do risco biológico de o segurado vir a necessitar de serviços e tratamentos médicos de maior complexidade. A ausência de reajuste nos prêmios pagos por aqueles que atingem faixa etária de maior risco e utilização redundaria, inevitavelmente, em um grave déficit atuarial a ser suportado pelos integrantes das demais faixas, desequilibrando e colapsando todo o sistema de saúde suplementar.

O Superior Tribunal de Justiça (STJ), operando sob o rigor da sistemática dos recursos repetitivos, esgotou a discussão sobre a matéria, fixando teses vinculantes que devem ser obrigatoriamente observadas por este juízo, nos termos do artigo 927, inciso III, do Código de Processo Civil.

No paradigmático julgamento do Tema 952/STJ, a Corte Cidadã cravou que o reajuste por faixa etária é plenamente válido desde que obedeça a três vetores: haja expressa previsão contratual; sejam observadas as normas expedidas pelos órgãos reguladores; e não sejam aplicados percentuais desarrazoados ou aleatórios desprovidos de base atuarial idônea. Posteriormente, ao julgar o Tema 1.016/STJ, o Tribunal estendeu e ratificou expressamente a aplicabilidade inafastável desses exatos vetores (Tema 952) aos contratos de planos de saúde de natureza coletiva.

Desse modo, a apreciação do presente litígio submete-se de forma inexorável à ratio decidendi fixada no Tema 1.016 do STJ. No caso vertente, a operadora ré atende de forma irretocável aos três vetores de validade exigidos pelas Cortes Superiores:

a) Existência de expressa previsão contratual: O contrato coletivo PME firmado com a estipulante prevê, de forma clara e destacada, a incidência de reajuste do prêmio em função da mudança de idade cronológica dos beneficiários, sendo disponibilizada tabela com os exatos índices de majoração previstos para o plano, permitindo que a parte tivesse ciência inequívoca da evolução tarifária desde a adesão.

b) Observância estrita às normas governamentais: A apólice e a respectiva tabela de evolução etária respeitam integralmente as balizas cogentes estabelecidas pela Resolução Normativa nº 563/2022 da ANS (norma consolidadora da antiga RN nº 63/2003). A operadora observa a arquitetura de 10 (dez) faixas etárias e as estritas proporções matemáticas fixadas pela agência, garantindo que o valor da última faixa (59 anos ou mais) não seja superior a 6 (seis) vezes o valor da primeira (0 a 18 anos), bem como respeita a trava de que a variação acumulada entre a 7ª e a 10ª faixas não ultrapasse a acumulada entre a 1ª e a 7ª faixas, promovendo a solidariedade intergeracional.

c) Inexistência de percentuais desarrazoados ou aleatórios (Lastro Atuarial): Os percentuais aplicados não ostentam qualquer viés aleatório ou abusivo, possuindo absoluta justificação técnica. A mensuração do risco atuarial para a precificação das faixas foi submetida à prévia fiscalização do Estado por intermédio da Nota Técnica de Registro de Produto (NTRP), documento atuarial obrigatório que foi rigorosamente auditado e aprovado pela própria ANS para autorizar a comercialização do plano.

Como expressamente encampado pelos fundamentos do Tema 1.016 do STJ, se as faixas e os percentuais previstos na avença foram chancelados pela ANS por meio da NTRP, atendendo aos rigorosos critérios matemáticos de evolução do risco, não há como o Judiciário rotular tais percentuais como desarrazoados ou desprovidos de base atuarial idônea.

Portanto, preenchidos cumulativamente todos os requisitos formais, técnicos e regulatórios delineados nos Temas 952 e 1.016 do Superior Tribunal de Justiça, revela-se manifestamente infundada a pretensão exordial, impondo-se a total improcedência do pedido de declaração de abusividade e anulação dos reajustes etários aplicados à apólice da parte autora.`,
  },

  // 7.7 PROVA TÉCNICA E ATUARIAL DOS REAJUSTES
  {
    key: 'merits_technical_proof_block',
    title: 'DA PROVA TÉCNICA E ATUARIAL DOS REAJUSTES',
    category: 'merits',
    order: 210,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA PROVA TÉCNICA E ATUARIAL DOS REAJUSTES

Definida a base regulatória do agrupamento e do PRU, impõe-se demonstrar que os índices efetivamente aplicados contam com lastro documental, técnico e atuarial suficiente, afastando a alegação de reajustes aleatórios, unilaterais ou desprovidos de transparência.

Para eliminar qualquer dúvida acerca da lisura, idoneidade e exatidão matemática dos índices apurados, a SulAmérica submete, historicamente, toda a sua base de dados e a metodologia de cálculo preestabelecida nas Condições Gerais a rigorosas auditorias independentes de prestígio global.

Os Relatórios de Procedimentos Previamente Acordados (PPAs), emitidos anualmente pelas conceituadas firmas de auditagem, atestam a formação do agrupamento e chancelam de forma absoluta a correção dos cálculos do PRU, demonstrando, perante as metodologias do mercado e da ANS, que os percentuais aplicados não ostentam qualquer traço de aleatoriedade, generalidade ou abusividade.

Mais do que a demonstração de estrita legalidade, a prova atuarial evidencia que a operadora ré, na contramão da alegada onerosidade excessiva, frequentemente adota uma postura comercial de mitigação dos impactos financeiros aos seus segurados.

Historicamente, conforme atestado por exaustivos laudos periciais em demandas análogas de controle de pool, a SulAmérica tem aplicado aos contratos PME reajustes efetivos em patamares substancialmente inferiores aos índices técnicos matematicamente apurados como necessários pelas auditorias para o pleno reequilíbrio da carteira. Trata-se de inquestionável liberalidade da operadora que beneficia diretamente a coletividade das empresas estipulantes, esvaziando por completo a falácia de que haveria obtenção de vantagem exagerada pela seguradora.

Sendo assim, diante da irrefutável comprovação de que os reajustes de Sinistralidade e VCMH decorrem de expressa previsão contratual e encontram-se plenamente justificados por sólida base atuarial e relatórios de auditoria independente, desmorona a alegação genérica de abusividade.

Consequentemente, requer a total improcedência da demanda revisional e do pretenso pleito restitutório financeiro, ante a comprovação cabal de que a evolução dos preços do contrato possui estrito lastro regulatório e contratual, correspondendo à real Variação de Custos Médico-Hospitalares (VCMH) e à sinistralidade fática da carteira auditada de até 29 vidas, em estrita obediência aos preceitos dos artigos 37 e 38 da RN nº 565/2022 da ANS.`,
  },

  // 7.8 CONSEQUÊNCIAS SISTÊMICAS, MUTUALISMO E FREE-RIDER
  {
    key: 'merits_systemic_consequences_block',
    title: 'DAS CONSEQUÊNCIAS SISTÊMICAS: MUTUALISMO, EQUILÍBRIO ATUARIAL E EFEITO FREE-RIDER',
    category: 'merits',
    order: 220,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DAS CONSEQUÊNCIAS SISTÊMICAS: MUTUALISMO, EQUILÍBRIO ATUARIAL E EFEITO FREE-RIDER

Comprovada a regularidade técnica dos reajustes, resta evidenciar que a pretensão revisional não afeta apenas a relação bilateral entre as partes, mas repercute diretamente sobre o fundo comum e sobre os demais integrantes do agrupamento.

Ao se pretender blindar judicialmente um contrato de forma casuística e desconectada da realidade de seu agrupamento, o déficit financeiro gerado por este pacto não é magicamente absorvido pela operadora; ao revés, ele é obrigatoriamente redistribuído e repassado aos demais consumidores e microempresas que integram o pool de risco.

Ao tentar obter a substituição dos reajustes de forma artificial e esquivar-se de sua contrapartida financeira, a parte autora busca instituir no sistema a figura do “beneficiário carona” (efeito free-rider). Configura-se, com nitidez, o comportamento daquele que extrai as vantagens individuais e a segurança do sistema de saúde suplementar, sem, contudo, arcar com a contribuição matematicamente proporcional aos seus custos, onerando de forma direta e parasitária a massa de consumidores idôneos que cumprem o pactuado.

A desconstituição judicial de índices legítimos faz com que o litigante desfrute de serviços de alto custo sem arcar com a contrapartida proporcional. Como os custos médicos reais são dinâmicos e não desaparecem por decisão judicial, esse défice financeiro individual é obrigatoriamente socializado e rateado entre as demais microempresas que integram o agrupamento (pool de risco), transferindo o benefício a um único agente em detrimento da coletividade.

Do ponto de vista econômico, o parecerista Barroso sintetiza o paradoxo: "há o problema do free-rider, em que os beneficiários que litigam obtêm vantagem individual de redução do valor das mensalidades, desfrutando dos serviços de saúde sem arcar proporcionalmente com seus custos, às expensas do equilíbrio atuarial do restante do agrupamento. Os ônus difusos são socializados, enquanto os benefícios são apropriados individualmente. (...) A limitação judicial de reajustes para determinados beneficiários não elimina o custo assistencial correspondente; apenas o redistribui."

A multiplicação dessas decisões gera uma autêntica "tragédia dos comuns", exaurindo o fundo mútuo coletivo que protege a totalidade dos segurados. A chancela jurisdicional a essa pretensão representaria um golpe gravoso contra a arquitetura do sistema e a viabilidade da prestação de serviços à saúde, premiando o individualismo em detrimento da higidez atuarial.

Desse modo, requer-se a total improcedência dos pedidos formulados pela parte autora, assegurando-se a prevalência do interesse coletivo da carteira e a proteção do fundo mútuo contra pretensões individuais assimétricas, a fim de evitar a injusta socialização de prejuízos e o desequilíbrio sistêmico (efeito free-rider) no agrupamento de risco.`,
  },

  // 7.9 PROVA EMPRESTADA E PERÍCIA ATUARIAL SUBSIDIÁRIA
  {
    key: 'merits_borrowed_proof_block',
    title: 'DA PROVA EMPRESTADA E DA PERÍCIA ATUARIAL SUBSIDIÁRIA',
    category: 'merits',
    order: 230,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'is_pme_selected',
      operator: 'equals',
      value: true,
    },
    content: `DA PROVA EMPRESTADA E DA PERÍCIA ATUARIAL SUBSIDIÁRIA

Caso ainda se entenda necessária alguma dilação probatória, a controvérsia instaurada nestes autos ostenta natureza eminentemente técnica, econômica e atuarial, o que reforça a indispensabilidade de prova especializada.

A pretensão da parte autora orbita em torno da declaração de abusividade e consequente anulação dos reajustes anuais técnicos (VCMH e Sinistralidade) aplicados ao longo da relação contratual, almejando a imposição transversa dos índices-teto definidos pela Agência Nacional de Saúde Suplementar (ANS) exclusivamente para a categoria de planos individuais.

Contudo, a verificação da regularidade matemática e da adequação financeira dos percentuais praticados pela operadora no ecossistema do agrupamento de contratos coletivos empresariais (pool de risco com até 29 vidas) exige, de forma intransponível, uma acurada e especializada análise probatória.

O cálculo dos índices de reajuste destas apólices corporativas não consubstancia uma mera operação aritmética de adição ou subtração, mas sim a aplicação de fórmulas estatísticas e atuariais altamente sofisticadas, que ponderam, simultaneamente e em larga escala, o Índice de Variação de Custos Médico-Hospitalares (VCMH) e o Índice de Reajuste por Sinistralidade (IRS) atrelados a uma massa imensa de beneficiários e microempresas.

O Código de Processo Civil, primando pela racionalidade e eficiência jurisdicional, consagra expressamente em seu artigo 372 que o juiz poderá admitir a utilização de prova produzida em outro processo, atribuindo-lhe o valor que considerar adequado, observado o contraditório. O Superior Tribunal de Justiça trilha idêntico entendimento, assentando a plena admissibilidade da prova emprestada mesmo na hipótese em que as partes não tenham figurado no feito de origem.

Destaca-se, como esteio probatório irrefutável para a presente lide, o laudo oficial exarado no âmbito do processo paradigmático nº 1031894-75.2017.8.26.0100, perante o Tribunal de Justiça de São Paulo, no qual o expert do juízo realizou minuciosa diligência in loco na sede da operadora, teve acesso irrestrito a toda a base histórica de sinistros, confrontou os dados amostrais e atestou categoricamente a integridade contábil das informações e a absoluta correção matemática dos Percentuais de Reajuste Único (PRU), chancelados pelas auditorias independentes (KPMG e Deloitte).

Ante o exposto, pugna a requerida pela admissão, pelo recebimento e pela juntada do irretocável Laudo Pericial Contábil-Atuarial homologado nos autos da ação paradigmática nº 1031894-75.2017.8.26.0100 (bem como da respectiva sentença e acórdão), para que seja integralmente aproveitado por este douto juízo como prova emprestada (art. 372 do CPC), servindo como fundamento técnico impeditivo do direito alegado e culminando na total improcedência dos pleitos revisionais formulados pela parte autora.

Subsidiariamente, caso se entenda pela indispensabilidade de renovação da instrução probatória originária neste feito, requer-se a produção de prova pericial técnico-atuarial formal a ser conduzida por perito oficial cadastrado e registrado junto ao IBA (Instituto Brasileiro de Atuários), inclusive mediante diligência in loco na sede da operadora, obstando-se categoricamente o julgamento antecipado ou intuitivo do mérito para afastar a ocorrência de cerceamento de defesa.`,
  },

  // 7.10 REPETIÇÃO SIMPLES
  {
    key: 'repetition_simple_block',
    title: 'DA IMPOSSIBILIDADE DE RESTITUIÇÃO DOS VALORES: DO EXERCÍCIO REGULAR DE DIREITO, DA CONTRAPRESTAÇÃO ASSISTENCIAL E DA VEDAÇÃO AO ENRIQUECIMENTO SEM CAUSA',
    category: 'merits',
    order: 240,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'repetition_status',
      operator: 'equals',
      value: 'simple',
    },
    associatedRequestKey: 'req_merits_repetition',
    content: `DA IMPOSSIBILIDADE DE RESTITUIÇÃO DOS VALORES: DO EXERCÍCIO REGULAR DE DIREITO, DA CONTRAPRESTAÇÃO ASSISTENCIAL E DA VEDAÇÃO AO ENRIQUECIMENTO SEM CAUSA

Ainda que se cogite, por puro princípio de eventualidade, qualquer readequação judicial da natureza jurídica do plano, das cláusulas contratuais ou dos índices de reajuste aplicados — hipóteses expressamente rechaçadas —, tal conclusão não conduz, de forma automática, à existência de indébito nem autoriza a restituição das mensalidades regularmente faturadas e adimplidas ao longo da relação contratual.

A pretensão restitutória pressupõe, logicamente, a demonstração de pagamento indevido, isto é, a existência de parcela que tenha ingressado no patrimônio da operadora sem correspondente fundamento jurídico ou em montante superior àquele efetivamente devido. Não basta, portanto, questionar posteriormente determinada cláusula, metodologia ou índice de reajuste para transformar retroativamente em indébito todos os valores pagos durante a execução regular do contrato.

As mensalidades foram faturadas com fundamento nas cláusulas do negócio jurídico vigente e segundo a disciplina aplicável ao produto contratado, tendo a operadora ré atuado no exercício regular de posição jurídica decorrente da avença e da regulamentação da saúde suplementar. Enquanto não reconhecida concretamente a invalidade da cobrança e apurado eventual excesso, inexiste pressuposto jurídico para qualquer restituição.

Mesmo eventual reconhecimento judicial de abusividade de determinado reajuste não autoriza a devolução integral das mensalidades pagas, pois a contraprestação não se destinava exclusivamente a remunerar o índice posteriormente controvertido. A mensalidade constitui contraprestação pela assunção continuada do risco assistencial e pela disponibilização permanente das coberturas médico-hospitalares contratadas.

Durante todo o período impugnado, a parte autora e os beneficiários permaneceram inseridos na estrutura assistencial da operadora, com acesso à rede contratada e transferência à SulAmérica do risco econômico correspondente aos eventos de saúde cobertos. Houve, portanto, efetiva contraprestação durante a execução contratual.

A eventual revisão judicial somente poderia alcançar, em tese e após demonstração técnica e individualizada, a diferença positiva entre aquilo que foi efetivamente cobrado e o montante que o juízo venha a considerar devido segundo os critérios jurídicos aplicáveis ao caso concreto. Não existe fundamento para restituição fundada em simples comparação abstrata entre os valores historicamente pagos e aqueles unilateralmente reconstruídos pela parte autora.

A restituição igualmente deve observar a vedação ao enriquecimento sem causa prevista no artigo 884 do Código Civil. Não se pode admitir que a revisão posterior da relação contratual produza resultado econômico que coloque a parte autora em situação mais vantajosa do que aquela em que estaria caso o critério reputado correto tivesse sido aplicado desde a origem.

São essas razões que impõem a improcedência do pedido de restituição formulado na petição inicial, reconhecendo-se a inexistência de indébito enquanto hígidas as cobranças realizadas no exercício regular das disposições contratuais e regulatórias aplicáveis e, subsidiariamente, na remota hipótese de revisão judicial, limitando-se qualquer recomposição exclusivamente às diferenças efetivamente comprovadas como pagas a maior, vedada restituição que importe enriquecimento sem causa ou desconsidere a contraprestação assistencial efetivamente disponibilizada durante a execução do contrato.`,
  },

  // 7.11 REPETIÇÃO EM DOBRO
  {
    key: 'repetition_double_block',
    title: 'DA IMPOSSIBILIDADE DE REPETIÇÃO DO INDÉBITO EM DOBRO: DA AUSÊNCIA DE CONDUTA CONTRÁRIA À BOA-FÉ OBJETIVA E DA INAPLICABILIDADE DO ARTIGO 42, PARÁGRAFO ÚNICO, DO CDC',
    category: 'merits',
    order: 250,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'repetition_status',
      operator: 'equals',
      value: 'double',
    },
    associatedRequestKey: 'req_merits_repetition',
    content: `DA IMPOSSIBILIDADE DE REPETIÇÃO DO INDÉBITO EM DOBRO: DA AUSÊNCIA DE CONDUTA CONTRÁRIA À BOA-FÉ OBJETIVA E DA INAPLICABILIDADE DO ARTIGO 42, PARÁGRAFO ÚNICO, DO CDC

Ainda que se cogite, por puro princípio de eventualidade, qualquer readequação judicial da natureza jurídica do plano, das cláusulas contratuais ou dos índices de reajuste aplicados — hipóteses expressamente rechaçadas —, tal conclusão jamais conduziria, automaticamente, à incidência da sanção prevista no artigo 42, parágrafo único, do Código de Defesa do Consumidor.

A repetição em dobro possui pressupostos próprios e mais rigorosos, não se confundindo com a simples constatação posterior de que determinado valor poderia ter sido calculado segundo critério diverso daquele empregado durante a execução do contrato.

As mensalidades foram faturadas e exigidas com fundamento nas cláusulas de negócio jurídico vigente e segundo a disciplina regulatória aplicável ao produto contratado, tendo a operadora ré atuado no exercício regular das posições jurídicas decorrentes da avença e do regime normativo da saúde suplementar. A cobrança fundada em cláusula contratual expressa, aplicada ostensivamente durante a execução do negócio e inserida em ambiente submetido à regulação estatal não traduz, por si só, comportamento desleal, ardiloso ou incompatível com os deveres de confiança, cooperação e lealdade.

A jurisprudência da Corte Especial do Superior Tribunal de Justiça consolidou o entendimento de que a restituição em dobro prevista no dispositivo consumerista não depende da demonstração de má-fé subjetiva do fornecedor, mas pressupõe cobrança indevida reveladora de conduta contrária à boa-fé objetiva. Afastada a antiga exigência de prova de dolo ou má-fé subjetiva, não se instituiu responsabilidade sancionatória automática pela simples existência de cobrança posteriormente reputada indevida.

Permanece indispensável verificar se a conduta objetivamente adotada pelo fornecedor contrariou os padrões de lealdade, transparência, confiança e correção legitimamente exigíveis na relação de consumo. Divergência jurídica, contratual, regulatória ou técnico-atuarial não se confunde com violação à boa-fé objetiva.

A própria ressalva expressamente prevista no artigo 42, parágrafo único, do CDC confirma essa conclusão ao excepcionar a repetição dobrada diante de engano justificável. Se o próprio legislador exclui a consequência sancionatória quando a cobrança indevida decorre de circunstância objetivamente justificável, não se pode converter toda revisão judicial superveniente em causa suficiente para duplicação do valor controvertido.

São essas razões que impõem a improcedência do pedido de repetição do indébito em dobro, reconhecendo-se que eventual revisão judicial das cobranças não caracteriza, por si só, conduta contrária à boa-fé objetiva e não autoriza a incidência automática do artigo 42, parágrafo único, do Código de Defesa do Consumidor, cuja aplicação pressupõe a efetiva demonstração dos requisitos específicos que justificam a excepcional duplicação do valor reputado indevido.`,
  },

  // 7.12 DANO MORAL
  {
    key: 'moral_damages_block',
    title: 'DA AUSÊNCIA DE DANO MORAL',
    category: 'merits',
    order: 260,
    contentType: 'conditional',
    version: '1.0.0',
    active: true,
    condition: {
      field: 'moral_damages_status',
      operator: 'equals',
      value: 'claimed',
    },
    associatedRequestKey: 'req_merits_moral_damages',
    content: `DA AUSÊNCIA DE DANO MORAL

Não há que se falar em dano moral por "desvio produtivo". A aplicação dos índices de reajuste e o correto faturamento das mensalidades do plano de saúde decorrem do exercício regular de direito (art. 188, I, do Código Civil), sendo a cobrança pautada em cláusula válida e na efetiva disponibilidade da rede assistencial como contraprestação.

O tempo despendido pela parte autora para questionar débitos legítimos não caracteriza lesão à personalidade. A teoria do desvio produtivo exige prova de perda do tempo útil em razão de falha inequívoca do serviço, o que não ocorre quando a cobrança é pautada em cláusula válida.

Os precedentes que deferem indenização presumida — in re ipsa — alicerçam-se na premissa inafastável de que a cobrança ou anotação restritiva deve ser inequivocamente indevida, originada de fraude, falha na prestação de serviços ou exigência de obrigações declaradas nulas. O cenário vertente, contudo, encerra dinâmica diametralmente oposta: o débito cobrado é materialmente lícito, hígido e originado de explícita cláusula contratual e da observância dos preceitos regulatórios.

Transpondo tais vetores dogmáticos à aderência fática do caso concreto, evidencia-se de forma hialina que esta contestante agiu em conformidade estrita com o contrato pactuado, tratando-se a conduta de exercício regular de direito (art. 188, I, CC). Ausente qualquer falha na prestação do serviço ou antijuridicidade na conduta da operadora, o alegado desconforto administrativo sofrido pela parte demandante constitui mero revés, restando perfeitamente subsumido ao risco inerente à vida de relação.

Requer-se que seja julgado totalmente improcedente o pedido de compensação por danos morais, declarando-se que a controvérsia versa sobre estrita interpretação de cláusulas contratuais e inquestionável exercício regular de direito da credora, configurando mero aborrecimento sem qualquer ofensa a quaisquer direitos da personalidade.`,
  },

  // 7.13 TAXA SELIC (TEMA 1.368 DO STJ)
  {
    key: 'merits_selic_block',
    title: 'DA INCIDÊNCIA EXCLUSIVA DA TAXA SELIC EM EVENTUAL CONDENAÇÃO, SOB A ÓTICA DO TEMA 1.368 DO STJ',
    category: 'merits',
    order: 270,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    content: `DA INCIDÊNCIA EXCLUSIVA DA TAXA SELIC EM EVENTUAL CONDENAÇÃO, SOB A ÓTICA DO TEMA 1.368 DO STJ

Na eventual hipótese de procedência de qualquer dos pleitos condenatórios formulados pela demandante, o que se admite estritamente em atenção ao princípio da eventualidade, faz-se imperiosa a correta fixação dos consectários legais incidentes sobre o montante da condenação, a fim de coibir o enriquecimento sem causa.

O Superior Tribunal de Justiça (STJ), ao apreciar o Tema 1.368 sob o rito qualificado dos recursos repetitivos, consolidou o entendimento vinculante de que o artigo 406 do Código Civil de 2002, antes da entrada em vigor da Lei nº 14.905/2024, deve ser interpretado de maneira restritiva, reconhecendo a Taxa Selic como o índice único e exclusivo aplicável às dívidas de natureza civil. A Corte Nacional firmou a diretriz inafastável de que a Selic engloba, simultaneamente, os juros de mora e a atualização monetária, sendo expressamente vedada a sua cumulação com quaisquer outros índices inflacionários ou encargos moratórios no período anterior ao novel diploma legal.

Nos exatos termos do artigo 927, inciso III, do Código de Processo Civil, a jurisprudência firmada sob tal sistemática possui caráter vinculante e aplicação obrigatória. Ademais, no que tange ao período posterior à vigência da Lei nº 14.905/2024, a legislação superveniente e a adequação pretoriana preconizam que a atualização das dívidas civis passe a observar os critérios da nova redação do artigo 406 e do artigo 389, parágrafo único, do Código Civil (IPCA acrescido da taxa legal).

Desta feita, invocando o imperativo da segurança jurídica e o acatamento aos precedentes vinculantes, pugna-se para que, na eventualidade de condenação pecuniária de qualquer natureza (como repetição de indébito), seja determinada por este douto juízo a incidência exclusiva da Taxa Selic, a título de correção monetária e juros de mora, para o período anterior à vigência da Lei nº 14.905/2024, e, posteriormente, a aplicação do IPCA somada aos juros legais calculados nos moldes da novel legislação civil.`,
  },

  // ====================================================================
  // 8. DO PREQUESTIONAMENTO QUALIFICADO
  // ====================================================================
  {
    key: 'prequestioning_block',
    title: 'DO PREQUESTIONAMENTO QUALIFICADO',
    category: 'prequestioning',
    order: 280,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    content: `DO PREQUESTIONAMENTO QUALIFICADO

Caso sejam acolhidos os pleitos deduzidos na exordial, o que se cogita exclusivamente em estrita obediência ao princípio da eventualidade, a operadora ré pugna, desde logo, pelo prequestionamento explícito e qualificado da integralidade da matéria constitucional, infraconstitucional e regulatória ventilada nesta peça defensiva, com o escopo de pavimentar o acesso às instâncias extraordinária e especial.

A prolação de eventual provimento desfavorável à seguradora ré demandará manifestação jurisdicional expressa sobre os dispositivos normativos basilares que chancelam a higidez da engenharia atuarial do plano coletivo empresarial (PME) firmado entre as partes.

No plano constitucional, a pretensão da parte autora de transmutação do contrato coletivo para individual e a anulação dos reajustes afrontam os imperativos da livre iniciativa, do ato jurídico perfeito e da legalidade, atraindo a necessidade de manifestação expressa deste douto juízo sobre os artigos 1º, inciso IV, 5º, incisos II e XXXVI, bem como o artigo 170, caput e inciso IV, todos da Constituição da República. Ademais, a eventual negativa de produção de prova pericial atuarial, essencial para atestar a correção matemática dos índices questionados, consubstanciará flagrante cerceamento de defesa e violação ao devido processo legal substantivo, vulnerando o artigo 5º, incisos LIV e LV, da Carta Magna.

Por fim, a imposição transversa de limites de reajuste restritos a planos individuais em apólice corporativa configura invasão indevida da competência regulatória da Agência Nacional de Saúde Suplementar (ANS), vilipendiando o princípio da Separação de Poderes, insculpido no artigo 2º da Constituição Federal.

Sob o prisma infraconstitucional, exige-se o prequestionamento explícito dos ditames encartados nos artigos 421, 421-A e 422 do Código Civil, que consagram a liberdade contratual, a alocação de riscos definida pelas partes e a boa-fé objetiva, repelindo de forma veemente o inaceitável comportamento contraditório (venire contra factum proprium) daquele que anui à modalidade corporativa e depois a rechaça.

A atualização de eventual condenação pecuniária também deverá enfrentar a aplicação conjugada dos artigos 389 e 406 do Código Civil, com a redação conferida pela Lei nº 14.905/2024. No âmbito processual, impõe-se o prequestionamento do artigo 373, inciso I, do Código de Processo Civil, bem como dos artigos 156 e 375 do mesmo diploma codificado, quanto à reserva de perícia técnica. Requer-se ainda a análise sob a ótica dos artigos 37 e 38 da RN nº 565/2022 e da RN nº 563/2022 da ANS.

Por todo o exposto, pugna a seguradora ré para que este respeitável juízo, no momento da prolação do provimento final de mérito, manifeste-se expressa, individualizada e fundamentadamente sobre a integralidade dos normativos aqui declinados, a fim de perfectibilizar o inafastável prequestionamento da matéria.`,
  },

  // ====================================================================
  // 9. DOS REQUERIMENTOS FINAIS
  // ====================================================================
  {
    key: 'final_requests_block',
    title: 'DOS REQUERIMENTOS FINAIS',
    category: 'requests',
    order: 290,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    variables: ['REQUESTS_ITEMS_TEXT'],
    content: `DOS REQUERIMENTOS FINAIS

Diante de todo o exposto fático e jurídico, restando irrefutavelmente demonstrada a higidez da apólice de modalidade coletiva empresarial (PME) e a estrita regularidade normativa e atuarial dos reajustes aplicados, a Sul América Companhia de Seguro Saúde requer a Vossa Excelência:

{{REQUESTS_ITEMS_TEXT}}`,
  },

  // ====================================================================
  // 10. FECHAMENTO E ASSINATURAS
  // ====================================================================
  {
    key: 'closing_block',
    title: 'FECHAMENTO E ASSINATURAS',
    category: 'closing',
    order: 300,
    contentType: 'permanent',
    version: '1.0.0',
    active: true,
    variables: ['CIDADE_ESTADO_DATA', 'LISTA_OABS_PATRONO'],
    content: `Nestes Termos,
Pede Deferimento.

{{CIDADE_ESTADO_DATA}}

BRUNA D’ ANGELO ALVES
OAB/MG 132.039

MÁRCIO AGUIAR
OAB/RJ 95.148

JOSÉ ANTÔNIO MARTINS
{{LISTA_OABS_PATRONO}}`,
  },
];

export const CONTESTACAO_FINAL_REQUESTS: FinalRequestItem[] = [
  {
    key: 'req_standing',
    label: 'a) Preliminar de Ilegitimidade Ativa',
    order: 10,
    contentType: 'conditional',
    condition: {
      field: 'standing_challenge_status',
      operator: 'equals',
      value: 'challenge',
    },
    text: `a) o acolhimento da preliminar de ilegitimidade ativa ad causam da pessoa física autora (beneficiário isolado), decretando-se a extinção do processo sem resolução do mérito, fulcro no artigo 485, inciso VI, do Código de Processo Civil, por versar a lide sobre cláusulas financeiras e repetição de indébito de faturamento corporativo emitido em face da estipulante;`,
  },
  {
    key: 'req_legal_aid',
    label: 'b) Impugnação à Gratuidade de Justiça',
    order: 20,
    contentType: 'conditional',
    condition: {
      field: 'legal_aid_status',
      operator: 'equals',
      value: 'challenge',
    },
    text: `b) o acolhimento da impugnação ao benefício da gratuidade de justiça, determinando-se o recolhimento das custas iniciais;`,
  },
  {
    key: 'req_claim_value',
    label: 'c) Impugnação ao Valor da Causa',
    order: 30,
    contentType: 'conditional',
    condition: {
      field: 'claim_value_challenge_status',
      operator: 'equals',
      value: 'challenge',
    },
    text: `c) o acolhimento da impugnação ao valor da causa, determinando-se a retificação de ofício para abarcar a soma do suposto indébito trienal retroativo e doze parcelas vincendas das diferenças controvertidas, intimando-se a parte para a complementação das custas, sob pena de cancelamento da distribuição;`,
  },
  {
    key: 'req_petition_aptitude',
    label: 'd) Inépcia da Petição Inicial',
    order: 40,
    contentType: 'conditional',
    condition: {
      field: 'petition_aptitude_status',
      operator: 'equals',
      value: 'challenge',
    },
    text: `d) o acolhimento da preliminar de inépcia da petição inicial, extinguindo-se o feito sem resolução do mérito (artigos 330, § 2º, e 485, inciso I, do CPC) ante a ausência de quantificação do valor incontroverso e discriminação exata das obrigações impugnadas;`,
  },
  {
    key: 'req_prescription_triennial',
    label: 'e) Prejudicial de Prescrição Trienal (Tema 610/STJ)',
    order: 50,
    contentType: 'conditional',
    condition: {
      field: 'prescription_triennial_status',
      operator: 'equals',
      value: 'argue',
    },
    text: `e) o acolhimento e a decretação da prescrição trienal, sob a égide vinculante do Tema Repetitivo 610 do Superior Tribunal de Justiça (artigo 206, § 3º, inciso IV, do Código Civil), extinguindo-se com resolução do mérito a pretensão de restituição pecuniária atinente a todas as parcelas faturadas no triênio precedente à distribuição da demanda;`,
  },
  {
    key: 'req_prescription_decennial',
    label: 'f) Prejudicial de Prescrição Decenal (Art. 205 CC)',
    order: 60,
    contentType: 'conditional',
    condition: {
      field: 'prescription_decennial_status',
      operator: 'equals',
      value: 'argue',
    },
    text: `f) a decretação da prescrição decenal da pretensão de revisão de cláusulas contratuais, limitando-se os efeitos de eventual e remota procedência estritamente ao período não atingido por esta prescrição ordinária, obstando-se que o recálculo da metodologia financeira retroceda além do decênio legal (art. 205 do Código Civil);`,
  },
  {
    key: 'req_merits_head',
    label: 'g) Mérito: Total Improcedência da Demanda',
    order: 70,
    contentType: 'permanent',
    text: `g) o julgamento de total improcedência dos pedidos formulados na petição inicial, extinguindo-se o feito com resolução de mérito, com fulcro no artigo 487, inciso I, do Código de Processo Civil, a fim de:`,
  },
  {
    key: 'req_merits_pme_validity',
    label: 'g.1) Validade Material do Contrato PME e Rejeição de Falso Coletivo',
    order: 71,
    contentType: 'permanent',
    text: `   g.1) declarar a validade material e a higidez do contrato Coletivo Empresarial (PME), rechaçando a inaplicável tese de "falso coletivo" e repelindo a pretensão de transmutação contratual e de equiparação forçada aos limitadores de reajuste de planos individuais da ANS, em respeito à autonomia da vontade e ao recente REsp nº 2.233.632/SP do STJ;`,
  },
  {
    key: 'req_merits_pru_legality',
    label: 'g.2) Reconhecimento da Legalidade Atuarial do PRU',
    order: 72,
    contentType: 'permanent',
    text: `   g.2) reconhecer a estrita legalidade, a base atuarial e a exatidão matemática dos reajustes técnicos anuais (Percentual de Reajuste Único - PRU) decorrentes do agrupamento compulsório de contratos (pool de risco), com base na Variação de Custos Médico-Hospitalares (VCMH) e na sinistralidade linear, por traduzirem imperativo técnico estatuído pelos artigos 37 e 38 da RN nº 565/2022 da ANS;`,
  },
  {
    key: 'req_merits_repetition',
    label: 'g.3) Rechaço ao Pleito de Repetição de Indébito',
    order: 73,
    contentType: 'conditional',
    condition: {
      field: 'is_repetition_claimed',
      operator: 'equals',
      value: true,
    },
    text: `   g.3) rechaçar o pleito de repetição de indébito, haja vista a manifesta ausência de abusividade ou cobrança indevida (art. 188, I, do Código Civil), atestando-se, subsidiariamente, o exercício regular de direito consubstanciado na aplicação de cláusulas contratuais e normas regulatórias;`,
  },
  {
    key: 'req_merits_moral_damages',
    label: 'g.4) Rejeição do Pleito de Danos Morais',
    order: 74,
    contentType: 'conditional',
    condition: {
      field: 'moral_damages_status',
      operator: 'equals',
      value: 'claimed',
    },
    text: `   g.4) rejeitar o pleito de compensação pecuniária por danos morais, declarando-se a inexistência de ato ilícito, de falha na prestação do serviço ou de dano moral in re ipsa, diante do lídimo e documentado exercício regular de direito da credora, ora contestante (artigo 188, inciso I, do Código Civil);`,
  },
  {
    key: 'req_selic',
    label: 'h) Incidência Exclusiva da Taxa Selic (Tema 1.368/STJ)',
    order: 80,
    contentType: 'permanent',
    text: `h) a aplicação das disposições da Lei nº 14.905/2024 e do entendimento vinculante do STJ no Tema 1.368 para os consectários legais, o que se admite apenas pelo princípio da eventualidade, em caráter subsidiário, determinando-se a incidência exclusiva e não cumulativa da Taxa Selic no período anterior à novel legislação civil.`,
  },
  {
    key: 'req_provas',
    label: 'i) Meios de Prova: Emprestada e Pericial Atuarial Subsidiária',
    order: 90,
    contentType: 'permanent',
    text: `i) o deferimento da produção de todos os meios de prova em direito admitidos, requerendo, destacadamente:
   i.1) a admissão, o recebimento e o amplo aproveitamento como prova emprestada (art. 372 do CPC) do irretocável Laudo Pericial Contábil-Atuarial validado nos autos da ação paradigmática nº 1031894-75.2017.8.26.0100 (bem como de suas sentenças e acórdãos correlatos), cujo exame exauriente in loco atesta de forma definitiva a idoneidade das bases de dados, das auditorias (KPMG e Deloitte) e a exatidão na apuração do PRU pela SulAmérica nos contratos corporativos PME, servindo como fato impeditivo inconteste do direito pleiteado;
   i.2) a produção de prova pericial técnico-atuarial formal, em caráter subsidiário, caso configurada a convicção deste juízo pela dilação probatória originária nestes autos, a ser conduzida obrigatoriamente por perito oficial cadastrado e registrado junto ao IBA (Instituto Brasileiro de Atuários), mediante diligência in loco ou via sistemas parametrizados na sede da operadora, rito indispensável para a verificação fidedigna do VCMH e da sinistralidade;`,
  },
  {
    key: 'req_prequestionamento',
    label: 'j) Prequestionamento Expresso',
    order: 100,
    contentType: 'permanent',
    text: `j) a manifestação explícita e fundamentada deste respeitável juízo, para fins de prequestionamento, acerca dos dispositivos constitucionais, legais, processuais e regulatórios invocados ao longo da defesa, afastando-se qualquer alegação futura de negativa de prestação jurisdicional;`,
  },
  {
    key: 'req_sucumbencia',
    label: 'k) Condenação em Custas e Honorários de Sucumbência',
    order: 110,
    contentType: 'permanent',
    text: `k) a condenação integral da empresa demandante ao pagamento das custas processuais, despesas periciais e dos honorários advocatícios de sucumbência em favor dos patronos desta operadora, calculados sobre o valor atualizado da causa; e`,
  },
  {
    key: 'req_publicacoes',
    label: 'l) Publicações Exclusivas em Nome do Patrono Principal',
    order: 120,
    contentType: 'permanent',
    text: `l) a veiculação de todas as publicações, intimações e notificações de estilo vinculadas ao presente feito em nome do patrono da contestante, Dr. José Antônio Martins, {{ADVOGADO_OAB_ESPECIFICA}}, sob pena de nulidade absoluta.`,
  },
];
