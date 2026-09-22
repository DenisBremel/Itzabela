/**
 * Une clases CSS condicionales sin dependencias externas.
 * Ejemplo: cn('card', isActive && 'card--active') -> "card card--active"
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
