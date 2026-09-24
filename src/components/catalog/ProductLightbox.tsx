import { useEffect, type JSX } from 'react';
import { Icon } from '@/components/ui/Icon';
import { isAvailable, type Product } from '@/types/product';

interface ProductLightboxProps {
  product: Product;
  onClose: () => void;
}

/**
 * La foto de un arreglo, en grande y sola.
 *
 * Sin precio, sin descripción y sin botones: el cliente ya los tiene en
 * la tarjeta, y aquí viene solo a mirar el detalle de las flores.
 *
 * La ventana se adapta a la foto, no al revés. Si se fijara un ancho y
 * la foto se encajara dentro, cada imagen con proporción distinta
 * dejaría franjas blancas a los lados.
 */
export function ProductLightbox({ product, onClose }: ProductLightboxProps): JSX.Element {
  const available = isAvailable(product);

  // Cerrar con Escape y bloquear el scroll del fondo.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/80 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-lg transition-colors hover:bg-white sm:top-6 sm:right-6"
      >
        <Icon name="close" size={22} />
      </button>

      {/* `w-auto h-auto` deja que la foto conserve su proporción real:
          la caja mide exactamente lo que mide la imagen. */}
      <div className="relative" onClick={(event) => event.stopPropagation()}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="block h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-2xl"
        />

        {!available && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-stone-900/45">
            <span className="rotate-[-6deg] rounded-xl border-2 border-white/90 bg-stone-900/70 px-6 py-2.5 text-lg font-bold tracking-[0.22em] text-white uppercase shadow-lg">
              Agotado
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
