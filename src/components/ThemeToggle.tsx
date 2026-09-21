import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode }> = [
    { mode: 'light', label: 'Modo Claro', icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: 'dark', label: 'Modo Escuro', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'system', label: 'Padrão do Sistema', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  const currentIcon =
    theme === 'system' ? (
      <Laptop className="w-3.5 h-3.5" />
    ) : resolvedTheme === 'dark' ? (
      <Moon className="w-3.5 h-3.5" />
    ) : (
      <Sun className="w-3.5 h-3.5" />
    );

  const currentLabel =
    theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Escuro' : 'Claro';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-xs font-medium focus:outline-none"
        title="Alternar tema de interface"
        aria-label="Alternar tema de interface"
      >
        <span className="text-slate-500 dark:text-slate-400">{currentIcon}</span>
        {!compact && <span className="hidden sm:inline text-[11px]">{currentLabel}</span>}
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
            Aparência
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}>
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
