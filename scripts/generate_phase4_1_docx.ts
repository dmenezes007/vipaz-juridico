/**
 * Script de Geração e Verificação do DOCX da Fase 4.1
 * Produz o arquivo físico: VIPAZ_Contestacao_0802491-32.2024.8.19.0001_F4-1.docx
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  experimentalDocxService,
  getOfficialHomologatedSnapshot,
} from '../src/services/experimentalDocxService';

async function main() {
  console.log('--- GERANDO DOCX FASE 4.1 DETERMINÍSTICO ---');
  const snapshot = getOfficialHomologatedSnapshot();
  console.log('Snapshot carregado:');
  console.log(' - Job ID:', snapshot.generation_job_id);
  console.log(' - Input ID:', snapshot.id);
  console.log(' - Processo:', snapshot.basic_data.process_number);

  // Gera DOCX Fase 4 (original snapshot 27 blocos + renumeração dinâmica)
  const resultF4 = await experimentalDocxService.generateDocx(snapshot);
  const bufferF4 = Buffer.from(await resultF4.blob.arrayBuffer());
  const outputPathF4 = path.resolve(process.cwd(), resultF4.filename);
  fs.writeFileSync(outputPathF4, bufferF4);
  console.log(`\n✓ Arquivo Fase 4 gravado com sucesso em: ${outputPathF4} (${bufferF4.length} bytes)`);

  // Gera DOCX Fase 4.1 (28 blocos + renumeração dinâmica)
  const result = await experimentalDocxService.generatePhase41Docx(snapshot);

  console.log('\nResultado da geração:');
  console.log(' - Sucesso:', result.success);
  console.log(' - Nome do arquivo:', result.filename);
  console.log(' - Blocos incluídos:', result.includedBlocksCount);
  console.log(' - Pedidos vinculados:', result.linkedRequestsCount);
  console.log(' - Tamanho:', result.fileSizeFormatted, `(${result.fileSizeBytes} bytes)`);
  console.log(' - Blocos não homologados com marcador:', result.unhomologatedBlocks);
  console.log(' - Variáveis não resolvidas:', result.unresolvedVariables.length);

  // Converte o Blob para Buffer e grava no disco
  const arrayBuffer = await result.blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outputPath = path.resolve(process.cwd(), result.filename);

  fs.writeFileSync(outputPath, buffer);
  console.log(`\n✓ Arquivo gravado com sucesso em: ${outputPath}`);
  console.log(`✓ Verificação de integridade: ${fs.statSync(outputPath).size} bytes`);
}

main().catch((err) => {
  console.error('Falha na geração do DOCX:', err);
  process.exit(1);
});
