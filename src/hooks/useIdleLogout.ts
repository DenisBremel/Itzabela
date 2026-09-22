import { useEffect, useRef } from 'react';

/**
 * ============================================================
 *  CIERRE DE SESIÓN POR INACTIVIDAD
 * ============================================================
 *  Si pasan `minutes` sin que nadie toque nada, se llama a
 *  `onIdle` para cerrar la sesión. Pensado para el panel: un
 *  celular olvidado sobre el mostrador no debe quedar abierto.
 *
 *  Cualquier señal de vida reinicia la cuenta: mover el ratón,
 *  escribir, tocar la pantalla, hacer scroll o volver a la
 *  pestaña.
 *
 *  Detalle de implementación: en vez de reiniciar un temporizador
 *  en cada movimiento del ratón (cientos por segundo), solo se
 *  apunta la hora del último gesto y se comprueba cada 30
 *  segundos. Cuesta lo mismo con o sin actividad.
 * ============================================================
 */

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const;

/** Cada cuánto se comprueba si ya venció el plazo. */
const CHECK_INTERVAL_MS = 30_000;

export function useIdleLogout(onIdle: () => void, minutes: number): void {
  // En una referencia, no en estado: cambia constantemente y no
  // debe provocar que React vuelva a dibujar nada.
  const lastActivity = useRef(Date.now());
  // Guardamos la última función recibida para no reiniciar el
  // intervalo cada vez que el componente se vuelve a dibujar.
  const callback = useRef(onIdle);
  callback.current = onIdle;

  useEffect(() => {
    const limit = minutes * 60 * 1000;
    const touch = (): void => {
      lastActivity.current = Date.now();
    };

    EVENTS.forEach((event) => window.addEventListener(event, touch, { passive: true }));

    // Volver a la pestaña también cuenta como actividad: si no, una
    // pestaña en segundo plano se cerraría nada más mirarla.
    const onVisible = (): void => {
      if (document.visibilityState === 'visible') touch();
    };
    document.addEventListener('visibilitychange', onVisible);

    const interval = window.setInterval(() => {
      if (Date.now() - lastActivity.current >= limit) {
        callback.current();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      EVENTS.forEach((event) => window.removeEventListener(event, touch));
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, [minutes]);
}
