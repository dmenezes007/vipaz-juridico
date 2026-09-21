import React from 'react';
import {
  LayoutDashboard,
  FolderArchive,
  BookOpen,
  BarChart3,
  Wrench,
  Plus,
  LogOut,
  Building2,
  ChevronRight,
  ShieldCheck,
  Scale,
  PanelLeftClose,
  PanelLeft,
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const tenantSlug = organization.slug;

  const globalNavItems = [
    {
      label: 'Início',
      path: `/app/${tenantSlug}`,
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      matches: (p: string) => p === `/app/${tenantSlug}`,
    },
    {
      label: 'Casos',
      path: `/app/${tenantSlug}/casos`,
      icon: <Scale className="w-4 h-4 shrink-0" />,
      matches: (p: string) => p.includes('/casos') || p.includes('/caso/'),
    },
    {
      label: 'Peças & Autos',
      path: `/app/${tenantSlug}/documentos`,
      icon: <FolderArchive className="w-4 h-4 shrink-0" />,
      matches: (p: string) => p.includes('/documentos'),
    },
    {
      label: 'Biblioteca',
      path: `/app/${tenantSlug}/biblioteca`,
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      matches: (p: string) => p.includes('/biblioteca'),
    },
    {
      label: 'Indicadores',
      path: `/app/${tenantSlug}/indicadores`,
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      matches: (p: string) => p.includes('/indicadores'),
    },
  ];

  const adminNavItems = [
    {
      label: 'Administração',
      path: `/app/${tenantSlug}/admin`,
      icon: <Wrench className="w-4 h-4 shrink-0" />,
      matches: (p: string) => p.includes('/admin'),
    },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Backdrop para mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white dark:bg-[#090F1E] border-r border-slate-200 dark:border-slate-800/90 flex flex-col justify-between transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section / Brand */}
        <div className="flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => handleNav(`/app/${tenantSlug}`)}
              className="text-left flex items-center gap-2.5 focus:outline-none overflow-hidden"
              title="VIPAZ Jurídico"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm font-editorial shrink-0">
                V
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-editorial text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      VIPAZ
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400">
                      Jurídico
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono-tech">
                    LegalTech Enterprise
                  </span>
                </div>
              )}
            </button>

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              >
                {isCollapsed ? (
                  <PanelLeft className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Botão Nova Peça / Novo Caso */}
          <div className="p-3">
            <button
              onClick={() => handleNav(`/app/${tenantSlug}/nova-peca`)}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm ${
                isCollapsed ? 'px-2' : 'px-3'
              }`}
              title="Nova Peça / Caso"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Nova Peça</span>}
            </button>
          </div>

          {/* Navegação Global */}
          <nav className="p-3 space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Workspace
              </div>
            )}
            {globalNavItems.map((item, index) => {
              const isActive = item.matches(currentPath);

              return (
                <button
                  key={index}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold border border-slate-200 dark:border-slate-700/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  )}
                </button>
              );
            })}

            {/* Divisor */}
            <div className="pt-2 pb-1">
              <div className="border-t border-slate-200 dark:border-slate-800/80" />
            </div>

            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Governança
              </div>
            )}

            {adminNavItems.map((item, index) => {
              const isActive = item.matches(currentPath);
              return (
                <button
                  key={index}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold border border-slate-200 dark:border-slate-700/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section / Tenant & User */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
          {/* Tenant Switcher */}
          <button
            onClick={onOpenTenantSwitcher}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
            } rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left`}
            title={`Organização: ${organization.name}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {organization.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono-tech">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Tenant Isolado</span>
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </button>

          {/* User Profile & Logout */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pt-1 px-1`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {user?.full_name || 'Dr. José Antônio'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user?.oab || 'OAB/RJ 114.760'}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
