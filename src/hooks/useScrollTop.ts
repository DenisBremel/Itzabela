import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Lleva la vista al inicio al cambiar de página (no al saltar a una sección). */
export function useScrollTop(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
}
