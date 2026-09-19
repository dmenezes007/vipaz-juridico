import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  CheckCircle2,
  Download,
  Eye,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  RefreshCw,
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carregamento real a partir do Supabase (sem simulação de pipeline)
  const fetchJobData = useCallback(async () => {
    try {
      const existingJob = await generationService.getJobById(jobId);
      if (existingJob) {
        setJob(existingJob);
        if (existingJob.status === 'completed') {
          const doc = await generationService.getDocumentByJobId(jobId);
          setDocument(doc);
        }
      } else {
        setJob(null);
      }
    } catch (err) {
      console.error('Erro ao consultar job no Supabase:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchJobData();
  };

  if (!job && !isLoading) {
    return (
      <div className="p-8 text-center space-y-4 bg-[#0B1325] rounded-xl border border-slate-800">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-semibold text-slate-100">Solicitação não encontrada</h2>
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
  const isPending = job?.status === 'pending';
  const isProcessing = job?.status === 'processing';
  const subjectsList = job?.process_data?.subjects?.join(', ') || 'Não especificadas';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Refresh */}
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

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono-tech text-slate-300 bg-slate-900 border border-slate-700 rounded hover:bg-slate-800 transition disabled:opacity-50"
            title="Atualizar status do Supabase"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Atualizar</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono-tech text-slate-400">
            <span>JOB:</span>
            <span className="text-cyan-400 truncate max-w-[180px]">{jobId}</span>
          </div>
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
                <ShieldCheck className="w-3 h-3" /> Padrão Homologado
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              {isCompleted
                ? 'Peça Concluída'
                : isPending
                ? 'Solicitação Registrada'
                : 'Processamento Forense'}
            </h1>
            <p className="text-xs text-slate-400">
              {isCompleted
                ? 'Peça processual homologada e disponibilizada para conferência.'
                : isPending
                ? 'Processo judicial e metadados persistidos no Supabase. Aguardando início do processamento.'
                : 'Execução do pipeline metodológico sob a arquitetura jurídica VIPAZ.'}
            </p>
          </div>

          <div>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PEÇA CONCLUÍDA</span>
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Aguardando Processamento</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium">
                <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Etapa {job?.current_step} de 10 em curso</span>
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
              {job?.process_data?.process_number || 'N/A'}
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
              {job?.process_data?.represented_party || 'N/A'}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1325] border border-slate-800 space-y-0.5">
            <span className="text-[10px] uppercase font-mono-tech text-slate-400">
              Matéria(s)
            </span>
            <div className="font-semibold text-slate-200 truncate" title={subjectsList}>
              {subjectsList}
            </div>
          </div>
        </div>

        {/* Source Document File Banner */}
        {job?.source_document && (
          <div className="p-3 rounded-lg bg-[#0B1325] border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300 truncate font-medium">
                {job.source_document.file_name}
              </span>
              <span className="text-[11px] font-mono-tech text-slate-500">
                ({(job.source_document.file_size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
              PDF Anexado no Storage
            </span>
          </div>
        )}
      </div>

      {/* DOCUMENTO FINAL (HABILITADO APENAS QUANDO GERADO REALMENTE) */}
      {isCompleted && document ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B172F] to-[#080E1C] border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono-tech text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> PEÇA PROCESSUAL HOMOLOGADA
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
            </div>
          </div>

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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR DOCX</span>
            </button>

            <button
              onClick={() => generationService.downloadDocument(document, 'pdf')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR PDF</span>
            </button>
          </div>
        </div>
      ) : (
        /* ESTADO PENDENTE OU EM PROCESSAMENTO — BOTÕES DESABILITADOS DE FORMA TRANSPARENTE */
        <div className="p-6 rounded-2xl bg-[#090F1E] border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Documentos Finais da Peça</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Os arquivos definitivos (DOCX e PDF) serão disponibilizados para download após a conclusão do processamento.
              </p>
            </div>
            <span className="text-[10px] font-mono-tech text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 whitespace-nowrap self-start sm:self-center">
              Aguardando Geração
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60">
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/60 text-slate-500 border border-slate-800 text-xs font-semibold cursor-not-allowed opacity-60"
            >
              <Eye className="w-4 h-4" />
              <span>VISUALIZAR PEÇA</span>
            </button>

            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/60 text-slate-500 border border-slate-800 text-xs font-semibold cursor-not-allowed opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR DOCX</span>
            </button>

            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/60 text-slate-500 border border-slate-800 text-xs font-semibold cursor-not-allowed opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>BAIXAR PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* TIMELINE DAS 10 ETAPAS REAIS (LIDAS DO SUPABASE) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1325] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Pipeline Metodológico VIPAZ
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Estruturação formal das 10 etapas forenses registradas em <code className="font-mono-tech text-cyan-400">generation_steps</code>.
            </p>
          </div>

          <span className="text-xs font-mono-tech text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-500/20">
            {isCompleted
              ? '10 / 10 Concluídas'
              : `${job?.steps?.filter((s) => s.status === 'completed').length || 0} / 10 Concluídas`}
          </span>
        </div>

        {job?.steps && job.steps.length > 0 && (
          <GenerationTimeline
            steps={job.steps}
            currentStepIndex={job.current_step}
          />
        )}
      </div>

      {/* Document Viewer Modal (se documento real existir) */}
      {isViewerOpen && document && (
        <DocumentViewerModal
          document={document}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
};
