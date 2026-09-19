import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { Organization } from '../types';

interface TenantBadgeProps {
  organization: Organization;
  onClick?: () => void;
  interactive?: boolean;
}

export const TenantBadge: React.FC<TenantBadgeProps> = ({
  organization,
  onClick,
  interactive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
        interactive
          ? 'cursor-pointer border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-200'
          : 'border-slate-700/60 bg-slate-900/60 text-slate-300'
      }`}
    >
      <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span className="font-semibold tracking-wide truncate max-w-[180px]">
        {organization.name}
      </span>
      <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400/80 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
        <ShieldCheck className="w-2.5 h-2.5" />
        Tenant Ativo
      </span>
    </div>
  );
};
