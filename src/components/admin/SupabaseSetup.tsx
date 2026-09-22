import type { JSX } from 'react';
import { Icon } from '@/components/ui/Icon';

const STEPS = [
  {
    title: 'Crea el proyecto en Supabase',
    detail:
      'Entra a supabase.com, regístrate gratis y crea un proyecto nuevo. Anota la contraseña de la base de datos que te pida.',
  },
  {
    title: 'Crea la tabla del catálogo',
    detail:
      'En el menú lateral abre "SQL Editor", pega todo el contenido del archivo supabase/schema.sql del proyecto y pulsa Run.',
  },
  {
    title: 'Crea tu usuario de administradora',
    detail:
      'Ve a Authentication → Users → Add user. Pon tu correo y una contraseña, y marca "Auto Confirm User". Ese será tu acceso a este panel.',
  },
  {
    title: 'Copia las dos claves al archivo .env',
    detail:
      'En Project Settings → API copia "Project URL" y la clave "anon public". Pégalas en VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY del archivo .env, y reinicia bun dev.',
  },
] as const;

/**
 * Pantalla que aparece en /admin cuando todavía no hay Supabase.
 * Mientras tanto la web pública funciona con el catálogo de ejemplo,
 * así que nada se rompe: solo el panel queda en espera.
 */
export function SupabaseSetup(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-rose-200 bg-blush-100 p-8 shadow-card">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
        <Icon name="box" size={24} />
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        Falta conectar la base de datos
      </h1>
      <p className="mt-2 text-stone-600">
        El panel de stock necesita Supabase (es gratis) para guardar los productos y validar tu
        contraseña. Son cuatro pasos, una sola vez.
      </p>

      <ol className="mt-8 space-y-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-700 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-stone-900">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 flex items-start gap-2 rounded-2xl border border-rose-200 bg-blush-200/70 px-5 py-4 text-sm text-stone-700">
        <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-rose-600" />
        <span>
          Mientras tanto la tienda funciona con el catálogo de ejemplo de{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">src/data/products.ts</code> y los
          clientes pueden comprar por WhatsApp con normalidad.
        </span>
      </p>
    </div>
  );
}
