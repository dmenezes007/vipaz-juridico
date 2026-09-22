import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { authService, AuthError } from '../services/authService';

interface LoginPageProps { onLoginSuccess: (tenantSlug: string) => void; onNavigateHome: () => void; initialErrorMessage?: string | null; }

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome, initialErrorMessage }) => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(initialErrorMessage||null);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!email.trim()||!password){setError('Informe e-mail e senha para continuar.');return;}setLoading(true);setError(null);try{const s=await authService.login(email,password);onLoginSuccess(s.organization.slug);}catch(err){setError(err instanceof AuthError?err.message:'Não foi possível autenticar. Verifique suas credenciais.');}finally{setLoading(false);}};
  return <div className="min-h-screen bg-[#080b10] text-white grid lg:grid-cols-2">
    <section className="hidden lg:flex p-12 xl:p-16 flex-col justify-between border-r border-white/[.07]">
      <button onClick={onNavigateHome} className="w-fit font-editorial text-2xl font-bold">VIPAZ <span className="font-sans text-[11px] font-medium text-cyan-300">Jurídico</span></button>
      <div className="max-w-lg"><div className="text-[11px] uppercase tracking-[.18em] text-cyan-300 mb-7">Workspace jurídico</div><h1 className="text-5xl xl:text-6xl leading-[.98] tracking-[-.05em] font-semibold">Estrutura para pensar.<br/><span className="text-white/30">Controle para produzir.</span></h1></div>
      <div className="text-[11px] text-white/25">Ambiente profissional privado</div>
    </section>
    <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-[420px]">
        <button onClick={onNavigateHome} className="lg:hidden mb-12 inline-flex items-center gap-2 text-[12px] text-white/45"><ArrowLeft className="w-4 h-4"/>Voltar</button>
        <div className="mb-10"><h2 className="text-3xl tracking-[-.035em] font-semibold">Bem-vindo.</h2><p className="mt-2 text-[13px] text-white/40">Acesse seu ambiente de trabalho.</p></div>
        {error&&<div className="mb-5 flex gap-2 rounded-xl border border-red-400/20 bg-red-400/[.06] p-3 text-[12px] text-red-200"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}
        <form onSubmit={submit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-[11px] text-white/45">E-mail</span><input autoComplete="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full h-12 rounded-xl border border-white/10 bg-white/[.035] px-4 text-[13px] outline-none focus:border-cyan-300/60 transition" placeholder="nome@escritorio.com.br"/></label>
          <label className="block"><span className="mb-2 block text-[11px] text-white/45">Senha</span><input autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full h-12 rounded-xl border border-white/10 bg-white/[.035] px-4 text-[13px] outline-none focus:border-cyan-300/60 transition" placeholder="Sua senha"/></label>
          <button disabled={loading} className="w-full h-12 rounded-xl bg-white text-black text-[12px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50">{loading?'Entrando…':<>Entrar <ArrowRight className="w-4 h-4"/></>}</button>
        </form>
        <p className="mt-7 text-center text-[10px] leading-5 text-white/25">Acesso destinado a usuários autorizados.</p>
      </div>
    </section>
  </div>;
};