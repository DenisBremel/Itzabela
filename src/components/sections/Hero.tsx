import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SHOP } from '@/constants/shop';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

const HIGHLIGHTS = [
  'Entrega el mismo día',
  'Tarjeta dedicada sin costo',
] as const;

/** Portada: promesa clara, foto que enamora y dos caminos de compra. */
export function Hero(): JSX.Element {
  return (
    <section id="inicio" className="relative overflow-hidden bg-blush-100">
      <div className="petal-pattern-soft absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-rose-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-sage-200/40 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Texto */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-rose-800 ring-1 ring-rose-200">
              <Icon name="truck" size={16} />
              {SHOP.deliveryArea}
            </p>

            <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
              {SHOP.tagline}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              Ramos hechos a mano con flores eternas. Elige el tuyo y lo coordinamos por WhatsApp
              en un minuto.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/catalogo" size="lg">
                Ver catálogo
              </Button>
              <Button href={buildWhatsAppUrl()} variant="whatsapp" size="lg">
                <Icon name="whatsapp" size={20} />
                Pedir por WhatsApp
              </Button>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                  <Icon name="check" size={16} className="text-rose-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Composición visual */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80"
                alt=""
                className="mt-10 h-72 w-full rounded-3xl object-cover shadow-2xl"
                loading="eager"
                decoding="async"
              />
              <img
                src="https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&w=700&q=80"
                alt=""
                className="h-72 w-full rounded-3xl object-cover shadow-2xl"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
