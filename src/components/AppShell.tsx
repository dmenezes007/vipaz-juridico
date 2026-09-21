import React, { useState, useEffect } from 'react';
import { Organization, Profile } from '../types';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TenantSwitcherModal } from './TenantSwitcherModal';

interface AppShellProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  organization: Organization;
  user: Profile | null;
  onLogout: () => void;
  onSwitchTenant: (slug: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  currentPath,
  onNavigate,
  organization,
  user,
  onLogout,
  onSwitchTenant,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vipaz_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('vipaz_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        organization={organization}
        user={user}
        onLogout={onLogout}
        onOpenTenantSwitcher={() => setIsTenantModalOpen(true)}
        isOpenMobile={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          organization={organization}
          user={user}
          onOpenTenantSwitcher={() => setIsTenantModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Multi-Tenant Switcher Modal */}
      {isTenantModalOpen && (
        <TenantSwitcherModal
          currentOrg={organization}
          onSelectOrg={(slug) => {
            onSwitchTenant(slug);
            onNavigate(`/app/${slug}`);
          }}
          onClose={() => setIsTenantModalOpen(false)}
        />
      )}
    </div>
  );
};
