import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB (limite real do bucket source-documents)

export interface SelectedPdfFile {
  name: string;
  size: number;
  fileObj: File;
}

interface PdfUploaderProps {
  onFileSelect: (file: SelectedPdfFile) => void;
  onFileRemove: () => void;
  selectedFile: SelectedPdfFile | null;
  disabled?: boolean;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Valida formato exclusivamente PDF
    const isPdfMime = file.type === 'application/pdf';
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');

    if (!isPdfMime && !isPdfExt) {
      setErrorMessage('Formato inválido. Por favor, anexe exclusivamente arquivos em formato PDF.');
      return;
    }

    // Valida tamanho real máximo do Storage (50 MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        `O arquivo excede o limite máximo permitido de 50 MB (${formatBytes(file.size)}). Reduza o tamanho ou otimize o PDF antes de enviar.`
      );
      return;
    }

    if (file.size === 0) {
      setErrorMessage('O arquivo selecionado está vazio (0 bytes). Selecione um arquivo PDF válido.');
      return;
    }

    // Entrega a instância nativa File real imediatamente para o formulário
    onFileSelect({
      name: file.name,
      size: file.size,
      fileObj: file,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    // Reseta o input para permitir selecionar o mesmo arquivo novamente se desejado
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200">
            PROCESSO JUDICIAL
          </label>
          <p className="text-xs text-slate-400">
            Anexe o processo integral em formato PDF para armazenamento seguro e análise forense.
          </p>
        </div>
        <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          PDF até 50MB
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleManualChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Selected File Card */}
      {selectedFile ? (
        <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200 truncate max-w-xs md:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Pronto para Envio
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                {formatBytes(selectedFile.size)} • O upload real ocorrerá ao submeter o formulário
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
              title="Substituir PDF"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setErrorMessage(null);
                onFileRemove();
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
              title="Remover arquivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed border-slate-800' : 'cursor-pointer'
          } ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Arraste o arquivo PDF aqui ou{' '}
            <span className="text-cyan-400 underline underline-offset-2">selecione no computador</span>
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            Processo integral eletrônico (limite de 50 MB por arquivo)
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-500/30 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
