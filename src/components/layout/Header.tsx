import { useEffect, useState, type JSX } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MAIN_NAV } from '@/constants/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { buildWhatsAppUrl } from '@/utils/whatsapp';
import { cn } from '@/utils/cn';

/**
 * Cabecera fija con la navegación principal.
 *
 * En móvil el menú es un panel lateral que entra deslizándose desde la
 * izquierda y se dibuja SOBRE la página, sin empujar el contenido. Se
 * cierra con la X, con Escape o tocando el fondo oscurecido.
 *
 * El panel y su fondo viven fuera de <header> a propósito: el header usa
 * `backdrop-blur`, y un elemento con desenfoque de fondo pasa a ser el
 * marco de referencia de sus hijos `fixed`. Dentro, el panel se
 * posicionaría respecto al header en vez de respecto a la pantalla.
 *
 * Aquí NO hay ningún enlace de "iniciar sesión": el cliente nunca ve un
 * login. El panel vive en /admin y no se anuncia en ninguna parte.
 */
export function Header(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Cierra el menú al cambiar de ruta o de sección.
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname, location.hash, location.key]);

  // Sombra sutil al hacer scroll
  useEffect(() => {
    const onScroll = (): void => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del fondo y permite cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 w-full border-b bg-blush-100/90 backdrop-blur-md transition-shadow',
          isScrolled ? 'border-rose-100 shadow-header' : 'border-transparent',
        )}
      >
        <Container className="flex h-18 items-center justify-between py-3">
          <div className="flex items-center gap-2">
            {/* Botón hamburguesa: a la izquierda, antes de la marca */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="-ml-2 inline-flex items-center justify-center rounded-full p-2.5 text-stone-700 transition-colors hover:bg-rose-50 lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={isOpen}
              aria-controls="menu-movil"
            >
              <Icon name="menu" size={26} />
            </button>

            <Logo />
          </div>

          {/* Navegación de escritorio */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-stone-700 transition-colors hover:bg-rose-50 hover:text-rose-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href={buildWhatsAppUrl()} variant="whatsapp" size="sm">
              <Icon name="whatsapp" size={18} />
              Pedir ahora
            </Button>
          </div>
        </Container>
      </header>

      {/* Fondo oscurecido: cubre la página mientras el panel está abierto */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-stone-900/40 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Panel lateral */}
      <div
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className={cn(
          'fixed top-0 left-0 z-50 flex h-dvh w-[82%] max-w-xs flex-col',
          'border-r border-rose-200 bg-blush-100 shadow-2xl',
          'transition-transform duration-300 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-rose-200 px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="-mr-2 inline-flex items-center justify-center rounded-full p-2.5 text-stone-700 transition-colors hover:bg-rose-50"
            aria-label="Cerrar menú"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Navegación">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-xl px-3 py-3.5 text-base font-medium text-stone-800 transition-colors hover:bg-rose-100 hover:text-rose-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="shrink-0 border-t border-rose-200 p-4">
          <Button href={buildWhatsAppUrl()} variant="whatsapp" fullWidth>
            <Icon name="whatsapp" size={20} />
            Pedir por WhatsApp
          </Button>
        </div>
      </div>
    </>
  );
}
