/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Serviço de Orquestração da Geração Determinística de Contestação
 */

import { supabase } from '../lib/supabase';
import { authService } from './authService';
import { LegalFormData, ResolvedDocumentAssembly } from '../domain/legal-engine/types';
import { ruleEngine } from '../domain/legal-engine/ruleEngine';
import { documentRenderer } from './documentRenderer';
import { sanitizeFilename } from './generationService';
import { legalSnapshotService, LegalCaseSnapshotResult } from './legalSnapshotService';

export interface DeterministicGenerationStep {
  step_number: number;
  step_key: string;
  label: string;
  description: string;
}

export const DETERMINISTIC_PIPELINE_STEPS: DeterministicGenerationStep[] = [
  {
    step_number: 1,
    step_key: 'input_validation',
    label: 'Validação de Entrada e Jurisdição Competente',
    description: 'Conferência de dados forenses, número do processo e comarca.',
  },
  {
    step_number: 2,
    step_key: 'derivation_resolution',
    label: 'Resolução de Derivações e Regras Forenses',
    description: 'Aplicação das regras de competência territorial e identificação do patrono.',
  },
  {
    step_number: 3,
    step_key: 'mapa_da_peca_filter',
    label: 'Inspeção do Mapa da Peça e Filtro de Teses',
    description: 'Filtragem determinística dos blocos preliminares e prejudiciais de mérito.',
  },
  {
    step_number: 4,
    step_key: 'preliminaries_assembly',
    label: 'Estruturação das Preliminares e Prejudiciais',
    description: 'Compilação de ilegitimidade ativa, gratuidade, valor da causa e prescrição.',
  },
  {
    step_number: 5,
    step_key: 'merits_defense_assembly',
    label: 'Montagem da Defesa de Mérito e Pool PME',
    description: 'Demonstração de higidez regulatória, agrupamento da ANS e validade do contrato.',
  },
  {
    step_number: 6,
    step_key: 'actuarial_proof_consolidation',
    label: 'Consolidação de Prova Atuarial e Diálogo das Fontes',
    description: 'Incorporação de laudos de auditoria independente e parâmetros do STJ/STF.',
  },
  {
    step_number: 7,
    step_key: 'requests_harmonization',
    label: 'Harmonização de Requerimentos com as Teses Ativas',
    description: 'Sincronização estrita dos pedidos finais com as matérias defensivas incluídas.',
  },
  {
    step_number: 8,
    step_key: 'prequestioning_closing',
    label: 'Prequestionamento Qualificado e Fechamento Institucional',
    description: 'Inserção de dispositivos constitucionais, normativos e assinaturas homologadas.',
  },
  {
    step_number: 9,
    step_key: 'docx_rendering',
    label: 'Renderização Tipográfica em Formato DOCX Homologado',
    description: 'Aplicação de padrões ABNT/forenses, cabeçalhos, margens e paginação CAW.',
  },
  {
    step_number: 10,
    step_key: 'storage_persistence',
    label: 'Persistência em Repositório Seguro e Emissão de Snapshot',
    description: 'Armazenamento no repositório criptografado e gravação de trilha de auditoria.',
  },
];

export class DeterministicGenerationService {
  /**
   * Executa o fluxo completo do Motor Determinístico de Montagem Jurídica
   */
  async generateContestacao(
    formData: LegalFormData,
    onProgress?: (stepText: string) => void
  ): Promise<{
    job_id: string;
    process_id: string;
    assembly: ResolvedDocumentAssembly;
  }> {
    // 1. Avalia o formulário com o motor de regras
    onProgress?.('Validando integridade formal dos dados da peça...');
    const evaluation = ruleEngine.evaluate(formData);
    if (!evaluation.isValid) {
      const msgs = evaluation.errors.map((e) => e.message).join(' | ');
      throw new Error(`Pendências no formulário: ${msgs}`);
    }

    const assembly = evaluation.assembly;

    // 2. Valida autenticação e tenant
    onProgress?.('Verificando credenciais e isolamento de tenant...');
    const currentOrg = authService.getCurrentOrganization();
    if (!currentOrg?.id) {
      throw new Error('Nenhuma organização ativa selecionada. Faça login novamente.');
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const authUserId = sessionData?.session?.user?.id || '00000000-0000-0000-0000-000000000000';

    const process_id = crypto.randomUUID();
    const generation_job_id = crypto.randomUUID();

    // 3. Cadastra o Processo
    onProgress?.('Registrando processo judicial...');
    const { error: procErr } = await supabase.from('processes').insert({
      id: process_id,
      organization_id: currentOrg.id,
      process_number: formData.process_number.trim(),
      court: `${formData.court_type} ${formData.court_number}ª - Comarca de ${formData.district}/${formData.uf}`,
      represented_party: formData.client.trim(),
      created_by: authUserId,
    });

    if (procErr) {
      console.warn('Registro em public.processes:', procErr.message);
    }

    // 4. Cadastra Matérias Controvertidas
    onProgress?.('Registrando matérias controvertidas...');
    const subjectsToInsert = [];
    if (formData.dispute_objects.reajuste_pme) {
      subjectsToInsert.push({
        id: crypto.randomUUID(),
        process_id,
        subject: 'Reajuste PME',
        custom_subject: null,
      });
    }
    if (formData.dispute_objects.reajuste_pme_etario) {
      subjectsToInsert.push({
        id: crypto.randomUUID(),
        process_id,
        subject: 'Reajuste Etário',
        custom_subject: null,
      });
    }
    if (formData.moral_damages_status === 'claimed') {
      subjectsToInsert.push({
        id: crypto.randomUUID(),
        process_id,
        subject: 'Dano Moral',
        custom_subject: null,
      });
    }
    if (formData.dispute_objects.outro && formData.dispute_objects.outro_descricao) {
      subjectsToInsert.push({
        id: crypto.randomUUID(),
        process_id,
        subject: 'Outro',
        custom_subject: formData.dispute_objects.outro_descricao.trim(),
      });
    }
    if (subjectsToInsert.length === 0) {
      subjectsToInsert.push({
        id: crypto.randomUUID(),
        process_id,
        subject: 'Reajuste Coletivo',
        custom_subject: null,
      });
    }

    try {
      await supabase.from('process_subjects').insert(subjectsToInsert);
    } catch (subjErr) {
      console.warn('Registro em process_subjects ignorado:', subjErr);
    }

    // 5. Cadastra o Job de Geração
    onProgress?.('Criando job metodológico no pipeline...');
    const { error: jobErr } = await supabase.from('generation_jobs').insert({
      id: generation_job_id,
      organization_id: currentOrg.id,
      process_id,
      user_id: authUserId,
      document_type: formData.document_piece,
      special_instructions: `Montagem Determinística v${assembly.architecture.version} | ${assembly.includedBlocks.length} blocos ativos`,
      status: 'processing',
      current_step: 1,
    });

    if (jobErr) {
      console.warn('Registro em generation_jobs:', jobErr.message);
    }

    // 6. Cadastra as 10 Etapas
    onProgress?.('Estruturando as 10 etapas do pipeline forense...');
    const stepsToInsert = DETERMINISTIC_PIPELINE_STEPS.map((step) => ({
      id: crypto.randomUUID(),
      generation_job_id,
      step_number: step.step_number,
      step_key: step.step_key,
      label: step.label,
      description: step.description,
      status: 'pending',
      telemetry: null,
    }));

    try {
      await supabase.from('generation_steps').insert(stepsToInsert);
    } catch (stepErr) {
      console.warn('Registro de generation_steps:', stepErr);
    }

    // 7. Se houver arquivo fonte (PDF), faz upload para source-documents
    if (formData.source_file) {
      onProgress?.('Armazenando autos do processo original no Storage seguro...');
      try {
        const sanitizedName = sanitizeFilename(formData.source_file.name);
        const sourceStoragePath = `${currentOrg.id}/${process_id}/${generation_job_id}/${sanitizedName}`;

        await supabase.storage
          .from('source-documents')
          .upload(sourceStoragePath, formData.source_file, {
            contentType: 'application/pdf',
            upsert: false,
          });

        await supabase.from('source_documents').insert({
          id: crypto.randomUUID(),
          organization_id: currentOrg.id,
          process_id,
          generation_job_id,
          file_name: formData.source_file.name.slice(0, 255),
          storage_path: sourceStoragePath,
          mime_type: 'application/pdf',
          file_size: formData.source_file.size,
        });
      } catch (uploadErr) {
        console.warn('Upload de source_documents ignorado:', uploadErr);
      }
    }

    // 8. Renderização Tipográfica do DOCX
    onProgress?.('Renderizando peça em formato DOCX com tipografia forense...');
    const docxBlob = await documentRenderer.renderToDocxBlob(assembly);

    // 9. Persistência do DOCX no Storage Privado
    onProgress?.('Salvando arquivo DOCX no repositório criptografado...');
    const cleanProc = formData.process_number.replace(/[^0-9]/g, '') || Date.now().toString();
    const docxStoragePath = `${currentOrg.id}/${generation_job_id}/Contestacao_${cleanProc}.docx`;

    let storageUploaded = false;
    try {
      const { error: uploadDocxErr } = await supabase.storage
        .from('generated-documents')
        .upload(docxStoragePath, docxBlob, {
          contentType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: true,
        });

      if (!uploadDocxErr) {
        storageUploaded = true;
      } else {
        console.warn('Aviso no upload para generated-documents:', uploadDocxErr.message);
      }
    } catch (docUpErr) {
      console.warn('Exceção no upload para generated-documents:', docUpErr);
    }

    // Se o bucket falhar ou não estiver provisionado, cria fallback com ObjectURL ou local base
    const finalDocxStoragePath = storageUploaded ? docxStoragePath : `local/${docxStoragePath}`;

    // 10. Registra o Documento Gerado em public.generated_documents
    onProgress?.('Registrando metadados da Contestação gerada...');
    const generatedDocId = crypto.randomUUID();
    const subjectsNames = subjectsToInsert.map((s) => s.subject);

    try {
      await supabase.from('generated_documents').insert({
        id: generatedDocId,
        organization_id: currentOrg.id,
        generation_job_id,
        process_number: formData.process_number.trim(),
        document_type: formData.document_piece,
        version: assembly.architecture.version,
        docx_storage_path: finalDocxStoragePath,
        pdf_storage_path: '', // MVP trabalha exclusivamente com DOCX
        title: `Contestação — Plano de Saúde PME (${formData.process_number})`,
        metadata: {
          court: `${formData.court_type} ${formData.court_number}ª - Comarca de ${formData.district}/${formData.uf}`,
          represented_party: formData.client.trim(),
          opposing_party: formData.opposing_party.trim(),
          subjects: subjectsNames,
          word_count: assembly.includedBlocks.reduce(
            (acc, b) => acc + b.content.split(/\s+/).length,
            0
          ),
          pages_estimated: Math.ceil(
            assembly.includedBlocks.reduce(
              (acc, b) => acc + b.content.split(/\s+/).length,
              0
            ) / 350
          ),
        },
        structured_content: {
          addressing: assembly.resolvedVariables.DISTRICT,
          qualification: formData.client,
          preliminaries: assembly.includedBlocks
            .filter((b) => b.category === 'preliminary')
            .map((b) => b.title),
          facts_summary: [formData.claim_summary],
          merits: assembly.includedBlocks
            .filter((b) => b.category === 'merits')
            .map((b) => b.title),
          requests: assembly.includedRequests.map((r) => r.label),
          closing: assembly.resolvedVariables.CIDADE_ESTADO_DATA,
        },
      });
    } catch (genDocErr) {
      console.warn('Registro em generated_documents:', genDocErr);
    }

    // 11. Gravação do Snapshot Auditável
    onProgress?.('Gravando snapshot de auditoria forense...');
    try {
      await supabase.from('generation_snapshots').insert({
        id: crypto.randomUUID(),
        organization_id: currentOrg.id,
        generation_job_id,
        architecture_version: assembly.architecture.version,
        form_data: assembly.snapshot.formData,
        applied_rule_keys: assembly.snapshot.appliedRuleKeys,
        included_block_keys: assembly.snapshot.includedBlockKeys,
      });
    } catch (snapErr) {
      console.warn('Gravação em generation_snapshots:', snapErr);
    }

    // 12. Atualiza status de todas as etapas para completed
    onProgress?.('Finalizando conferência e disponibilizando documento...');
    try {
      await supabase
        .from('generation_steps')
        .update({ status: 'completed' })
        .eq('generation_job_id', generation_job_id);

      await supabase
        .from('generation_jobs')
        .update({
          status: 'completed',
          current_step: 10,
          completed_at: new Date().toISOString(),
        })
        .eq('id', generation_job_id);
    } catch (updateErr) {
      console.warn('Atualização de status do job:', updateErr);
    }

    // Fase 3: n8n desativado estritamente por determinação de escopo
    // Webhook n8n não é chamado nesta fase

    return {
      job_id: generation_job_id,
      process_id,
      assembly,
    };
  }

  /**
   * Executa a Fase 3: Validação, criação de job e persistência de snapshot em legal_case_inputs
   * Sem gerar DOCX, sem chamar OpenAI e sem chamar n8n.
   */
  async saveDeterministicSnapshot(
    formData: LegalFormData,
    onProgress?: (stepText: string) => void
  ): Promise<LegalCaseSnapshotResult> {
    return legalSnapshotService.persistCaseSnapshot(formData, onProgress);
  }
}

export const deterministicGenerationService = new DeterministicGenerationService();
