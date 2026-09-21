import React from 'react';
import {
  Building2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Scale,
  ArrowRight,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { LegalCaseWorkspace } from '../../types/caseTypes';

interface CaseOverviewTabProps {
  caseData: LegalCaseWorkspace;
  onNavigateTab: (tab: any) => void;
}

export const CaseOverviewTab: React.FC<CaseOverviewTabProps> = ({
  caseData,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Alertas Jurídicos Relevantes */}
      {caseData.alerts && caseData.alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {caseData.alerts.map((alert) => {
            const isWarning = alert.type === 'warning';
            const isCritical = alert.type === 'critical';
            const isSuccess = alert.type === 'success';

            const bgClass = isCritical
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
              : isWarning
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
              : isSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
              : 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900/60 text-cyan-900 dark:text-cyan-200';

            const Icon = isCritical
              ? AlertCircle
              : isWarning
              ? AlertTriangle
              : isSuccess
              ? CheckCircle2
              : ShieldCheck;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition ${bgClass}`}
              >
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold">{alert.title}</div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {alert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grid de Cards Executivos do Caso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Processo e Foro */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Identificação do Processo
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono-tech">
            {caseData.process_number}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {caseData.court}
          </div>
        </div>

        {/* Card 2: Fase e Prazo */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Fase Processual & Prazo
          </span>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            {caseData.procedural_stage}
          </div>
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{caseData.relevant_deadline}</span>
          </div>
        </div>

        {/* Card 3: Valor e Tipo de Ação */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Valor Atribuído à Causa
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white font-mono-tech">
            {caseData.claim_value}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {caseData.action_type}
          </div>
        </div>

        {/* Card 4: Tutela de Urgência */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Status da Tutela Liminar
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {caseData.injunction_status === 'denied'
                ? 'Indeferida pelo Juízo'
                : caseData.injunction_status === 'granted'
                ? 'Deferida'
                : 'Pendente de Apreciação'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Reajustes mantidos integralmente
          </div>
        </div>
      </div>

      {/* Partes e Resumo Executivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Partes e Movimentação */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Partes do Processo
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Cliente Representado (Polo Passivo)
                </span>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {caseData.client}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Parte Demandante (Polo Ativo)
                </span>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {caseData.opposing_party}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Última Movimentação Relevante
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {caseData.last_movement}
                </p>
              </div>
            </div>
          </div>

          {/* Atalho para Documentos Disponíveis */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {caseData.documents.length} Documentos nos Autos
                </div>
                <div className="text-[11px] text-slate-500">
                  Autos integrais, petição e subsídios
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('documentos')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Acessar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Painel Central e Direito: Síntese e Peça em Elaboração */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card da Peça em Elaboração */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Peça em Elaboração
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
                Pronta para Revisão & Download
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  Contestação — Ação Revisional PME
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Responsável: {caseData.pieces[0]?.responsible_lawyer || 'Dr. José Antônio Martins'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Última atualização: {caseData.pieces[0]?.last_updated || 'Hoje'} • Versão {caseData.pieces[0]?.version || 'v2.1'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigateTab('estrategia')}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 font-medium transition"
                >
                  Ajustar Estratégia
                </button>
                <button
                  onClick={() => onNavigateTab('pecas')}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Revisar Peça</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Síntese dos Fatos Relevantes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Síntese do Caso Jurídico
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {caseData.analysis.case_summary}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {caseData.strategy_items.filter((i) => i.status === 'confirmed').length} teses e preliminares confirmadas na estratégia defensiva.
              </span>
              <button
                onClick={() => onNavigateTab('analise-juridica')}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                Ver Análise Completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
