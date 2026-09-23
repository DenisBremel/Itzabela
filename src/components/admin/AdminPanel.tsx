import { useMemo, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { ProductRow } from './ProductRow';
import { ProductForm } from './ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import { SHOP } from '@/constants/shop';
import { MAX_FEATURED, type Product } from '@/types/product';

interface AdminPanelProps {
  /** Correo de quien ha entrado, para mostrarlo en la cabecera. */
  email: string;
  onSignOut: () => Promise<void>;
}

/** Minutos sin tocar nada antes de cerrar la sesión por seguridad. */
const IDLE_MINUTES = 15;

/** Panel de stock: la vista que usas a diario para mantener el catálogo. */
export function AdminPanel({ email, onSignOut }: AdminPanelProps): JSX.Element {
  const toast = useToast();
  const { products, isLoading, error, reload, replaceProduct } = useProducts('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Un celular olvidado en el mostrador no debe quedar con el panel
  // abierto: a los 15 minutos sin actividad se cierra la sesión.
  useIdleLogout(() => {
    toast.info('Sesión cerrada por seguridad tras 15 minutos sin actividad.');
    void onSignOut();
  }, IDLE_MINUTES);

  /** Cuántos destacados hay: limita cuántos más se pueden marcar. */
  const featuredCount = useMemo(
    () => products.filter((product) => product.featured).length,
    [products],
  );

  const query = search.trim().toLowerCase();
  const visible = query
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      )
    : products;

  function openNew(): void {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEdit(product: Product): void {
    setEditing(product);
    setIsFormOpen(true);
  }

  return (
    <div className="min-h-screen bg-blush-100 pb-20">
      {/* Cabecera del panel */}
      <header className="border-b border-rose-200 bg-blush-100">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <h1 className="font-display text-3xl font-semibold text-stone-900">Panel de stock</h1>
            <p className="mt-0.5 text-sm text-stone-500">
              {SHOP.fullName} · sesión de {email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <Icon name="eye" size={18} />
              Ver la tienda
            </Link>
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <Icon name="logout" size={18} />
              Salir
            </button>
          </div>
        </Container>
      </header>

      <Container className="py-8">
        {/* Buscador y alta, siempre en una sola fila */}
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar producto…"
            aria-label="Buscar producto"
            className="min-w-0 flex-1 rounded-full border border-rose-200 bg-white/70 px-5 py-3 text-base text-stone-900 outline-none transition-colors focus:border-rose-400 focus:bg-white sm:py-2.5 sm:text-sm"
          />

          {/* En el celular el botón se queda solo con el +, para que la
              fila entre completa; el texto vuelve desde 640 px. */}
          <Button onClick={openNew} aria-label="Nuevo producto" className="shrink-0">
            <Icon name="plus" size={18} />
            <span className="hidden sm:inline">Nuevo producto</span>
          </Button>
        </div>

        {/* Listado */}
        <div className="mt-6">
          {isLoading && <p className="py-10 text-center text-stone-500">Cargando catálogo…</p>}

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-800"
            >
              <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="rounded-3xl border border-rose-200 bg-blush-100 p-10 text-center">
              <Icon name="flower" size={36} className="mx-auto text-rose-300" />
              <p className="mt-4 font-medium text-stone-800">Tu catálogo está vacío</p>
              <p className="mt-1 text-sm text-stone-600">
                Crea tu primer producto y aparecerá en la tienda al instante.
              </p>
              <div className="mt-6 flex justify-center">
                <Button onClick={openNew}>
                  <Icon name="plus" size={18} />
                  Crear el primero
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            // En el celular cada producto es una tarjeta apilada; desde
            // 1024 px se convierte en la tabla de cuatro columnas.
            <div className="lg:overflow-x-auto lg:rounded-2xl lg:border lg:border-rose-200">
              <table className="block w-full border-collapse text-left lg:table">
                <thead className="hidden lg:table-header-group">
                  <tr className="border-b border-rose-200 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="block space-y-3 lg:table-row-group lg:space-y-0">
                  {visible.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      // Solo se puede destacar si queda sitio en la portada.
                      canFeature={product.featured || featuredCount < MAX_FEATURED}
                      onSaved={replaceProduct}
                      onDeleted={() => {
                        reload();
                        toast.success('Producto eliminado.');
                      }}
                      onEdit={openEdit}
                    />
                  ))}

                  {visible.length === 0 && (
                    <tr className="block lg:table-row">
                      <td colSpan={4} className="block px-4 py-10 text-center text-stone-500 lg:table-cell">
                        Ningún producto coincide con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>

      {isFormOpen && (
        <ProductForm
          product={editing}
          products={products}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved, isNew) => {
            if (isNew) {
              reload();
            } else {
              replaceProduct(saved);
            }
          }}
        />
      )}
    </div>
  );
}
