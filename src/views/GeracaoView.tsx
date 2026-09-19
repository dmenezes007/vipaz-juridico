import React, { useEffect, useState } from 'react';
import {
  FileText,
  Building2,
  CheckCircle2,
  Download,
  Eye,
  RefreshCw,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { GenerationJob, GeneratedDocument, Organization } from '../types';
import { generationService } from '../services/generationService';
import { GenerationTimeline } from '../components/GenerationTimeline';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface GeracaoViewProps {
  jobId: string;
  organization: Organization;
  onNavigate: (path: string) => void;
}

export const GeracaoView: React.FC<GeracaoViewProps> = ({
  jobId,
  organization,
  onNavigate,
}) => {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega e orquestra o pipeline
  useEffect(() => {
    let isMounted = true;

    async function loadAndRun() {
      setIsLoading(true);
      const existingJob = await generationService.getJobById(jobId);

      if (!existingJob) {
        setIsLoading(false);
        return;
      }

      setJob(existingJob);

      // Se já está concluído, busca o documento gerado
      if (existingJob.status === 'completed') {
        const doc = await generationService.getDocumentByJobId(jobId);
        if (isMounted) setDocument(doc);
        setIsLoading(false);
        return;
      }

      // Se está em processamento, executa as etapas com cadência visual realista
      try {
        const completedJob = await generationService.executeJobPipeline(
          jobId,
          (updatedJob) => {
            if (isMounted) setJob({ ...updatedJob });
          }
        );

        if (isMounted) {
          setJob(completedJob);
          const doc = await generationService.getDocumentByJobId(jobId);
          setDocument(doc);
        }
      } catch (err) {
        console.error('Falha na execução do pipeline:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAndRun();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  if (!job && !isLoading) {
    return (
      <div className="p-8 text-center space-y-4 bg-[#0B1325] rounded-xl border border-slate-800">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-semibold text-slate-100">Job não encontrado</h2>
        <p className="text-xs text-slate-400">
          Não foi possível localizar o job <code className="font-mono-tech">{jobId}</code> nesta organização.
        </p>
        <button
          onClick={() => onNavigate(`/app/${organization.slug}`)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition"
        >
          Voltar à Visão Geral
        </button>
      </div>
    );
  }

  const isCompleted = job?.status === 'completed';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(`/app/${organization.slug}`)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Visão Geral</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-200">Acompanhamento da Produção</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-mono-tech text-slate-400">
          <span>JOB ID:</span>
          <span className="text-cyan-400">{jobId}</span>
        </div>
      </div>

      {/* Main Header / Status Panel */}
      <div className="p-6 rounded-2xl bg-[#090F1E] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech uppercase tracking-wider text-cyan-400">
                {organization.name}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-emerald-400 font-mono-tech flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Modelo Validado CAW (v3.4)
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              {isCompleted ? 'Peça Produzida com Sucesso' : 'Produzindo sua peça'}
            </h1>
            <p className="text-xs text-slate-400">
              Execução passo a passo sob método estruturado VIPAZ Jurídico.
            </p>
          </div>

          <div>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PEÇA CONCLUÍDA</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Etapa {job?.current_step} de 10 em processamento</span>
              </span>
            )}
          </div>
        </div>

        {/* Process Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-lg bg-[#0B1325] border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-mono-tech text-slate-400">
              Número do Processo
            </span>
            <div className="font-mono-tech font-semibold text-slate-200 truncate">
              {job?.process_data.process_number}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1325] border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-mono-tech text-slate-400">
              Tipo de Peça
            </span>
            <div className="font-semibold text-slate-200">
              {job?.document_type}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1325] border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-mono-tech text-slate-400">
              Parte Representada
            </span>
            <div className="font-semibold text-slate-200 truncate">
              {job?.process_data.represented_party}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1325] border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-mono-tech text-slate-400">
              Matéria(s)
            </span>
            <div className="font-semibold text-slate-200 truncate">
              {job?.process_data.subjects.join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* 25. TELA DE CONCLUSÃO / AÇÕES SE CONCLUÍDO */}
      {isCompleted && document && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B172F] to-[#080E1C] border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono-tech text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> REVISÃO ESTATUTÁRIA HOMOLOGADA
              </span>
              <h2 className="text-xl font-bold text-white">
                {document.title}
              </h2>
              <p className="text-xs text-slate-300">
                Documento formatado em padrão forense com todas as teses e preliminares estruturadas.
              </p>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono-tech">
              <div>Concluído em {new Date(job.completed_at || document.created_at).toLocaleTimeString('pt-BR')}</div>
              <div className="text-cyan-400">~{document.metadata.word_count} palavras</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsViewerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-cyan-950/60 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>VISUALIZAR PEÇA</span>
            </button>

            <button
              onClick={() => generationService.downloadDocument(document, 'docx')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR DOCX</span>
            </button>

            <button
              onClick={() => generationService.downloadDocument(document, 'pdf')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR PDF</span>
            </button>

            {/* Ação futura desabilitada/em breve */}
            <div className="relative group">
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/40 text-slate-500 border border-slate-800 text-xs font-medium cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>GERAR NOVA VERSÃO</span>
                <span className="text-[10px] uppercase font-mono-tech text-amber-500/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Em breve
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 24. TIMELINE REAL DAS 10 ETAPAS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Pipeline Metodológico VIPAZ
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Acompanhamento de cada fase da engenharia de contexto e redação forense.
            </p>
          </div>

          <span className="text-xs font-mono-tech text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-500/20">
            {isCompleted ? '10 / 10 Concluídas' : `${job?.current_step || 1} / 10 Em curso`}
          </span>
        </div>

        {job?.steps && (
          <GenerationTimeline
            steps={job.steps}
            currentStepIndex={job.current_step}
          />
        )}
      </div>

      {/* Document Viewer Modal */}
      {isViewerOpen && document && (
        <DocumentViewerModal
          document={document}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
};
