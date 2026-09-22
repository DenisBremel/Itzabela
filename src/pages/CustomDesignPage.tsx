import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SHOP, WHATSAPP_CUSTOM_MESSAGE } from '@/constants/shop';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

/** Lo que conviene contarnos para que la propuesta salga a la primera. */
const CHECKLIST = [
  {
    icon: 'heart' as const,
    title: 'La ocasión',
    description: 'Cumpleaños, aniversario, pedida, disculpa, agradecimiento…',
  },
  {
    icon: 'flower' as const,
    title: 'Flores y colores',
    description: 'Si tienes flores favoritas o un color en mente, dínoslo. Si no, proponemos.',
  },
  {
    icon: 'box' as const,
    title: 'Presupuesto',
    description: 'Trabajamos con el monto que nos digas y te mostramos qué entra.',
  },
  {
    icon: 'calendar' as const,
    title: 'Fecha y hora',
    description: 'Cuándo debe llegar y a qué dirección. También hacemos entregas sorpresa.',
  },
] as const;

/** Galería de referencia: solo inspiración, nada que comprar aquí. */
const INSPIRATION = [
  'photo-1494972308805-463bc619d34e',
  'photo-1591886960571-74d43a9d4166',
  'photo-1464982326199-86f32f81b211',
  'photo-1470509037663-253afd7f0f51',
] as const;

/**
 * Página del diseño personalizado.
 * Todo desemboca en el mismo sitio: un WhatsApp con el mensaje ya
 * preparado, porque la conversación real la tienes tú con el cliente.
 */
export function CustomDesignPage(): JSX.Element {
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_CUSTOM_MESSAGE);

  return (
    <>
      <section className="relative overflow-hidden bg-blush-100">
        <div className="petal-pattern-soft absolute inset-0" aria-hidden="true" />
        <Container className="relative py-20 lg:py-24">
          <SectionHeading
            as="h1"
            eyebrow="Diseño personalizado"
            title="Lo imaginas tú, lo armamos nosotros"
            description="Cuéntanos tu idea o envíanos una foto o video de referencia, sin compromiso."
          />
          <div className="mt-10 flex justify-center">
            <Button href={whatsappUrl} variant="whatsapp" size="lg">
              <Icon name="whatsapp" size={20} />
              Hablar con {SHOP.name}
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Para empezar"
            title="Cuéntanos estas cuatro cosas"
            description="Con esto basta para preparar tu propuesta. El mensaje de WhatsApp ya lleva las preguntas escritas."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <article
                key={item.title}
                className="reveal flex gap-5 rounded-3xl border border-rose-200 bg-blush-100 p-7 shadow-card"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                  <Icon name={item.icon} size={24} />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Inspiración"
            title="Algunos trabajos a medida"
            description="Cada uno nació de una conversación por WhatsApp, igual que el tuyo."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INSPIRATION.map((photo) => (
              <img
                key={photo}
                src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=80`}
                alt="Arreglo floral personalizado"
                loading="lazy"
                decoding="async"
                className="reveal aspect-4/5 w-full rounded-3xl object-cover shadow-card"
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button href={whatsappUrl} variant="whatsapp" size="lg">
              <Icon name="whatsapp" size={20} />
              Pedir mi diseño personalizado
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
