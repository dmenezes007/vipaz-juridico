import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  FolderArchive,
  History,
  UserCheck,
  LogOut,
  Building2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Organization, Profile } from '../types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  organization: Organization;
  user: Profile | null;
  onLogout: () => void;
  onOpenTenantSwitcher: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  organization,
  user,
  onLogout,
  onOpenTenantSwitcher,
  isOpenMobile,
  onCloseMobile,
}) => {
  const tenantSlug = organization.slug;

  const navItems = [
    {
      label: 'Visão Geral',
      path: `/app/${tenantSlug}`,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Nova Peça',
      path: `/app/${tenantSlug}/nova-peca`,
      icon: <FilePlus2 className="w-4 h-4" />,
      highlight: true,
    },
    {
      label: 'Documentos',
      path: `/app/${tenantSlug}/documentos`,
      icon: <FolderArchive className="w-4 h-4" />,
    },
    {
      label: 'Histórico',
      path: `/app/${tenantSlug}/documentos`,
      icon: <History className="w-4 h-4" />,
    },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#090F1D] border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section / Brand */}
        <div className="flex flex-col">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('/')}
              className="group text-left flex flex-col focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition">
                  VIPAZ
                </span>
                <span className="text-xs uppercase tracking-widest font-semibold text-cyan-400 font-sans border-l border-slate-700 pl-2">
                  Jurídico
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono-tech mt-0.5">
                Alta Performance B2B
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item, index) => {
              const isActive =
                currentPath === item.path ||
                (item.label === 'Visão Geral' && currentPath === `/app/${tenantSlug}`) ||
                (item.label === 'Documentos' && currentPath.includes('/documentos'));

              return (
                <button
                  key={index}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section / Tenant & Profile */}
        <div className="p-3 border-t border-slate-800/90 space-y-2">
          {/* Tenant Switcher Button */}
          <div
            onClick={onOpenTenantSwitcher}
            className="cursor-pointer p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition">
                  {organization.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono-tech flex items-center gap-1">
                  <span>/app/{organization.slug}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </div>

          {/* User Profile Card */}
          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {user?.full_name || 'Usuário'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {user?.oab || (user?.role === 'admin' ? 'Administrador' : user?.role === 'senior_lawyer' ? 'Advogado Sênior' : user?.role === 'reviewer' ? 'Revisor' : 'Advogado')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
              <button
                onClick={() => onNavigate('/')}
                className="text-slate-400 hover:text-slate-200 transition flex items-center gap-1"
                title="Página Pública"
              >
                <span>Site Público</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>

              <button
                onClick={onLogout}
                className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1 font-medium"
              >
                <LogOut className="w-3 h-3" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
