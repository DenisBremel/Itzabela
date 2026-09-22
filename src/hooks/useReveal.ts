import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Activa la animación de aparición de los elementos con clase `.reveal`
 * cuando entran en pantalla.
 *
 * Detalle importante: el catálogo llega de forma asíncrona, así que las
 * tarjetas aparecen DESPUÉS del primer barrido. Por eso vigilamos el DOM
 * con un MutationObserver y damos de alta los elementos nuevos; si no, se
 * quedarían invisibles para siempre (opacity 0).
 */
export function useReveal(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const showAll = (): void => {
      document
        .querySelectorAll<HTMLElement>('.reveal')
        .forEach((element) => element.classList.add('is-visible'));
    };

    if (typeof IntersectionObserver === 'undefined') {
      showAll();
      return;
    }

    let observerFired = false;
    const registered = new WeakSet<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        observerFired = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    /** Da de alta los `.reveal` que todavía no estaban vigilados. */
    const register = (): void => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((element) => {
        if (registered.has(element)) return;
        registered.add(element);
        observer.observe(element);
      });
    };

    register();

    // Contenido que llega más tarde (productos, filtros) también se anima.
    const mutations = new MutationObserver(register);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Red de seguridad: si el observador nunca llega a ejecutarse,
    // mostramos todo. El contenido jamás debe quedar oculto.
    const failsafe = window.setTimeout(() => {
      if (!observerFired) showAll();
    }, 2500);

    return () => {
      window.clearTimeout(failsafe);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);
}
