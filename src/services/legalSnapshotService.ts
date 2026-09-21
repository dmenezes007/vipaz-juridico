/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Serviço de Persistência do Snapshot Jurídico em public.legal_case_inputs (Fase 3)
 */

import { supabase } from '../lib/supabase';
import { authService } from './authService';
import { LegalFormData } from '../domain/legal-engine/types';
import { ruleEngine } from '../domain/legal-engine/ruleEngine';
import {
  mapBasicData,
  mapLegalAnswers,
  mapCustomTexts,
  extractDerivedVariables,
  buildResolvedArchitectureSnapshot,
  buildInitialLegalCaseInputPayload,
  INITIAL_EMPTY_DERIVED_VARIABLES,
  INITIAL_EMPTY_RESOLVED_ARCHITECTURE,
  DETERMINISTIC_ENGINE_VERSION,
  BasicDataSnapshot,
  LegalAnswersSnapshot,
  CustomTextsSnapshot,
  ResolvedArchitectureSnapshot,
} from '../domain/legal-engine/caseDataMapper';
import { sanitizeFilename } from './generationService';

export interface LegalCaseSnapshotResult {
  success: boolean;
  generation_job_id: string;
  legal_case_input_id: string;
  process_id: string;
  included_blocks_count: number;
  linked_requests_count: number;
  basic_data: BasicDataSnapshot;
  legal_answers: LegalAnswersSnapshot;
  custom_texts: CustomTextsSnapshot;
  derived_variables: Record<string, unknown>;
  resolved_architecture: ResolvedArchitectureSnapshot;
}

export class LegalSnapshotService {
  /**
   * Executa o pipeline determinístico estrito da Fase 3:
   * FORMULÁRIO -> caseData -> validação -> process -> generation_job ->
   * INSERT legal_case_inputs -> RuleEngine / ArchitectureResolver ->
   * UPDATE legal_case_inputs -> retorno para confirmação visual
   *
   * NÃO gera DOCX.
   * NÃO chama OpenAI.
   * NÃO chama n8n.
   */
  async persistCaseSnapshot(
    formData: LegalFormData,
    onProgress?: (stepText: string) => void
  ): Promise<LegalCaseSnapshotResult> {
    // 1. Validação com o RuleEngine
    onProgress?.('Validando integridade formal dos dados informados...');
    const evaluation = ruleEngine.evaluate(formData);
    if (!evaluation.isValid) {
      const msgs = evaluation.errors.map((e) => e.message).join(' | ');
      throw new Error(`Pendências no formulário: ${msgs}`);
    }

    const assembly = evaluation.assembly;

    // 2. Obtenção da Organização Ativa e Usuário
    onProgress?.('Verificando credenciais de acesso e isolamento de tenant...');
    const currentOrg = authService.getCurrentOrganization();
    if (!currentOrg?.id) {
      throw new Error('Nenhuma organização ativa selecionada. Faça login novamente.');
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const authUserId = sessionData?.session?.user?.id || '00000000-0000-0000-0000-000000000000';

    const process_id = crypto.randomUUID();
    const generation_job_id = crypto.randomUUID();
    const legal_case_input_id = crypto.randomUUID();

    // 3. Criação/Obtenção do Processo em public.processes
    onProgress?.('Garantindo registro do processo judicial...');
    let finalProcessId = process_id;

    try {
      const { data: existingProc } = await supabase
        .from('processes')
        .select('id')
        .eq('organization_id', currentOrg.id)
        .eq('process_number', formData.process_number.trim())
        .maybeSingle();

      if (existingProc?.id) {
        finalProcessId = existingProc.id;
      } else {
        const { error: procErr } = await supabase.from('processes').insert({
          id: process_id,
          organization_id: currentOrg.id,
          process_number: formData.process_number.trim(),
          court: `${formData.court_type} ${formData.court_number}ª - Comarca de ${formData.district}/${formData.uf}`,
          represented_party: formData.client.trim(),
          created_by: authUserId,
        });

        if (procErr) {
          console.warn('Aviso no registro de public.processes:', procErr.message);
        }
      }
    } catch (procException) {
      console.warn('Exceção ao consultar/criar processo:', procException);
    }

    // 4. Criação de generation_job em public.generation_jobs
    // Status 'processing': representa job em andamento com snapshot resolvido nesta fase
    onProgress?.('Criando job de geração no pipeline...');
    const { error: jobErr } = await supabase.from('generation_jobs').insert({
      id: generation_job_id,
      organization_id: currentOrg.id,
      process_id: finalProcessId,
      user_id: authUserId,
      document_type: formData.document_piece,
      special_instructions: `Montagem Determinística (Fase 3: Snapshot Jurídico) | ${assembly.includedBlocks.length} blocos ativos`,
      status: 'processing',
      current_step: 1,
    });

    if (jobErr) {
      throw new Error(`Falha ao registrar generation_job: ${jobErr.message}`);
    }

    // 5. Mapeamento dos contratos do snapshot
    onProgress?.('Mapeando contratos estritos de basic_data, legal_answers e custom_texts...');
    const basic_data = mapBasicData(formData);
    const legal_answers = mapLegalAnswers(formData);
    const custom_texts = mapCustomTexts(formData);

    // 6. Verificação de correspondência em public.legal_architectures
    let architectureId: string | null = null;
    let architectureVersion: string = assembly.architecture.version;

    try {
      const { data: archData } = await supabase
        .from('legal_architectures')
        .select('id, version')
        .eq('id', assembly.architecture.id)
        .maybeSingle();

      if (archData?.id) {
        architectureId = archData.id;
        if (archData.version) {
          architectureVersion = archData.version;
        }
      }
    } catch {
      // Se não houver correspondência persistida segura, mantém architecture_id = null
      architectureId = null;
    }

    // 7. INSERT inicial em public.legal_case_inputs (com campos JSONB NOT NULL inicializados com objetos válidos vazios)
    onProgress?.('Gravando snapshot inicial em public.legal_case_inputs...');
    const initialInputPayload = buildInitialLegalCaseInputPayload({
      id: legal_case_input_id,
      organization_id: currentOrg.id,
      process_id: finalProcessId,
      generation_job_id,
      user_id: authUserId,
      basic_data,
      legal_answers,
      custom_texts,
      architecture_id: architectureId,
      architecture_version: architectureVersion,
      engine_version: DETERMINISTIC_ENGINE_VERSION,
    });

    const { error: insertErr } = await supabase
      .from('legal_case_inputs')
      .insert(initialInputPayload);

    if (insertErr) {
      // Falha atômica: marca erro no job e interrompe imediatamente
      try {
        await supabase
          .from('generation_jobs')
          .update({
            status: 'failed',
            error_message: `Falha no INSERT de legal_case_inputs: ${insertErr.message}`,
          })
          .eq('id', generation_job_id);
      } catch {
        // Silêncio defensivo
      }

      throw new Error(
        `Falha ao persistir entrada do caso em public.legal_case_inputs: ${insertErr.message}`
      );
    }

    // 8. Resolução das variáveis derivadas e arquitetura auditável
    onProgress?.('Extraindo variáveis derivadas e consolidando arquitetura auditável...');
    const derived_variables = extractDerivedVariables(formData, assembly);
    const resolved_architecture = buildResolvedArchitectureSnapshot(assembly);

    // 9. UPDATE de public.legal_case_inputs com derived_variables e resolved_architecture
    onProgress?.('Atualizando snapshot definitivo com variáveis derivadas e blocos resolvidos...');
    const { error: updateErr } = await supabase
      .from('legal_case_inputs')
      .update({
        derived_variables,
        resolved_architecture,
        updated_at: new Date().toISOString(),
      })
      .eq('id', legal_case_input_id);

    if (updateErr) {
      try {
        await supabase
          .from('generation_jobs')
          .update({
            status: 'failed',
            error_message: `Falha no UPDATE de legal_case_inputs: ${updateErr.message}`,
          })
          .eq('id', generation_job_id);
      } catch {
        // Silêncio defensivo
      }

      throw new Error(
        `Falha ao atualizar snapshot resolvido em public.legal_case_inputs: ${updateErr.message}`
      );
    }

    // 10. Se houver arquivo fonte (PDF opcional), upload preservado sem bloquear se falhar
    if (formData.source_file) {
      onProgress?.('Armazenando autos originais no Storage seguro (opcional)...');
      try {
        const sanitizedName = sanitizeFilename(formData.source_file.name);
        const sourceStoragePath = `${currentOrg.id}/${finalProcessId}/${generation_job_id}/${sanitizedName}`;

        await supabase.storage
          .from('source-documents')
          .upload(sourceStoragePath, formData.source_file, {
            contentType: 'application/pdf',
            upsert: false,
          });

        await supabase.from('source_documents').insert({
          id: crypto.randomUUID(),
          organization_id: currentOrg.id,
          process_id: finalProcessId,
          generation_job_id,
          file_name: formData.source_file.name.slice(0, 255),
          storage_path: sourceStoragePath,
          mime_type: 'application/pdf',
          file_size: formData.source_file.size,
        });
      } catch (uploadErr) {
        console.warn('Upload de source_documents opcional ignorado:', uploadErr);
      }
    }

    // 11. Atualiza generation_jobs informando persistência bem-sucedida do snapshot
    // Mantém status 'processing' coerente com a ausência de DOCX nesta fase
    try {
      await supabase
        .from('generation_jobs')
        .update({
          current_step: 2,
          special_instructions: `Montagem Determinística: Snapshot gravado em legal_case_inputs (${legal_case_input_id}). Blocos: ${assembly.includedBlocks.length}. Requerimentos: ${assembly.includedRequests.length}.`,
        })
        .eq('id', generation_job_id);
    } catch (jobUpdateErr) {
      console.warn('Atualização informativa do job ignorada:', jobUpdateErr);
    }

    onProgress?.('Snapshot jurídico validado e gravado com sucesso no Supabase.');

    return {
      success: true,
      generation_job_id,
      legal_case_input_id,
      process_id: finalProcessId,
      included_blocks_count: assembly.includedBlocks.length,
      linked_requests_count: assembly.includedRequests.length,
      basic_data,
      legal_answers,
      custom_texts,
      derived_variables,
      resolved_architecture,
    };
  }
}

export const legalSnapshotService = new LegalSnapshotService();
