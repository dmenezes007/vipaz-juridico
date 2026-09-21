/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Motor de Regras e Orquestração do Domínio Jurídico
 */

import { LegalFormData, ResolvedDocumentAssembly, ValidationError } from './types';
import { validateLegalForm, validateAssemblyIntegrity } from './validators';
import { resolveLegalArchitecture } from './architectureResolver';
import { getArchitectureForPiece } from './architectureRegistry';
import { CONTESTACAO_PME_ARCHITECTURE } from './data/contestacao/architecture';

export class RuleEngine {
  /**
   * Avalia a montagem preliminar sem travar em validações incompletas (para visualização em tempo real no Mapa da Peça)
   */
  preview(formData: LegalFormData): ResolvedDocumentAssembly {
    const arch = getArchitectureForPiece(formData.document_piece) || CONTESTACAO_PME_ARCHITECTURE;
    return resolveLegalArchitecture(formData, arch);
  }

  /**
   * Executa a avaliação completa com validação estrita de integridade
   */
  evaluate(formData: LegalFormData): {
    isValid: boolean;
    errors: ValidationError[];
    assembly: ResolvedDocumentAssembly;
  } {
    const formErrors = validateLegalForm(formData);
    const arch = getArchitectureForPiece(formData.document_piece) || CONTESTACAO_PME_ARCHITECTURE;
    const assembly = resolveLegalArchitecture(formData, arch);
    const integrityErrors = validateAssemblyIntegrity(assembly);

    const allErrors = [...formErrors, ...integrityErrors];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      assembly,
    };
  }
}

export const ruleEngine = new RuleEngine();
