import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Printer, Shield, BookOpen } from 'lucide-react';
import { GeneratedDocument } from '../types';
import { generationService } from '../services/generationService';

interface DocumentViewerModalProps {
  document: GeneratedDocument;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'full' | 'preliminaries' | 'merits' | 'requests'>('full');

  const handleCopy = () => {
    const text = `
${document.structured_content.addressing}

${document.structured_content.qualification}

${document.structured_content.preliminaries.map((p) => `${p.title}\n${p.subtitle || ''}\n${p.paragraphs.join('\n\n')}`).join('\n\n')}

${document.structured_content.facts_summary.map((f) => `${f.title}\n${f.paragraphs.join('\n\n')}`).join('\n\n')}

${document.structured_content.merits.map((m) => `${m.title}\n${m.subtitle || ''}\n${m.paragraphs.join('\n\n')}`).join('\n\n')}

DOS PEDIDOS:
${document.structured_content.requests.map((r, i) => `${i + 1}. ${r}`).join('\n')}

${document.structured_content.closing}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1526] border border-slate-700/70 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-100">
                  {document.title}
                </h3>
                <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {document.version}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Processo nº {document.process_number} • {document.metadata.court}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
              title="Copiar texto integral"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={() => generationService.downloadDocument(document, 'docx')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 rounded-lg border border-cyan-500/30 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX</span>
            </button>

            <button
              onClick={() => generationService.downloadDocument(document, 'pdf')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-900/50 border-b border-slate-800/80 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('full')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'full'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Peça Integral
          </button>
          <button
            onClick={() => setActiveTab('preliminaries')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'preliminaries'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Preliminares ({document.structured_content.preliminaries.length})
          </button>
          <button
            onClick={() => setActiveTab('merits')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'merits'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mérito ({document.structured_content.merits.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'requests'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pedidos ({document.structured_content.requests.length})
          </button>

          <div className="ml-auto flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-cyan-400" />
              ~{document.metadata.pages_estimated} páginas
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Modelo Validado CAW
            </span>
          </div>
        </div>

        {/* Document Body (Forensic Style Paper Simulator) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#080D1A] text-slate-200 font-editorial leading-relaxed text-sm md:text-base selection:bg-cyan-500/30">
          <div className="max-w-3xl mx-auto bg-[#0B1120] border border-slate-800/80 rounded-lg p-8 md:p-14 shadow-xl space-y-8">
            
            {/* Addressing */}
            <div className="font-sans text-xs md:text-sm font-semibold tracking-wider text-slate-300 uppercase leading-snug">
              {document.structured_content.addressing}
            </div>

            {/* Process & Parties */}
            <div className="font-sans text-xs border-y border-slate-800/80 py-3 space-y-1 text-slate-400">
              <div><strong className="text-slate-200">PROCESSO DIGITAL Nº:</strong> {document.process_number}</div>
              <div><strong className="text-slate-200">AUTOR:</strong> {document.metadata.represented_party === 'SulAmérica Companhia de Seguro Saúde' ? 'Carlos Alberto Mendonça ME' : 'Parte Autora'}</div>
              <div><strong className="text-slate-200">RÉ:</strong> {document.metadata.represented_party}</div>
            </div>

            {/* Qualification */}
            {(activeTab === 'full') && (
              <div className="text-justify indent-8 text-slate-300">
                {document.structured_content.qualification}
              </div>
            )}

            {/* Preliminaries */}
            {(activeTab === 'full' || activeTab === 'preliminaries') && (
              <div className="space-y-6">
                {document.structured_content.preliminaries.map((prelim, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-sans text-sm md:text-base font-bold text-cyan-200 tracking-wide">
                      {prelim.title}
                    </h4>
                    {prelim.subtitle && (
                      <div className="font-sans text-xs italic text-slate-400">
                        {prelim.subtitle}
                      </div>
                    )}
                    {prelim.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-justify indent-8 text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Facts Summary */}
            {(activeTab === 'full') && (
              <div className="space-y-6">
                {document.structured_content.facts_summary.map((fact, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-sans text-sm md:text-base font-bold text-cyan-200 tracking-wide">
                      {fact.title}
                    </h4>
                    {fact.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-justify indent-8 text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Merits */}
            {(activeTab === 'full' || activeTab === 'merits') && (
              <div className="space-y-6">
                {document.structured_content.merits.map((merit, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-sans text-sm md:text-base font-bold text-cyan-200 tracking-wide">
                      {merit.title}
                    </h4>
                    {merit.subtitle && (
                      <div className="font-sans text-xs italic text-slate-400">
                        {merit.subtitle}
                      </div>
                    )}
                    {merit.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-justify indent-8 text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Requests */}
            {(activeTab === 'full' || activeTab === 'requests') && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="font-sans text-sm md:text-base font-bold text-cyan-200 tracking-wide">
                  DOS PEDIDOS E REQUERIMENTOS
                </h4>
                <p className="text-justify indent-8 text-slate-300">
                  Ante o exposto, pugna a Ré a Vossa Excelência pelo acolhimento das razões defensivas, requerendo:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-4 font-sans text-xs md:text-sm">
                  {document.structured_content.requests.map((req, rIdx) => (
                    <li key={rIdx} className="leading-relaxed">
                      {req}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Closing */}
            {(activeTab === 'full') && (
              <div className="pt-6 font-sans text-xs md:text-sm text-slate-400 whitespace-pre-line text-right">
                {document.structured_content.closing}
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-[#0B1120] text-xs text-slate-400">
          <div>
            Revisado por: <span className="text-slate-200">{document.metadata.reviewed_by || 'Dr. Alexandre Castro'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
