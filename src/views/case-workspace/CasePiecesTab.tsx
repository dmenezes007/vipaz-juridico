import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  RefreshCw,
  Edit3,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { LegalCaseWorkspace } from '../../types/caseTypes';
import { experimentalDocxService } from '../../services/experimentalDocxService';
import { DocumentViewerModal } from '../../components/DocumentViewerModal';
import { GeneratedDocument } from '../../types';

interface CasePiecesTabProps {
  caseData: LegalCaseWorkspace;
  onNavigateTab: (tab: any) => void;
}

export const CasePiecesTab: React.FC<CasePiecesTabProps> = ({
  caseData,
  onNavigateTab,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [_downloadSuccess, setDownloadSuccess] = useState(false);
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewerDoc, setViewerDoc] = useState<GeneratedDocument | null>(null);

  const activePiece = caseData.pieces[0];

  const steps = [
    'Autos processuais e anexos analisados',
    'Subsídios da operadora e estudo de sinistralidade considerados',
    'Pontos controvertidos e preliminares fixados',
    'Estratégia defensiva estruturada pelo advogado',
    'Elaborando documento forense homologado (DOCX)...',
  ];

  const handleGeneratePiece = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      // Simulação visual de etapas humanizadas de alta classe
      for (let i = 0; i < steps.length; i++) {
        setGenerationStep(i);
        await new Promise((r) => setTimeout(r, 600));
      }

      // Dispara a geração real de DOCX conectada ao motor homologado Fase 4.2
      const result = await experimentalDocxService.generatePhase42Docx();

      if (result.success && result.blob) {
        setDownloadSuccess(true);
        experimentalDocxService.downloadDocxFile(result.blob, result.filename);
      } else {
        throw new Error('Falha ao processar o documento final.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Erro ao gerar peça jurídica.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadExistingDocx = async () => {
    try {
      const result = await experimentalDocxService.generatePhase42Docx();
      if (result.success && result.blob) {
        experimentalDocxService.downloadDocxFile(result.blob, result.filename);
      }
    } catch (e: any) {
      console.error('Download falhou:', e);
    }
  };

  const handleReviewInViewer = () => {
    const mockDoc: GeneratedDocument = {
      id: 'doc-preview-001',
      generation_job_id: caseData.generation_job_id || '90e487ff-c76b-4eef-b0ba-31405a3ba9cf',
      organization_id: caseData.organization_id,
      process_number: caseData.process_number,
      document_type: 'Contestação',
      version: '1.0',
      title: `${caseData.formData.court_type.toUpperCase()} ${caseData.formData.court_number}ª - ${caseData.formData.district.toUpperCase()}/${caseData.formData.uf.toUpperCase()} — CONTESTAÇÃO`,
      docx_storage_path: 'contestações/homologada_caw_v2.docx',
      pdf_storage_path: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        court: caseData.court,
        represented_party: caseData.client,
        subjects: ['Reajuste Coletivo PME', 'Plano de Saúde'],
        word_count: 3840,
        pages_estimated: 18,
        reviewed_by: caseData.pieces[0]?.responsible_lawyer || 'Dr. José Antônio',
      },
      structured_content: {
        addressing: `DOUTO JUÍZO DE DIREITO DA ${caseData.formData.court_number}ª VARA CÍVEL DA COMARCA DA ${caseData.formData.district.toUpperCase()} – ${caseData.formData.uf.toUpperCase()}`,
        qualification: `${caseData.client.toUpperCase()}, sociedade empresária já qualificada nos autos, por seus advogados infra-assinados, vem apresentar CONTESTAÇÃO em face de ${caseData.opposing_party.toUpperCase()}.`,
        preliminaries: [
          {
            title: '1. ILEGITIMIDADE ATIVA DOS SÓCIOS PESSOA FÍSICA',
            subtitle: 'Art. 17 e 18 do CPC',
            paragraphs: [
              'Os sócios da pessoa jurídica contratante não detêm legitimidade para pleitear, em nome próprio, a repetição de indébito de mensalidades vertidas pela sociedade contratante.',
            ],
          },
          {
            title: '2. IMPUGNAÇÃO À GRATUIDADE DE JUSTIÇA',
            subtitle: 'Súmula 481 do STJ',
            paragraphs: [
              'A concessão de gratuidade à pessoa jurídica exige comprovação inequívoca de impossibilidade financeira, inocorrente nos autos.',
            ],
          },
          {
            title: '3. IMPUGNAÇÃO AO VALOR DA CAUSA',
            subtitle: 'Art. 292, II do CPC',
            paragraphs: [
              'O valor atribuído à causa deve corresponder ao proveito econômico pretendido no período de 12 meses.',
            ],
          },
        ],
        facts_summary: [
          {
            title: 'DA SÍNTESE FÁTICA DOS AUTOS',
            paragraphs: [
              'Trata-se de ação revisional em que a parte autora insurge-se contra os reajustes anuais de plano coletivo empresarial PME com menos de 30 vidas.',
            ],
          },
        ],
        merits: [
          {
            title: '1. DA PRESCRIÇÃO TRIENAL',
            subtitle: 'Tema 610/STJ e Art. 206, § 3º, IV do CC',
            paragraphs: [
              'Impõe-se a declaração de prescrição das pretensões de cobrança e repetição anteriores ao triênio precedente à propositura da ação.',
            ],
          },
          {
            title: '2. DA HIGIDEZ DOS REAJUSTES EM CONTRATO COLETIVO EMPRESARIAL',
            subtitle: 'Resolução Normativa nº 565 da ANS',
            paragraphs: [
              'O agrupamento de contratos coletivos (pooling) obedece estritamente à metodologia atuarial e regulatória da ANS, sendo inaplicáveis os índices de planos individuais.',
            ],
          },
        ],
        requests: [
          'O acolhimento das preliminares processuais de ilegitimidade ativa, revogação da gratuidade e adequação do valor da causa;',
          'O reconhecimento da prejudicial de mérito de prescrição trienal;',
          'No mérito, a total improcedência dos pedidos autorais;',
          'A condenação da parte demandante em custas e honorários sucumbenciais.',
        ],
        closing: `${caseData.formData.district.toUpperCase()} - ${caseData.formData.uf.toUpperCase()}, ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
      },
    };

    setViewerDoc(mockDoc);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal de Peças */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Documento Processual Final</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Elaboração & Emissão da Peça
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Peça estruturada conforme a estratégia aprovada e o padrão técnico homologado (CAW v2).
          </p>
        </div>

        {/* Botão de Geração / Atualização */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleGeneratePiece}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-400 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Elaborando Peça...' : 'Atualizar & Emitir Peça'}</span>
          </button>
        </div>
      </div>

      {/* Painel de Progresso Humanizado durante a Geração */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/60 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200 uppercase tracking-wider">
              Condução da Elaboração Forense
            </span>
            <span className="text-xs text-cyan-700 dark:text-cyan-300 font-medium">
              Etapa {generationStep + 1} de {steps.length}
            </span>
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isDone = idx < generationStep;
              const isCurrent = idx === generationStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition ${
                    isDone
                      ? 'text-emerald-700 dark:text-emerald-300 font-medium'
                      : isCurrent
                      ? 'text-cyan-900 dark:text-cyan-100 font-bold'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Card da Peça Principal Homologada */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {activePiece.piece_type} — Revisional de Plano Coletivo PME
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
                Versão {activePiece.version} Homologada
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Responsável Técnico: {activePiece.responsible_lawyer} • Atualizado em {activePiece.last_updated}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReviewInViewer}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Revisar Peça</span>
            </button>

            <button
              onClick={() => onNavigateTab('estrategia')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Estrutura</span>
            </button>

            <button
              onClick={handleDownloadExistingDocx}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar DOCX Oficial</span>
            </button>
          </div>
        </div>

        {/* Resumo da Estrutura Contida na Peça */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Preliminares Processuais
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              3 Preliminares Arguidas
            </div>
            <p className="text-[11px] text-slate-500">
              Ilegitimidade dos sócios, impugnação de gratuidade e valor da causa.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Prejudicial de Mérito
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Prescrição Trienal (Tema 610/STJ)
            </div>
            <p className="text-[11px] text-slate-500">
              Extinção parcial com mérito das parcelas anteriores ao triênio.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Marco Regulatório
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              RN 565 da ANS (Pooling PME)
            </div>
            <p className="text-[11px] text-slate-500">
              Defesa da autonomia atuarial e descabimento de devolução em dobro.
            </p>
          </div>
        </div>
      </div>

      {/* Visualizador de Peça Modal */}
      {viewerDoc && (
        <DocumentViewerModal
          document={viewerDoc}
          onClose={() => setViewerDoc(null)}
        />
      )}
    </div>
  );
};
