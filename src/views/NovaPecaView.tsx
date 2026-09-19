import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Info,
  Loader2,
} from 'lucide-react';
import { Organization, DocumentType } from '../types';
import { SubjectMultiSelect, SelectedSubjectItem } from '../components/SubjectMultiSelect';
import { PdfUploader, SelectedPdfFile } from '../components/PdfUploader';
import { generationService } from '../services/generationService';

interface NovaPecaViewProps {
  organization: Organization;
  onNavigate: (path: string) => void;
}

const COURTS = [
  'TJSP - Tribunal de Justiça de São Paulo',
  'TJRJ - Tribunal de Justiça do Rio de Janeiro',
  'TJMG - Tribunal de Justiça de Minas Gerais',
  'TJRS - Tribunal de Justiça do Rio Grande do Sul',
  'TRF-3 - Tribunal Regional Federal da 3ª Região',
  'TRF-2 - Tribunal Regional Federal da 2ª Região',
  'TRF-1 - Tribunal Regional Federal da 1ª Região',
  'STJ - Superior Tribunal de Justiça',
];

export const NovaPecaView: React.FC<NovaPecaViewProps> = ({
  organization,
  onNavigate,
}) => {
  const [processNumber, setProcessNumber] = useState('');
  const [court, setCourt] = useState(COURTS[0]);
  const [representedParty, setRepresentedParty] = useState(
    organization.slug === 'caw' ? 'SulAmérica Companhia de Seguro Saúde' : ''
  );
  const [documentType, setDocumentType] = useState<DocumentType>('Contestação');
  const [subjects, setSubjects] = useState<SelectedSubjectItem[]>([
    { subject: 'Reajuste Plano PME', custom_subject: null },
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState<SelectedPdfFile | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');

  // Helper de preenchimento rápido para avaliação ágil com PDF real válido
  const fillQuickCase = () => {
    setProcessNumber('5029144-67.2024.8.26.0100');
    setCourt('TJSP - Tribunal de Justiça de São Paulo');
    setRepresentedParty('SulAmérica Companhia de Seguro Saúde');
    setDocumentType('Contestação');
    setSubjects([
      { subject: 'Reajuste Plano PME', custom_subject: null },
      { subject: 'Aviso Prévio', custom_subject: null },
    ]);
    setSpecialInstructions(
      'Enfatizar o Tema Repetitivo 1.065 do STJ quanto à licitude do aviso prévio de 60 dias e a higidez atuarial do contrato coletivo PME.'
    );

    // Cria um arquivo PDF binário legítimo mínimo para teste de upload
    const samplePdfContent =
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n';
    const sampleBlob = new Blob([samplePdfContent], { type: 'application/pdf' });
    const quickFile = new File([sampleBlob], 'Autos_Processo_5029144_SulAmerica.pdf', {
      type: 'application/pdf',
    });

    setSelectedFile({
      name: quickFile.name,
      size: quickFile.size,
      fileObj: quickFile,
    });

    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};

    if (!processNumber.trim()) {
      newErrors.processNumber = 'Informe o número do processo judicial (CNJ).';
    }
    if (!representedParty.trim()) {
      newErrors.representedParty = 'Informe a parte representada.';
    }
    if (subjects.length === 0) {
      newErrors.subjects = 'Selecione ao menos uma matéria pertinente ao caso.';
    }

    // Validação específica para "Outro"
    const outroItem = subjects.find((s) => s.subject === 'Outro');
    if (outroItem && (!outroItem.custom_subject || !outroItem.custom_subject.trim())) {
      newErrors.subjects = 'Por favor, preencha a descrição da matéria específica selecionada em "Outro".';
    }

    if (!selectedFile || !selectedFile.fileObj) {
      newErrors.file = 'É obrigatório anexar o processo integral em formato PDF.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setProgressStatus('Iniciando registro da solicitação...');

    try {
      const result = await generationService.createProcessAndJob({
        process_number: processNumber.trim(),
        court,
        represented_party: representedParty.trim(),
        document_type: documentType,
        subjects,
        special_instructions: specialInstructions.trim() || null,
        file: selectedFile!.fileObj,
        onProgressState: (status) => setProgressStatus(status),
      });

      // Redireciona para tela de acompanhamento real
      onNavigate(`/app/${organization.slug}/geracoes/${result.job_id}`);
    } catch (err: unknown) {
      console.error('Erro na submissão de Nova Peça:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao registrar solicitação. Tente novamente.';
      setErrors({ submit: msg });
      setIsSubmitting(false);
      setProgressStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span className="text-slate-600">•</span>
            <span>MÓDULO DE PRODUÇÃO FORENSE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Nova Peça Processual
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Forneça as diretrizes da causa para persistência do processo e estruturação do pipeline.
          </p>
        </div>

        {/* Quick Fill Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={fillQuickCase}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Preencher Exemplo (Caso SulAmérica)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* SECTION 1: DADOS PROCESSUAIS BÁSICOS */}
        <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-slate-800 text-cyan-400 flex items-center justify-center font-mono-tech text-[10px]">
                01
              </span>
              <span>Identificação do Processo & Juízo</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono-tech">Campos Obrigatórios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NÚMERO DO PROCESSO */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                NÚMERO DO PROCESSO <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={processNumber}
                onChange={(e) => setProcessNumber(e.target.value)}
                placeholder="Ex: 5014382-19.2024.8.26.0100"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 font-mono-tech focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-60"
              />
              {errors.processNumber && (
                <p className="text-[11px] text-rose-400">{errors.processNumber}</p>
              )}
            </div>

            {/* TRIBUNAL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                TRIBUNAL / ÓRGÃO JULGADOR <span className="text-cyan-400">*</span>
              </label>
              <select
                disabled={isSubmitting}
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-60"
              >
                {COURTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* PARTE REPRESENTADA */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                PARTE REPRESENTADA (CLIENTE) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={representedParty}
                onChange={(e) => setRepresentedParty(e.target.value)}
                placeholder="Ex: SulAmérica Companhia de Seguro Saúde"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-60"
              />
              {errors.representedParty && (
                <p className="text-[11px] text-rose-400">{errors.representedParty}</p>
              )}
            </div>

            {/* TIPO DE PEÇA */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  TIPO DE PEÇA <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[10px] text-cyan-400 font-mono-tech">
                  Operacional
                </span>
              </div>
              <select
                disabled={isSubmitting}
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-60"
              >
                <option value="Contestação">Contestação (Ativo)</option>
                <option value="Recurso Inominado" disabled>
                  Recurso Inominado (Em validação)
                </option>
                <option value="Apelação" disabled>
                  Apelação (Em validação)
                </option>
                <option value="Agravo de Instrumento" disabled>
                  Agravo de Instrumento (Em breve)
                </option>
                <option value="Contraminuta de Agravo" disabled>
                  Contraminuta de Agravo (Em breve)
                </option>
                <option value="Contrarrazões" disabled>
                  Contrarrazões (Em breve)
                </option>
                <option value="Petição Intermediária" disabled>
                  Petição Intermediária (Em breve)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: MATÉRIA JURÍDICA */}
        <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 text-cyan-400 flex items-center justify-center font-mono-tech text-[10px]">
                  02
                </span>
                <span>Matéria Controvertida</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecione uma ou mais matérias para direcionamento da fundamentação técnica.
              </p>
            </div>
          </div>

          <SubjectMultiSelect
            selected={subjects}
            onChange={(newSubjects) => {
              setSubjects(newSubjects);
              setErrors((prev) => ({ ...prev, subjects: '' }));
            }}
            disabled={isSubmitting}
            error={errors.subjects}
          />
        </div>

        {/* SECTION 3: ORIENTAÇÕES ESPECÍFICAS (OPCIONAL) */}
        <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 text-cyan-400 flex items-center justify-center font-mono-tech text-[10px]">
                  03
                </span>
                <span>Orientações para este Caso</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Diretrizes táticas suplementares para guiar a argumentação.
              </p>
            </div>
            <span className="text-[11px] font-mono-tech text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              Opcional
            </span>
          </div>

          <textarea
            rows={3}
            disabled={isSubmitting}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Informe aspectos que mereçam atenção especial na elaboração da peça, teses que devam ser avaliadas ou outras orientações relevantes."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed font-sans disabled:opacity-60"
          />
        </div>

        {/* SECTION 4: UPLOAD DO PROCESSO */}
        <div className="p-6 rounded-xl bg-[#0B1325] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-slate-800 text-cyan-400 flex items-center justify-center font-mono-tech text-[10px]">
                04
              </span>
              <span>Anexo do Processo Judicial</span>
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono-tech">Storage Privado</span>
          </div>

          <PdfUploader
            disabled={isSubmitting}
            selectedFile={selectedFile}
            onFileSelect={(file) => {
              setSelectedFile(file);
              setErrors((prev) => ({ ...prev, file: '' }));
            }}
            onFileRemove={() => setSelectedFile(null)}
          />
          {errors.file && <p className="text-[11px] text-rose-400">{errors.file}</p>}
        </div>

        {/* SECTION 5: MODELO VALIDADO (ESTADO SEMANTICAMENTE NEUTRO) */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-cyan-200">
                Diretrizes e Arquitetura Jurídica
              </div>
              <p className="text-[11px] text-slate-400">
                Modelo jurídico validado será aplicado na etapa de processamento.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono-tech px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap self-start sm:self-center">
            Padrão Homologado
          </span>
        </div>

        {/* SUBMIT BUTTON & HONEST PROGRESS STATUS */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {isSubmitting
                ? progressStatus || 'Processando solicitação...'
                : 'Ao confirmar, o processo e o arquivo PDF serão persistidos com segurança no Supabase.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-xl shadow-cyan-950/60 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>{progressStatus || 'REGISTRANDO...'}</span>
              </>
            ) : (
              <>
                <span>GERAR PEÇA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
