import React, { useEffect, useState } from 'react';
import {
  FilePlus2,
  FileCheck2,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Scale,
  FolderArchive,
} from 'lucide-react';
import { Organization, GenerationJob, GeneratedDocument } from '../types';
import { generationService } from '../services/generationService';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface DashboardViewProps {
  organization: Organization;
  onNavigate: (path: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  organization,
  onNavigate,
}) => {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<GeneratedDocument | null>(null);

  useEffect(() => {
    generationService.getJobsByOrganization(organization.id).then(setJobs);
  }, [organization.id]);

  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const processingCount = jobs.filter((j) => j.status === 'processing').length;

  const handleOpenDoc = async (jobId: string) => {
    const doc = await generationService.getDocumentByJobId(jobId);
    if (doc) setSelectedDoc(doc);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Top Banner / Hero Executivo */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#090F1E] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Ambiente Homologado CAW v2
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Jurídico
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Estruture fatos, selecione teses e elabore peças forenses com garantia determinística de qualidade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate(`/app/${organization.slug}/casos`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold uppercase tracking-wider transition"
          >
            <Scale className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Ver Casos</span>
          </button>

          <button
            onClick={() => onNavigate(`/app/${organization.slug}/nova-peca`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Nova Peça</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Peças no acervo</span>
            <FileCheck2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono-tech">
            {jobs.length}
          </div>
          <p className="text-[11px] text-slate-400">Registros em {organization.name}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Em elaboração</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono-tech">
            {processingCount}
          </div>
          <p className="text-[11px] text-slate-400">Processos em análise estratégica</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Peças Homologadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono-tech">
            {completedCount}
          </div>
          <p className="text-[11px] text-slate-400">Minutas DOCX prontas para protocolo</p>
        </div>
      </div>

      {/* Destaque: Caso Ativo da Homologação CAW v2 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Caso em Destaque — Workspace Completo
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono-tech">
              CAW v2
            </span>
          </div>

          <button
            onClick={() => onNavigate(`/app/${organization.slug}/caso/proc-caw-001`)}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition flex items-center gap-1 font-semibold"
          >
            <span>Abrir no Workspace de 7 Módulos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          onClick={() => onNavigate(`/app/${organization.slug}/caso/proc-caw-001`)}
          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:border-cyan-500/50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech font-bold text-xs text-slate-900 dark:text-slate-100">
                0004589-32.2024.8.19.0001
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                4ª Vara Cível / RJ
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Demandada: <strong>Unimed / Operadora PME</strong> • Autor: <strong>Comércio de Alimentos Silva Ltda ME</strong>
            </div>
            <p className="text-[11px] text-slate-500">
              Contestação com preliminares de ilegitimidade, gratuidade e impugnação ao valor da causa, prescrição trienal e RN 565 ANS.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
              Estratégia Validada
            </span>
          </div>
        </div>
      </div>

      {/* Tabela de Demandas e Histórico Recente */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Demandas em Andamento e Histórico Recente
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Processos submetidos à estruturação jurídica contextual
            </p>
          </div>

          <button
            onClick={() => onNavigate(`/app/${organization.slug}/documentos`)}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition flex items-center gap-1 font-semibold"
          >
            <span>Ver acervo completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-3">
            <p>Nenhuma demanda registrada nesta organização até o momento.</p>
            <button
              onClick={() => onNavigate(`/app/${organization.slug}/nova-peca`)}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition"
            >
              Criar primeira peça
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-mono-tech text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Processo</th>
                  <th className="px-4 py-3">Peça / Matéria</th>
                  <th className="px-4 py-3">Parte Representada</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono-tech font-medium text-slate-900 dark:text-slate-200">
                      <div>{job.process_data?.process_number || job.process?.process_number || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400 font-sans truncate max-w-[200px]">
                        {job.process_data?.court || job.process?.court || 'N/A'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">{job.document_type}</div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {(job.process_data?.subjects || []).map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {job.process_data?.represented_party || job.process?.represented_party || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() =>
                          onNavigate(`/app/${organization.slug}/geracoes/${job.id}`)
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 transition inline-flex items-center gap-1 font-medium"
                      >
                        <span>Acompanhar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {job.status === 'completed' && (
                        <button
                          onClick={() => handleOpenDoc(job.id)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800 transition font-medium"
                        >
                          Visualizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Viewer Modal if clicked */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};
