/**
 * ============================================================
 *  CONFIGURACIÓN DE LA APLICACIÓN
 * ============================================================
 *  Los valores pueden llegar por dos caminos:
 *
 *  1. EN DESARROLLO — del archivo `.env`, incrustados por Vite
 *     al compilar (`import.meta.env`).
 *
 *  2. EN PRODUCCIÓN — de `/config.js`, un archivo que el
 *     contenedor escribe al arrancar con sus variables de
 *     entorno (ver docker/entrypoint.sh).
 *
 *  El segundo camino existe porque Vite congela las variables
 *  al COMPILAR. En un servidor como Dokploy, las variables de
 *  entorno llegan al contenedor DESPUÉS, cuando la web ya está
 *  construida: nunca las vería. Leyéndolas al arrancar, basta
 *  con reiniciar para cambiar una clave, sin reconstruir nada.
 *
 *  Si un valor está en los dos sitios, manda el del servidor.
 * ============================================================
 */

type ConfigKey =
  | 'VITE_SUPABASE_URL'
  | 'VITE_SUPABASE_ANON_KEY'
  | 'VITE_WHATSAPP_NUMBER'
  | 'VITE_PHONE_DISPLAY'
  | 'VITE_CONTACT_EMAIL'
  | 'VITE_SITE_URL';

/** Lo que dejó el contenedor en /config.js, si es que hay algo. */
const runtime: Partial<Record<ConfigKey, string>> =
  typeof window !== 'undefined' ? (window.__ITZABELA_CONFIG__ ?? {}) : {};

/** Lo que incrustó Vite al compilar, desde el archivo .env. */
const buildTime: Partial<Record<ConfigKey, string>> = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER,
  VITE_PHONE_DISPLAY: import.meta.env.VITE_PHONE_DISPLAY,
  VITE_CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
};

/**
 * Devuelve el valor de una variable, o `fallback` si no está.
 * Una cadena vacía o con solo espacios cuenta como "no está".
 */
export function config(key: ConfigKey, fallback = ''): string {
  const value = runtime[key]?.trim() || buildTime[key]?.trim() || '';
  return value === '' ? fallback : value;
}
