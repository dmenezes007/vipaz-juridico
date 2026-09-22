import React from 'react';
import { ArrowRight, Check, FileText, Layers3, Library, Radar, Send, Sparkles } from 'lucide-react';

interface LandingPageProps { onNavigate: (path: string) => void; }

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const modules = [
    ['Matters','Organize casos e contexto.',Layers3],
    ['Monitor','Acompanhe o que exige atenção.',Radar],
    ['Studio','Estruture e produza peças.',Sparkles],
    ['Delivery','Conclua e entregue documentos.',Send],
    ['Library','Preserve conhecimento validado.',Library],
  ] as const;
  return (
    <div className="min-h-screen bg-[#080b10] text-white selection:bg-cyan-300/20">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.06] bg-[#080b10]/80 backdrop-blur-xl">
        <div className="mx-auto h-[72px] max-w-[1320px] px-6 lg:px-10 flex items-center justify-between">
          <button onClick={()=>onNavigate('/')} className="flex items-baseline gap-2"><span className="font-editorial text-[22px] font-bold tracking-tight">VIPAZ</span><span className="text-[11px] text-cyan-300">Jurídico</span></button>
          <div className="flex items-center gap-3">
            <button onClick={()=>onNavigate('/login')} className="px-3 py-2 text-[12px] text-white/60 hover:text-white transition">Entrar</button>
            <button onClick={()=>onNavigate('/login')} className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black hover:bg-white/90 transition">Acessar plataforma</button>
          </div>
        </div>
      </header>

      <main>
        <section className="min-h-[86vh] pt-40 pb-24 px-6 flex items-center">
          <div className="mx-auto max-w-[1180px] w-full grid lg:grid-cols-12 gap-14 items-end">
            <div className="lg:col-span-8">
              <div className="mb-7 text-[11px] uppercase tracking-[.18em] text-cyan-300">Produção jurídica estruturada</div>
              <h1 className="max-w-[900px] text-[clamp(3.3rem,7.3vw,7.2rem)] leading-[.91] tracking-[-.055em] font-semibold">
                Do caso ao documento.
                <span className="block text-white/35">Com método.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <p className="text-[15px] leading-7 text-white/55 max-w-sm">Transforme informações processuais, estratégia e conhecimento validado em documentos consistentes, editáveis e prontos para revisão profissional.</p>
              <button onClick={()=>onNavigate('/login')} className="mt-8 inline-flex items-center gap-3 text-[13px] font-semibold group">Começar agora <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition"><ArrowRight className="w-4 h-4"/></span></button>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[.07] px-6">
          <div className="mx-auto max-w-[1180px] py-20">
            <div className="grid md:grid-cols-4 gap-px bg-white/[.08] border border-white/[.08] rounded-2xl overflow-hidden">
              {['Caso','Estratégia','Estrutura','Documento'].map((item,i)=><div key={item} className="bg-[#080b10] p-7 min-h-36 flex flex-col justify-between"><span className="text-[11px] text-white/25">0{i+1}</span><div className="text-[17px] font-medium">{item}</div></div>)}
            </div>
          </div>
        </section>

        <section className="px-6 py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid lg:grid-cols-12 gap-12 mb-16">
              <h2 className="lg:col-span-7 text-4xl sm:text-5xl tracking-[-.04em] font-semibold">Um sistema jurídico.<br/><span className="text-white/35">Cinco módulos.</span></h2>
              <p className="lg:col-span-4 lg:col-start-9 text-sm leading-6 text-white/45">Uma experiência contínua para organizar trabalho, aplicar método e preservar conhecimento institucional.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 border-t border-white/10">
              {modules.map(([name,desc,Icon])=><div key={name} className="py-7 lg:px-5 lg:first:pl-0 border-b lg:border-b-0 lg:border-r last:border-r-0 border-white/10"><Icon className="w-4 h-4 text-cyan-300 mb-12"/><h3 className="text-[15px] font-semibold">{name}</h3><p className="mt-2 text-[12px] leading-5 text-white/40">{desc}</p></div>)}
            </div>
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-[1180px] rounded-[28px] bg-[#0d1118] border border-white/[.07] p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-14">
            <div><FileText className="w-5 h-5 text-cyan-300 mb-8"/><h2 className="text-3xl sm:text-4xl tracking-[-.035em] font-semibold">Tecnologia sem tirar o advogado do centro.</h2></div>
            <div className="space-y-5 text-[13px] text-white/50">
              {['Arquiteturas e modelos jurídicos validados.','Automação determinística para decisões estruturais.','Inteligência artificial como recurso opcional e assistido.','Resultado editável antes da entrega final.'].map(x=><div key={x} className="flex gap-3 border-b border-white/[.07] pb-5"><Check className="w-4 h-4 text-cyan-300 shrink-0"/><span>{x}</span></div>)}
            </div>
          </div>
        </section>

        <section className="px-6 py-28 border-t border-white/[.07] text-center">
          <h2 className="text-4xl sm:text-6xl tracking-[-.05em] font-semibold">Produza com estrutura.<br/><span className="text-white/35">Revise com controle.</span></h2>
          <button onClick={()=>onNavigate('/login')} className="mt-10 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black">Acessar VIPAZ Jurídico</button>
        </section>
      </main>
      <footer className="border-t border-white/[.07] px-6 py-8 text-[11px] text-white/30"><div className="mx-auto max-w-[1180px] flex justify-between"><span>VIPAZ Jurídico</span><span>© {new Date().getFullYear()}</span></div></footer>
    </div>
  );
};