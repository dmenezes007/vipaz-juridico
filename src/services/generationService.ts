/**
 * VIPAZ Jurídico — Generation Service
 * 
 * Camada de orquestração de persistência real no Supabase:
 * - Persistência de processos em public.processes
 * - Registro de matérias em public.process_subjects
 * - Criação de jobs de geração em public.generation_jobs
 * - Registro de etapas em public.generation_steps
 * - Upload de PDFs no bucket privado source-documents
 * - Registro de metadados em public.source_documents
 * - Consulta de jobs e documentos em tempo real
 */

import { supabase } from '../lib/supabase';
import { authService } from './authService';
import {
  GenerationJob,
  GenerationStep,
  DocumentType,
  GeneratedDocument,
  Process,
  ProcessSubject,
  SourceDocument,
} from '../types';

export interface CreateProcessAndJobParams {
  process_number: string;
  court: string;
  represented_party: string;
  document_type: DocumentType;
  subjects: Array<{
    subject: string;
    custom_subject?: string | null;
  }>;
  special_instructions?: string | null;
  file: File;
  onProgressState?: (message: string) => void;
}

export const INITIAL_GENERATION_STEPS: Omit<GenerationStep, 'id' | 'generation_job_id'>[] = [
  {
    step_number: 1,
    step_key: 'court_pdf_ingestion',
    label: 'Ingestão e Auditoria Estrutural do PDF Judicial',
    description: 'Validação de integridade, higienização e decodificação do processo eletrônico.',
    status: 'pending',
  },
  {
    step_number: 2,
    step_key: 'forensic_segmentation',
    label: 'Segmentação Forense dos Autos Processuais',
    description: 'Separação estruturada de Petição Inicial, Procurações, Contratos e Decisões Liminares.',
    status: 'pending',
  },
  {
    step_number: 3,
    step_key: 'factual_timeline_extraction',
    label: 'Extração da Cronologia dos Fatos e Partes',
    description: 'Mapeamento fático, datas contratuais, vigência e histórico de notificações.',
    status: 'pending',
  },
  {
    step_number: 4,
    step_key: 'controversy_delimitation',
    label: 'Fixação dos Pontos Controvertidos',
    description: 'Identificação cirúrgica dos pedidos da parte autora e teses contrapostas.',
    status: 'pending',
  },
  {
    step_number: 5,
    step_key: 'template_rule_matching',
    label: 'Aplicação das Diretrizes do Modelo Validado',
    description: 'Carregamento do padrão técnico homologado pela organização.',
    status: 'pending',
  },
  {
    step_number: 6,
    step_key: 'theses_and_precedents_mapping',
    label: 'Mapeamento de Precedentes e Normas Regulatórias',
    description: 'Enquadramento aos Temas Repetitivos do STJ e Resoluções da ANS.',
    status: 'pending',
  },
  {
    step_number: 7,
    step_key: 'forensic_drafting_synthesis',
    label: 'Redação Forense Estruturada',
    description: 'Elaboração das preliminares, mérito e pedidos conforme padrão do tribunal.',
    status: 'pending',
  },
  {
    step_number: 8,
    step_key: 'internal_consistency_audit',
    label: 'Auditoria Interna de Coerência Processual',
    description: 'Verificação algorítmica de correspondência entre fatos, normas e pedidos.',
    status: 'pending',
  },
  {
    step_number: 9,
    step_key: 'compilation_and_metadata',
    label: 'Diagramação e Formatação Oficial',
    description: 'Aplicação de margens forenses, numeração e compilação dos metadados.',
    status: 'pending',
  },
  {
    step_number: 10,
    step_key: 'final_readiness_check',
    label: 'Homologação e Disponibilização para Revisão',
    description: 'Peça concluída e disponibilizada para conferência pelo advogado responsável.',
    status: 'pending',
  },
];

/**
 * Sanitiza o nome do arquivo para armazenamento seguro no Storage:
 * - Preserva extensão .pdf
 * - Remove caracteres de controle e barras (path traversal)
 * - Normaliza espaços
 * - Limita tamanho
 */
export function sanitizeFilename(originalName: string): string {
  let clean = originalName.replace(/[/\\?%*:|"<>]/g, '').trim();
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');
  clean = clean.replace(/\.{2,}/g, '.');
  clean = clean.replace(/\s+/g, '_');

  if (!clean.toLowerCase().endsWith('.pdf')) {
    clean = `${clean}.pdf`;
  }

  const base = clean.slice(0, -4).replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 80);
  const finalBase = base || `processo_${Date.now()}`;
  return `${finalBase}.pdf`;
}

export class GenerationService {
  /**
   * Criação real de processo, matérias, job, etapas, upload no Storage e documento fonte.
   * Ordem rigorosa com compensação segura em caso de falha.
   */
  async createProcessAndJob(params: CreateProcessAndJobParams): Promise<{
    job_id: string;
    process_id: string;
    storage_path: string;
  }> {
    // PASSO 1 — Validar autenticação e tenant
    params.onProgressState?.('Validando sessão e autorizações...');

    const currentOrg = authService.getCurrentOrganization();
    if (!currentOrg?.id) {
      throw new Error('Nenhuma organização ativa selecionada. Por favor, refaça o login.');
    }

    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !sessionData?.session?.user) {
      throw new Error('Sessão expirada. Por favor, autentique-se novamente.');
    }
    const authUserId = sessionData.session.user.id;

    if (!params.process_number.trim()) {
      throw new Error('O número do processo judicial é obrigatório.');
    }
    if (!params.represented_party.trim()) {
      throw new Error('A parte representada é obrigatória.');
    }
    if (!params.subjects || params.subjects.length === 0) {
      throw new Error('Selecione ao menos uma matéria controvertida.');
    }
    for (const sub of params.subjects) {
      if (sub.subject === 'Outro' && (!sub.custom_subject || !sub.custom_subject.trim())) {
        throw new Error('Por favor, informe a descrição da matéria personalizada em "Outro".');
      }
    }
    if (!params.file) {
      throw new Error('O arquivo PDF do processo é obrigatório.');
    }
    if (params.file.size > 50 * 1024 * 1024) {
      throw new Error('O arquivo PDF excede o limite máximo permitido de 50 MB.');
    }

    // PASSO 2 — Gerar UUIDs reais no cliente
    const process_id = crypto.randomUUID();
    const generation_job_id = crypto.randomUUID();

    let uploadedStoragePath: string | null = null;
    let processCreated = false;
    let jobCreated = false;

    try {
      // PASSO 3 — Inserir em public.processes
      params.onProgressState?.('Registrando processo judicial...');

      const { error: procError } = await supabase.from('processes').insert({
        id: process_id,
        organization_id: currentOrg.id,
        process_number: params.process_number.trim(),
        court: params.court.trim(),
        represented_party: params.represented_party.trim(),
        created_by: authUserId,
      });

      if (procError) {
        throw new Error(`Falha ao registrar processo: ${procError.message}`);
      }
      processCreated = true;

      // PASSO 4 — Inserir em public.process_subjects
      params.onProgressState?.('Vinculando matérias controvertidas...');

      const subjectsToInsert = params.subjects.map((s) => ({
        id: crypto.randomUUID(),
        process_id,
        subject: s.subject,
        custom_subject: s.subject === 'Outro' && s.custom_subject ? s.custom_subject.trim() : null,
      }));

      const { error: subjError } = await supabase.from('process_subjects').insert(subjectsToInsert);
      if (subjError) {
        throw new Error(`Falha ao vincular matérias: ${subjError.message}`);
      }

      // PASSO 5 — Inserir em public.generation_jobs
      params.onProgressState?.('Criando solicitação jurídica...');

      const { error: jobError } = await supabase.from('generation_jobs').insert({
        id: generation_job_id,
        organization_id: currentOrg.id,
        process_id: process_id,
        user_id: authUserId,
        document_type: params.document_type,
        special_instructions: params.special_instructions?.trim() || null,
        status: 'pending',
        current_step: 1,
      });

      if (jobError) {
        throw new Error(`Falha ao registrar job de geração: ${jobError.message}`);
      }
      jobCreated = true;

      // PASSO 6 — Inserir em public.generation_steps (10 etapas todas como 'pending')
      params.onProgressState?.('Estruturando pipeline metodológico...');

      const stepsToInsert = INITIAL_GENERATION_STEPS.map((s) => ({
        id: crypto.randomUUID(),
        generation_job_id,
        step_number: s.step_number,
        step_key: s.step_key,
        label: s.label,
        description: s.description,
        status: 'pending',
        telemetry: null,
      }));

      const { error: stepsError } = await supabase.from('generation_steps').insert(stepsToInsert);
      if (stepsError) {
        throw new Error(`Falha ao registrar etapas metodológicas: ${stepsError.message}`);
      }

      // PASSO 7 — Upload real do PDF no Storage privado
      params.onProgressState?.('Enviando processo PDF para o Storage seguro...');

      const sanitizedName = sanitizeFilename(params.file.name);
      // Padrão estrito: {organization_id}/{process_id}/{generation_job_id}/{filename}
      const storagePath = `${currentOrg.id}/${process_id}/${generation_job_id}/${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('source-documents')
        .upload(storagePath, params.file, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Falha no upload do processo judicial: ${uploadError.message}`);
      }
      uploadedStoragePath = storagePath;

      // PASSO 8 — Inserir em public.source_documents
      params.onProgressState?.('Registrando metadados do documento fonte...');

      const { error: sourceDocError } = await supabase.from('source_documents').insert({
        id: crypto.randomUUID(),
        organization_id: currentOrg.id,
        process_id: process_id,
        generation_job_id: generation_job_id,
        file_name: params.file.name.slice(0, 255),
        storage_path: storagePath,
        mime_type: 'application/pdf',
        file_size: params.file.size,
      });

      if (sourceDocError) {
        throw new Error(`Falha ao registrar documento fonte: ${sourceDocError.message}`);
      }

      // Auditoria opcional em public.audit_events (executada silenciosamente se permitida pelo RLS)
      try {
        await supabase.from('audit_events').insert({
          id: crypto.randomUUID(),
          organization_id: currentOrg.id,
          user_id: authUserId,
          action: 'generation_job.created',
          entity_type: 'generation_jobs',
          entity_id: generation_job_id,
          metadata: {
            process_number: params.process_number.trim(),
            document_type: params.document_type,
            file_name: params.file.name,
          },
        });
      } catch (auditErr) {
        console.warn('Registro de evento de auditoria ignorado:', auditErr);
      }

      params.onProgressState?.('Finalizando solicitação...');

      return {
        job_id: generation_job_id,
        process_id,
        storage_path: storagePath,
      };
    } catch (err: unknown) {
      // COMPENSAÇÃO EM CASO DE FALHA
      console.error('Erro na criação de Nova Peça, iniciando compensação:', err);
      await this.compensateFailure({
        process_id: processCreated ? process_id : undefined,
        generation_job_id: jobCreated ? generation_job_id : undefined,
        storage_path: uploadedStoragePath || undefined,
      });

      const message = err instanceof Error ? err.message : 'Falha inesperada ao registrar solicitação.';
      throw new Error(message);
    }
  }

  /**
   * Compensação reversa segura
   */
  private async compensateFailure(details: {
    process_id?: string;
    generation_job_id?: string;
    storage_path?: string;
  }) {
    if (details.storage_path) {
      try {
        await supabase.storage.from('source-documents').remove([details.storage_path]);
      } catch (e) {
        console.warn('Falha na remoção compensatória de arquivo do Storage:', e);
      }
    }

    if (details.generation_job_id) {
      try {
        await supabase.from('source_documents').delete().eq('generation_job_id', details.generation_job_id);
      } catch (e) {
        console.warn('Falha na remoção compensatória de source_documents:', e);
      }

      try {
        await supabase.from('generation_steps').delete().eq('generation_job_id', details.generation_job_id);
      } catch (e) {
        console.warn('Falha na remoção compensatória de generation_steps:', e);
      }

      try {
        await supabase.from('generation_jobs').delete().eq('id', details.generation_job_id);
      } catch (e) {
        console.warn('Falha na remoção compensatória de generation_jobs:', e);
      }
    }

    if (details.process_id) {
      try {
        await supabase.from('process_subjects').delete().eq('process_id', details.process_id);
      } catch (e) {
        console.warn('Falha na remoção compensatória de process_subjects:', e);
      }

      try {
        await supabase.from('processes').delete().eq('id', details.process_id);
      } catch (e) {
        console.warn('Falha na remoção compensatória de processes:', e);
      }
    }
  }

  /**
   * Consulta real de um Job por ID com join de processo, matérias, etapas e documento fonte
   */
  async getJobById(jobId: string): Promise<GenerationJob | null> {
    try {
      const { data: job, error: jobErr } = await supabase
        .from('generation_jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (jobErr || !job) {
        return null;
      }

      // Busca processo
      const { data: proc } = await supabase
        .from('processes')
        .select('*')
        .eq('id', job.process_id)
        .maybeSingle();

      // Busca matérias
      const { data: subjectsData } = await supabase
        .from('process_subjects')
        .select('*')
        .eq('process_id', job.process_id);

      const subjectsList = (subjectsData || []).map((s: ProcessSubject) =>
        s.subject === 'Outro' && s.custom_subject ? `Outro: ${s.custom_subject}` : s.subject
      );

      // Busca etapas
      const { data: stepsData } = await supabase
        .from('generation_steps')
        .select('*')
        .eq('generation_job_id', jobId)
        .order('step_number', { ascending: true });

      // Busca documento fonte
      const { data: sourceDoc } = await supabase
        .from('source_documents')
        .select('*')
        .eq('generation_job_id', jobId)
        .maybeSingle();

      const generationJob: GenerationJob = {
        id: job.id,
        organization_id: job.organization_id,
        process_id: job.process_id,
        user_id: job.user_id,
        document_type: job.document_type as DocumentType,
        special_instructions: job.special_instructions,
        status: job.status,
        current_step: job.current_step,
        error_message: job.error_message,
        created_at: job.created_at,
        started_at: job.started_at,
        completed_at: job.completed_at,
        process: proc || undefined,
        process_data: {
          process_number: proc?.process_number || 'N/A',
          court: proc?.court || 'N/A',
          represented_party: proc?.represented_party || 'N/A',
          subjects: subjectsList,
          file_name: sourceDoc?.file_name || undefined,
          file_size: sourceDoc?.file_size || undefined,
        },
        steps: stepsData || [],
        source_document: sourceDoc || undefined,
      };

      return generationJob;
    } catch (e) {
      console.error('Erro ao buscar job no Supabase:', e);
      return null;
    }
  }

  /**
   * Consulta real dos Jobs da organização
   */
  async getJobsByOrganization(orgId: string): Promise<GenerationJob[]> {
    try {
      const { data: jobs, error } = await supabase
        .from('generation_jobs')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (error || !jobs || jobs.length === 0) {
        return [];
      }

      // Preenche os metadados dos processos para a lista
      const processIds = Array.from(new Set(jobs.map((j) => j.process_id)));
      const { data: processes } = await supabase
        .from('processes')
        .select('*')
        .in('id', processIds);

      const processMap = new Map((processes || []).map((p: Process) => [p.id, p]));

      // Preenche matérias
      const { data: allSubjects } = await supabase
        .from('process_subjects')
        .select('*')
        .in('process_id', processIds);

      const subjectsMap = new Map<string, string[]>();
      (allSubjects || []).forEach((s: ProcessSubject) => {
        const list = subjectsMap.get(s.process_id) || [];
        const label = s.subject === 'Outro' && s.custom_subject ? `Outro: ${s.custom_subject}` : s.subject;
        list.push(label);
        subjectsMap.set(s.process_id, list);
      });

      return jobs.map((job) => {
        const proc = processMap.get(job.process_id);
        const subs = subjectsMap.get(job.process_id) || [];

        return {
          id: job.id,
          organization_id: job.organization_id,
          process_id: job.process_id,
          user_id: job.user_id,
          document_type: job.document_type as DocumentType,
          special_instructions: job.special_instructions,
          status: job.status,
          current_step: job.current_step,
          error_message: job.error_message,
          created_at: job.created_at,
          started_at: job.started_at,
          completed_at: job.completed_at,
          process: proc,
          process_data: {
            process_number: proc?.process_number || 'N/A',
            court: proc?.court || 'N/A',
            represented_party: proc?.represented_party || 'N/A',
            subjects: subs,
          },
          steps: [],
        };
      });
    } catch (e) {
      console.error('Erro ao buscar jobs da organização:', e);
      return [];
    }
  }

  /**
   * Consulta real de um documento gerado pelo job_id
   */
  async getDocumentByJobId(jobId: string): Promise<GeneratedDocument | null> {
    try {
      const { data: doc, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('generation_job_id', jobId)
        .maybeSingle();

      if (error || !doc) return null;
      return doc as GeneratedDocument;
    } catch {
      return null;
    }
  }

  /**
   * Listagem real de documentos gerados da organização
   */
  async listDocuments(
    orgId: string,
    filterStatus?: string,
    search?: string
  ): Promise<GeneratedDocument[]> {
    try {
      let query = supabase
        .from('generated_documents')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      const { data: docs, error } = await query;
      if (error || !docs) return [];

      let list = docs as GeneratedDocument[];
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (d) =>
            d.process_number?.toLowerCase().includes(q) ||
            d.title?.toLowerCase().includes(q)
        );
      }
      return list;
    } catch {
      return [];
    }
  }

  /**
   * Download de documento — no estado atual, nenhum documento fictício é gerado.
   */
  downloadDocument(doc: GeneratedDocument, format: 'docx' | 'pdf'): void {
    console.info('Download solicitado para documento:', doc.id, format);
  }
}

export const generationService = new GenerationService();
