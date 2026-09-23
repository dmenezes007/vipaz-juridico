import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps { compact?: boolean; }

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const nextMode = isDark ? 'light' : 'dark';
  const label = isDark ? 'Modo Claro' : 'Modo Escuro';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextMode)}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border vipaz-border bg-[var(--bg-surface)] vipaz-text-secondary hover:vipaz-text-primary transition-colors text-xs font-medium"
      title={`Alternar para ${label.toLowerCase()}`}
      aria-label={`Alternar para ${label.toLowerCase()}`}
    >
      <Icon className="w-3.5 h-3.5 vipaz-text-brand" />
      {!compact && <span className="hidden sm:inline text-[11px]">{label}</span>}
    </button>
  );
};