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

/**
 * Pone en una sola línea una descripción escrita en varios renglones,
 * separando cada uno con coma.
 *
 *   "Lirio\nMargaritas\n1 carrito"  ->  "Lirio, Margaritas, 1 carrito"
 *
 * En la tarjeta del catálogo el texto va corrido, así que sin esto los
 * renglones se pegarían unos a otros y se leerían como una lista sin
 * separar. El PDF sí respeta los saltos: ahí hay sitio de sobra.
 */
export function inlineDescription(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/[,;]+$/, ''))
    .filter((line) => line !== '')
    .join(', ');
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
