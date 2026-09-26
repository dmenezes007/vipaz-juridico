import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCheck2,
  FileText,
  Files,
  Layers3,
  Library,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

interface LandingPageProps { onNavigate: (path: string) => void; }

const journey = [
  {
    name: 'Contexto',
    eyebrow: '01 · Compreender',
    title: 'Reúna autos e documentos que realmente importam.',
    text: 'Envie os autos em PDF e acrescente outros documentos que possam contribuir para a análise: contratos, pareceres, normas, comunicações, documentos técnicos e demais subsídios relevantes.',
    detail: 'O trabalho não começa em uma página em branco. Começa com um conjunto documental organizado, rastreável e preparado para análise.',
    icon: Files,
  },
  {
    name: 'Estratégia',
    eyebrow: '02 · Decidir',
    title: 'Transforme contexto em escolhas jurídicas fundamentadas.',
    text: 'A inteligência do sistema estrutura fatos, evidências, controvérsias e questões jurídicas para apoiar a seleção das teses e dos caminhos de atuação pertinentes ao caso.',
    detail: 'A tecnologia apoia a decisão sem retirar do profissional a responsabilidade pela análise e pela revisão.',
    icon: Workflow,
  },
  {
    name: 'Estrutura',
    eyebrow: '03 · Organizar',
    title: 'Monte uma arquitetura jurídica coerente e auditável.',
    text: 'Conhecimento institucional, modelos validados e conteúdo individualizado são combinados em uma estrutura revisável antes da produção do documento.',
    detail: 'Você acompanha a lógica da peça antes de transformar a estratégia em texto final.',
    icon: Layers3,
  },
  {
    name: 'Documento',
    eyebrow: '04 · Produzir',
    title: 'Produza, revise e entregue com controle.',
    text: 'A estrutura aprovada é transformada em documento editável, preservando a lógica jurídica, as fontes utilizadas e os pontos que exigem revisão profissional.',
    detail: 'Da análise ao documento final, o processo mantém rastreabilidade e espaço para intervenção humana.',
    icon: FileCheck2,
  },
] as const;

const modules = [
  {name:'Matters',desc:'Organize casos, partes, documentos e contexto em um espaço de trabalho único.',verb:'Organizar',icon:Layers3},
  {name:'Monitor',desc:'Acompanhe eventos, pendências e sinais que exigem atenção jurídica.',verb:'Acompanhar',icon:Radar},
  {name:'Studio',desc:'Estruture e produza peças jurídicas com regras, modelos e assistência de IA.',verb:'Produzir',icon:Sparkles},
  {name:'Delivery',desc:'Conclua, versione e disponibilize documentos prontos para uso.',verb:'Entregar',icon:Send},
  {name:'Library',desc:'Preserve modelos, blocos e conhecimento jurídico institucional validado.',verb:'Preservar',icon:Library},
] as const;

const documentTypes = [
  'Contestações e recursos',
  'Pareceres e manifestações',
  'Ofícios e respostas institucionais',
  'Documentos de procuradorias',
  'Peças da Administração Pública',
  'Outros documentos jurídicos',
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeStep,setActiveStep]=useState(0);
  const [activeModule,setActiveModule]=useState(2);
  const [autoPlay,setAutoPlay]=useState(true);

  useEffect(()=>{
    if(!autoPlay) return;
    const timer=window.setInterval(()=>setActiveStep(step=>(step+1)%journey.length),5200);
    return ()=>window.clearInterval(timer);
  },[autoPlay]);

  const step=journey[activeStep];
  const StepIcon=step.icon;

  return (
    <div className="min-h-screen bg-[#080b10] text-white selection:bg-cyan-300/20">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.06] bg-[#080b10]/85 backdrop-blur-xl">
        <div className="mx-auto h-[72px] max-w-[1320px] px-6 lg:px-10 flex items-center justify-between">
          <button onClick={()=>onNavigate('/')} className="flex items-baseline gap-2"><span className="font-editorial text-[22px] font-bold tracking-tight">VIPAZ</span><span className="text-[11px] text-cyan-300">Jurídico</span></button>
          <div className="flex items-center gap-3">
            <button onClick={()=>onNavigate('/login')} className="px-3 py-2 text-[12px] text-white/60 hover:text-white transition">Entrar</button>
            <button onClick={()=>onNavigate('/login')} className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black hover:bg-cyan-100 transition">Acessar plataforma</button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-40 pb-20 px-6">
          <div className="mx-auto max-w-[1180px] grid lg:grid-cols-12 gap-14 items-end">
            <div className="lg:col-span-8">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[.04] px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-cyan-300"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse"/>Inteligência estratégica · produção jurídica · governança</div>
              <h1 className="max-w-[900px] text-[clamp(3.3rem,7.3vw,7.2rem)] leading-[.91] tracking-[-.055em] font-semibold">Inteligência para decidir.<br/><span className="text-white/35">Produção para agir.</span></h1>
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <p className="text-[15px] leading-7 text-white/55 max-w-sm">O VIPAZ conecta inteligência estratégica, produção jurídica orientada, gestão otimizada de dados e conhecimento institucional — com tecnologia sob governança e o advogado no centro das decisões.</p>
              <button onClick={()=>onNavigate('/login')} className="mt-8 inline-flex items-center gap-3 text-[13px] font-semibold group">Conhecer a plataforma <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition"><ArrowRight className="w-4 h-4"/></span></button>
            </div>
          </div>

          <div className="mx-auto max-w-[1180px] mt-20 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[.07] bg-white/[.07]">
            {[['01','Inteligência estratégica'],['02','Produção orientada'],['03','Dados governados'],['04','Advogado no centro']].map(([n,label])=><div key={n} className="bg-[#0a0e14] px-5 py-4 flex items-center gap-3"><span className="text-[10px] font-mono text-cyan-300/70">{n}</span><span className="text-[11px] text-white/55">{label}</span></div>)}
          </div>
        </section>

        <section className="border-y border-white/[.07] px-6 py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div><div className="text-[10px] uppercase tracking-[.18em] text-cyan-300 mb-3">Base documental</div><h2 className="text-3xl sm:text-4xl tracking-[-.035em] font-semibold">Não é só o processo. É o contexto necessário para produzir a peça.</h2></div>
              <p className="max-w-md text-[13px] leading-6 text-white/40">Além dos autos em PDF, o fluxo pode considerar documentos complementares em PDF que ajudem a compreender o caso e construir o documento jurídico.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-white/[.08] border border-white/[.08] rounded-2xl overflow-hidden">
              <div className="bg-[#0d1118] p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] grid place-items-center"><FileText className="w-5 h-5 text-cyan-300"/></div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-.025em]">Autos e documentos do caso</h3>
                <p className="mt-3 text-[13px] leading-6 text-white/45">O material principal que registra a demanda, seus fatos, pedidos, manifestações e decisões existentes.</p>
              </div>
              <div className="bg-[#0d1118] p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] grid place-items-center"><Files className="w-5 h-5 text-cyan-300"/></div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-.025em]">Documentos complementares em PDF</h3>
                <p className="mt-3 text-[13px] leading-6 text-white/45">Contratos, pareceres, normas, documentos técnicos, comunicações e outros subsídios que possam contribuir para a melhor produção jurídica.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 border-y border-white/[.07]">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-3xl">
              <div className="text-[10px] uppercase tracking-[.18em] text-cyan-300 mb-3">Arquitetura de valor</div>
              <h2 className="text-3xl sm:text-5xl tracking-[-.04em] font-semibold">Não é apenas IA. É uma camada de inteligência sobre a operação jurídica.</h2>
              <p className="mt-5 max-w-2xl text-[13px] leading-6 text-white/40">O VIPAZ foi concebido para organizar a informação antes de transformá-la em ação: dados contextualizados, inteligência estratégica, produção orientada e governança profissional em um mesmo fluxo.</p>
            </div>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[.08] border border-white/[.08] rounded-2xl overflow-hidden">
              <div key="01" className="bg-[#0d1118] p-7">
                <span className="text-[10px] font-mono text-cyan-300/70">01</span>
                <h3 className="mt-8 text-[16px] font-semibold">Inteligência estratégica</h3>
                <p className="mt-3 text-[12px] leading-5 text-white/40">Fatos, evidências, controvérsias e questões jurídicas estruturados para apoiar decisões.</p>
              </div><div key="02" className="bg-[#0d1118] p-7">
                <span className="text-[10px] font-mono text-cyan-300/70">02</span>
                <h3 className="mt-8 text-[16px] font-semibold">Produção orientada</h3>
                <p className="mt-3 text-[12px] leading-5 text-white/40">Teses, arquiteturas e documentos construídos a partir do contexto e do conhecimento validado.</p>
              </div><div key="03" className="bg-[#0d1118] p-7">
                <span className="text-[10px] font-mono text-cyan-300/70">03</span>
                <h3 className="mt-8 text-[16px] font-semibold">Dados governados</h3>
                <p className="mt-3 text-[12px] leading-5 text-white/40">Fontes, documentos, eventos e histórico organizados para reduzir ruído e preservar rastreabilidade.</p>
              </div><div key="04" className="bg-[#0d1118] p-7">
                <span className="text-[10px] font-mono text-cyan-300/70">04</span>
                <h3 className="mt-8 text-[16px] font-semibold">Governança profissional</h3>
                <p className="mt-3 text-[12px] leading-5 text-white/40">IA assistida, revisão humana e pontos de controle explícitos antes da decisão e da entrega.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
              <div><div className="text-[10px] uppercase tracking-[.18em] text-cyan-300 mb-3">Produção jurídica</div><h2 className="text-3xl sm:text-4xl tracking-[-.035em] font-semibold">Para além da peça forense.</h2></div>
              <p className="max-w-lg text-[13px] leading-6 text-white/40">A mesma inteligência de produção pode apoiar documentos destinados ao Judiciário, à advocacia consultiva, às procuradorias e à Administração Pública.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {documentTypes.map(type=><span key={type} className="rounded-full border border-white/[.09] bg-white/[.025] px-4 py-2.5 text-[11px] text-white/55">{type}</span>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[.07] px-6 py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div><div className="text-[10px] uppercase tracking-[.18em] text-cyan-300 mb-3">Fluxo de produção</div><h2 className="text-3xl sm:text-4xl tracking-[-.035em] font-semibold">Entenda como o VIPAZ trabalha.</h2></div>
              <p className="max-w-md text-[13px] leading-6 text-white/40">O sistema organiza o trabalho e acelera o que é repetitivo; o profissional define, revisa e valida o que importa.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-px bg-white/[.08] border border-white/[.08] rounded-2xl overflow-hidden">
              {journey.map((item,i)=><button key={item.name} onClick={()=>{setActiveStep(i);setAutoPlay(false)}} className={`group text-left p-6 min-h-32 flex flex-col justify-between transition ${activeStep===i?'bg-cyan-300/[.08]':'bg-[#080b10] hover:bg-white/[.025]'}`}><div className="flex justify-between"><span className={`text-[10px] font-mono ${activeStep===i?'text-cyan-300':'text-white/25'}`}>0{i+1}</span>{activeStep===i&&<span className="h-1.5 w-1.5 rounded-full bg-cyan-300"/>}</div><div className="flex items-center justify-between"><span className="text-[16px] font-medium">{item.name}</span><ChevronRight className={`w-4 h-4 transition ${activeStep===i?'text-cyan-300 translate-x-0':'text-white/15 -translate-x-1 group-hover:translate-x-0'}`}/></div></button>)}
            </div>
            <div className="mt-5 rounded-2xl border border-white/[.08] bg-[#0d1118] p-7 md:p-9 grid md:grid-cols-12 gap-8 min-h-[250px]">
              <div className="md:col-span-2"><div className="w-11 h-11 rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] grid place-items-center"><StepIcon className="w-5 h-5 text-cyan-300"/></div></div>
              <div className="md:col-span-6"><div className="text-[10px] uppercase tracking-[.16em] text-cyan-300 mb-3">{step.eyebrow}</div><h3 className="text-2xl sm:text-3xl font-semibold tracking-[-.03em]">{step.title}</h3><p className="mt-4 max-w-xl text-[13px] leading-6 text-white/50">{step.text}</p></div>
              <div className="md:col-span-4 md:border-l border-white/[.08] md:pl-8 flex flex-col justify-between"><p className="text-[12px] leading-6 text-white/40">{step.detail}</p><button onClick={()=>onNavigate('/login')} className="mt-6 inline-flex items-center gap-2 text-[12px] text-white/70 hover:text-cyan-300 transition">Conhecer na plataforma <ArrowRight className="w-3.5 h-3.5"/></button></div>
            </div>
          </div>
        </section>

        <section className="px-6 py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid lg:grid-cols-12 gap-12 mb-14">
              <h2 className="lg:col-span-7 text-4xl sm:text-5xl tracking-[-.04em] font-semibold">Uma operação jurídica conectada.<br/><span className="text-white/35">Cinco módulos, uma inteligência.</span></h2>
              <p className="lg:col-span-4 lg:col-start-9 text-sm leading-6 text-white/45">Cada módulo resolve uma parte da operação. Juntos, eles formam um fluxo contínuo de contexto, inteligência, produção, entrega e conhecimento.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-y border-white/10">
              {modules.map((item,i)=>{const Icon=item.icon;const active=activeModule===i;return <button key={item.name} onMouseEnter={()=>setActiveModule(i)} onFocus={()=>setActiveModule(i)} onClick={()=>setActiveModule(i)} className={`text-left py-7 px-5 first:pl-0 border-b lg:border-b-0 lg:border-r last:border-r-0 border-white/10 transition ${active?'bg-white/[.025]':''}`}><div className="flex justify-between items-start"><Icon className={`w-4 h-4 mb-10 ${active?'text-cyan-300':'text-white/35'}`}/><span className="text-[9px] uppercase tracking-wider text-white/20">{item.verb}</span></div><h3 className="text-[15px] font-semibold">{item.name}</h3><p className={`mt-2 text-[12px] leading-5 transition ${active?'text-white/60':'text-white/35'}`}>{item.desc}</p></button>})}
            </div>
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-[1180px] rounded-[28px] bg-[#0d1118] border border-white/[.07] p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-14">
            <div><ShieldCheck className="w-5 h-5 text-cyan-300 mb-8"/><div className="text-[10px] uppercase tracking-[.16em] text-white/30 mb-3">Controle profissional</div><h2 className="text-3xl sm:text-4xl tracking-[-.035em] font-semibold">Governança centrada no advogado.</h2><p className="mt-5 text-[13px] leading-6 text-white/40 max-w-md">A tecnologia organiza dados, sugere caminhos e acelera a produção. A decisão jurídica permanece explícita, revisável e sob responsabilidade profissional.</p></div>
            <div className="space-y-5 text-[13px] text-white/50">
              {['Contexto e dados com fontes identificáveis.','Inteligência estratégica orientada ao caso.','Produção jurídica assistida e editável.','Revisão e validação antes da entrega.','Conhecimento institucional governado e reutilizável.'].map((x,i)=><div key={x} className="group flex gap-4 border-b border-white/[.07] pb-5"><span className="text-[10px] font-mono text-white/20">0{i+1}</span><Check className="w-4 h-4 text-cyan-300 shrink-0"/><span className="group-hover:text-white/75 transition">{x}</span></div>)}
            </div>
          </div>
        </section>

        <section className="px-6 py-28 border-t border-white/[.07]">
          <div className="mx-auto max-w-[1180px] flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div><div className="text-[10px] uppercase tracking-[.18em] text-cyan-300 mb-4">VIPAZ Jurídico</div><h2 className="text-4xl sm:text-6xl tracking-[-.05em] font-semibold">Dados em contexto.<br/><span className="text-white/35">Estratégia em ação.</span></h2></div>
            <div className="max-w-sm"><p className="text-[13px] leading-6 text-white/45">Organize a operação jurídica, transforme informação em inteligência e conduza cada produção com rastreabilidade, revisão e controle.</p><button onClick={()=>onNavigate('/login')} className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black hover:bg-cyan-100 transition">Acessar VIPAZ Jurídico <ArrowRight className="w-4 h-4"/></button></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/[.07] px-6 py-8 text-[11px] text-white/30"><div className="mx-auto max-w-[1180px] flex justify-between"><span>VIPAZ Jurídico · Inteligência jurídica institucional</span><span>© {new Date().getFullYear()}</span></div></footer>
    </div>
  );
};
