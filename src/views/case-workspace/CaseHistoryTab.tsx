import React from 'react';
import {
  History,
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { LegalCaseWorkspace } from '../../types/caseTypes';

interface CaseHistoryTabProps {
  caseData: LegalCaseWorkspace;
}

export const CaseHistoryTab: React.FC<CaseHistoryTabProps> = ({ caseData }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner de Histórico */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <History className="w-3.5 h-3.5" />
            <span>Trilha de Governança & Auditoria Jurídica</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Histórico de Ações do Caso
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro cronológico das intervenções humanas, validações estratégicas e versões documentais geradas.
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 self-start md:self-center">
          {caseData.timeline.length} eventos registrados
        </div>
      </div>

      {/* Linha do Tempo Estilizada */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
          {caseData.timeline.map((item, idx) => {
            return (
              <div key={item.id} className="relative group">
                {/* Marcador do nó */}
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-cyan-500 ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition" />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono-tech text-slate-400">
                      • {item.date}
                    </span>
                    {item.user_name && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.user_name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
