import { SHOP } from '@/constants/shop';

/**
 * Formatea un precio en la moneda de la tienda.
 * Ejemplo: 129 -> "S/ 129.00"
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat(SHOP.locale, {
    style: 'currency',
    currency: SHOP.currency,
    minimumFractionDigits: 2,
  }).format(value);
}

/** Convierte un texto a slug: "Ramo de Rosas Rojas" -> "ramo-de-rosas-rojas" */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
