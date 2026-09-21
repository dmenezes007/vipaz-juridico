import React from 'react';
import { Menu, Building2, ChevronDown, ShieldCheck, Lock } from 'lucide-react';
import { Organization, Profile } from '../types';
import { ThemeToggle } from './ThemeToggle';

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
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#090F1E]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Mobile Toggle & Tenant Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Abrir navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-mono-tech text-[11px]">
            ORGANIZAÇÃO:
          </span>
          <button
            onClick={onOpenTenantSwitcher}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 hover:text-slate-900 dark:hover:text-white transition text-slate-800 dark:text-slate-200 font-medium"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="truncate max-w-[180px] md:max-w-none">{organization.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Right side: Theme Toggle, Security badge & User */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Seletor de Tema Light/Dark/System */}
        <ThemeToggle />

        {/* Emblema de Segurança e Sigilo Forense */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono-tech">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>Sigilo & RLS Ativo</span>
        </div>

        {/* Perfil Compacto */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {user?.full_name || 'Dr. José Antônio'}
            </div>
            <div className="text-[10px] text-slate-400">
              {user?.oab || 'OAB/RJ 114.760'}
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};
