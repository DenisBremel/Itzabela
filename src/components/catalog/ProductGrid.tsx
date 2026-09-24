import { useState, type JSX } from 'react';
import { ProductCard } from './ProductCard';
import { ProductLightbox } from './ProductLightbox';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { buildWhatsAppUrl } from '@/utils/whatsapp';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  /** Texto cuando no hay resultados (por ejemplo, tras filtrar). */
  emptyMessage?: string;
}

/** Rectángulos grises mientras llegan los datos: evita el salto de diseño. */
function Skeleton(): JSX.Element {
  return (
    <div className="overflow-hidden rounded-3xl border border-rose-200 bg-blush-100">
      <div className="aspect-4/5 animate-pulse bg-rose-100/70" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-rose-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-rose-50" />
        <div className="h-10 w-full animate-pulse rounded-full bg-rose-50" />
      </div>
    </div>
  );
}

/** Rejilla de productos, con sus estados de carga, error y vacío. */
export function ProductGrid({
  products,
  isLoading = false,
  error = null,
  emptyMessage = 'No hay productos en esta categoría por ahora.',
}: ProductGridProps): JSX.Element {
  const [zoomed, setZoomed] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    // Si la base de datos no responde no inventamos productos: sería
    // vender algo que quizá no hay. Dejamos abierta la vía de siempre.
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center">
        <Icon name="alert" size={32} className="text-rose-600" />
        <p className="font-medium text-stone-800">No pudimos cargar el catálogo.</p>
        <p className="max-w-md text-sm text-stone-600">
          Puede ser un problema de conexión. Vuelve a intentarlo en un momento o escríbenos y te
          mostramos lo que tenemos hoy.
        </p>
        <Button href={buildWhatsAppUrl()} variant="whatsapp" className="mt-2">
          <Icon name="whatsapp" size={18} />
          Escribirnos por WhatsApp
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-rose-200 bg-blush-100 p-10 text-center">
        <Icon name="flower" size={32} className="text-rose-400" />
        <p className="text-stone-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            eager={index < 4}
            onZoom={setZoomed}
          />
        ))}
      </div>

      {zoomed && <ProductLightbox product={zoomed} onClose={() => setZoomed(null)} />}
    </>
  );
}
