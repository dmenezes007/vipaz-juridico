import React from 'react';
import {
  ArrowRight,
  Shield,
  FileCheck2,
  Cpu,
  Layers,
  CheckCircle2,
  FileText,
  Lock,
  Workflow,
  Search,
  BookOpen,
  Scale,
  Sparkles,
  ChevronRight,
  Database,
  ArrowDown,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const methodSteps = [
    {
      num: '01',
      title: 'Compreender',
      desc: 'Leitura e estruturação do contexto processual integral e atos judiciais.',
    },
    {
      num: '02',
      title: 'Organizar',
      desc: 'Identificação de partes, pedidos, decisões, documentos e cronologia fática.',
    },
    {
      num: '03',
      title: 'Estruturar',
      desc: 'Aplicação da arquitetura jurídica correspondente ao tipo exato da peça.',
    },
    {
      num: '04',
      title: 'Argumentar',
      desc: 'Seleção e desenvolvimento das teses pertinentes e jurisprudência vinculante.',
    },
    {
      num: '05',
      title: 'Gerar',
      desc: 'Produção assistida por inteligência artificial generativa com contexto restrito.',
    },
    {
      num: '06',
      title: 'Revisar',
      desc: 'Controle rigoroso de consistência, evidências dos autos e aderência ao modelo.',
    },
    {
      num: '07',
      title: 'Entregar',
      desc: 'Documento profissional homologado pronto para revisão final do advogado.',
    },
  ];

  const problemCards = [
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      title: 'Volume Documental Crítico',
      desc: 'Centenas de páginas por processo que sobrecarregam a equipe com triagens mecânicas.',
    },
    {
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      title: 'Leitura e Mineração Morosa',
      desc: 'Tempo precioso de advogados seniores consumido na localização de decisões e contratos.',
    },
    {
      icon: <Workflow className="w-5 h-5 text-cyan-400" />,
      title: 'Repetição Operacional',
      desc: 'Elaboração repetitiva de argumentos conhecidos sem inteligência de contexto prévia.',
    },
    {
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      title: 'Dispersão de Modelos',
      desc: 'Risco de desvios dos padrões técnicos homologados e perda de controle da tese do escritório.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* 8. HEADER DA LANDING PAGE */}
      <header className="sticky top-0 z-40 bg-[#070C18]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                VIPAZ
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400 font-sans border-l border-slate-700 pl-2.5">
                Jurídico
              </span>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#metodo" className="hover:text-cyan-400 transition">
              Método
            </a>
            <a href="#como-funciona" className="hover:text-cyan-400 transition">
              Como funciona
            </a>
            <a href="#seguranca" className="hover:text-cyan-400 transition">
              Segurança
            </a>
            <a href="#plataforma" className="hover:text-cyan-400 transition">
              Plataforma
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
            >
              Entrar
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50 transition tracking-wide"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 9. HERO SECTION */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden border-b border-slate-800/60">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F172A_1px,transparent_1px),linear-gradient(to_bottom,#0F172A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-[11px] font-mono-tech tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIPAZ JURÍDICO • SAAS LEGALTECH B2B</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto font-sans leading-[1.15]">
            Produção jurídica de alta performance, potencializada por IA.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            O VIPAZ Jurídico combina automação, inteligência artificial generativa, contexto processual e modelos jurídicos validados para transformar informação em peças estruturadas, consistentes e prontas para revisão profissional.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-xl shadow-cyan-900/30 tracking-wide font-sans cursor-pointer"
            >
              <span>COMEÇAR AGORA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#metodo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-medium border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 transition"
            >
              <span>Conheça o método</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Abstract Visual Pipeline: PROCESSO → CONTEXTO → ESTRATÉGIA → REDAÇÃO → REVISÃO → DOCUMENTO */}
          <div className="pt-16 max-w-4xl mx-auto">
            <div className="text-[11px] font-mono-tech uppercase text-slate-500 tracking-widest mb-4">
              FLUXO ESTRUTURADO DE PRODUÇÃO
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              {[
                { step: 'PROCESSO', detail: 'Entrada integral' },
                { step: 'CONTEXTO', detail: 'Extração factual' },
                { step: 'ESTRATÉGIA', detail: 'Mapeamento teses' },
                { step: 'REDAÇÃO', detail: 'IA assistida' },
                { step: 'REVISÃO', detail: 'Controle de modelo' },
                { step: 'DOCUMENTO', detail: 'Peça homologada' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative p-3 rounded-lg bg-[#0B1222] border border-slate-800/80 text-left flex flex-col justify-between"
                >
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-semibold">
                    0{index + 1}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-200 tracking-wide">
                    {item.step}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. SEÇÃO — O PROBLEMA */}
      <section className="py-24 px-6 border-b border-slate-800/60 bg-[#090F1E]/60">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="max-w-2xl">
            <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest font-medium">
              CENÁRIO OPERACIONAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
              Os desafios crônicos da produção jurídica em escala
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Escritórios e procuradorias enfrentam demandas repetitivas sem ferramentas que garantam coerência atuarial, aderência a modelos validados e rigor técnico.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemCards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#0B1325] border border-slate-800/80 hover:border-slate-700 transition space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. SEÇÃO — MÉTODO VIPAZ */}
      <section id="metodo" className="py-24 px-6 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest font-medium">
              METODOLOGIA DE ALTA PERFORMANCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              O Método VIPAZ Jurídico
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Um sistema integrado em 7 etapas que une engenharia de contexto e modelos homologados para assegurar precisão técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methodSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#090F1E] border border-slate-800 hover:border-cyan-500/40 transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono-tech font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/20">
                    {step.num}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-tech">
                    ETAPA VALIDADA
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}

            {/* Final Highlight Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#0B152B] to-[#070D1B] border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono-tech text-emerald-400 uppercase tracking-wider font-semibold">
                  RESULTADO HOMOLOGADO
                </span>
                <h3 className="text-base font-semibold text-slate-100 mt-2">
                  Documento Forense Profissional
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Peças consistentes com o repositório institucional do cliente e prontas para assinatura do advogado responsável.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero alucinações de precedentes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. SEÇÃO — IA COM CONTEXTO */}
      <section id="como-funciona" className="py-24 px-6 border-b border-slate-800/60 bg-[#080E1C]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest font-medium">
              ENGENHARIA DE CONTEXTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              “Não basta gerar. É preciso compreender.”
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              O VIPAZ Jurídico não despacha um PDF bruto para um modelo generativo genérico. Nossa plataforma extrai o núcleo fático dos autos, submete os pontos controvertidos às teses vinculantes e respeita estritamente o modelo do escritório.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Estruturação metodológica do acervo probatório do processo eletrônico</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Isolamento da controvérsia antes de qualquer inferência generativa</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Aplicação estrita de modelos homologados por sócios e gestores de matéria</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Auditoria pós-geração com checagem de pedidos e fundamentos</span>
              </li>
            </ul>
          </div>

          {/* Interactive Flow Visualizer */}
          <div className="lg:col-span-6 bg-[#0B1325] border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
              <span>PIPELINE CONTEXTUAL</span>
              <span className="text-cyan-400">DESACOPLADO & SEGURO</span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'PDF PROCESSUAL', detail: 'Upload seguro em storage isolado por tenant' },
                { title: 'ESTRUTURA DO CASO', detail: 'Extração de pedidos, decisões interlocutórias e cronologia' },
                { title: 'ARQUITETURA JURÍDICA', detail: 'Definição de preliminares e mérito cabível' },
                { title: 'INTELIGÊNCIA GENERATIVA', detail: 'Redação contextual assistida por IA sob regras estritas' },
                { title: 'REVISÃO & CONTROLE', detail: 'Auditoria de aderência ao modelo validado' },
                { title: 'DOCUMENTO DOCX / PDF', detail: 'Saída formatada em padrão forense com signed URLs' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{step.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{step.detail}</div>
                  </div>
                  <span className="font-mono-tech text-[10px] text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/20">
                    NÍVEL 0{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 13. SEÇÃO — CONTROLE PROFISSIONAL */}
      <section id="seguranca" className="py-24 px-6 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest font-medium">
              GOVERNANÇA & SEGURANÇA B2B
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              A tecnologia potencializa a atuação profissional. A decisão jurídica permanece humana.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              O VIPAZ Jurídico foi projetado para assegurar compliance estrito com a LGPD, sigilo profissional e isolamento corporativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#090F1E] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Multi-Tenant com Row Level Security
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada escritório possui seus dados, documentos e modelos totalmente segregados no banco de dados, sem qualquer compartilhamento indevido.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#090F1E] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Controle Central de Modelos
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As peças geradas respeitam rigorosamente os modelos institucionais homologados pelos sócios, preservando a identidade jurídica do escritório.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#090F1E] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Rastreabilidade e Auditoria
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Histórico completo de jobs, responsáveis pelo upload, etapas percorridas e versões finais baixadas com registro temporal de eventos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. CTA FINAL */}
      <section id="plataforma" className="py-24 px-6 bg-gradient-to-b from-[#070C18] to-[#0A1224] text-center border-b border-slate-800/80">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Transforme contexto em produção jurídica.
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experimente a plataforma B2B concebida para elevar a produtividade e a consistência técnica das bancas mais exigentes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/login')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-xl shadow-cyan-950/60 tracking-wider font-sans"
            >
              <span>COMEÇAR AGORA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 15. FOOTER */}
      <footer className="py-12 px-6 bg-[#060A14] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-editorial text-lg font-bold text-slate-200">
                VIPAZ
              </span>
              <span className="text-[10px] uppercase font-semibold text-cyan-400">
                Jurídico
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Automação e Inteligência Artificial para produção jurídica de alta performance.
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button className="hover:text-slate-200 transition">Privacidade</button>
            <button className="hover:text-slate-200 transition">Termos de Uso</button>
            <button className="hover:text-slate-200 transition">Segurança</button>
            <button className="hover:text-slate-200 transition">Contato</button>
          </div>

          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} VIPAZ Jurídico. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
