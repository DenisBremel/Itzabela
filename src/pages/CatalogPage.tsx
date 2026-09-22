import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CustomDesignCta } from '@/components/sections/CustomDesignCta';
import { useProducts } from '@/hooks/useProducts';

/**
 * Catálogo completo.
 * Se muestran todos los diseños seguidos, sin clasificar: el orden lo
 * decides tú desde el panel con el campo "Orden" de cada producto.
 */
export function CatalogPage(): JSX.Element {
  const { products, isLoading, error } = useProducts('public');

  return (
    <>
      <section className="pt-16 pb-10 lg:pt-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Catálogo" title="Todos nuestros diseños" />
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            emptyMessage="Todavía no hay diseños publicados. Escríbenos y te preparamos uno a medida."
          />
        </Container>
      </section>

      <CustomDesignCta />
    </>
  );
}
