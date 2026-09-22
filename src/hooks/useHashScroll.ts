import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Lleva la vista a la sección indicada en la URL (por ejemplo /#como-pedir).
 * React Router no lo hace solo: navega, pero no desplaza la página.
 *
 * Se reintenta un par de veces porque la sección puede aún no existir
 * si el contenido tardó un instante en pintarse.
 */
export function useHashScroll(): void {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;

    const scroll = (): void => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempts < 10) {
        attempts += 1;
        window.setTimeout(scroll, 80);
      }
    };

    scroll();
  }, [hash, key]);
}
