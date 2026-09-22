import type { JSX } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatPrice } from '@/utils/format';
import { buildProductWhatsAppUrl, buildSoldOutWhatsAppUrl } from '@/utils/whatsapp';
import { isAvailable, type Product } from '@/types/product';
import { cn } from '@/utils/cn';

/** A partir de cuántas unidades dejamos de avisar "quedan pocas". */
const LOW_STOCK_THRESHOLD = 3;

interface ProductCardProps {
  product: Product;
  /** Carga la imagen con prioridad (solo para las primeras de la portada). */
  eager?: boolean;
}

/**
 * Tarjeta de producto del catálogo.
 *
 * Reglas de negocio que se ven aquí:
 *  - Si hay stock, el botón "Comprar" abre WhatsApp con el pedido escrito.
 *  - Si no hay stock, la foto se atenúa, aparece AGOTADO en el centro y
 *    el botón cambia a "Avísame cuando llegue" (también por WhatsApp).
 */
export function ProductCard({ product, eager = false }: ProductCardProps): JSX.Element {
  const available = isAvailable(product);
  const isLowStock = available && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <article className="reveal group flex flex-col overflow-hidden rounded-3xl border border-rose-200 bg-blush-100 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      {/* Imagen + estado */}
      <div className="relative aspect-4/5 overflow-hidden bg-rose-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'h-full w-full object-cover transition-transform duration-500',
            available ? 'group-hover:scale-105' : 'scale-100 grayscale-[55%] brightness-90',
          )}
        />

        {/* Cartel AGOTADO: centrado sobre la foto, imposible de pasar por alto */}
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/45">
            <span className="rotate-[-6deg] rounded-xl border-2 border-white/90 bg-stone-900/70 px-6 py-2.5 text-lg font-bold tracking-[0.22em] text-white uppercase shadow-lg backdrop-blur-[2px]">
              Agotado
            </span>
          </div>
        )}

        {/* Aviso de últimas unidades: empuja a decidir sin mentir */}
        {isLowStock && (
          <span className="absolute top-3 right-3 rounded-full bg-rose-700 px-3 py-1 text-xs font-semibold text-white">
            {product.stock === 1 ? 'Última unidad' : `Quedan ${product.stock}`}
          </span>
        )}
      </div>

      {/* Datos y acción */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-snug font-semibold text-stone-900">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{product.description}</p>

        <p className="mt-4 text-2xl font-semibold text-rose-700">{formatPrice(product.price)}</p>

        {available ? (
          <Button
            href={buildProductWhatsAppUrl(product)}
            variant="whatsapp"
            fullWidth
            className="mt-4"
          >
            <Icon name="whatsapp" size={20} />
            Comprar
          </Button>
        ) : (
          <Button href={buildSoldOutWhatsAppUrl(product)} variant="secondary" fullWidth className="mt-4">
            <Icon name="heart" size={18} />
            Quiero este modelo
          </Button>
        )}
      </div>
    </article>
  );
}
