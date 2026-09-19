import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  Building2,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { Organization, GeneratedDocument } from '../types';
import { generationService } from '../services/generationService';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface DocumentosViewProps {
  organization: Organization;
  onNavigate: (path: string) => void;
}

export const DocumentosView: React.FC<DocumentosViewProps> = ({
  organization,
  onNavigate,
}) => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<GeneratedDocument | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    generationService.listDocuments(organization.id, undefined, search).then(setDocuments);
  }, [organization.id, search]);

  const filteredDocs = documents.filter((doc) => {
    if (selectedSubjectFilter === 'all') return true;
    return doc.metadata.subjects.includes(selectedSubjectFilter);
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  // Extract all unique subjects for filter options
  const allSubjects = Array.from(
    new Set(documents.flatMap((d) => d.metadata.subjects))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono-tech uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span className="text-slate-600">•</span>
            <span>REPOSITÓRIO DE PEÇAS HOMOLOGADAS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Documentos & Histórico
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Acervo de peças processuais estruturadas e validadas nesta organização.
          </p>
        </div>

        <button
          onClick={() => onNavigate(`/app/${organization.slug}/nova-peca`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm self-start sm:self-center"
        >
          <FileText className="w-4 h-4" />
          <span>Nova Peça</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0B1325] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por número do processo, matéria, parte ou palavra-chave..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">Todas as Matérias</option>
              {allSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
            title="Inverter ordenação cronológica"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>{sortAsc ? 'Mais antigos' : 'Mais recentes'}</span>
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl bg-[#0B1325] border border-slate-800 overflow-hidden">
        {sortedDocs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-3">
            <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p>Nenhum documento encontrado com os critérios de busca selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono-tech text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Processo</th>
                  <th className="px-5 py-3">Peça & Matéria</th>
                  <th className="px-5 py-3">Data de Homologação</th>
                  <th className="px-5 py-3">Responsável</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-5 py-4 font-mono-tech">
                      <div className="font-semibold text-slate-100">
                        {doc.process_number}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans truncate max-w-[220px]">
                        {doc.metadata.court}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-200">{doc.document_type}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.metadata.subjects.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-400 font-mono-tech">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(doc.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(doc.created_at).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      <div>{doc.metadata.reviewed_by || 'Dr. Alexandre Castro'}</div>
                      <div className="text-[10px] text-slate-500">Sócio Homologador</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        Validada
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition inline-flex items-center gap-1"
                        title="Visualizar Peça Integral"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Visualizar</span>
                      </button>

                      <button
                        onClick={() => generationService.downloadDocument(doc, 'docx')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition inline-flex items-center gap-1"
                        title="Baixar em formato DOCX"
                      >
                        <Download className="w-3 h-3 text-slate-400" />
                        <span>DOCX</span>
                      </button>

                      <button
                        onClick={() => generationService.downloadDocument(doc, 'pdf')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition inline-flex items-center gap-1"
                        title="Baixar em formato PDF"
                      >
                        <Download className="w-3 h-3 text-slate-400" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
};
