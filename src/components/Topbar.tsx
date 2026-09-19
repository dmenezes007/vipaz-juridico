import React from 'react';
import { Menu, Building2, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { Organization, Profile } from '../types';

interface TopbarProps {
  organization: Organization;
  user: Profile | null;
  onOpenTenantSwitcher: () => void;
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  organization,
  user,
  onOpenTenantSwitcher,
  onToggleMobileMenu,
}) => {
  const formatRole = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'senior_lawyer':
        return 'Advogado Sênior';
      case 'lawyer':
        return 'Advogado';
      case 'reviewer':
        return 'Revisor Jurídico';
      default:
        return '';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Tenant Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Abrir navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline text-slate-500 font-mono-tech">AMBIENTE:</span>
          <button
            onClick={onOpenTenantSwitcher}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:text-slate-200 transition text-slate-300 font-medium"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[200px] md:max-w-none">{organization.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Right side: Greeting & Security badge */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 font-mono-tech">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Isolamento RLS Ativo</span>
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-200">
              {user?.full_name || 'Usuário'}
            </div>
            <div className="text-[11px] text-slate-400">
              {user?.oab || formatRole(user?.role)}
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-medium text-xs">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
