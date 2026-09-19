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
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-500/30',
      color: 'text-emerald-400',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    processing: {
      text: 'Em processamento',
      bg: 'bg-cyan-950/30',
      border: 'border-cyan-500/30',
      color: 'text-cyan-400',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    pending: {
      text: 'Pendente',
      bg: 'bg-slate-900/40',
      border: 'border-slate-700/60',
      color: 'text-slate-400',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    failed: {
      text: 'Falha',
      bg: 'bg-rose-950/30',
      border: 'border-rose-500/30',
      color: 'text-rose-400',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[status] || configs.pending;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.border} ${current.color} ${padding}`}
    >
      {current.icon}
      <span>{label || current.text}</span>
    </span>
  );
};
