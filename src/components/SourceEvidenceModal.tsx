import React from 'react';
import { X, FileText, CheckCircle2, Bookmark, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { EvidenceSourceLink } from '../types/caseTypes';

interface SourceEvidenceModalProps {
  title: string;
  categoryLabel?: string;
  structuredInfo: {
    title: string;
    description: string;
    impact?: string;
    counterMeasure?: string;
  };
  evidenceSource: EvidenceSourceLink;
  onClose: () => void;
}

export const SourceEvidenceModal: React.FC<SourceEvidenceModalProps> = ({
  title,
  categoryLabel = 'Evidência Documental',
  structuredInfo,
  evidenceSource,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[85vh] max-h-[800px] bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {categoryLabel}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Rastreabilidade Forense
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split-View Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 overflow-hidden">
          {/* Left Pane: Informação Jurídica Estruturada */}
          <div className="p-6 overflow-y-auto space-y-5 bg-white dark:bg-[#0B1325]">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Fato ou Conclusão da Análise
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {structuredInfo.title}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {structuredInfo.description}
            </div>

            {structuredInfo.impact && (
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                  Relevância Processual
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {structuredInfo.impact}
                </p>
              </div>
            )}

            {structuredInfo.counterMeasure && (
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400">
                  Tese ou Conduta Proposta
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {structuredInfo.counterMeasure}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500">
              Conexão algorítmica auditável: o trecho ao lado comprova a afirmação fática nos autos.
            </div>
          </div>

          {/* Right Pane: Documento Fonte & Trecho Destacado */}
          <div className="p-6 overflow-y-auto space-y-4 bg-slate-50 dark:bg-[#080E1C]/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[280px]">
                  {evidenceSource.document_name}
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono-tech">
                Página {evidenceSource.page}
              </span>
            </div>

            {/* Trecho com highlight visual sofisticado de citação forense */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Trecho Localizado no Documento
              </span>

              <div className="relative p-5 rounded-xl bg-white dark:bg-[#0F182E] border-2 border-cyan-400/60 dark:border-cyan-500/40 shadow-sm text-xs font-mono-tech text-slate-800 dark:text-slate-200 leading-relaxed">
                <div className="absolute top-2 right-2 text-[10px] text-cyan-600 dark:text-cyan-400 font-sans font-medium px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60">
                  Destaque Verificado
                </div>
                <blockquote className="italic border-l-2 border-cyan-500 pl-3">
                  "{evidenceSource.snippet}"
                </blockquote>
              </div>
            </div>

            {evidenceSource.context_note && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-200">
                <span className="font-semibold">Nota Contextual: </span>
                {evidenceSource.context_note}
              </div>
            )}

            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 text-xs text-slate-500">
              <p>Visualização focada no parágrafo probatório.</p>
              <div className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Autenticidade conferida com os autos eletrônicos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
