import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { defaultPdfTextExtractor, loadCaseSourceBundle } from '../../server/caseSourceLoader';

function clientFor(blob: Blob, expectedPath = 'org/process/job/autos.txt') {
  return {
    storage: {
      from(bucket: string) {
        assert.equal(bucket, 'source-documents');
        return {
          async download(path: string) {
            assert.equal(path, expectedPath);
            return { data: blob, error: null };
          },
        };
      },
    },
  } as any;
}

const document = {
  id: 'doc-1',
  fileName: 'autos.txt',
  mimeType: 'text/plain',
  storagePath: 'org/process/job/autos.txt',
};

const bundle = await loadCaseSourceBundle(clientFor(new Blob(['Processo 123. Fato documental.'])), [document]);
assert.match(bundle.sourceMaterial, /DOCUMENT_ID: doc-1/);
assert.match(bundle.sourceMaterial, /Processo 123/);

const pdfDocument = {
  ...document,
  fileName: 'autos.pdf',
  mimeType: 'application/pdf',
  storagePath: 'org/process/job/autos.pdf',
};
const pdfBundle = await loadCaseSourceBundle(
  clientFor(new Blob(['%PDF-1.7']), pdfDocument.storagePath),
  [pdfDocument],
  {
    pdfTextExtractor: async () => ({
      totalPages: 2,
      pages: ['Processo 3001903-61.2026.8.19.0209', 'Documento probatorio.'],
    }),
  },
);
assert.match(pdfBundle.sourceMaterial, /DOCUMENT_ID: doc-1/);
assert.match(pdfBundle.sourceMaterial, /DOCUMENT_PAGES: 2/);
assert.match(pdfBundle.sourceMaterial, /PAGE: 1/);
assert.match(pdfBundle.sourceMaterial, /PAGE: 2/);
assert.match(pdfBundle.sourceMaterial, /3001903-61.2026.8.19.0209/);

await assert.rejects(
  () => loadCaseSourceBundle(
    clientFor(new Blob(['%PDF-1.7']), pdfDocument.storagePath),
    [pdfDocument],
    { pdfTextExtractor: async () => { throw new Error('source_pdf_text_not_extractable'); } },
  ),
  /source_pdf_text_not_extractable/,
);

console.log('✓ case source loader contract');const fixtureBytes = await readFile(new URL('./fixtures/minimal.pdf', import.meta.url));
const pdfDocument = { ...document, fileName: 'autos.pdf', mimeType: 'application/pdf', storagePath: 'org/process/job/autos.pdf' };
const pdfBundle = await loadCaseSourceBundle(clientFor(new Blob([fixtureBytes]), pdfDocument.storagePath), [pdfDocument]);
assert.match(pdfBundle.sourceMaterial, /DOCUMENT_ID: doc-1/);
assert.match(pdfBundle.sourceMaterial, /DOCUMENT_PAGES: 1/);
assert.match(pdfBundle.sourceMaterial, /PAGE: 1/);
assert.match(pdfBundle.sourceMaterial, /3001903-61.2026.8.19.0209/);

const extracted = await defaultPdfTextExtractor(new Blob([fixtureBytes]));
assert.equal(extracted.totalPages, 1);
assert.match(extracted.pages[0], /3001903-61.2026.8.19.0209/);

await assert.rejects(
  () => loadCaseSourceBundle(
    clientFor(new Blob(['%PDF-1.7']), pdfDocument.storagePath),
    [pdfDocument],
    { pdfTextExtractor: async () => { throw new Error('source_pdf_text_not_extractable'); } },
  ),
  /source_pdf_text_not_extractable/,
);
console.log('✓ case source loader contract');
