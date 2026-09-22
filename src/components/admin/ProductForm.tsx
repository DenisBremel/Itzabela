import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { createProduct, updateProduct } from '@/services/productService';
import { deleteProductImage, uploadProductImage } from '@/services/storageService';
import { MAX_FEATURED, type Product, type ProductInput } from '@/types/product';
import { cn } from '@/utils/cn';

interface ProductFormProps {
  /** null = crear uno nuevo; un producto = editarlo. */
  product: Product | null;
  /** Todo el catálogo: hace falta para comprobar que el orden no se repita. */
  products: Product[];
  onClose: () => void;
  onSaved: (product: Product, isNew: boolean) => void;
}

/**
 * Los números viven como texto mientras se escribe.
 * Así un campo vacío se queda vacío en vez de mostrar un 0 que hay que
 * borrar, y podemos distinguir "no ha puesto nada" de "ha puesto cero".
 */
interface FormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  sortOrder: string;
  featured: boolean;
  active: boolean;
}

const EMPTY: FormValues = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  sortOrder: '',
  featured: false,
  active: true,
};

const FIELD_BASE =
  'w-full rounded-xl border border-rose-200 bg-white/70 px-4 py-2.5 text-stone-900 outline-none transition-colors focus:border-rose-400 focus:bg-white';

const FIELD = `mt-1.5 ${FIELD_BASE}`;

/** Longitud máxima de la descripción, para que las tarjetas no se descuadren. */
const MAX_DESCRIPTION = 300;

/** Convierte lo escrito a número. Acepta coma decimal: "80,50" -> 80.5 */
function toNumber(raw: string): number | null {
  const clean = raw.trim().replace(',', '.');
  if (clean === '') return null;
  const value = Number(clean);
  return Number.isFinite(value) ? value : null;
}

/** Rellena el formulario con los datos de un producto existente. */
function toValues(product: Product): FormValues {
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    imageUrl: product.imageUrl,
    sortOrder: String(product.sortOrder),
    featured: product.featured,
    active: product.active,
  };
}

/**
 * Formulario para crear o editar un producto completo.
 *
 * Todo lo que llega a la base de datos pasa antes por `validate`: si algo
 * no cuadra, se avisa y no se manda nada. El trabajo diario (stock) se
 * hace desde la fila de la tabla, sin abrir esto.
 */
export function ProductForm({
  product,
  products,
  onClose,
  onSaved,
}: ProductFormProps): JSX.Element {
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Foto subida en esta misma ventana y todavía sin guardar: si se
  // quita, se borra también del almacén para no dejar basura.
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  // El <input type="file"> va oculto: lo dispara el botón de al lado.
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValues(product ? toValues(product) : EMPTY);
  }, [product]);

  // Cerrar con Escape, como cualquier diálogo del sistema.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  /** Los órdenes que ya están ocupados por OTROS productos. */
  const takenOrders = new Map(
    products
      .filter((item) => item.id !== product?.id)
      .map((item) => [item.sortOrder, item.name] as const),
  );

  /** Primer número de orden libre: se usa si el campo se deja vacío. */
  const nextFreeOrder = (() => {
    let candidate = 1;
    while (takenOrders.has(candidate)) candidate += 1;
    return candidate;
  })();

  const featuredCount = products.filter(
    (item) => item.featured && item.id !== product?.id,
  ).length;
  const canFeature = values.featured || featuredCount < MAX_FEATURED;

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]): void {
    setValues((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  /**
   * Comprueba todo antes de tocar la base de datos.
   * Devuelve el producto listo para guardar, o el motivo del rechazo.
   */
  function validate(): { ok: true; value: ProductInput } | { ok: false; message: string } {
    const name = values.name.trim();
    if (!name) return { ok: false, message: 'Ponle un nombre al producto.' };

    const price = toNumber(values.price);
    if (price === null) return { ok: false, message: 'Falta el precio.' };
    if (price <= 0) return { ok: false, message: 'El precio debe ser mayor que 0.' };

    const stock = toNumber(values.stock);
    if (stock === null) {
      return { ok: false, message: 'Falta el stock. Pon 0 si está agotado.' };
    }
    if (stock < 0) return { ok: false, message: 'El stock no puede ser negativo.' };
    if (!Number.isInteger(stock)) {
      return { ok: false, message: 'El stock tiene que ser un número entero.' };
    }

    const imageUrl = values.imageUrl.trim();
    if (!imageUrl) return { ok: false, message: 'Falta la foto del producto.' };

    // Orden vacío: lo colocamos en el primer hueco libre.
    let sortOrder = nextFreeOrder;
    if (values.sortOrder.trim() !== '') {
      const parsed = toNumber(values.sortOrder);
      if (parsed === null || !Number.isInteger(parsed) || parsed < 1) {
        return { ok: false, message: 'El orden tiene que ser un número entero desde 1.' };
      }
      const owner = takenOrders.get(parsed);
      if (owner) {
        return {
          ok: false,
          message: `El orden ${parsed} ya lo usa "${owner}". El primero libre es ${nextFreeOrder}.`,
        };
      }
      sortOrder = parsed;
    }

    return {
      ok: true,
      value: {
        name,
        description: values.description.trim().slice(0, MAX_DESCRIPTION),
        // La base de datos guarda dos decimales: redondeamos aquí para
        // que lo guardado sea exactamente lo que se ve.
        price: Math.round(price * 100) / 100,
        stock,
        imageUrl,
        sortOrder,
        featured: values.featured,
        active: values.active,
        category: product?.category ?? 'ramos',
      },
    };
  }

  /** Sube la foto elegida y deja su dirección en el campo. */
  async function handleFile(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    // Permite volver a elegir el mismo archivo si algo falló.
    event.target.value = '';
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadProductImage(file);
      update('imageUrl', url);
      setUploadedUrl(url);
      toast.success('Foto subida.');
    } catch (cause: unknown) {
      toast.error(cause instanceof Error ? cause.message : 'No se pudo subir la foto.');
    } finally {
      setIsUploading(false);
    }
  }

  /** Vacía el campo de la foto y limpia el archivo si acababa de subirse. */
  function clearImage(): void {
    const current = values.imageUrl;
    update('imageUrl', '');

    if (current && current === uploadedUrl) {
      void deleteProductImage(current);
      setUploadedUrl(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSaving || isUploading) return;

    const checked = validate();
    if (!checked.ok) {
      setError(checked.message);
      toast.error(checked.message);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const saved = product
        ? await updateProduct(product.id, checked.value)
        : await createProduct(checked.value);
      onSaved(saved, product === null);
      toast.success(product ? 'Producto actualizado.' : 'Producto creado.');
      onClose();
    } catch (cause: unknown) {
      const message = cause instanceof Error ? cause.message : 'No se pudo guardar el producto.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/50 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={product ? 'Editar producto' : 'Nuevo producto'}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-rose-200 bg-blush-100 p-7 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              {product ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Los cambios se ven en la web en cuanto guardas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-800">
              Nombre
            </label>
            <input
              id="name"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              className={FIELD}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-800">
              Descripción
            </label>
            <textarea
              id="description"
              rows={2}
              maxLength={MAX_DESCRIPTION}
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
              className={FIELD}
            />
            <p className="mt-1 text-xs text-stone-500">
              {values.description.length}/{MAX_DESCRIPTION}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-stone-800">
                Precio
              </label>
              <input
                id="price"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={values.price}
                onChange={(event) => update('price', event.target.value)}
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-stone-800">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                min={0}
                step="1"
                inputMode="numeric"
                value={values.stock}
                onChange={(event) => update('stock', event.target.value)}
                className={FIELD}
              />
              <p className="mt-1 text-xs text-stone-500">0 = se muestra como agotado</p>
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-800">
              Foto
            </label>

            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input
                id="imageUrl"
                value={values.imageUrl}
                onChange={(event) => update('imageUrl', event.target.value)}
                className={FIELD_BASE}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInput.current?.click()}
                disabled={isUploading}
                className="shrink-0"
              >
                <Icon name="upload" size={18} />
                {isUploading ? 'Subiendo…' : 'Subir foto'}
              </Button>
            </div>

            {/* Queda fuera de la vista: lo abre el botón de arriba. */}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleFile(event)}
            />

            <p className="mt-1.5 text-xs text-stone-500">
              Vertical, 1080 × 1350 px, menos de 5 MB. También puedes pegar una dirección.
            </p>

            {values.imageUrl && (
              <div className="relative mt-3 inline-block">
                <img
                  src={values.imageUrl}
                  alt="Vista previa de la foto"
                  className="h-40 w-32 rounded-xl border border-rose-200 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Quitar la foto"
                  title="Quitar la foto"
                  className="absolute -top-2 -right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-700 text-white shadow-card transition-colors hover:bg-rose-800"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-stone-800">
                Orden
              </label>
              <input
                id="sortOrder"
                type="number"
                min={1}
                step="1"
                inputMode="numeric"
                value={values.sortOrder}
                onChange={(event) => update('sortOrder', event.target.value)}
                className={FIELD}
              />
              <p className="mt-1 text-xs text-stone-500">Vacío = {nextFreeOrder} (primero libre)</p>
            </div>

            <label
              className={cn(
                'flex items-center gap-2.5 self-start pt-8 text-sm',
                canFeature ? 'text-stone-800' : 'cursor-not-allowed text-stone-400',
              )}
              title={
                canFeature
                  ? undefined
                  : `La portada ya tiene ${MAX_FEATURED} destacados. Quita uno para poner este.`
              }
            >
              <input
                type="checkbox"
                checked={values.featured}
                disabled={!canFeature}
                onChange={(event) => update('featured', event.target.checked)}
                className="h-4 w-4 accent-rose-700"
              />
              Destacado en portada ({featuredCount + (values.featured ? 1 : 0)}/{MAX_FEATURED})
            </label>

            <label className="flex items-center gap-2.5 self-start pt-8 text-sm text-stone-800">
              <input
                type="checkbox"
                checked={values.active}
                onChange={(event) => update('active', event.target.checked)}
                className="h-4 w-4 accent-rose-700"
              />
              Visible en la web
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800"
            >
              <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || isUploading}>
              <Icon name="save" size={18} />
              {isSaving ? 'Guardando…' : 'Guardar producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
