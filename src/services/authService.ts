import { Organization, Profile } from '../types';

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

export const SEED_PROFILES: Profile[] = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    full_name: 'Dr. Alexandre Castro',
    email: 'alexandre.castro@cawadvogados.com.br',
    role: 'senior_lawyer',
    oab: 'OAB/SP 289.412',
    organization_id: 'e1111111-1111-1111-1111-111111111111',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'u2222222-2222-2222-2222-222222222222',
    full_name: 'Dra. Mariana Vasconcellos',
    email: 'mariana.v@cawadvogados.com.br',
    role: 'lawyer',
    oab: 'OAB/SP 412.809',
    organization_id: 'e1111111-1111-1111-1111-111111111111',
    created_at: '2024-02-01T09:00:00Z',
  },
  {
    id: 'u3333333-3333-3333-3333-333333333333',
    full_name: 'Dr. Roberto Siqueira',
    email: 'roberto.siqueira@invicta.gov.br',
    role: 'admin',
    oab: 'OAB/RJ 198.344',
    organization_id: 'e2222222-2222-2222-2222-222222222222',
    created_at: '2024-03-20T14:30:00Z',
  },
];

const AUTH_STORAGE_KEY = 'vipaz_juridico_auth_session';

export interface AuthSession {
  user: Profile;
  organization: Organization;
  token: string;
  expiresAt: string;
}

export class AuthService {
  private currentSession: AuthSession | null = null;
  private listeners: Array<(session: AuthSession | null) => void> = [];

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        this.currentSession = JSON.parse(stored);
      } else {
        // Sessão padrão inicial configurada para o primeiro tenant (CAW)
        const defaultUser = SEED_PROFILES[0];
        const defaultOrg = ORGANIZATIONS.caw;
        this.currentSession = {
          user: defaultUser,
          organization: defaultOrg,
          token: 'vipaz_mock_jwt_caw_default',
          expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentSession));
      }
    } catch {
      this.currentSession = null;
    }
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

  async login(email: string, _password?: string, _rememberMe = true): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 450)); // Simula handshake seguro

    // Busca usuário pré-cadastrado ou associa ao tenant compatível
    const normalizedEmail = email.trim().toLowerCase();
    let foundProfile = SEED_PROFILES.find((p) => p.email.toLowerCase() === normalizedEmail);

    let org = ORGANIZATIONS.caw;
    if (normalizedEmail.includes('invicta') || normalizedEmail.includes('gov')) {
      org = ORGANIZATIONS.invicta;
      foundProfile = SEED_PROFILES[2];
    } else if (!foundProfile) {
      foundProfile = {
        id: `u-custom-${Date.now()}`,
        full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: normalizedEmail,
        role: 'lawyer',
        organization_id: org.id,
        created_at: new Date().toISOString(),
      };
    } else {
      org = foundProfile.organization_id === ORGANIZATIONS.invicta.id ? ORGANIZATIONS.invicta : ORGANIZATIONS.caw;
    }

    const session: AuthSession = {
      user: foundProfile,
      organization: org,
      token: `vipaz_jwt_${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    };

    this.currentSession = session;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    this.notify();
    return session;
  }

  async logout(): Promise<void> {
    this.currentSession = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.notify();
  }

  switchTenant(slug: 'caw' | 'invicta'): Organization {
    const org = ORGANIZATIONS[slug] || ORGANIZATIONS.caw;
    const userForOrg = SEED_PROFILES.find((p) => p.organization_id === org.id) || SEED_PROFILES[0];
    
    this.currentSession = {
      user: userForOrg,
      organization: org,
      token: `vipaz_jwt_${slug}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentSession));
    this.notify();
    return org;
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
