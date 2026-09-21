import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Bookmark,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { LegalCaseWorkspace, StrategyItem, StrategyItemStatus } from '../../types/caseTypes';
import { caseWorkspaceService } from '../../services/caseWorkspaceService';

interface CaseStrategyTabProps {
  caseData: LegalCaseWorkspace;
  onUpdateStrategy: () => void;
}

export const CaseStrategyTab: React.FC<CaseStrategyTabProps> = ({
  caseData,
  onUpdateStrategy,
}) => {
  const [items, setItems] = useState<StrategyItem[]>(caseData.strategy_items);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleStatusChange = (itemId: string, newStatus: StrategyItemStatus) => {
    caseWorkspaceService.updateStrategyItemStatus(itemId, newStatus);
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, status: newStatus } : it))
    );
    onUpdateStrategy();
  };

  const filteredItems = items.filter((it) => {
    if (selectedCategory === 'all') return true;
    return it.category === selectedCategory;
  });

  const confirmedCount = items.filter((i) => i.status === 'confirmed').length;
  const discardedCount = items.filter((i) => i.status === 'discarded').length;
  const suggestedCount = items.filter((i) => i.status === 'suggested' || i.status === 'requires_val').length;

  const getStatusBadge = (status: StrategyItemStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Confirmado pelo Advogado
          </span>
        );
      case 'discarded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 line-through">
            Descartado
          </span>
        );
      case 'requires_val':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-3 h-3" />
            Requer Validação
          </span>
        );
      case 'suggested':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300">
            <Sparkles className="w-3 h-3" />
            Sugerido pela Análise
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Estratégia */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel Estratégico do Advogado</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Construção da Estratégia Defensiva
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Defina quais teses, preliminares e pedidos integrarão a contestação oficial da operadora.
          </p>
        </div>

        {/* Indicadores de Decisão */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {confirmedCount}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Confirmadas</div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-center">
            <div className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
              {suggestedCount}
            </div>
            <div className="text-[10px] text-cyan-600 dark:text-cyan-400">Sugeridas</div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {discardedCount}
            </div>
            <div className="text-[10px] text-slate-500">Descartadas</div>
          </div>
        </div>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedCategory === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Todas as Matérias ({items.length})
        </button>
        <button
          onClick={() => setSelectedCategory('preliminar')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedCategory === 'preliminar'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Preliminares Processuais
        </button>
        <button
          onClick={() => setSelectedCategory('prejudicial')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedCategory === 'prejudicial'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Prejudiciais (Prescrição)
        </button>
        <button
          onClick={() => setSelectedCategory('merito')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedCategory === 'merito'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Teses de Mérito
        </button>
        <button
          onClick={() => setSelectedCategory('pedido_defensivo')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedCategory === 'pedido_defensivo'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Requerimentos & Pedidos
        </button>
      </div>

      {/* Lista Interativa de Teses e Decisões do Advogado */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isConfirmed = item.status === 'confirmed';
          const isDiscarded = item.status === 'discarded';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900/90 border transition shadow-sm ${
                isDiscarded
                  ? 'border-slate-200 dark:border-slate-800/60 opacity-60'
                  : isConfirmed
                  ? 'border-emerald-200 dark:border-emerald-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-[10px] uppercase tracking-wider font-mono-tech text-slate-400">
                      {item.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Controles de Decisão Direta do Advogado */}
                <div className="flex items-center gap-2 shrink-0 self-start md:self-center pt-2 md:pt-0">
                  {isConfirmed ? (
                    <button
                      onClick={() => handleStatusChange(item.id, 'discarded')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-400 text-xs text-slate-600 dark:text-slate-300 hover:text-rose-600 transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Descartar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(item.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirmar Tese</span>
                    </button>
                  )}

                  {!isDiscarded && !isConfirmed && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'discarded')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Descartar tese"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota Informativa de Conexão Automática */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
        <span>
          As teses confirmadas acima são sincronizadas automaticamente com a estrutura da peça oficial na aba <strong>Peças</strong>.
        </span>
      </div>
    </div>
  );
};
