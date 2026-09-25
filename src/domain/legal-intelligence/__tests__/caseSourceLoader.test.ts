import assert from 'node:assert/strict';
import { loadCaseSourceBundle } from '../../server/caseSourceLoader';

function clientFor(blob: Blob) {
  return {
    storage: {
      from(bucket: string) {
        assert.equal(bucket, 'source-documents');
        return {
          async download(path: string) {
            assert.equal(path, 'org/process/job/autos.txt');
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

await assert.rejects(
  () => loadCaseSourceBundle(clientFor(new Blob(['%PDF-1.7'])), [{ ...document, fileName: 'autos.pdf', mimeType: 'application/pdf' }]),
  /source_pdf_extractor_not_configured:doc-1/,
);

console.log('✓ case source loader contract');
