import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

export function NotFoundPage(): JSX.Element {
  return (
    <section className="py-24 lg:py-32">
      <Container width="narrow" className="text-center">
        <Icon name="flower" size={56} className="mx-auto text-rose-300" />
        <h1 className="mt-6 font-display text-5xl font-semibold text-stone-900">
          Esta página se marchitó
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          No encontramos lo que buscabas, pero el catálogo está fresco y esperándote.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/catalogo" size="lg">
            Ver catálogo
          </Button>
          <Button href={buildWhatsAppUrl()} variant="whatsapp" size="lg">
            <Icon name="whatsapp" size={20} />
            Escribirnos
          </Button>
        </div>
      </Container>
    </section>
  );
}
