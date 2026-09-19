import { supabase } from '../lib/supabase';
import { Organization, Profile, UserRole } from '../types';

export interface AuthSession {
  user: Profile;
  organization: Organization;
  availableOrganizations: Array<{
    organization: Organization;
    role: UserRole;
  }>;
  token: string;
  expiresAt: string;
}

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'no_organization'
  | 'connection_error'
  | 'session_expired'
  | 'unauthorized_tenant'
  | 'unknown';

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// Organizações padrão conhecidas pelo sistema
export const ORGANIZATIONS: Record<string, Organization> = {
  caw: {
    id: 'e1111111-1111-1111-1111-111111111111',
    name: 'CAW Advogados Associados',
    slug: 'caw',
    tagline: 'Contencioso Cível Estratégico & Saúde Suplementar',
    created_at: '2024-01-15T10:00:00Z',
  },
  invicta: {
    id: 'e2222222-2222-2222-2222-222222222222',
    name: 'Invicta Gestão Pública',
    slug: 'invicta',
    tagline: 'Assessoria Jurídica e Administrativa para Entes Públicos',
    created_at: '2024-03-20T14:30:00Z',
  },
};

export class AuthService {
  private currentSession: AuthSession | null = null;
  private isLoading = true;
  private userWithoutOrg = false;
  private listeners: Array<(session: AuthSession | null) => void> = [];

  constructor() {
    this.initialize();
  }

  /**
   * Inicializa o serviço ouvindo mudanças de sessão do Supabase Auth
   */
  private async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await this.loadFullUserSession(session.user.id, session.access_token, session.expires_at);
      } else {
        this.currentSession = null;
        this.isLoading = false;
        this.notify();
      }
    } catch (err) {
      console.error('[AuthService] Erro ao recuperar sessão inicial:', err);
      this.currentSession = null;
      this.isLoading = false;
      this.notify();
    }

    // Escuta eventos de autenticação do Supabase (login, logout, refresh de token)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.currentSession = null;
        this.userWithoutOrg = false;
        this.isLoading = false;
        this.notify();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session.user) {
          await this.loadFullUserSession(session.user.id, session.access_token, session.expires_at);
        }
      }
    });
  }

  /**
   * Carrega perfil, membros de organização e dados de tenant a partir do Supabase
   */
  private async loadFullUserSession(
    userId: string,
    token: string,
    expiresAt?: number
  ): Promise<AuthSession> {
    this.isLoading = true;

    try {
      // 1. Consulta dados do perfil em public.profiles
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('id, full_name, email, oab, avatar_url, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.warn('[AuthService] Aviso ao consultar profiles:', profileErr.message);
      }

      // 2. Consulta membros de organização em public.organization_members
      const { data: membersData, error: membersErr } = await supabase
        .from('organization_members')
        .select('organization_id, role, created_at')
        .eq('user_id', userId);

      if (membersErr) {
        console.warn('[AuthService] Aviso ao consultar organization_members:', membersErr.message);
      }

      if (!membersData || membersData.length === 0) {
        // Usuário está autenticado no Supabase Auth, mas sem associação a organização
        this.userWithoutOrg = true;
        this.currentSession = null;
        this.isLoading = false;
        this.notify();
        throw new AuthError(
          'no_organization',
          'Seu usuário está autenticado, mas ainda não possui acesso a uma organização do VIPAZ Jurídico. Entre em contato com o administrador.'
        );
      }

      // 3. Consulta as organizações correspondentes em public.organizations
      const orgIds = membersData.map((m) => m.organization_id);
      const { data: orgsData, error: orgsErr } = await supabase
        .from('organizations')
        .select('id, name, slug, tagline, logo_url, created_at')
        .in('id', orgIds);

      if (orgsErr || !orgsData || orgsData.length === 0) {
        this.userWithoutOrg = true;
        this.currentSession = null;
        this.isLoading = false;
        this.notify();
        throw new AuthError(
          'no_organization',
          'Seu usuário está autenticado, mas ainda não possui acesso a uma organização do VIPAZ Jurídico. Entre em contato com o administrador.'
        );
      }

      // Constrói a lista de organizações disponíveis
      const availableOrganizations = membersData
        .map((member) => {
          const org = orgsData.find((o) => o.id === member.organization_id);
          if (!org) return null;
          return {
            organization: org as Organization,
            role: member.role as UserRole,
          };
        })
        .filter((item): item is { organization: Organization; role: UserRole } => item !== null);

      if (availableOrganizations.length === 0) {
        this.userWithoutOrg = true;
        this.currentSession = null;
        this.isLoading = false;
        this.notify();
        throw new AuthError(
          'no_organization',
          'Seu usuário está autenticado, mas ainda não possui acesso a uma organização do VIPAZ Jurídico. Entre em contato com o administrador.'
        );
      }

      // Seleciona a organização ativa: prioriza CAW se membro, senão a primeira disponível
      const activeMembership =
        availableOrganizations.find((item) => item.organization.slug === 'caw') ||
        availableOrganizations[0];

      const fullProfile: Profile = {
        id: userId,
        full_name: profileData?.full_name || 'Usuário VIPAZ',
        email: profileData?.email || '',
        role: activeMembership.role,
        oab: profileData?.oab || undefined,
        avatar_url: profileData?.avatar_url || undefined,
        organization_id: activeMembership.organization.id,
        created_at: profileData?.created_at || new Date().toISOString(),
      };

      const newSession: AuthSession = {
        user: fullProfile,
        organization: activeMembership.organization,
        availableOrganizations,
        token,
        expiresAt: expiresAt ? new Date(expiresAt * 1000).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      };

      this.currentSession = newSession;
      this.userWithoutOrg = false;
      this.isLoading = false;
      this.notify();
      return newSession;
    } catch (error) {
      this.isLoading = false;
      this.notify();
      if (error instanceof AuthError) throw error;
      throw new AuthError('connection_error', 'Falha ao sincronizar dados com o banco de dados.');
    }
  }

  /**
   * Realiza login no Supabase Auth com email e senha reais
   */
  async login(email: string, password: string): Promise<AuthSession> {
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes('invalid login credentials') ||
        msg.includes('invalid_credentials') ||
        msg.includes('user not found') ||
        msg.includes('wrong password')
      ) {
        throw new AuthError(
          'invalid_credentials',
          'Credenciais de acesso inválidas. Verifique seu e-mail e senha.'
        );
      }

      if (msg.includes('fetch') || msg.includes('network') || msg.includes('timeout')) {
        throw new AuthError(
          'connection_error',
          'Não foi possível conectar aos servidores de autenticação. Verifique sua conexão.'
        );
      }

      throw new AuthError(
        'invalid_credentials',
        'Não foi possível autenticar. Verifique suas credenciais de acesso.'
      );
    }

    if (!data.user || !data.session) {
      throw new AuthError(
        'invalid_credentials',
        'Falha no retorno da autenticação. Tente novamente.'
      );
    }

    return await this.loadFullUserSession(
      data.user.id,
      data.session.access_token,
      data.session.expires_at
    );
  }

  /**
   * Realiza logout real no Supabase Auth
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[AuthService] Aviso ao efetuar signOut:', err);
    } finally {
      this.currentSession = null;
      this.userWithoutOrg = false;
      this.isLoading = false;
      this.notify();
    }
  }

  /**
   * Verifica se o usuário tem permissão para acessar determinado slug de organização
   */
  hasAccessToTenant(slug: string): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.availableOrganizations.some(
      (item) => item.organization.slug === slug
    );
  }

  /**
   * Alterna a organização ativa entre as organizações autorizadas do usuário
   */
  switchTenant(slug: string): Organization | null {
    if (!this.currentSession) return null;

    const target = this.currentSession.availableOrganizations.find(
      (item) => item.organization.slug === slug
    );

    if (!target) {
      throw new AuthError(
        'unauthorized_tenant',
        'Você não possui permissão de acesso a esta organização.'
      );
    }

    this.currentSession = {
      ...this.currentSession,
      organization: target.organization,
      user: {
        ...this.currentSession.user,
        role: target.role,
        organization_id: target.organization.id,
      },
    };

    this.notify();
    return target.organization;
  }

  getSession(): AuthSession | null {
    return this.currentSession;
  }

  getCurrentUser(): Profile | null {
    return this.currentSession?.user || null;
  }

  getCurrentOrganization(): Organization {
    return this.currentSession?.organization || ORGANIZATIONS.caw;
  }

  getAvailableOrganizations(): Array<{ organization: Organization; role: UserRole }> {
    return this.currentSession?.availableOrganizations || [];
  }

  isInitialLoading(): boolean {
    return this.isLoading;
  }

  isUserWithoutOrg(): boolean {
    return this.userWithoutOrg;
  }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentSession));
  }
}

export const authService = new AuthService();
