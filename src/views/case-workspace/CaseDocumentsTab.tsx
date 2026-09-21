import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  FileText,
  Upload,
  Check,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { CaseDocumentItem, LegalCaseWorkspace } from '../../types/caseTypes';
import { caseWorkspaceService } from '../../services/caseWorkspaceService';

interface CaseDocumentsTabProps {
  caseData: LegalCaseWorkspace;
  onViewDocModal?: (docName: string) => void;
}

export const CaseDocumentsTab: React.FC<CaseDocumentsTabProps> = ({
  caseData,
}) => {
  const [search, setSearch] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingClassification, setEditingClassification] = useState('');
  const [documents, setDocuments] = useState<CaseDocumentItem[]>(caseData.documents);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<CaseDocumentItem | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.suggested_classification.toLowerCase().includes(search.toLowerCase()) ||
      (doc.confirmed_classification || '').toLowerCase().includes(search.toLowerCase());

    const matchesOrigin =
      selectedOrigin === 'all' || doc.source_origin === selectedOrigin;

    return matchesSearch && matchesOrigin;
  });

  const handleStartEdit = (doc: CaseDocumentItem) => {
    setEditingDocId(doc.id);
    setEditingClassification(doc.confirmed_classification || doc.suggested_classification);
  };

  const handleSaveClassification = (docId: string) => {
    caseWorkspaceService.updateDocumentClassification(docId, editingClassification);
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, confirmed_classification: editingClassification, is_confirmed: true }
          : d
      )
    );
    setEditingDocId(null);
  };

  const handleConfirmClassification = (docId: string, classification: string) => {
    caseWorkspaceService.updateDocumentClassification(docId, classification);
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, confirmed_classification: classification, is_confirmed: true }
          : d
      )
    );
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: CaseDocumentItem = {
        id: `doc-${Date.now()}`,
        name: file.name,
        suggested_classification: 'Subsídios Técnicos da Operadora',
        confirmed_classification: 'Subsídios Técnicos da Operadora',
        is_confirmed: true,
        file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages_count: 5,
        uploaded_at: 'Agora',
        source_origin: 'Subsídios da Operadora',
      };
      caseWorkspaceService.addDocument(newDoc);
      setDocuments((prev) => [newDoc, ...prev]);
      setIsUploading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Documentos do Caso */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Documentos & Autos do Caso
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Peças processuais, autos eletrônicos, decisões e subsídios probatórios da operadora.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition shadow-sm self-start md:self-center">
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Adicionando...' : 'Adicionar Documento / Subsídio'}</span>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleSimulateUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do arquivo, classificação ou origem..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Todas as Origens</option>
            <option value="Autos Eletrônicos">Autos Eletrônicos</option>
            <option value="Subsídios da Operadora">Subsídios da Operadora</option>
            <option value="Anexo do Advogado">Anexo do Advogado</option>
          </select>
        </div>
      </div>

      {/* Tabela Clean de Documentos */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-mono-tech text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Documento</th>
                <th className="px-5 py-3">Origem</th>
                <th className="px-5 py-3">Classificação Sugerida</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredDocs.map((doc) => {
                const isEditing = editingDocId === doc.id;
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs md:max-w-md">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {doc.pages_count} páginas • {doc.file_size} • {doc.uploaded_at}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {doc.source_origin}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingClassification}
                            onChange={(e) => setEditingClassification(e.target.value)}
                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleSaveClassification(doc.id)}
                            className="p-1 rounded bg-emerald-600 text-white"
                            title="Salvar classificação"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {doc.confirmed_classification || doc.suggested_classification}
                          </span>
                          <button
                            onClick={() => handleStartEdit(doc)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
                            title="Renomear classificação"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      {doc.is_confirmed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmada
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleConfirmClassification(
                              doc.id,
                              doc.suggested_classification
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition"
                          title="Clique para confirmar a classificação sugerida"
                        >
                          <Check className="w-3 h-3" />
                          Confirmar
                        </button>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedDocForPreview(doc)}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>Visualizar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Pré-visualização do Documento */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedDocForPreview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Fechar
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-400">Classificação: </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {selectedDocForPreview.confirmed_classification || selectedDocForPreview.suggested_classification}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-400">Origem: </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {selectedDocForPreview.source_origin}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-400">Extensão & Páginas: </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {selectedDocForPreview.pages_count} páginas ({selectedDocForPreview.file_size})
                </span>
              </div>
            </div>

            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Documento digitalizado indexado na infraestrutura de evidências do caso.
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
              >
                Concluir Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
