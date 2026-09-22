import { useCallback, useEffect, useState } from 'react';
import { fetchAllProducts, fetchPublicProducts } from '@/services/productService';
import type { Product } from '@/types/product';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  /** Vuelve a pedir los datos (lo usa el panel tras guardar). */
  reload: () => void;
  /** Reemplaza un producto en memoria sin volver a consultar la base. */
  replaceProduct: (product: Product) => void;
}

/**
 * Carga el catálogo.
 * @param scope 'public' = solo productos activos (la web).
 *              'all'    = incluye los ocultos (el panel).
 */
export function useProducts(scope: 'public' | 'all' = 'public'): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const request = scope === 'all' ? fetchAllProducts() : fetchPublicProducts();

    request
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [scope, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const replaceProduct = useCallback((updated: Product) => {
    setProducts((current) =>
      current.map((product) => (product.id === updated.id ? updated : product)),
    );
  }, []);

  return { products, isLoading, error, reload, replaceProduct };
}
