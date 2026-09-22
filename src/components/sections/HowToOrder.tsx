import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { ORDER_STEPS } from '@/constants/content';

/** Cómo pedir: cuatro pasos para que nadie dude antes de escribir. */
export function HowToOrder(): JSX.Element {
  return (
    <section id="como-pedir" className="py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pedir es facilísimo"
          title="Cuatro pasos y listo"
          description="Sin crear cuenta, sin contraseñas y sin llenar formularios. Todo se coordina por WhatsApp."
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ORDER_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="reveal relative rounded-3xl border border-rose-200 bg-blush-100 p-7 shadow-card"
            >
              {/* Número grande de fondo: guía la lectura sin estorbar */}
              <span
                className="absolute top-4 right-6 font-display text-6xl font-semibold text-rose-100 select-none"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-700 text-white">
                <Icon name={step.icon} size={24} />
              </span>
              <h3 className="relative mt-5 font-display text-xl font-semibold text-stone-900">
                {step.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-stone-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
