#!/bin/sh
# ============================================================
#  Escribe la configuración justo antes de arrancar nginx.
#  ------------------------------------------------------------
#  Vite congela las variables al compilar, así que las del
#  servidor no llegarían nunca a la web ya construida. Aquí se
#  vuelcan a /config.js, que el navegador carga antes que la
#  aplicación.
#
#  Consecuencia práctica: para cambiar una clave basta con
#  reiniciar el contenedor. No hace falta reconstruir la imagen.
#
#  Se instala en /docker-entrypoint.d/, la carpeta que la imagen
#  oficial de nginx ejecuta al arrancar antes de levantar el
#  servidor. Por eso el script no arranca nginx: solo prepara.
# ============================================================
set -e

cat > /usr/share/nginx/html/config.js <<CONFIG
window.__ITZABELA_CONFIG__ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL:-}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY:-}",
  VITE_WHATSAPP_NUMBER: "${VITE_WHATSAPP_NUMBER:-}",
  VITE_PHONE_DISPLAY: "${VITE_PHONE_DISPLAY:-}",
  VITE_CONTACT_EMAIL: "${VITE_CONTACT_EMAIL:-}",
  VITE_SITE_URL: "${VITE_SITE_URL:-}"
};
CONFIG

# Aviso en los registros: si falta, el panel dira que falta la base.
if [ -z "${VITE_SUPABASE_URL:-}" ] || [ -z "${VITE_SUPABASE_ANON_KEY:-}" ]; then
  echo "[itzabela] AVISO: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY."
  echo "[itzabela] La tienda funciona, pero /admin pedira conectar la base de datos."
else
  echo "[itzabela] Configuracion cargada para ${VITE_SUPABASE_URL}"
fi
