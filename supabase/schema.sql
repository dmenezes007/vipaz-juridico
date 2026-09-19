-- ====================================================================
-- VIPAZ JURÍDICO — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Multi-tenant LegalTech B2B Architecture (CAW Advogados Associados)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. REUSABLE TRIGGER FUNCTIONS
-- ====================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- ====================================================================
-- 3. CORE TABLES
-- ====================================================================

-- ORGANIZATIONS (TENANTS)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROFILES (USERS)
-- Note: Global role removed. Permissions are scoped strictly by organization_members.role.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    oab VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORGANIZATION MEMBERS (MULTI-TENANT RBAC)
-- Supported roles: admin, senior_lawyer, lawyer, reviewer
CREATE TABLE IF NOT EXISTS public.organization_members (
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'lawyer' NOT NULL CHECK (role IN ('admin', 'senior_lawyer', 'lawyer', 'reviewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (organization_id, user_id)
);

-- PROCESSES (MATTERS)
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

-- PROCESS SUBJECTS (CHILD OF PROCESSES)
CREATE TABLE IF NOT EXISTS public.process_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    subject VARCHAR(150) NOT NULL,
    custom_subject VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DOCUMENT TEMPLATES (CENTRAL VALIDATED LEGAL TEMPLATES)
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

-- GENERATION JOBS
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
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GENERATION STEPS (10 RIGOROUS REAL METHODOLOGICAL STEPS)
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
    telemetry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SOURCE DOCUMENTS (ORIGINAL COURT PDFS IN SUPABASE STORAGE)
CREATE TABLE IF NOT EXISTS public.source_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    generation_job_id UUID NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GENERATED DOCUMENTS (FINAL REVISED FORENSIC DOCX & PDF)
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    generation_job_id UUID NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    docx_storage_path TEXT NOT NULL,
    pdf_storage_path TEXT NOT NULL,
    structured_content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AUDIT EVENTS (IMMUTABLE FORENSIC AUDIT TRAIL)
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
-- 4. AUTOMATIC UPDATED_AT TRIGGERS
-- ====================================================================

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON public.organizations;
CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_organization_members_updated_at ON public.organization_members;
CREATE TRIGGER trg_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_processes_updated_at ON public.processes;
CREATE TRIGGER trg_processes_updated_at
  BEFORE UPDATE ON public.processes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_document_templates_updated_at ON public.document_templates;
CREATE TRIGGER trg_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_generation_jobs_updated_at ON public.generation_jobs;
CREATE TRIGGER trg_generation_jobs_updated_at
  BEFORE UPDATE ON public.generation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_generation_steps_updated_at ON public.generation_steps;
CREATE TRIGGER trg_generation_steps_updated_at
  BEFORE UPDATE ON public.generation_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_source_documents_updated_at ON public.source_documents;
CREATE TRIGGER trg_source_documents_updated_at
  BEFORE UPDATE ON public.source_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_generated_documents_updated_at ON public.generated_documents;
CREATE TRIGGER trg_generated_documents_updated_at
  BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ====================================================================
-- 5. PERFORMANCE & QUERY INDEXES
-- ====================================================================

-- Organizations & Members
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON public.organization_members(organization_id, role);

-- Processes & Subjects
CREATE INDEX IF NOT EXISTS idx_processes_org_id ON public.processes(organization_id);
CREATE INDEX IF NOT EXISTS idx_processes_process_number ON public.processes(process_number);
CREATE INDEX IF NOT EXISTS idx_processes_created_by ON public.processes(created_by);
CREATE INDEX IF NOT EXISTS idx_processes_created_at ON public.processes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_process_subjects_process_id ON public.process_subjects(process_id);

-- Templates
CREATE INDEX IF NOT EXISTS idx_document_templates_org_id ON public.document_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_status ON public.document_templates(status);
CREATE INDEX IF NOT EXISTS idx_document_templates_doc_type ON public.document_templates(organization_id, document_type);

-- Generation Jobs & Steps
CREATE INDEX IF NOT EXISTS idx_generation_jobs_org_id ON public.generation_jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_process_id ON public.generation_jobs(process_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON public.generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON public.generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_created_at ON public.generation_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_steps_job_id ON public.generation_steps(generation_job_id);
CREATE INDEX IF NOT EXISTS idx_generation_steps_status ON public.generation_steps(status);

-- Documents (Source & Generated)
CREATE INDEX IF NOT EXISTS idx_source_documents_org_id ON public.source_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_source_documents_job_id ON public.source_documents(generation_job_id);
CREATE INDEX IF NOT EXISTS idx_source_documents_process_id ON public.source_documents(process_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_org_id ON public.generated_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_job_id ON public.generated_documents(generation_job_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_created_at ON public.generated_documents(created_at DESC);

-- Audit Events
CREATE INDEX IF NOT EXISTS idx_audit_events_org_id ON public.audit_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);

-- ====================================================================
-- 6. SECURITY DEFINER HELPER FUNCTIONS (HARDENED)
-- ====================================================================

-- Check if authenticated user belongs to the target organization
CREATE OR REPLACE FUNCTION public.user_belongs_to_org(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_members.organization_id = org_id
      AND organization_members.user_id = auth.uid()
  );
END;
$$;

-- Check if authenticated user has one of the allowed roles in the organization
CREATE OR REPLACE FUNCTION public.user_has_org_role(org_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_members.organization_id = org_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role = ANY(allowed_roles)
  );
END;
$$;

-- Check if authenticated user shares at least one organization with the target user
CREATE OR REPLACE FUNCTION public.user_shares_org_with(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om1
    JOIN public.organization_members om2
      ON om1.organization_id = om2.organization_id
    WHERE om1.user_id = auth.uid()
      AND om2.user_id = target_user_id
  );
END;
$$;

-- Safely extract and validate the organization UUID from a storage object path
-- Expected patterns:
--   source-documents:    {organization_id}/{process_id}/{generation_job_id}/{filename}
--   generated-documents: {organization_id}/{generation_job_id}/{filename}
CREATE OR REPLACE FUNCTION public.storage_path_organization_id(object_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
DECLARE
  cleaned_path TEXT;
  first_segment TEXT;
BEGIN
  IF object_name IS NULL THEN
    RETURN NULL;
  END IF;

  -- Strip leading slashes or whitespace
  cleaned_path := ltrim(trim(object_name), '/');
  first_segment := split_part(cleaned_path, '/', 1);

  -- Strict validation of UUID format (8-4-4-4-12 hexadecimal characters)
  IF first_segment ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN first_segment::UUID;
  END IF;

  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Automatic profile creation on new user signup in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(v_full_name, 'Usuário'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Complete, strict multi-tenant isolation with role-based policies
-- ====================================================================

-- Enable RLS across all tables
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

-- --------------------------------------------------------------------
-- 7.1 ORGANIZATIONS POLICIES
-- Users can only see organizations they belong to.
-- Tenant provisioning is strictly administrative/server-side.
-- --------------------------------------------------------------------

CREATE POLICY "organizations_select"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(id));

CREATE POLICY "organizations_update"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(id, ARRAY['admin']))
  WITH CHECK (public.user_has_org_role(id, ARRAY['admin']));

-- Note: No INSERT or DELETE policy for authenticated users.
-- Organization creation is performed server-side by system administrators.

-- --------------------------------------------------------------------
-- 7.2 PROFILES POLICIES
-- Users can view their own profile or profiles of members sharing an organization.
-- --------------------------------------------------------------------

CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.user_shares_org_with(id));

CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- --------------------------------------------------------------------
-- 7.3 ORGANIZATION MEMBERS POLICIES
-- Users can view members of their organizations.
-- Only organization admins can manage memberships (invite, change role, remove).
-- --------------------------------------------------------------------

CREATE POLICY "organization_members_select"
  ON public.organization_members FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "organization_members_insert"
  ON public.organization_members FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin']));

CREATE POLICY "organization_members_update"
  ON public.organization_members FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin']));

CREATE POLICY "organization_members_delete"
  ON public.organization_members FOR DELETE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin']));

-- --------------------------------------------------------------------
-- 7.4 PROCESSES POLICIES
-- Scoped strictly by organization_id.
-- Lawyers and above can create and edit processes; reviewers can view.
-- Only admins and senior lawyers can delete processes.
-- --------------------------------------------------------------------

CREATE POLICY "processes_select"
  ON public.processes FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "processes_insert"
  ON public.processes FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    AND created_by = auth.uid()
  );

CREATE POLICY "processes_update"
  ON public.processes FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));

CREATE POLICY "processes_delete"
  ON public.processes FOR DELETE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

-- --------------------------------------------------------------------
-- 7.5 PROCESS SUBJECTS POLICIES
-- Child table without organization_id column: verified via parent process relation.
-- --------------------------------------------------------------------

CREATE POLICY "process_subjects_select"
  ON public.process_subjects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.processes p
      WHERE p.id = process_subjects.process_id
        AND public.user_belongs_to_org(p.organization_id)
    )
  );

CREATE POLICY "process_subjects_insert"
  ON public.process_subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.processes p
      WHERE p.id = process_subjects.process_id
        AND public.user_has_org_role(p.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  );

CREATE POLICY "process_subjects_update"
  ON public.process_subjects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.processes p
      WHERE p.id = process_subjects.process_id
        AND public.user_has_org_role(p.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.processes p
      WHERE p.id = process_subjects.process_id
        AND public.user_has_org_role(p.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  );

CREATE POLICY "process_subjects_delete"
  ON public.process_subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.processes p
      WHERE p.id = process_subjects.process_id
        AND public.user_has_org_role(p.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  );

-- --------------------------------------------------------------------
-- 7.6 DOCUMENT TEMPLATES POLICIES
-- All organization members can view active templates.
-- Only admins and senior lawyers can add, update, or archive templates.
-- --------------------------------------------------------------------

CREATE POLICY "document_templates_select"
  ON public.document_templates FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "document_templates_insert"
  ON public.document_templates FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

CREATE POLICY "document_templates_update"
  ON public.document_templates FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

CREATE POLICY "document_templates_delete"
  ON public.document_templates FOR DELETE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin']));

-- --------------------------------------------------------------------
-- 7.7 GENERATION JOBS POLICIES
-- All members can follow jobs in their organization.
-- Lawyers and above can initiate jobs and update execution status.
-- --------------------------------------------------------------------

CREATE POLICY "generation_jobs_select"
  ON public.generation_jobs FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "generation_jobs_insert"
  ON public.generation_jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    AND user_id = auth.uid()
  );

CREATE POLICY "generation_jobs_update"
  ON public.generation_jobs FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));

CREATE POLICY "generation_jobs_delete"
  ON public.generation_jobs FOR DELETE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin']));

-- --------------------------------------------------------------------
-- 7.8 GENERATION STEPS POLICIES
-- Child table without organization_id column: verified via parent generation_jobs relation.
-- --------------------------------------------------------------------

CREATE POLICY "generation_steps_select"
  ON public.generation_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.generation_jobs gj
      WHERE gj.id = generation_steps.generation_job_id
        AND public.user_belongs_to_org(gj.organization_id)
    )
  );

CREATE POLICY "generation_steps_insert"
  ON public.generation_steps FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.generation_jobs gj
      WHERE gj.id = generation_steps.generation_job_id
        AND public.user_has_org_role(gj.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  );

CREATE POLICY "generation_steps_update"
  ON public.generation_steps FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.generation_jobs gj
      WHERE gj.id = generation_steps.generation_job_id
        AND public.user_has_org_role(gj.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.generation_jobs gj
      WHERE gj.id = generation_steps.generation_job_id
        AND public.user_has_org_role(gj.organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer'])
    )
  );

CREATE POLICY "generation_steps_delete"
  ON public.generation_steps FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.generation_jobs gj
      WHERE gj.id = generation_steps.generation_job_id
        AND public.user_has_org_role(gj.organization_id, ARRAY['admin'])
    )
  );

-- --------------------------------------------------------------------
-- 7.9 SOURCE DOCUMENTS POLICIES
-- Metadata of process court PDFs stored in private Supabase Storage buckets.
-- --------------------------------------------------------------------

CREATE POLICY "source_documents_select"
  ON public.source_documents FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "source_documents_insert"
  ON public.source_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));

CREATE POLICY "source_documents_update"
  ON public.source_documents FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));

CREATE POLICY "source_documents_delete"
  ON public.source_documents FOR DELETE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

-- --------------------------------------------------------------------
-- 7.10 GENERATED DOCUMENTS POLICIES
-- Completed forensic pieces (DOCX & PDF).
-- All organization members can view and download.
-- Lawyers and above can record generated document metadata.
-- --------------------------------------------------------------------

CREATE POLICY "generated_documents_select"
  ON public.generated_documents FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "generated_documents_insert"
  ON public.generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));

CREATE POLICY "generated_documents_update"
  ON public.generated_documents FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));

CREATE POLICY "generated_documents_delete"
  ON public.generated_documents FOR DELETE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin']));

-- --------------------------------------------------------------------
-- 7.11 AUDIT EVENTS POLICIES
-- Immutable audit log: Only SELECT and verified INSERT are allowed.
-- Spoofing user_id or arbitrary organization_id is prevented.
-- No UPDATE or DELETE policies exist, ensuring audit records cannot be tampered with.
-- --------------------------------------------------------------------

CREATE POLICY "audit_events_select"
  ON public.audit_events FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "audit_events_insert"
  ON public.audit_events FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_belongs_to_org(organization_id)
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- ====================================================================
-- 8. STORAGE BUCKETS CONFIGURATION (PRIVATE STORAGE ONLY)
-- Files are accessed via signed temporary URLs; buckets are NOT public.
-- ====================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'storage' AND table_name = 'buckets'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES
      ('source-documents', 'source-documents', false, 52428800, ARRAY['application/pdf']),
      ('generated-documents', 'generated-documents', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
    ON CONFLICT (id) DO UPDATE
    SET
      public = false,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
  END IF;
END;
$$;

-- Storage Multi-Tenant RLS Policies (Applied when storage.objects exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'storage' AND table_name = 'objects'
  ) THEN
    -- Drop previous conflicting or generic policies if any
    DROP POLICY IF EXISTS "source_documents_authenticated_read" ON storage.objects;
    DROP POLICY IF EXISTS "source_documents_authenticated_insert" ON storage.objects;
    DROP POLICY IF EXISTS "generated_documents_authenticated_read" ON storage.objects;
    DROP POLICY IF EXISTS "generated_documents_authenticated_insert" ON storage.objects;
    DROP POLICY IF EXISTS "source_documents_tenant_select" ON storage.objects;
    DROP POLICY IF EXISTS "source_documents_tenant_insert" ON storage.objects;
    DROP POLICY IF EXISTS "source_documents_tenant_update" ON storage.objects;
    DROP POLICY IF EXISTS "source_documents_tenant_delete" ON storage.objects;
    DROP POLICY IF EXISTS "generated_documents_tenant_select" ON storage.objects;
    DROP POLICY IF EXISTS "generated_documents_tenant_insert" ON storage.objects;
    DROP POLICY IF EXISTS "generated_documents_tenant_update" ON storage.objects;
    DROP POLICY IF EXISTS "generated_documents_tenant_delete" ON storage.objects;

    -- ------------------------------------------------------------------
    -- SOURCE DOCUMENTS (Process Court PDFs)
    -- Path: {organization_id}/{process_id}/{generation_job_id}/{filename}
    -- ------------------------------------------------------------------

    -- SELECT: Member of the tenant in the first path segment
    CREATE POLICY "source_documents_tenant_select"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'source-documents'
        AND public.user_belongs_to_org(public.storage_path_organization_id(name))
      );

    -- INSERT: Authorized role (admin, senior_lawyer, lawyer) in the tenant
    CREATE POLICY "source_documents_tenant_insert"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'source-documents'
        AND public.user_has_org_role(
          public.storage_path_organization_id(name),
          ARRAY['admin', 'senior_lawyer', 'lawyer']
        )
      );

    -- UPDATE: Authorized role (admin, senior_lawyer, lawyer) in the tenant
    CREATE POLICY "source_documents_tenant_update"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'source-documents'
        AND public.user_has_org_role(
          public.storage_path_organization_id(name),
          ARRAY['admin', 'senior_lawyer', 'lawyer']
        )
      )
      WITH CHECK (
        bucket_id = 'source-documents'
        AND public.user_has_org_role(
          public.storage_path_organization_id(name),
          ARRAY['admin', 'senior_lawyer', 'lawyer']
        )
      );

    -- DELETE: Organization admins or senior lawyers only
    CREATE POLICY "source_documents_tenant_delete"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'source-documents'
        AND public.user_has_org_role(
          public.storage_path_organization_id(name),
          ARRAY['admin', 'senior_lawyer']
        )
      );

    -- ------------------------------------------------------------------
    -- GENERATED DOCUMENTS (Final Forensic DOCX / PDF)
    -- Path: {organization_id}/{generation_job_id}/{filename}
    -- Frontend users can only SELECT objects of their organization.
    -- Uploads and modifications are strictly server-side (orchestrator service_role).
    -- ------------------------------------------------------------------

    -- SELECT: Member of the tenant in the first path segment
    CREATE POLICY "generated_documents_tenant_select"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'generated-documents'
        AND public.user_belongs_to_org(public.storage_path_organization_id(name))
      );

  END IF;
END;
$$;

-- ====================================================================
-- 9. IDEMPOTENT INITIAL SEED (CAW ADVOGADOS ASSOCIADOS ONLY)
-- First official tenant configured for production.
-- ====================================================================

INSERT INTO public.organizations (id, name, slug, tagline)
VALUES (
  'e1111111-1111-1111-1111-111111111111',
  'CAW Advogados Associados',
  'caw',
  'Especialistas em Contencioso Cível Estratégico e Saúde Suplementar'
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  updated_at = timezone('utc'::text, now());
