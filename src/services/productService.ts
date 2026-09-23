import { supabase, isSupabaseConfigured, requireSupabase } from '@/lib/supabase';
import { SEED_PRODUCTS } from '@/data/products';
import type { CategoryId, Product, ProductInput } from '@/types/product';

/**
 * ============================================================
 *  ACCESO A DATOS DEL CATÁLOGO
 * ============================================================
 *  Toda la aplicación pide los productos por aquí. Si Supabase
 *  está configurado, los lee de la base de datos; si no, usa el
 *  catálogo de ejemplo (src/data/products.ts).
 *
 *  La tabla usa nombres en snake_case (convención de Postgres) y
 *  la interfaz camelCase: la traducción vive en este archivo y
 *  en ningún otro sitio.
 * ============================================================
 */

const TABLE = 'products';

/**
 * Tiempo máximo de espera de una consulta. Sin esto, si Supabase no
 * responde (sin internet, servicio caído), el catálogo se quedaría
 * cargando para siempre en lugar de avisar al cliente.
 */
const TIMEOUT_MS = 12_000;

/** Forma exacta de una fila de la tabla `products`. */
interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  featured: boolean;
  active: boolean;
  sort_order: number;
}

/** Fila de Postgres -> objeto que entiende la interfaz. */
function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    imageUrl: row.image_url ?? '',
    category: row.category as CategoryId,
    stock: row.stock,
    featured: row.featured,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

/** Objeto de la interfaz -> columnas de Postgres. */
function toRow(product: Partial<ProductInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (product.name !== undefined) row.name = product.name;
  if (product.description !== undefined) row.description = product.description;
  if (product.price !== undefined) row.price = product.price;
  if (product.imageUrl !== undefined) row.image_url = product.imageUrl;
  if (product.category !== undefined) row.category = product.category;
  if (product.stock !== undefined) row.stock = product.stock;
  if (product.featured !== undefined) row.featured = product.featured;
  if (product.active !== undefined) row.active = product.active;
  if (product.sortOrder !== undefined) row.sort_order = product.sortOrder;
  return row;
}

/**
 * Productos visibles en la web pública (solo los activos).
 * Sin Supabase devuelve el catálogo de ejemplo.
 */
export async function fetchPublicProducts(): Promise<Product[]> {
  if (!supabase) {
    return SEED_PRODUCTS.filter((product) => product.active).map((product) => ({ ...product }));
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .abortSignal(AbortSignal.timeout(TIMEOUT_MS));

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(fromRow);
}

/**
 * Todos los productos, incluidos los ocultos. Solo lo usa el panel:
 * las políticas RLS exigen sesión iniciada para ver los inactivos.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  if (!supabase) {
    return SEED_PRODUCTS.map((product) => ({ ...product }));
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true })
    .abortSignal(AbortSignal.timeout(TIMEOUT_MS));

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(fromRow);
}

/** Actualiza solo los campos enviados (por ejemplo, únicamente el stock). */
export async function updateProduct(
  id: string,
  changes: Partial<ProductInput>,
): Promise<Product> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .update(toRow(changes))
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromRow(data as ProductRow);
}

/** Crea un producto nuevo. */
export async function createProduct(product: ProductInput): Promise<Product> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .insert(toRow(product))
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromRow(data as ProductRow);
}

/** Borra un producto definitivamente. */
export async function deleteProduct(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export { isSupabaseConfigured };
