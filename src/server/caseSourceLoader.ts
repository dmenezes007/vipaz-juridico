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

export interface PdfExtractionResult {
  totalPages: number;
  pages: string[];
}

export type PdfTextExtractor = (blob: Blob) => Promise<PdfExtractionResult>;

const SOURCE_BUCKET = 'source-documents';
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const MAX_PDF_PAGES = 200;
const MAX_EXTRACTED_CHARS_PER_DOCUMENT = 2_000_000;
const PDF_EXTRACTION_TIMEOUT_MS = 20_000;

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

export const defaultPdfTextExtractor: PdfTextExtractor = async (blob) => {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const pdf = await getDocumentProxy(bytes);

  if (pdf.numPages > MAX_PDF_PAGES) throw new Error('source_pdf_too_many_pages');

  const extraction = await Promise.race([
    extractText(pdf, { mergePages: false }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('source_pdf_extraction_timeout')), PDF_EXTRACTION_TIMEOUT_MS),
    ),
  ]);

  const pages = Array.isArray(extraction.text) ? extraction.text.map((page) => String(page || '').trim()) : [String(extraction.text || '').trim()];
  const extractedChars = pages.reduce((total, page) => total + page.length, 0);
  if (!pages.some(Boolean)) throw new Error('source_pdf_text_not_extractable');
  if (extractedChars > MAX_EXTRACTED_CHARS_PER_DOCUMENT) throw new Error('source_pdf_extracted_text_too_large');

  return { totalPages: pdf.numPages, pages };
};

async function readTextBlob(blob: Blob) {
  if (blob.size > MAX_DOCUMENT_BYTES) throw new Error('source_document_too_large');
  return (await blob.text()).trim();
}

export async function loadCaseSourceBundle(
  client: SupabaseClient,
  documents: AuthorizedSourceDocument[],
  options: { pdfTextExtractor?: PdfTextExtractor } = {},
): Promise<CaseSourceBundle> {
  if (documents.length === 0) throw new Error('source_document_required');

  let totalBytes = 0;
  const sections: string[] = [];
  const pdfTextExtractor = options.pdfTextExtractor || defaultPdfTextExtractor;

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
      const extracted = await pdfTextExtractor(data);
      const pages = extracted.pages.map((text, index) => `[PAGE: ${index + 1}]\\n${text}`).join('\\n\\n');
      sections.push([
        `[DOCUMENT_ID: ${document.id}]`,
        `[DOCUMENT_NAME: ${document.fileName}]`,
        `[DOCUMENT_PAGES: ${extracted.totalPages}]`,
        pages,
      ].join('\\n'));
      continue;
    }

    throw new Error(`source_document_type_not_supported:${document.id}`);
  }

  return { sourceMaterial: sections.join('\n\n---\n\n'), documents };
}
