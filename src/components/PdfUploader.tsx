import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react';

interface PdfUploaderProps {
  onFileSelect: (file: { name: string; size: number; fileObj?: File }) => void;
  onFileRemove: () => void;
  selectedFile: { name: string; size: number } | null;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
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

    // Valida tipo
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Formato inválido. Por favor, anexe exclusivamente arquivos em formato PDF.');
      return;
    }

    // Valida tamanho máximo (ex: 150MB para autos processuais integrais)
    const MAX_SIZE = 150 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage('O arquivo excede o limite máximo permitido de 150 MB.');
      return;
    }

    // Simulação refinada de upload para Supabase Storage
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          onFileSelect({
            name: file.name,
            size: file.size,
            fileObj: file,
          });
          return null;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
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
            Anexe o processo integral em formato PDF.
          </p>
        </div>
        <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          PDF até 150MB
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleManualChange}
        className="hidden"
      />

      {/* Upload State / File Display */}
      {selectedFile ? (
        <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200 truncate max-w-xs md:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Carregado
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                {formatBytes(selectedFile.size)} • Armazenamento isolado por tenant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Substituir PDF"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onFileRemove}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Remover arquivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : uploadProgress !== null ? (
        <div className="p-6 bg-slate-900/60 border border-cyan-500/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-cyan-300">Enviando processo para repositório criptografado...</span>
            <span className="font-mono-tech text-cyan-400">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
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
            Processo integral eletrônico (autos completos, petição inicial, decisões e documentos)
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
