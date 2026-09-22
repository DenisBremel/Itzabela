import { SHOP, WHATSAPP_DEFAULT_MESSAGE } from '@/constants/shop';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types/product';

/**
 * Construye el enlace de WhatsApp con el mensaje ya escrito.
 * Usa wa.me, que funciona igual en la app móvil y en WhatsApp Web.
 *
 * @param message Texto que aparecerá precargado en el chat.
 * @param phone   Número en formato internacional (solo dígitos).
 */
export function buildWhatsAppUrl(
  message: string = WHATSAPP_DEFAULT_MESSAGE,
  phone: string = SHOP.whatsapp,
): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje de compra de un producto concreto.
 * Incluye nombre y precio para que la conversación empiece sin preguntas.
 */
export function buildProductMessage(product: Product): string {
  return (
    `Hola ${SHOP.name}, quiero comprar:\n` +
    `${product.name}\n` +
    `Precio: ${formatPrice(product.price)}\n\n` +
    `¿Me confirman disponibilidad y la entrega, por favor?`
  );
}

/** Enlace de WhatsApp para el botón "Comprar" de una tarjeta de producto. */
export function buildProductWhatsAppUrl(product: Product): string {
  return buildWhatsAppUrl(buildProductMessage(product));
}

/**
 * Mensaje para un producto agotado.
 * No pide un aviso pasivo: propone encargarlo, porque los arreglos se
 * hacen a mano y "agotado" solo significa que hoy no está armado.
 */
export function buildSoldOutWhatsAppUrl(product: Product): string {
  return buildWhatsAppUrl(
    `Hola ${SHOP.name}, quiero este modelo:\n` +
      `${product.name}\n` +
      `Precio: ${formatPrice(product.price)}\n\n` +
      `Vi que está agotado. ¿Me pueden preparar uno? ¿Para cuándo estaría?`,
  );
}

/** Enlace `mailto:` con asunto y cuerpo opcionales. */
export function buildMailtoUrl(subject: string, body = ''): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${SHOP.email}?${params.toString()}`;
}

/** Enlace `tel:` a partir del teléfono configurado. */
export function buildTelUrl(): string {
  return `tel:+${SHOP.whatsapp}`;
}
