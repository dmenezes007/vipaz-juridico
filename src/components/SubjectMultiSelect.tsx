import React, { useState } from 'react';
import { Check, Plus, Tag, X } from 'lucide-react';

interface SubjectMultiSelectProps {
  selected: string[];
  onChange: (subjects: string[]) => void;
  options?: string[];
}

const DEFAULT_OPTIONS = [
  'Reajuste Plano PME',
  'Reajuste Plano Individual',
  'Aviso Prévio',
  'Prêmio Complementar',
  'Outro',
];

export const SubjectMultiSelect: React.FC<SubjectMultiSelectProps> = ({
  selected,
  onChange,
  options = DEFAULT_OPTIONS,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(
    selected.some((s) => !DEFAULT_OPTIONS.filter((o) => o !== 'Outro').includes(s) && s !== 'Outro')
  );

  const toggleOption = (opt: string) => {
    if (opt === 'Outro') {
      setShowCustomInput(!showCustomInput);
      return;
    }

    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const handleAddCustom = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customInput.trim()) return;

    const trimmed = customInput.trim();
    if (!selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomInput('');
  };

  const removeSelected = (item: string) => {
    onChange(selected.filter((s) => s !== item));
  };

  return (
    <div className="space-y-3">
      {/* Pills selector */}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === 'Outro' ? showCustomInput : selected.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() => toggleOption(option)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              {isSelected && option !== 'Outro' ? (
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : (
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Custom input if "Outro" selected */}
      {showCustomInput && (
        <div className="flex items-center gap-2 p-3 bg-slate-900/40 border border-slate-700/60 rounded-lg">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleAddCustom}
            placeholder="Informe a matéria específica (ex: Limitação de Coparticipação)"
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      )}

      {/* Active tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Selecionadas:</span>
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-xs text-slate-200"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeSelected(item)}
                className="hover:text-rose-400 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
