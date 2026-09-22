import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { OCCASIONS } from '@/constants/content';

/** Ocasiones: ayuda a decidir a quien entra sin saber qué quiere. */
export function Occasions(): JSX.Element {
  return (
    <section id="ocasiones" className="py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Para cada momento"
          title="¿Para qué ocasión son las flores?"
          description="Cuéntanos el motivo y te recomendamos el arreglo que mejor encaja."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((occasion) => (
            <article
              key={occasion.title}
              className="reveal rounded-3xl border border-rose-200 bg-blush-100 p-7 transition-shadow duration-300 hover:shadow-card"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <Icon name={occasion.icon} size={24} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-stone-900">
                {occasion.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{occasion.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
