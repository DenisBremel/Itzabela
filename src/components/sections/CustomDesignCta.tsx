import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { WHATSAPP_CUSTOM_MESSAGE } from '@/constants/shop';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

const PERKS = [
  'Tú eliges flores, colores y presupuesto',
  'Te enviamos una propuesta con foto de referencia',
  'Confirmas y lo preparamos para la fecha que necesites',
] as const;

/**
 * Banner de diseño personalizado.
 * Es la segunda vía de venta: lleva a WhatsApp con un mensaje que ya
 * pregunta ocasión, flores, presupuesto y fecha, para que la
 * conversación empiece con la mitad del trabajo hecho.
 */
export function CustomDesignCta(): JSX.Element {
  return (
    <section id="diseno-personalizado" className="py-20 lg:py-24">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[2rem] border border-rose-200 bg-blush-100 px-8 py-14 shadow-card sm:px-14">
          <div className="petal-pattern-soft absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-rose-800 ring-1 ring-rose-200">
                <Icon name="sparkles" size={16} />
                Hecho a tu medida
              </p>

              <h2 className="mt-5 font-display text-4xl leading-tight font-semibold text-stone-900 sm:text-5xl">
                ¿Quieres un diseño personalizado?
              </h2>

              <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
                Si ninguno del catálogo es exactamente lo que imaginas, lo creamos juntos.
                Escríbenos y lo armamos contigo.
              </p>

              <ul className="mt-7 space-y-3">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-stone-700">
                    <Icon name="check" size={18} className="mt-0.5 text-rose-600" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-rose-200 bg-blush-200/60 p-7">
              <p className="font-display text-2xl font-semibold text-stone-900">
                Cuéntanos tu idea por WhatsApp
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Te responde una persona, no un robot. Normalmente en menos de 10 minutos dentro
                del horario de atención.
              </p>
              <Button
                href={buildWhatsAppUrl(WHATSAPP_CUSTOM_MESSAGE)}
                variant="whatsapp"
                size="lg"
                fullWidth
                className="mt-6"
              >
                <Icon name="whatsapp" size={20} />
                Diseño personalizado
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
