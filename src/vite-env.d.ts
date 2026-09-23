/// <reference types="vite/client" />

/** Variables de entorno disponibles en el navegador (ver .env.example). */
interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_PHONE_DISPLAY?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Configuracion inyectada por el contenedor en /config.js.
 * Ver src/lib/config.ts y docker/entrypoint.sh.
 */
interface Window {
  __ITZABELA_CONFIG__?: Record<string, string>;
}
