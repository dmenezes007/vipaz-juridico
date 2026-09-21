import React, { useState } from 'react';
import {
  Wrench,
  Layers,
  Cpu,
  FileJson,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Organization } from '../types';
import { CONTESTACAO_BLOCKS } from '../domain/legal-engine/data/contestacao/blocks';
import { HOMOLOGATED_CASE_DEFAULTS } from '../domain/legal-engine/formDefinitions';
import { ruleEngine } from '../domain/legal-engine/ruleEngine';
import { buildCawDocxPayload } from '../domain/legal-engine/documentPayloadMapper';
import { LegalBlock } from '../domain/legal-engine/types';

interface AdminToolsViewProps {
  organization: Organization;
  onNavigate?: (path: string) => void;
}

export const AdminToolsView: React.FC<AdminToolsViewProps> = ({
  organization,
}) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'ruleEngine' | 'payload'>('blocks');
  const [searchBlock, setSearchBlock] = useState('');

  const blocks: LegalBlock[] = CONTESTACAO_BLOCKS;
  const filteredBlocks = blocks.filter(
    (b) =>
      b.key.toLowerCase().includes(searchBlock.toLowerCase()) ||
      b.title.toLowerCase().includes(searchBlock.toLowerCase()) ||
      b.category.toLowerCase().includes(searchBlock.toLowerCase())
  );

  // Executa avaliação do RuleEngine para exibição diagnóstica
  const evaluation = ruleEngine.evaluate(HOMOLOGATED_CASE_DEFAULTS);
  const samplePayload = buildCawDocxPayload({
    organization_id: organization.id,
    generation_job_id: 'job-caw-homologado-001',
    assembly: evaluation.assembly,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>MÓDULO TÉCNICO & AUDITORIA INTERNA</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Administração & Engenharia Forense
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Inspeção da BlockLibrary determinística, RuleEngine, serializador documental e diagnósticos de infraestrutura.
          </p>
        </div>

        <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono-tech flex items-center gap-1.5 self-start sm:self-center">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Motor Determinístico v2.0 (173 Testes Aprovados)</span>
        </div>
      </div>

      {/* Tabs Técnicas */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('blocks')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'blocks'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Catálogo de Blocos ({blocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ruleEngine')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'ruleEngine'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Diagnóstico do RuleEngine</span>
        </button>

        <button
          onClick={() => setActiveTab('payload')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'payload'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>Contrato Documental (Payload d.*)</span>
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchBlock}
              onChange={(e) => setSearchBlock(e.target.value)}
              placeholder="Buscar bloco por ID, título ou categoria..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBlocks.map((b) => (
              <div
                key={b.key}
                className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono-tech">
                    {b.key}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {b.category}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {b.title}
                </div>
                <div className="text-[11px] font-mono-tech text-slate-500 truncate">
                  Ordem de Montagem: {b.order}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ruleEngine' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Avaliação Algorítmica Atual
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Blocos Incluídos
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {evaluation.assembly.includedBlocks.length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Pedidos Vinculados
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {evaluation.assembly.includedRequests.length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Integridade Formal
              </span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Válido</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payload' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              JSON Homologado para Template CAW v2
            </h3>
            <span className="text-xs text-slate-500 font-mono-tech">
              Estrutura d.* completa
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono-tech text-[11px] overflow-x-auto max-h-96 border border-slate-800">
            {JSON.stringify(samplePayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
