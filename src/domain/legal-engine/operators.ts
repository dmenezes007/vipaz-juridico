/**
 * VIPAZ Jurídico — Motor Determinístico de Montagem Jurídica
 * Avaliador de Operadores e Condições Lógicas
 */

import { RuleCondition, OperatorType } from './types';

/**
 * Obtém valor aninhado ou simples de um objeto de dados
 */
export function getValueByPath(data: Record<string, unknown>, path: string): unknown {
  if (!path) return undefined;
  if (path in data) return data[path];

  const parts = path.split('.');
  let current: unknown = data;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Avalia uma única condição lógica sobre os dados fornecidos
 */
export function evaluateCondition(
  condition: RuleCondition,
  data: Record<string, unknown>
): boolean {
  const { operator, field, value, conditions } = condition;

  switch (operator) {
    case 'all': {
      if (!conditions || conditions.length === 0) return true;
      return conditions.every((c) => evaluateCondition(c, data));
    }

    case 'any': {
      if (!conditions || conditions.length === 0) return false;
      return conditions.some((c) => evaluateCondition(c, data));
    }

    case 'truthy': {
      if (!field) return false;
      const actual = getValueByPath(data, field);
      return Boolean(actual);
    }

    case 'falsy': {
      if (!field) return false;
      const actual = getValueByPath(data, field);
      return !actual;
    }

    case 'equals': {
      if (!field) return false;
      const actual = getValueByPath(data, field);
      return actual === value;
    }

    case 'not_equals': {
      if (!field) return false;
      const actual = getValueByPath(data, field);
      return actual !== value;
    }

    case 'in': {
      if (!field) return false;
      const actual = getValueByPath(data, field);
      if (Array.isArray(value)) {
        return value.includes(actual);
      }
      if (Array.isArray(actual)) {
        return actual.includes(value);
      }
      return false;
    }

    case 'not_in': {
      if (!field) return false;
      const actual = getValueByPath(data, field);
      if (Array.isArray(value)) {
        return !value.includes(actual);
      }
      if (Array.isArray(actual)) {
        return !actual.includes(value);
      }
      return true;
    }

    default:
      return false;
  }
}

/**
 * Gera uma justificativa textual legível para a avaliação da condição
 */
export function describeConditionReason(
  condition: RuleCondition,
  data: Record<string, unknown>,
  isMet: boolean
): string {
  const { operator, field, value, conditions } = condition;

  if (operator === 'all' && conditions) {
    const reasons = conditions.map((c) => describeConditionReason(c, data, evaluateCondition(c, data)));
    return `Todas as condições requeridas (${reasons.join(' E ')}) -> ${isMet ? 'SATISFEITA' : 'NÃO SATISFEITA'}`;
  }

  if (operator === 'any' && conditions) {
    const reasons = conditions.map((c) => describeConditionReason(c, data, evaluateCondition(c, data)));
    return `Ao menos uma condição requerida (${reasons.join(' OU ')}) -> ${isMet ? 'SATISFEITA' : 'NÃO SATISFEITA'}`;
  }

  if (!field) {
    return isMet ? 'Condição permanente satisfeita' : 'Condição não satisfeita';
  }

  const actual = getValueByPath(data, field);
  const actualStr = JSON.stringify(actual);
  const valStr = JSON.stringify(value);

  switch (operator) {
    case 'equals':
      return `${field} = ${valStr} (atual: ${actualStr})`;
    case 'not_equals':
      return `${field} != ${valStr} (atual: ${actualStr})`;
    case 'in':
      return `${field} está em ${valStr} (atual: ${actualStr})`;
    case 'not_in':
      return `${field} não está em ${valStr} (atual: ${actualStr})`;
    case 'truthy':
      return `${field} ativo/verdadeiro (atual: ${actualStr})`;
    case 'falsy':
      return `${field} inativo/falso (atual: ${actualStr})`;
    default:
      return `${field} ${operator} ${valStr}`;
  }
}
