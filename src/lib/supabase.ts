import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '') ||
  (typeof process !== 'undefined' && process.env ? process.env.VITE_SUPABASE_URL : '') ||
  '';
const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '') ||
  (typeof process !== 'undefined' && process.env ? process.env.VITE_SUPABASE_ANON_KEY : '') ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[VIPAZ Jurídico] Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não estão definidas. A autenticação Supabase requer estas configurações.'
  );
}

/**
 * Cliente Supabase tipado e seguro para uso no frontend.
 * Utiliza exclusivamente a Anon Key pública, respeitando as políticas de RLS.
 * Nunca utiliza ou expõe service_role ou credenciais privilegiadas.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
