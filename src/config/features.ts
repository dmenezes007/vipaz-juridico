// Feature flags for VIPAZ Jurídico
export const FEATURE_FLAGS = {
  DETERMINISTIC_ENGINE_ENABLED:
    import.meta.env.VITE_DETERMINISTIC_ENGINE_ENABLED !== 'false', // Default true
  AI_PREFILL_ENABLED: import.meta.env.VITE_AI_PREFILL_ENABLED === 'true', // Default false
  AI_REVIEW_ENABLED: import.meta.env.VITE_AI_REVIEW_ENABLED === 'true', // Default false
};
