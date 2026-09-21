-- ====================================================================
-- VIPAZ Jurídico — Migração: Motor Determinístico de Montagem Jurídica
-- Tabelas de Arquitetura, Blocos, Regras e Snapshots Auditáveis
-- ====================================================================

-- 1. Tabela de Arquiteturas Jurídicas
CREATE TABLE IF NOT EXISTS public.legal_architectures (
  id TEXT PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_piece TEXT NOT NULL,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Blocos Jurídicos Homologados
CREATE TABLE IF NOT EXISTS public.legal_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  architecture_id TEXT REFERENCES public.legal_architectures(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  variables JSONB DEFAULT '[]'::jsonb,
  condition JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Snapshots Auditáveis de Geração
CREATE TABLE IF NOT EXISTS public.generation_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  generation_job_id UUID NOT NULL REFERENCES public.generation_jobs(id) ON DELETE CASCADE,
  architecture_version TEXT NOT NULL,
  form_data JSONB NOT NULL,
  applied_rule_keys JSONB NOT NULL,
  included_block_keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.legal_architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_snapshots ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para legal_architectures
CREATE POLICY "legal_architectures_select"
  ON public.legal_architectures FOR SELECT
  TO authenticated
  USING (organization_id IS NULL OR public.user_belongs_to_org(organization_id));

CREATE POLICY "legal_architectures_insert"
  ON public.legal_architectures FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

CREATE POLICY "legal_architectures_update"
  ON public.legal_architectures FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

-- Políticas RLS para legal_blocks
CREATE POLICY "legal_blocks_select"
  ON public.legal_blocks FOR SELECT
  TO authenticated
  USING (organization_id IS NULL OR public.user_belongs_to_org(organization_id));

CREATE POLICY "legal_blocks_insert"
  ON public.legal_blocks FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

CREATE POLICY "legal_blocks_update"
  ON public.legal_blocks FOR UPDATE
  TO authenticated
  USING (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']))
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer']));

-- Políticas RLS para generation_snapshots
CREATE POLICY "generation_snapshots_select"
  ON public.generation_snapshots FOR SELECT
  TO authenticated
  USING (public.user_belongs_to_org(organization_id));

CREATE POLICY "generation_snapshots_insert"
  ON public.generation_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_role(organization_id, ARRAY['admin', 'senior_lawyer', 'lawyer']));
