import type { JSX } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { MAX_FEATURED } from '@/types/product';

/** Los más pedidos: ocho productos destacados en la portada. */
export function FeaturedProducts(): JSX.Element {
  const { products, isLoading, error } = useProducts('public');

  // Si nadie ha marcado destacados todavía, mostramos los primeros.
  const featured = products.filter((product) => product.featured);
  const visible = (featured.length > 0 ? featured : products).slice(0, MAX_FEATURED);

  return (
    <section id="destacados" className="py-20 lg:py-24">
      <Container>
        <SectionHeading eyebrow="Los más pedidos" title="Nuestros favoritos de esta semana" />

        <div className="mt-12">
          <ProductGrid products={visible} isLoading={isLoading} error={error} />
        </div>

        <div className="mt-10 flex justify-center">
          <Button to="/catalogo" variant="secondary" size="lg">
            Ver todo el catálogo
          </Button>
        </div>
      </Container>
    </section>
  );
}
