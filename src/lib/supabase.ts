import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * ============================================================
 *  CLIENTE DE SUPABASE
 * ============================================================
 *  Supabase guarda el catálogo y valida tu inicio de sesión.
 *  La clave "anon" es pública por diseño: quien puede escribir
 *  lo deciden las políticas RLS del archivo supabase/schema.sql.
 *
 *  Si las variables no están configuradas, la aplicación sigue
 *  funcionando con el catálogo de ejemplo y el panel avisa qué
 *  falta. Nunca se rompe la web pública por esto.
 * ============================================================
 */

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** ¿Están las dos variables de entorno puestas? */
export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // Mantiene la sesión del administrador entre recargas.
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/** Igual que `supabase`, pero lanza un error claro si no está configurado. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado. Copia .env.example a .env y completa ' +
        'VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
    );
  }
  return supabase;
}
