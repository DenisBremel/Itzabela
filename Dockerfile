# ============================================================
#  ITZABELA — IMAGEN DE PRODUCCIÓN
#  ------------------------------------------------------------
#  Dos etapas:
#    1. bun compila la web a archivos estáticos.
#    2. nginx los sirve. La imagen final no lleva Node, ni bun,
#       ni el código fuente: solo el resultado (unos 50 MB).
#
#  IMPORTANTE: Vite incrusta las variables VITE_* EN EL MOMENTO
#  DE COMPILAR, no al arrancar. Por eso llegan como build args
#  y hay que declararlas en Dokploy → Build Arguments, no como
#  variables de entorno del contenedor.
# ============================================================

# ---------- Etapa 1: compilar ----------
FROM oven/bun:1.3-alpine AS build

WORKDIR /app

# Primero las dependencias: si no cambian, Docker reutiliza esta
# capa y el despliegue tarda segundos en vez de minutos.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# --- Datos del negocio --------------------------------------
ARG VITE_WHATSAPP_NUMBER=51935826674
ARG VITE_PHONE_DISPLAY="+51 935 826 674"
ARG VITE_CONTACT_EMAIL=""
ARG VITE_SITE_URL=https://itzabela.com

# --- Supabase (panel de stock) ------------------------------
# La clave anon es pública por diseño: viaja al navegador de
# cada visitante. NUNCA pases aquí la clave service_role.
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""

ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER \
    VITE_PHONE_DISPLAY=$VITE_PHONE_DISPLAY \
    VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL \
    VITE_SITE_URL=$VITE_SITE_URL \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN bun run build

# ---------- Etapa 2: servir ----------
FROM nginx:1.27-alpine AS runtime

# Quitamos la configuración de ejemplo que trae la imagen.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
