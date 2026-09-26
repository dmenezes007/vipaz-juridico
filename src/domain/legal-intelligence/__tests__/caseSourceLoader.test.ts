import assert from 'node:assert/strict';
import { loadCaseSourceBundle } from '../../server/caseSourceLoader';

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

const pdfBytes = Uint8Array.from(Buffer.from('JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgMyAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL0NvbnRlbnRzIDcgMCBSIC9NZWRpYUJveCBbIDAgMCAzMDAgMzAwIF0gL1BhcmVudCA2IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSCj4+IC9UeXBlIC9QYWdlCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNiAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL0YxIDIgMCBSCj4+CmVuZG9iago=', 'base64'));
const pdfDocument = { ...document, fileName: 'autos.pdf', mimeType: 'application/pdf', storagePath: 'org/process/job/autos.pdf' };
const pdfBundle = await loadCaseSourceBundle(clientFor(new Blob([pdfBytes]), pdfDocument.storagePath), [pdfDocument]);
assert.match(pdfBundle.sourceMaterial, /DOCUMENT_ID: doc-1/);
assert.match(pdfBundle.sourceMaterial, /PAGE: 1/);
assert.match(pdfBundle.sourceMaterial, /Processo 3001903-61.2026.8.19.0209/);

console.log('✓ case source loader contract');
