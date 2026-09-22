import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { FAQ } from '@/constants/content';

/**
 * Preguntas frecuentes con <details>: se abren y cierran sin JavaScript,
 * y Google puede leer las respuestas aunque no ejecute scripts.
 */
export function Faq(): JSX.Element {
  return (
    <section id="preguntas-frecuentes" className="py-20 lg:py-24">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Antes de escribirnos"
          title="Preguntas frecuentes"
          description="Lo que más nos consultan por WhatsApp, respondido de una vez."
        />

        <div className="mt-12 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="reveal group rounded-2xl border border-rose-200 bg-blush-100 px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-stone-900">
                {item.question}
                <Icon
                  name="chevron-down"
                  size={20}
                  className="shrink-0 text-rose-600 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
