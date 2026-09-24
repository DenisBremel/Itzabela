# Itzabela — catálogo y venta por WhatsApp

Tienda de flores sin carrito ni registro: el cliente ve el catálogo, toca **Comprar** y
la conversación sigue por WhatsApp. El stock lo controlas tú desde un panel privado.

- **Público:** portada, catálogo con filtros, página de diseño personalizado. Sin login.
- **Privado:** `/admin`, con correo y contraseña, para cambiar stock, precios y fotos.
  La sesión se cierra sola tras 15 minutos sin actividad.
- **Agotado:** cuando el stock llega a 0, la foto se atenúa y aparece **AGOTADO** en el
  centro; el botón cambia a "Quiero este modelo" (también por WhatsApp).
- **Catálogo en PDF:** desde el panel, con las fotos incrustadas para poder verlo sin
  internet. Solo entran los productos visibles y con stock.

## Tecnologías

Las mismas del proyecto Labsicodex, más Supabase para la base de datos:

| Qué                | Con qué                                 |
| ------------------ | --------------------------------------- |
| Interfaz           | React 19 + TypeScript                   |
| Compilador         | Vite 7                                  |
| Estilos            | Tailwind CSS 4 (sin archivo de config)  |
| Rutas              | React Router 6                          |
| Datos y acceso     | Supabase (Postgres + Auth)              |
| Tipografías        | Inter y Cormorant Garamond, autoalojadas |

## Empezar

```bash
bun install
bun dev
```

Se abre en <http://localhost:5174>. Funciona desde el primer arranque con el catálogo de
ejemplo de `src/data/products.ts`, aunque todavía no hayas configurado Supabase.

Otros comandos:

```bash
bun run lint     # revisa los tipos
bun run build    # genera /dist para publicar
bun run preview  # sirve /dist para probarlo
```

## Configurar el panel de stock (Supabase)

Una sola vez, y es gratis:

1. Crea una cuenta en <https://supabase.com> y un proyecto nuevo.
2. En **SQL Editor**, pega todo `supabase/schema.sql` y pulsa **Run**. Eso crea la tabla
   `products` y las reglas de seguridad.
3. En **Authentication → Users → Add user**, crea tu usuario con correo y contraseña y
   marca *Auto Confirm User*. Ese será tu acceso al panel.
4. En **Project Settings → API**, copia *Project URL* y la clave *anon public* y pégalas
   en `.env`:

   ```ini
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

5. Reinicia `bun dev`, entra a `/admin` y crea tus productos.

> La clave *anon* es pública a propósito: viaja al navegador de cualquier visitante. Lo
> que protege el catálogo son las políticas RLS de `supabase/schema.sql`: sin sesión
> iniciada solo se pueden **leer** los productos activos. Nunca pongas en `.env` la clave
> `service_role`.

## Qué edito para cambiar cosas

| Quiero cambiar…                       | Archivo                        |
| ------------------------------------- | ------------------------------ |
| Nombre, WhatsApp, horarios, redes     | `src/constants/shop.ts`        |
| Menú y enlaces del pie                | `src/constants/navigation.ts`  |
| Ocasiones, pasos y preguntas          | `src/constants/content.ts`     |
| Colores y tipografías                 | `src/index.css`                |
| Catálogo de ejemplo                   | `src/data/products.ts`         |
| Productos de verdad                   | el panel `/admin`              |

El número de WhatsApp también se puede cambiar sin tocar código, desde `.env`
(`VITE_WHATSAPP_NUMBER`), que es lo cómodo al desplegar.

## Fotos de los productos

En el panel, cada producto tiene un botón **Subir foto**: eliges el archivo y se guarda
en Supabase Storage (depósito `productos`, creado por `supabase/schema.sql`). La
dirección se rellena sola.

Medida recomendada: **vertical 4:5, 1080 × 1350 px**, JPG y menos de 5 MB. La tarjeta
recorta para llenar el recuadro, así que deja aire alrededor del arreglo.

También se puede pegar una dirección a mano, o servir la foto desde
`public/images/productos/` escribiendo `/images/productos/mi-foto.jpg`.

## Estructura

```text
src/
├─ components/
│  ├─ admin/     Panel privado: login, tabla de stock, formulario
│  ├─ catalog/   Tarjeta, rejilla y filtros de productos
│  ├─ layout/    Header, footer, logo, botón flotante
│  ├─ sections/  Bloques de la portada
│  └─ ui/        Botón, contenedor, encabezado, iconos
├─ constants/    Datos del negocio y textos
├─ data/         Catálogo de ejemplo
├─ hooks/        Sesión, productos, animaciones
├─ lib/          Cliente de Supabase
├─ pages/        Una por ruta
├─ services/     Lectura y escritura del catálogo
├─ types/        Modelo de producto y categorías
└─ utils/        WhatsApp, formato de precios, clases CSS
```

## Publicar con Dokploy

El proyecto trae `Dockerfile` listo. La imagen compila con bun y sirve el resultado con
nginx; pesa unos 50 MB y no lleva código fuente.

1. En Dokploy: **Create Application** → tipo **Dockerfile** → apunta al repositorio.
2. En la pestaña **Environment**, añade estas variables:

   ```ini
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_...
   VITE_WHATSAPP_NUMBER=51935826674
   VITE_SITE_URL=https://itzabela.com
   ```

3. **Port**: `80`.
4. En **Domains**, añade `itzabela.com` y activa el certificado (Let's Encrypt).
5. Deploy.

El contenedor responde en `/healthz` con `ok`, que es lo que usan el `HEALTHCHECK` de
Docker y el monitor de Dokploy.

> Las variables se leen **al arrancar el contenedor**, no al compilar: el contenedor
> escribe `/config.js` con ellas y el navegador lo carga antes que la aplicación (ver
> `docker/entrypoint.sh` y `src/lib/config.ts`). Por eso, para cambiar una clave basta
> con guardar y **reiniciar**, sin reconstruir la imagen.
>
> Se hizo así porque Vite congela las variables al compilar, y los paneles de despliegue
> suelen entregarlas al contenedor *después* de construir la web: nunca las vería.

Para probar la imagen en tu máquina antes de subirla:

```bash
docker compose up --build
```

Queda en <http://localhost:8080>.

### Otros hostings

`bun run build` deja todo en `dist/`, que es una web estática y sirve igual en Vercel,
Netlify o Cloudflare Pages: el repositorio incluye `vercel.json` y `netlify.toml` con la
redirección a `index.html` que necesitan `/catalogo` y `/admin`.
