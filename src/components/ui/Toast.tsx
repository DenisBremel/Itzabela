import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/utils/cn';

/**
 * ============================================================
 *  AVISOS FLOTANTES (TOASTS)
 * ============================================================
 *  Mensajes cortos que aparecen abajo y se van solos. Sustituyen
 *  a los `alert()` del navegador, que bloquean la pantalla y se
 *  ven fuera de lugar.
 *
 *  Hecho a mano, sin librerías, como el resto del proyecto.
 *  Se usa así:
 *
 *      const toast = useToast();
 *      toast.success('Producto guardado');
 *      toast.error('No se pudo guardar');
 * ============================================================
 */

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

/** Cuánto se queda en pantalla. Los errores, más tiempo: hay que leerlos. */
const DURATION: Record<ToastKind, number> = {
  success: 3000,
  info: 3500,
  error: 6000,
};

const STYLES: Record<ToastKind, { icon: IconName; className: string }> = {
  success: { icon: 'check', className: 'border-sage-300 bg-sage-50 text-sage-800' },
  error: { icon: 'alert', className: 'border-rose-300 bg-rose-50 text-rose-800' },
  info: { icon: 'alert', className: 'border-rose-200 bg-blush-100 text-stone-700' },
};

const ToastContext = createContext<ToastApi | null>(null);

/** Da acceso a los avisos. Lanza si falta el proveedor: así el fallo se ve en desarrollo. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast debe usarse dentro de <ToastProvider>.');
  return api;
}

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number): void => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string): void => {
      const id = Date.now() + Math.random();
      setItems((current) => [...current, { id, kind, message }]);
      window.setTimeout(() => dismiss(id), DURATION[kind]);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Abajo centrado en el celular, abajo a la derecha en escritorio */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {items.map((item) => {
          const style = STYLES[item.kind];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => dismiss(item.id)}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-2xl border px-4 py-3 text-left text-sm shadow-card',
                'animate-[toast-in_0.22s_ease-out]',
                style.className,
              )}
            >
              <Icon name={style.icon} size={18} className="mt-0.5 shrink-0" />
              <span className="flex-1">{item.message}</span>
            </button>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
