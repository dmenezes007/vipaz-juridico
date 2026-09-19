import React, { useEffect, useState } from 'react';
import { authService, AuthSession, ORGANIZATIONS } from './services/authService';
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { AppShell } from './components/AppShell';
import { DashboardView } from './views/DashboardView';
import { NovaPecaView } from './views/NovaPecaView';
import { GeracaoView } from './views/GeracaoView';
import { DocumentosView } from './views/DocumentosView';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  // Listen for browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate helper with history pushState
  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleSwitchTenant = (slug: 'caw' | 'invicta') => {
    authService.switchTenant(slug);
  };

  // Route 1: Landing Page
  if (currentPath === '/' || currentPath === '') {
    return <LandingPage onNavigate={navigate} />;
  }

  // Route 2: Login Page
  if (currentPath === '/login') {
    return (
      <LoginPage
        onLoginSuccess={(tenantSlug) => {
          navigate(`/app/${tenantSlug}`);
        }}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // Authenticated Area Protection: /app/*
  if (currentPath.startsWith('/app')) {
    // If not authenticated, redirect to login
    if (!session) {
      return (
        <LoginPage
          onLoginSuccess={(tenantSlug) => {
            navigate(`/app/${tenantSlug}`);
          }}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    const currentOrg = session.organization;

    // Normalizes /app or /app/ without tenant to active tenant
    if (currentPath === '/app' || currentPath === '/app/') {
      const target = `/app/${currentOrg.slug}`;
      window.history.replaceState({}, '', target);
      return (
        <AppShell
          currentPath={target}
          onNavigate={navigate}
          organization={currentOrg}
          user={session.user}
          onLogout={handleLogout}
          onSwitchTenant={handleSwitchTenant}
        >
          <DashboardView organization={currentOrg} onNavigate={navigate} />
        </AppShell>
      );
    }

    // Match /app/:slug/geracoes/:id
    const geracoesMatch = currentPath.match(/^\/app\/([a-zA-Z0-9_-]+)\/geracoes\/([a-zA-Z0-9_-]+)$/);
    if (geracoesMatch) {
      const jobId = geracoesMatch[2];
      return (
        <AppShell
          currentPath={currentPath}
          onNavigate={navigate}
          organization={currentOrg}
          user={session.user}
          onLogout={handleLogout}
          onSwitchTenant={handleSwitchTenant}
        >
          <GeracaoView
            jobId={jobId}
            organization={currentOrg}
            onNavigate={navigate}
          />
        </AppShell>
      );
    }

    // Match /app/:slug/nova-peca
    const novaPecaMatch = currentPath.match(/^\/app\/([a-zA-Z0-9_-]+)\/nova-peca$/);
    if (novaPecaMatch) {
      return (
        <AppShell
          currentPath={currentPath}
          onNavigate={navigate}
          organization={currentOrg}
          user={session.user}
          onLogout={handleLogout}
          onSwitchTenant={handleSwitchTenant}
        >
          <NovaPecaView
            organization={currentOrg}
            onNavigate={navigate}
          />
        </AppShell>
      );
    }

    // Match /app/:slug/documentos
    const documentosMatch = currentPath.match(/^\/app\/([a-zA-Z0-9_-]+)\/documentos$/);
    if (documentosMatch) {
      return (
        <AppShell
          currentPath={currentPath}
          onNavigate={navigate}
          organization={currentOrg}
          user={session.user}
          onLogout={handleLogout}
          onSwitchTenant={handleSwitchTenant}
        >
          <DocumentosView
            organization={currentOrg}
            onNavigate={navigate}
          />
        </AppShell>
      );
    }

    // Match /app/:slug (Dashboard)
    const dashboardMatch = currentPath.match(/^\/app\/([a-zA-Z0-9_-]+)$/);
    if (dashboardMatch) {
      const tenantSlug = dashboardMatch[1];
      const org = ORGANIZATIONS[tenantSlug] || currentOrg;

      return (
        <AppShell
          currentPath={currentPath}
          onNavigate={navigate}
          organization={org}
          user={session.user}
          onLogout={handleLogout}
          onSwitchTenant={handleSwitchTenant}
        >
          <DashboardView
            organization={org}
            onNavigate={navigate}
          />
        </AppShell>
      );
    }
  }

  // Fallback / 404 Route
  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4 text-center">
      <div className="text-cyan-400 font-mono-tech text-xs uppercase tracking-wider">
        VIPAZ JURÍDICO
      </div>
      <h1 className="text-4xl font-bold font-sans">404 — Página não encontrada</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        O endereço solicitado não existe ou você não possui autorização neste tenant.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition"
      >
        Voltar à página inicial
      </button>
    </div>
  );
}
