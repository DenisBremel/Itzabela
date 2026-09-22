/**
 * Enlaces del menú principal y del footer.
 * Un `href` con "#" apunta a una sección de la portada.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const MAIN_NAV: readonly NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Diseño personalizado', href: '/diseno-personalizado' },
  { label: 'Cómo pedir', href: '/#como-pedir' },
  { label: 'Preguntas', href: '/#preguntas-frecuentes' },
] as const;

export const FOOTER_NAV: readonly { title: string; items: readonly NavItem[] }[] = [
  {
    title: 'Tienda',
    items: [
      { label: 'Ver el catálogo', href: '/catalogo' },
      { label: 'Diseño personalizado', href: '/diseno-personalizado' },
      { label: 'Ocasiones', href: '/#ocasiones' },
    ],
  },
  {
    title: 'Ayuda',
    items: [
      { label: 'Cómo pedir', href: '/#como-pedir' },
      { label: 'Preguntas frecuentes', href: '/#preguntas-frecuentes' },
    ],
  },
] as const;
