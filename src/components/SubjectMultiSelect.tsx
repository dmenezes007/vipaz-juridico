import React, { useState, useEffect } from 'react';
import { Check, Tag, X } from 'lucide-react';

export interface SelectedSubjectItem {
  subject: string;
  custom_subject?: string | null;
}

interface SubjectMultiSelectProps {
  selected: SelectedSubjectItem[];
  onChange: (subjects: SelectedSubjectItem[]) => void;
  options?: string[];
  disabled?: boolean;
  error?: string;
}

export const VALID_SUBJECT_OPTIONS = [
  'Reajuste Plano PME',
  'Reajuste Plano Individual',
  'Aviso Prévio',
  'Prêmio Complementar',
  'Outro',
];

export const SubjectMultiSelect: React.FC<SubjectMultiSelectProps> = ({
  selected,
  onChange,
  options = VALID_SUBJECT_OPTIONS,
  disabled = false,
  error,
}) => {
  const outroItem = selected.find((s) => s.subject === 'Outro');
  const isOutroSelected = Boolean(outroItem);
  const [customText, setCustomText] = useState(outroItem?.custom_subject || '');

  useEffect(() => {
    if (outroItem && outroItem.custom_subject !== customText) {
      setCustomText(outroItem.custom_subject || '');
    }
  }, [outroItem]);

  const toggleOption = (opt: string) => {
    if (disabled) return;

    if (opt === 'Outro') {
      if (isOutroSelected) {
        // Desmarca Outro
        onChange(selected.filter((s) => s.subject !== 'Outro'));
      } else {
        // Marca Outro com o texto atual
        onChange([...selected, { subject: 'Outro', custom_subject: customText.trim() || null }]);
      }
      return;
    }

    const exists = selected.some((s) => s.subject === opt);
    if (exists) {
      onChange(selected.filter((s) => s.subject !== opt));
    } else {
      onChange([...selected, { subject: opt, custom_subject: null }]);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomText(val);

    if (isOutroSelected) {
      onChange(
        selected.map((s) =>
          s.subject === 'Outro' ? { ...s, custom_subject: val } : s
        )
      );
    }
  };

  const removeSelected = (subjectName: string) => {
    if (disabled) return;
    onChange(selected.filter((s) => s.subject !== subjectName));
  };

  return (
    <div className="space-y-3">
      {/* Pills selector */}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected =
            option === 'Outro'
              ? isOutroSelected
              : selected.some((s) => s.subject === option);

          return (
            <button
              type="button"
              key={option}
              disabled={disabled}
              onClick={() => toggleOption(option)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-200 ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : (
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Custom input if "Outro" is selected */}
      {isOutroSelected && (
        <div className="p-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-cyan-300">
              Descreva a matéria específica do caso <span className="text-rose-400">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono-tech">Obrigatório para &quot;Outro&quot;</span>
          </div>
          <input
            type="text"
            disabled={disabled}
            value={customText}
            onChange={handleCustomTextChange}
            placeholder="Ex: Limitação de Coparticipação em Tratamento Continuado"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          {!customText.trim() && (
            <p className="text-[11px] text-amber-400">
              Preencha o nome da matéria para prosseguir com a seleção.
            </p>
          )}
        </div>
      )}

      {/* Active tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Selecionadas:</span>
          {selected.map((item) => (
            <span
              key={item.subject}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700 text-xs text-slate-200"
            >
              <span>
                {item.subject === 'Outro'
                  ? `Outro: ${item.custom_subject?.trim() || '(preencher)'}`
                  : item.subject}
              </span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeSelected(item.subject)}
                className="text-slate-400 hover:text-rose-400 transition"
                title="Remover matéria"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
};
