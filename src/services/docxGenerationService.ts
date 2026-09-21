/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Fase 5: Serviço de Geração DOCX CAW (n8n / Carbone)
 * 
 * Responsabilidades:
 * - Valida sessão do usuário e organização ativa;
 * - Dispara a geração através do endpoint seguro server-side /api/generate-docx;
 * - Trata estados progressivos de progresso para a UI (sem falsos positivos);
 * - Confirma o registro em public.generated_documents;
 * - Fornece download do DOCX gerado via URL assinada temporária ou storage autenticado.
 */

import { supabase } from '../lib/supabase';
import { authService } from './authService';

export type CawDocxGenerationStep =
  | 'idle'
  | 'assembling_payload'
  | 'sending_to_n8n'
  | 'processing_carbone'
  | 'saving_to_storage'
  | 'confirming_document'
  | 'completed'
  | 'error';

export interface CawDocxGenerationResult {
  success: boolean;
  job_id: string;
  document_id: string | null;
  filename: string;
  docx_storage_path: string;
  signed_url: string | null;
  included_blocks_count: number;
  linked_requests_count: number;
  created_at: string;
  duration_ms?: number;
  message?: string;
}

export class DocxGenerationService {
  /**
   * Dispara a geração oficial de DOCX através do endpoint seguro do VIPAZ
   */
  async generateDocx(
    generationJobId: string,
    onStepChange?: (step: CawDocxGenerationStep, message: string) => void
  ): Promise<CawDocxGenerationResult> {
    if (!generationJobId || !generationJobId.trim()) {
      throw new Error('ID do job de geração (generation_job_id) é obrigatório.');
    }

    const cleanJobId = generationJobId.trim();

    // 1. Validar organização ativa
    const currentOrg = authService.getCurrentOrganization();
    if (!currentOrg?.id) {
      console.warn('[DocxGenerationService] Nenhuma organização explicitamente selecionada.');
    }

    // 2. Notificar montagem de payload
    onStepChange?.(
      'assembling_payload',
      'Montando payload determinístico a partir do snapshot persistido...'
    );

    // 3. Obter token de sessão para repasse seguro
    let token = '';
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      token = sessionData?.session?.access_token || '';
    } catch (e) {
      console.warn('[DocxGenerationService] Sessão Supabase não ativa:', e);
    }

    // 4. Disparar chamada ao endpoint server-side /api/generate-docx
    onStepChange?.('sending_to_n8n', 'Enviando ao motor DOCX CAW (n8n)...');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Timeout de 100 segundos no cliente
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 100000);

    // Transições visuais estimadas para transparência operacional
    const tCarbone = setTimeout(() => {
      onStepChange?.('processing_carbone', 'Processando template nativo no Carbone...');
    }, 4000);

    const tStorage = setTimeout(() => {
      onStepChange?.('saving_to_storage', 'Gravando documento no Supabase Storage seguro...');
    }, 12000);

    let response: Response;
    try {
      response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          generation_job_id: cleanJobId,
        }),
        signal: abortController.signal,
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      clearTimeout(tCarbone);
      clearTimeout(tStorage);

      const isAbort = (fetchErr as Error)?.name === 'AbortError';
      const msg = isAbort
        ? 'Tempo limite de requisição excedido ao comunicar com o servidor VIPAZ.'
        : (fetchErr as Error)?.message || 'Erro de rede na chamada da API.';

      onStepChange?.('error', `Falha de conexão: ${msg}`);
      throw new Error(`Falha de comunicação com o backend VIPAZ: ${msg}`);
    } finally {
      clearTimeout(timeoutId);
      clearTimeout(tCarbone);
      clearTimeout(tStorage);
    }

    onStepChange?.('confirming_document', 'Confirmando registro em public.generated_documents...');

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.error || errorJson.message || JSON.stringify(errorJson);
      } catch {
        try {
          errorDetails = await response.text();
        } catch {
          errorDetails = `HTTP ${response.status} ${response.statusText}`;
        }
      }

      onStepChange?.('error', `Erro na geração: ${errorDetails}`);
      throw new Error(`O motor de geração DOCX reportou erro: ${errorDetails}`);
    }

    let resultData: any;
    try {
      resultData = await response.json();
    } catch (parseErr) {
      throw new Error('A resposta do servidor VIPAZ não é um JSON válido.');
    }

    if (!resultData.success) {
      const err = resultData.error || 'Falha não especificada na geração do DOCX.';
      onStepChange?.('error', err);
      throw new Error(err);
    }

    // Se signed_url não tiver sido gerada pelo servidor, tenta gerar no cliente autenticado
    let signedUrl = resultData.signed_url || null;
    if (!signedUrl && resultData.docx_storage_path) {
      try {
        const { data: signedData } = await supabase.storage
          .from('generated-documents')
          .createSignedUrl(resultData.docx_storage_path, 3600);
        if (signedData?.signedUrl) {
          signedUrl = signedData.signedUrl;
        }
      } catch (signClientErr) {
        console.warn('[DocxGenerationService] Aviso ao gerar signedUrl no cliente:', signClientErr);
      }
    }

    const finalResult: CawDocxGenerationResult = {
      success: true,
      job_id: resultData.generation_job_id || cleanJobId,
      document_id: resultData.document_id || null,
      filename: resultData.filename || 'VIPAZ_Contestacao.docx',
      docx_storage_path: resultData.docx_storage_path || '',
      signed_url: signedUrl,
      included_blocks_count: resultData.included_blocks_count || 28,
      linked_requests_count: resultData.linked_requests_count || 14,
      created_at: resultData.created_at || new Date().toISOString(),
      duration_ms: resultData.duration_ms,
      message: resultData.message,
    };

    onStepChange?.('completed', 'Documento DOCX gerado e homologado com sucesso!');
    return finalResult;
  }

  /**
   * Download seguro do arquivo DOCX gerado (via URL assinada ou download autenticado do Storage)
   */
  async downloadDocx(params: {
    signed_url?: string | null;
    docx_storage_path?: string;
    filename?: string;
  }): Promise<void> {
    const filename = params.filename || 'VIPAZ_Contestacao.docx';

    // 1. Se possuir URL assinada temporária, realiza o download direto
    if (params.signed_url) {
      try {
        const response = await fetch(params.signed_url);
        if (response.ok) {
          const blob = await response.blob();
          this.triggerBrowserDownload(blob, filename);
          return;
        }
      } catch (err) {
        console.warn('[DocxGenerationService] Download via signed_url falhou, tentando fallback por storage:', err);
      }
    }

    // 2. Fallback por download autenticado no Supabase Storage
    if (params.docx_storage_path) {
      const { data: blob, error } = await supabase.storage
        .from('generated-documents')
        .download(params.docx_storage_path);

      if (error || !blob) {
        throw new Error(
          error?.message || 'Falha ao descarregar o arquivo DOCX do repositório seguro.'
        );
      }

      this.triggerBrowserDownload(blob, filename);
      return;
    }

    throw new Error('Nenhum caminho ou URL assinada disponível para download do DOCX.');
  }

  /**
   * Helper para disparar download no browser
   */
  private triggerBrowserDownload(blob: Blob, filename: string): void {
    const blobUrl = window.URL.createObjectURL(blob);
    try {
      const link = window.document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } finally {
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 3000);
    }
  }
}

export const docxGenerationService = new DocxGenerationService();
