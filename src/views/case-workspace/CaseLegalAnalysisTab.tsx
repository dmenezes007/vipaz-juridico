import React, { useState } from 'react';
import {
  Scale,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight,
  Gavel,
  HelpCircle,
} from 'lucide-react';
import { LegalCaseWorkspace, EvidenceSourceLink } from '../../types/caseTypes';

interface CaseLegalAnalysisTabProps {
  caseData: LegalCaseWorkspace;
  onOpenEvidence: (
    evidence: EvidenceSourceLink,
    title: string,
    info: {
      title: string;
      description: string;
      impact?: string;
      counterMeasure?: string;
    }
  ) => void;
}

export const CaseLegalAnalysisTab: React.FC<CaseLegalAnalysisTabProps> = ({
  caseData,
  onOpenEvidence,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'geral' | 'teses' | 'validacao'>('geral');

  const analysis = caseData.analysis;

  return (
    <div className="space-y-6">
      {/* Top Banner de Análise */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <Scale className="w-3.5 h-3.5" />
            <span>Inteligência & Diagnóstico Processual</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Análise Jurídica Estruturada
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mapeamento fático, delimitação de teses, identificação de fragilidades e ancoragem probatória nos autos.
          </p>
        </div>

        {/* Sub-filtro elegante */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start md:self-center">
          <button
            onClick={() => setActiveSubSection('geral')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubSection === 'geral'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fatos & Controvérsia
          </button>
          <button
            onClick={() => setActiveSubSection('teses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubSection === 'teses'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Teses & Preliminares
          </button>
          <button
            onClick={() => setActiveSubSection('validacao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeSubSection === 'validacao'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fragilidades & Validação ({analysis.human_validation_points.length})
          </button>
        </div>
      </div>

      {activeSubSection === 'geral' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Fatos Relevantes com Ancoragem Probatória */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Fatos Relevantes Identificados</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Com suporte probatório)
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.relevant_facts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{fact.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {fact.description}
                    </p>
                  </div>

                  {fact.evidence_source && (
                    <button
                      onClick={() =>
                        onOpenEvidence(
                          fact.evidence_source!,
                          fact.title,
                          {
                            title: fact.title,
                            description: fact.description,
                            counterMeasure: 'Fato favorável comprovado por documento juntado aos autos.',
                          }
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium self-start pt-1"
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Ver fonte nos autos ({fact.evidence_source.document_name})</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Argumentos da Parte Adversa & Tática de Neutralização */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Argumentos da Parte Adversa & Tática de Neutralização
            </h3>

            <div className="space-y-3">
              {analysis.opposing_arguments.map((arg) => (
                <div
                  key={arg.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Alegação Autoral: "{arg.argument}"
                    </div>
                    <div className="text-xs text-cyan-700 dark:text-cyan-300 font-medium">
                      Diretriz VIPAZ: {arg.counter_tactic}
                    </div>
                  </div>

                  {arg.evidence_source && (
                    <button
                      onClick={() =>
                        onOpenEvidence(
                          arg.evidence_source!,
                          'Alegação da Parte Adversa',
                          {
                            title: arg.argument,
                            description: arg.counter_tactic,
                          }
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition shrink-0 self-start md:self-center flex items-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Ver Petição Inicial</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Questões Controvertidas */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Pontos Controvertidos Fixados
            </h3>
            <ul className="space-y-2">
              {analysis.controversial_issues.map((issue, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeSubSection === 'teses' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Preliminares Possíveis */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Preliminares Processuais Cabíveis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Matérias processuais de ordem pública e defesas processuais antes do mérito
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-semibold">
                3 Preliminares Fortes
              </span>
            </div>

            <div className="space-y-3">
              {analysis.possible_preliminaries.map((prel) => (
                <div
                  key={prel.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {prel.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                        Recomendada
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Fundamento Legal: {prel.legal_basis}
                    </div>
                  </div>

                  {prel.evidence_source && (
                    <button
                      onClick={() =>
                        onOpenEvidence(
                          prel.evidence_source!,
                          prel.title,
                          {
                            title: prel.title,
                            description: prel.legal_basis,
                            impact: 'Extinção do processo sem julgamento de mérito em relação ao ponto impugnado.',
                          }
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-xs text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition shrink-0 self-start md:self-center flex items-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Ver Fonte</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Teses de Mérito e Precedentes */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Teses de Mérito & Marco Regulatório Homologado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.merits_theses.map((tese) => (
                <div
                  key={tese.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400">
                        {tese.regulatory_framework}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-medium">
                        Solidez {tese.strength === 'muito_forte' ? 'Alta' : 'Moderada'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {tese.title}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tese.legal_basis}
                    </p>
                  </div>

                  {tese.evidence_source && (
                    <button
                      onClick={() =>
                        onOpenEvidence(
                          tese.evidence_source!,
                          tese.title,
                          {
                            title: tese.title,
                            description: tese.legal_basis,
                          }
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline pt-2"
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Ver subsídios regulatórios</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubSection === 'validacao' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Pontos que exigem validação humana do advogado */}
          <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="text-sm font-bold">
                Pontos que Exigem Validação do Advogado
              </h3>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              A VIPAZ destaca aspectos específicos que exigem decisão humana ou conferência de documentos supervenientes:
            </p>

            <div className="space-y-2.5">
              {analysis.human_validation_points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inconsistências Documentais Identificadas */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Inconsistências Identificadas na Petição Inicial</span>
            </h3>

            <div className="space-y-2">
              {analysis.document_inconsistencies.map((inc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
