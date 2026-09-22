import type { JSX } from 'react';
import { Icon } from '@/components/ui/Icon';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

/**
 * Botón flotante de WhatsApp visible en todo el sitio.
 * Abre el chat con el mensaje de pedido precargado.
 */
export function WhatsAppFloat(): JSX.Element {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-20 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.04] hover:bg-[#1EBE5A] sm:right-6 sm:bottom-6"
    >
      <Icon name="whatsapp" size={26} />
      <span className="hidden pr-1 sm:inline">Pedir por WhatsApp</span>
    </a>
  );
}
