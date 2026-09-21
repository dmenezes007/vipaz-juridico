import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Scale, ShieldCheck } from 'lucide-react';
import { Organization } from '../types';

interface IndicadoresViewProps {
  organization: Organization;
  onNavigate: (path: string) => void;
}

export const IndicadoresView: React.FC<IndicadoresViewProps> = ({
  organization,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>MÉTRICAS & INDICADORES DE OPERAÇÃO FORENSE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Indicadores Executivos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Painel de produtividade jurídica, aderência a teses defensivas e conformidade técnica.
          </p>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Peças Homologadas
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            24
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% de conformidade com CAW v2</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Tempo Médio de Preparação
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            4.2 min
          </div>
          <div className="text-xs text-slate-500">
            Desde autos eletrônicos até minuta DOCX
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Teses Mais Aplicadas
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            RN 565 ANS / Prescrição Trienal
          </div>
          <div className="text-xs text-slate-500">
            92% de adesão nos casos PME
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Risco de Sucumbência Mitigado
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            Alto
          </div>
          <div className="text-xs text-slate-500">
            Arguição expressa conforme art. 85 do CPC
          </div>
        </div>
      </div>
    </div>
  );
};
