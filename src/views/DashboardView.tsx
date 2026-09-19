import React, { useEffect, useState } from 'react';
import {
  FilePlus2,
  FileCheck2,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Hero */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#090F1E] border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Ambiente Homologado
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Produção Jurídica
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Transforme processos em peças estruturadas com o método VIPAZ Jurídico.
          </p>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => onNavigate(`/app/${organization.slug}/nova-peca`)}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-900/40 transition cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>NOVA PEÇA</span>
          </button>
        </div>

        {/* Subtle decorative background pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row (3 metric blocks without mock numbers, clearly labeled) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0B1325] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peças recentes</span>
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-tech">
            {jobs.length}
          </div>
          <p className="text-[11px] text-slate-400">Registros em {organization.name}</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0B1325] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Em processamento</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono-tech">
            {processingCount}
          </div>
          <p className="text-[11px] text-slate-400">Pipelines ativos de contexto e redação</p>
        </div>

        <div className="p-5 rounded-xl bg-[#0B1325] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono-tech">
            {completedCount}
          </div>
          <p className="text-[11px] text-slate-400">Peças homologadas prontas para uso</p>
        </div>
      </div>

      {/* Recent Matters Table / List */}
      <div className="p-6 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Demandas em Andamento e Histórico Recente
            </h2>
            <p className="text-xs text-slate-400">
              Processos submetidos à produção jurídica contextual
            </p>
          </div>

          <button
            onClick={() => onNavigate(`/app/${organization.slug}/documentos`)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 font-medium"
          >
            <span>Ver acervo completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-3">
            <p>Nenhuma demanda registrada nesta organização até o momento.</p>
            <button
              onClick={() => onNavigate(`/app/${organization.slug}/nova-peca`)}
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition"
            >
              Criar primeira peça
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono-tech text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Processo</th>
                  <th className="px-4 py-3">Peça / Matéria</th>
                  <th className="px-4 py-3">Parte Representada</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-4 py-3 font-mono-tech font-medium text-slate-200">
                      <div>{job.process_data.process_number}</div>
                      <div className="text-[10px] text-slate-400 font-sans truncate max-w-[200px]">
                        {job.process_data.court}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{job.document_type}</div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {job.process_data.subjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-300">
                      {job.process_data.represented_party}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() =>
                          onNavigate(`/app/${organization.slug}/geracoes/${job.id}`)
                        }
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 transition inline-flex items-center gap-1"
                      >
                        <span>Acompanhar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {job.status === 'completed' && (
                        <button
                          onClick={() => handleOpenDoc(job.id)}
                          className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 transition"
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
