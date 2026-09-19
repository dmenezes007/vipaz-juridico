import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Check, AlertCircle, Sparkles } from 'lucide-react';
import { authService, SEED_PROFILES } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (tenantSlug: string) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('alexandre.castro@cawadvogados.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail corporativo.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const session = await authService.login(email, password, rememberMe);
      onLoginSuccess(session.organization.slug);
    } catch (err) {
      setErrorMessage('Não foi possível autenticar. Verifique suas credenciais de acesso.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('••••••••••••');
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      {/* Top bar back link */}
      <header className="p-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <span className="font-editorial text-2xl font-bold text-white group-hover:text-cyan-400 transition">
            VIPAZ
          </span>
          <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400 font-sans border-l border-slate-700 pl-2">
            Jurídico
          </span>
        </button>

        <span className="text-[11px] font-mono-tech text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Acesso Restrito B2B
        </span>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0B1325] border border-slate-800/90 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="space-y-1.5 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Entre na sua plataforma.
            </h1>
            <p className="text-xs text-slate-400">
              Produção jurídica de alta performance com IA contextual.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {forgotPasswordNotice && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 space-y-1">
              <div className="font-semibold">Recuperação de Acesso:</div>
              <div>As instruções foram enviadas para o administrador do tenant {email.includes('caw') ? 'CAW' : 'Invicta'}.</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@escritorio.adv.br"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-mono-tech"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Manter conectado</span>
              </label>

              <span className="text-[11px] text-slate-500 font-mono-tech">
                Supabase Auth RLS
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wider uppercase transition shadow-lg shadow-cyan-950/40 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Validando credenciais...</span>
              ) : (
                <>
                  <span>ENTRAR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo profiles */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider block text-center">
              ACESSOS HOMOLOGADOS PARA AVALIAÇÃO:
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => selectDemoUser(SEED_PROFILES[0].email)}
                className="w-full p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Dr. Alexandre Castro (CAW Advogados)
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono-tech">
                    alexandre.castro@cawadvogados.com.br
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Tenant 1
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectDemoUser(SEED_PROFILES[2].email)}
                className="w-full p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Dr. Roberto Siqueira (Invicta Gestão)
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono-tech">
                    roberto.siqueira@invicta.gov.br
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Tenant 2
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="p-6 text-center text-xs text-slate-500">
        VIPAZ Jurídico • Tecnologia para potencializar a atuação profissional.
      </footer>
    </div>
  );
};
