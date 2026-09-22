import type { JSX, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFloat } from './WhatsAppFloat';
import { useReveal } from '@/hooks/useReveal';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useHashScroll } from '@/hooks/useHashScroll';

/** Estructura común a todas las páginas públicas: header, contenido y footer. */
export function Layout({ children }: { children: ReactNode }): JSX.Element {
  useScrollTop();
  useHashScroll();
  useReveal();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only rounded-full bg-rose-700 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
