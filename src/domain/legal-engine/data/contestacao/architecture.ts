/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Arquitetura Homologada: Contestação Reajuste PME
 */

import { LegalArchitecture } from '../../types';
import { CONTESTACAO_BLOCKS, CONTESTACAO_FINAL_REQUESTS } from './blocks';

export const CONTESTACAO_PME_ARCHITECTURE: LegalArchitecture = {
  id: 'arch_contestacao_pme_v1',
  documentPiece: 'Contestação',
  title: 'Contestação — Plano de Saúde Coletivo Empresarial (PME) e Reajustes',
  version: '1.0.0',
  active: true,
  blocks: CONTESTACAO_BLOCKS,
  finalRequests: CONTESTACAO_FINAL_REQUESTS,
};
