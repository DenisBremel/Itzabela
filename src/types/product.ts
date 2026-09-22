/** Categorías disponibles en el catálogo. */
export const CATEGORIES = [
  { id: 'ramos', label: 'Ramos' },
  { id: 'cajas', label: 'Cajas de flores' },
  { id: 'arreglos', label: 'Arreglos' },
  { id: 'plantas', label: 'Plantas' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

/** Un producto del catálogo tal como lo usa la interfaz. */
export interface Product {
  /** Identificador único (uuid en Supabase, slug en los datos de ejemplo) */
  id: string;
  /** Nombre visible: "Ramo de 12 rosas rojas" */
  name: string;
  /** Descripción corta que acompaña a la tarjeta */
  description: string;
  /** Precio en la moneda configurada en SHOP.currency */
  price: number;
  /** URL de la foto (puede ser externa o un archivo de /public/images) */
  imageUrl: string;
  category: CategoryId;
  /** Unidades disponibles. 0 o menos => se muestra "AGOTADO" */
  stock: number;
  /** Aparece en la sección "Los más pedidos" de la portada */
  featured: boolean;
  /** Si es false, el producto no se muestra en la web pública */
  active: boolean;
  /** Orden de aparición: menor número, primero */
  sortOrder: number;
}

/** Campos que el panel de administración puede modificar. */
export type ProductInput = Omit<Product, 'id'>;

/**
 * Cuántos productos caben en "Los más pedidos" de la portada.
 * El panel no deja marcar más y la portada no muestra más.
 */
export const MAX_FEATURED = 8;

/** ¿Se puede comprar? Regla única usada por toda la interfaz. */
export function isAvailable(product: Product): boolean {
  return product.active && product.stock > 0;
}

/** Etiqueta legible de la categoría de un producto. */
export function categoryLabel(category: CategoryId): string {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}
