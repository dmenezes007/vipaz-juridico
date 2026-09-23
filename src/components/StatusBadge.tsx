import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { JobStatus } from '../types';

interface StatusBadgeProps {
  status: JobStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const configs: Record<
    JobStatus,
    { text: string; bg: string; border: string; color: string; icon: React.ReactNode }
  > = {
    completed: {
      text: 'Concluído',
      bg: 'bg-emerald-50 dark:bg-emerald-950/35',
      border: 'border-emerald-300 dark:border-emerald-500/40',
      color: 'text-emerald-800 dark:text-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    processing: {
      text: 'Em processamento',
      bg: 'bg-cyan-50 dark:bg-cyan-950/35',
      border: 'border-cyan-300 dark:border-cyan-500/40',
      color: 'text-cyan-800 dark:text-cyan-200',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    pending: {
      text: 'Pendente',
      bg: 'bg-slate-100 dark:bg-slate-900/50',
      border: 'border-slate-300 dark:border-slate-700',
      color: 'text-slate-700 dark:text-slate-300',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    failed: {
      text: 'Falha',
      bg: 'bg-rose-50 dark:bg-rose-950/35',
      border: 'border-rose-300 dark:border-rose-500/40',
      color: 'text-rose-800 dark:text-rose-300',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[status] || configs.pending;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${current.bg} ${current.border} ${current.color} ${padding}`}
    >
      {current.icon}
      <span>{label || current.text}</span>
    </span>
  );
};
