import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building2,
  User,
  ShieldAlert,
  ArrowRight,
  Bookmark,
  Gavel,
} from 'lucide-react';
import { LegalCaseWorkspace } from '../../types/caseTypes';

interface CaseProcessTabProps {
  caseData: LegalCaseWorkspace;
  onOpenEvidence: (evidence: any, title: string, info: any) => void;
}

export const CaseProcessTab: React.FC<CaseProcessTabProps> = ({
  caseData,
  onOpenEvidence,
}) => {
  return (
    <div className="space-y-6">
      {/* Grid Superior: Dados Processuais & Juízo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Gavel className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Juízo & Jurisdição</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400">Órgão Julgador:</span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {caseData.court}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Comarca / Estado:</span>
              <div className="text-slate-800 dark:text-slate-200">
                Comarca da {caseData.district} — {caseData.uf}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Tipo de Juízo:</span>
              <div className="text-slate-800 dark:text-slate-200">
                {caseData.court_type}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Polo Passivo e Ativo</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400">Demandado (Cliente):</span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {caseData.client}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Demandantes (Autores):</span>
              <div className="text-slate-800 dark:text-slate-200">
                {caseData.opposing_party}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Classificação dos Autores:</span>
              <div className="text-slate-800 dark:text-slate-200">
                Pessoa Jurídica (Estipulante) e Pessoas Físicas (Sócios)
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Prazos & Fase</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400">Fase Atual:</span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {caseData.procedural_stage}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Prazo Principal:</span>
              <div className="font-semibold text-amber-600 dark:text-amber-400">
                {caseData.relevant_deadline}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Valor da Causa:</span>
              <div className="font-mono-tech font-bold text-slate-900 dark:text-slate-100">
                {caseData.claim_value}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Causa de Pedir e Pedidos Formulados pela Parte Adversa */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Causa de Pedir e Pretensão Autoral
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pedidos formulados na petição inicial identificados e mapeados
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            3 Pedidos Principais
          </span>
        </div>

        <div className="space-y-3">
          {caseData.analysis.opposing_claims.map((claim, idx) => (
            <div
              key={claim.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {idx + 1}. {claim.claim}
                  </span>
                  {claim.amount && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-mono-tech font-semibold">
                      {claim.amount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {claim.basis}
                </p>
              </div>

              {claim.evidence_source && (
                <button
                  onClick={() =>
                    onOpenEvidence(
                      claim.evidence_source,
                      claim.claim,
                      {
                        title: claim.claim,
                        description: claim.basis,
                        impact: `Valor econômico pretendido: ${claim.amount || 'A apurar'}`,
                      }
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-xs text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition shrink-0 self-start md:self-center flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Ver Fonte nos Autos</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decisão sobre Tutela de Urgência */}
      <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Decisão Interlocutória de Tutela de Urgência
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
            Favorável à Operadora
          </span>
        </div>

        <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
          O Douto Juízo indeferiu o pedido liminar dos autores de suspensão dos reajustes, reconhecendo a ausência de probabilidade do direito e a necessidade de instrução probatória para aferição dos cálculos atuariais do grupamento coletivo.
        </p>

        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
          Impacto na Peça: Tese defensiva já ancorada na manutenção do status quo contratual e desnecessidade de reversão judicial liminar.
        </div>
      </div>

      {/* Timeline Processual dos Autos */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Linha do Tempo dos Autos Judiciais
        </h3>

        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 ring-4 ring-white dark:ring-slate-900" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              18/09/2026 — Decisão Interlocutória
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Juízo indefere a tutela provisória de urgência e determina a citação da operadora para oferecimento de contestação.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              12/09/2026 — Conclusão para Decisão
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Autos conclusos ao Magistrado titular para apreciação do pleito de urgência.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-400 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              05/09/2026 — Distribuição da Petição Inicial
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Ação Revisional ajuizada perante a 4ª Vara Cível da Capital com requerimento de gratuidade de justiça e tutela antecipada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
