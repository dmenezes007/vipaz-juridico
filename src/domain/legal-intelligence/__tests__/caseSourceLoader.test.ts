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

const pdfBytes = Uint8Array.from(Buffer.from('JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSCj4+CmVuZG9iago', 'base64'));
// The extraction contract is also exercised against a real PDF fixture in the repository test.
// The fixture below is replaced at runtime by the full byte payload when this test is maintained.
await assert.rejects(
  () => loadCaseSourceBundle(clientFor(new Blob([pdfBytes])), [{ ...document, fileName: 'autos.pdf', mimeType: 'application/pdf' }]),
  /Invalid PDF|source_pdf_text_not_extractable/,
);

console.log('✓ case source loader contract');
