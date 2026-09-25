import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthorizedSourceDocument {
  id: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
}

export interface CaseSourceBundle {
  sourceMaterial: string;
  documents: AuthorizedSourceDocument[];
}

const SOURCE_BUCKET = 'source-documents';
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;

function normalizeMimeType(value: unknown) {
  return String(value || '').split(';', 1)[0].trim().toLowerCase();
}

function isTextualDocument(document: AuthorizedSourceDocument) {
  const mime = normalizeMimeType(document.mimeType);
  const name = document.fileName.toLowerCase();
  return mime.startsWith('text/') || mime === 'application/json' || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.json');
}

function isPdf(document: AuthorizedSourceDocument) {
  return normalizeMimeType(document.mimeType) === 'application/pdf' || document.fileName.toLowerCase().endsWith('.pdf');
}

async function readTextBlob(blob: Blob) {
  if (blob.size > MAX_DOCUMENT_BYTES) throw new Error('source_document_too_large');
  return (await blob.text()).trim();
}

export async function loadCaseSourceBundle(
  client: SupabaseClient,
  documents: AuthorizedSourceDocument[],
): Promise<CaseSourceBundle> {
  if (documents.length === 0) throw new Error('source_document_required');

  let totalBytes = 0;
  const sections: string[] = [];

  for (const document of documents) {
    const { data, error } = await client.storage.from(SOURCE_BUCKET).download(document.storagePath);
    if (error || !data) throw new Error(`source_document_download_failed:${document.id}`);

    totalBytes += data.size;
    if (data.size > MAX_DOCUMENT_BYTES || totalBytes > MAX_TOTAL_BYTES) {
      throw new Error('source_document_too_large');
    }

    if (isTextualDocument(document)) {
      const text = await readTextBlob(data);
      if (!text) throw new Error(`source_document_empty:${document.id}`);
      sections.push([
        `[DOCUMENT_ID: ${document.id}]`,
        `[DOCUMENT_NAME: ${document.fileName}]`,
        text,
      ].join('\n'));
      continue;
    }

    if (isPdf(document)) {
      // PDFs are intentionally not decoded with an ad-hoc browser/client parser.
      // Phase 5.1 requires a trusted server-side extraction adapter before a PDF
      // can become evidentiary sourceMaterial for the Case Analyst.
      throw new Error(`source_pdf_extractor_not_configured:${document.id}`);
    }

    throw new Error(`source_document_type_not_supported:${document.id}`);
  }

  return { sourceMaterial: sections.join('\n\n---\n\n'), documents };
}
