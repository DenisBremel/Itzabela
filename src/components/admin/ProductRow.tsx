import { useEffect, useState, type JSX } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/utils/format';
import { deleteProduct, updateProduct } from '@/services/productService';
import { isAvailable, MAX_FEATURED, type Product } from '@/types/product';
import { cn } from '@/utils/cn';

interface ProductRowProps {
  product: Product;
  /** false cuando la portada ya está llena y este producto no está en ella. */
  canFeature: boolean;
  onSaved: (product: Product) => void;
  onDeleted: (id: string) => void;
  onEdit: (product: Product) => void;
}

/** Pausa antes de guardar el stock, para no mandar una petición por clic. */
const SAVE_DELAY_MS = 700;

type SaveStatus = 'idle' | 'saving' | 'saved';

const ACTION_BUTTON =
  'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors';

/**
 * Una fila de la tabla del panel.
 *
 * El stock **se guarda solo**: cambias el número con − y + y, tras una
 * pausa corta, se manda a la base de datos. No hay botón de guardar
 * porque en el trabajo diario sobraba un clic en cada movimiento.
 */
export function ProductRow({
  product,
  canFeature,
  onSaved,
  onDeleted,
  onEdit,
}: ProductRowProps): JSX.Element {
  const toast = useToast();
  const [stock, setStock] = useState(product.stock);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = isAvailable(product);

  // Si el producto cambia desde fuera (recarga, edición completa),
  // el número de la fila se pone al día.
  useEffect(() => {
    setStock(product.stock);
  }, [product.stock]);

  /** Guarda solo los campos indicados y refresca la fila. */
  async function save(changes: Partial<Product>): Promise<void> {
    setStatus('saving');
    setError(null);
    try {
      onSaved(await updateProduct(product.id, changes));
      setStatus('saved');
      window.setTimeout(() => setStatus('idle'), 2000);
    } catch (cause: unknown) {
      const message = cause instanceof Error ? cause.message : 'No se pudo guardar.';
      setError(message);
      toast.error(message);
      setStatus('idle');
      // Deshacemos el cambio: nunca debe quedar en pantalla un número
      // distinto al que hay guardado de verdad.
      setStock(product.stock);
    }
  }

  // Guardado automático del stock tras la pausa. Si sigues pulsando,
  // el temporizador se reinicia y solo se manda una petición al final.
  useEffect(() => {
    if (stock === product.stock) return;

    const timer = window.setTimeout(() => {
      void save({ stock });
    }, SAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [stock, product.stock]);

  async function toggle(changes: Partial<Product>): Promise<void> {
    setIsBusy(true);
    await save(changes);
    setIsBusy(false);
  }

  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm(
      `¿Eliminar "${product.name}" del catálogo? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setIsBusy(true);
    try {
      await deleteProduct(product.id);
      onDeleted(product.id);
    } catch (cause: unknown) {
      const message = cause instanceof Error ? cause.message : 'No se pudo eliminar.';
      setError(message);
      toast.error(message);
      setIsBusy(false);
    }
  }

  return (
    <tr
      className={cn(
        'block rounded-2xl border border-rose-200 bg-blush-100 p-3',
        'lg:table-row lg:rounded-none lg:border-0 lg:border-b lg:border-rose-200/70 lg:p-0 lg:last:border-b-0',
        !product.active && 'opacity-70',
      )}
    >
      {/* Producto: foto, nombre y precio */}
      <td className="block lg:table-cell lg:px-4 lg:py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-rose-50 lg:h-14 lg:w-14">
            <img
              src={product.imageUrl}
              alt=""
              className={cn('h-full w-full object-cover', !available && 'grayscale')}
              loading="lazy"
            />
            {!available && (
              <span className="absolute inset-0 flex items-center justify-center bg-stone-900/50 text-[0.5rem] font-bold tracking-wider text-white uppercase">
                Agotado
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-medium text-stone-900">{product.name}</p>
            <p className="mt-0.5 text-sm text-stone-500">{formatPrice(product.price)}</p>
            {!product.active && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-stone-500">
                <Icon name="eye-off" size={13} />
                Oculto en la web
              </p>
            )}
            {error && (
              <p role="alert" className="mt-1 text-xs text-rose-700">
                {error}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Descripción, recortada a dos líneas */}
      <td className="hidden lg:table-cell lg:max-w-md lg:px-4 lg:py-3 lg:align-middle">
        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
          {product.description || <span className="text-stone-400">Sin descripción</span>}
        </p>
      </td>

      {/* Stock: se guarda solo */}
      <td className="mt-3 block lg:mt-0 lg:table-cell lg:px-4 lg:py-3 lg:align-middle">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-stone-500 uppercase lg:hidden">
            Stock
          </span>
          <div className="flex items-center rounded-full border border-rose-200 bg-white/70">
            <button
              type="button"
              onClick={() => setStock((value) => Math.max(0, value - 1))}
              disabled={isBusy || stock === 0}
              aria-label="Quitar una unidad"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-rose-100 disabled:opacity-40"
            >
              <Icon name="minus" size={16} />
            </button>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(event) => setStock(Math.max(0, Number(event.target.value) || 0))}
              aria-label={`Stock de ${product.name}`}
              className="w-12 bg-transparent text-center font-semibold text-stone-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setStock((value) => value + 1)}
              disabled={isBusy}
              aria-label="Añadir una unidad"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-rose-100 disabled:opacity-40"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>

          {/* Aviso de guardado: ancho fijo para que la tabla no salte */}
          <span
            aria-live="polite"
            className={cn(
              'inline-flex w-24 items-center gap-1 text-xs font-medium',
              status === 'saved' ? 'text-sage-600' : 'text-stone-400',
            )}
          >
            {status === 'saving' && 'Guardando…'}
            {status === 'saved' && (
              <>
                <Icon name="check" size={14} />
                Guardado
              </>
            )}
          </span>
        </div>
      </td>

      {/* Acciones */}
      <td className="mt-2 block border-t border-rose-200/70 pt-2 lg:mt-0 lg:table-cell lg:border-0 lg:px-4 lg:py-3 lg:pt-3 lg:align-middle">
        <div className="flex items-center justify-between gap-1 lg:justify-end">
          <button
            type="button"
            onClick={() => void toggle({ featured: !product.featured })}
            disabled={isBusy || !canFeature}
            aria-pressed={product.featured}
            title={
              product.featured
                ? 'Quitar de destacados'
                : canFeature
                  ? 'Marcar como destacado'
                  : `La portada ya tiene ${MAX_FEATURED} destacados. Quita uno para poner este.`
            }
            className={cn(
              ACTION_BUTTON,
              product.featured
                ? 'bg-rose-100 text-rose-700'
                : canFeature
                  ? 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                  : 'cursor-not-allowed text-stone-300',
            )}
          >
            <Icon name="star" size={18} />
          </button>

          <button
            type="button"
            onClick={() => void toggle({ active: !product.active })}
            disabled={isBusy}
            aria-pressed={product.active}
            title={product.active ? 'Ocultar de la web' : 'Mostrar en la web'}
            className={cn(ACTION_BUTTON, 'text-stone-400 hover:bg-stone-100 hover:text-stone-600')}
          >
            <Icon name={product.active ? 'eye' : 'eye-off'} size={18} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(product)}
            disabled={isBusy}
            title="Editar producto"
            className={cn(ACTION_BUTTON, 'text-stone-400 hover:bg-stone-100 hover:text-stone-600')}
          >
            <Icon name="edit" size={18} />
          </button>

          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isBusy}
            title="Eliminar producto"
            className={cn(ACTION_BUTTON, 'text-stone-400 hover:bg-rose-50 hover:text-rose-700')}
          >
            <Icon name="trash" size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
