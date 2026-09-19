-- ====================================================================
-- VIPAZ JURÍDICO — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Multi-tenant LegalTech B2B Architecture
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ORGANIZATIONS (TENANTS)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROFILES (USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'lawyer' CHECK (role IN ('admin', 'senior_lawyer', 'lawyer', 'reviewer')),
    oab VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORGANIZATION MEMBERS (MULTI-TENANT ACCESS CONTROL)
CREATE TABLE IF NOT EXISTS public.organization_members (
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'lawyer' CHECK (role IN ('admin', 'senior_lawyer', 'lawyer', 'reviewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (organization_id, user_id)
);

-- 5. PROCESSES (MATTERS)
CREATE TABLE IF NOT EXISTS public.processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    process_number VARCHAR(100) NOT NULL,
    court VARCHAR(150) NOT NULL,
    represented_party VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROCESS SUBJECTS
CREATE TABLE IF NOT EXISTS public.process_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    subject VARCHAR(150) NOT NULL,
    custom_subject VARCHAR(255)
);

-- 7. DOCUMENT TEMPLATES (CENTRAL VALIDATED LEGAL TEMPLATES)
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    storage_path TEXT NOT NULL,
    rules_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. GENERATION JOBS
CREATE TABLE IF NOT EXISTS public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    document_type VARCHAR(100) NOT NULL,
    special_instructions TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    current_step INT DEFAULT 1,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 9. GENERATION STEPS (10 RIGOROUS REAL STEPS)
CREATE TABLE IF NOT EXISTS public.generation_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_job_id UUID NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    step_key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    telemetry TEXT
);

-- 10. SOURCE DOCUMENTS (ORIGINAL COURT PDFS IN SUPABASE STORAGE)
CREATE TABLE IF NOT EXISTS public.source_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    generation_job_id UUID NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. GENERATED DOCUMENTS (FINAL REVISED DOCX & PDF)
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    generation_job_id UUID NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    docx_storage_path TEXT NOT NULL,
    pdf_storage_path TEXT NOT NULL,
    structured_content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. AUDIT EVENTS
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict multi-tenant isolation by organization_id
-- ====================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user belongs to the organization
CREATE OR REPLACE FUNCTION public.user_belongs_to_org(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organization Policies
CREATE POLICY "Users can view organizations they belong to"
  ON public.organizations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
  ));

-- Processes Policies
CREATE POLICY "Tenant isolation for processes SELECT"
  ON public.processes FOR SELECT
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "Tenant isolation for processes INSERT"
  ON public.processes FOR INSERT
  WITH CHECK (public.user_belongs_to_org(organization_id));

-- Generation Jobs Policies
CREATE POLICY "Tenant isolation for generation_jobs SELECT"
  ON public.generation_jobs FOR SELECT
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "Tenant isolation for generation_jobs INSERT"
  ON public.generation_jobs FOR INSERT
  WITH CHECK (public.user_belongs_to_org(organization_id));

-- Generated Documents Policies
CREATE POLICY "Tenant isolation for generated_documents SELECT"
  ON public.generated_documents FOR SELECT
  USING (public.user_belongs_to_org(organization_id));

-- Audit Events Policies
CREATE POLICY "Tenant isolation for audit_events SELECT"
  ON public.audit_events FOR SELECT
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "Tenant isolation for audit_events INSERT"
  ON public.audit_events FOR INSERT
  WITH CHECK (public.user_belongs_to_org(organization_id));

-- ====================================================================
-- SEED INITIAL TENANTS & VALIDATED TEMPLATES
-- ====================================================================
INSERT INTO public.organizations (id, name, slug, tagline)
VALUES 
  ('e1111111-1111-1111-1111-111111111111', 'CAW Advogados Associados', 'caw', 'Especialistas em Contencioso Cível Estratégico e Saúde Suplementar'),
  ('e2222222-2222-2222-2222-222222222222', 'Invicta Gestão Pública', 'invicta', 'Assessoria Jurídica e Administrativa para Entes Públicos')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.document_templates (organization_id, document_type, name, version, status, storage_path, rules_json)
VALUES 
  ('e1111111-1111-1111-1111-111111111111', 'Contestação', 'Modelo Validado CAW — Contestação Padrão Saúde Suplementar', '3.4', 'active', 'templates/caw/contestacao_v3_4.docx', '{"structure": ["Endereçamento", "Qualificação", "Tempestividade", "Preliminares", "Resumo dos Fatos", "Mérito", "Pedidos", "Provas", "Fechamento"], "allowed_subjects": ["Reajuste Plano PME", "Reajuste Plano Individual", "Aviso Prévio", "Prêmio Complementar"]}'::jsonb)
ON CONFLICT DO NOTHING;
