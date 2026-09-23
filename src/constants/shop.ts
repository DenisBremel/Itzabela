/**
 * ============================================================
 *  CONFIGURACIÓN CENTRAL DE LA TIENDA
 * ============================================================
 *  Este es el ÚNICO archivo que necesitas editar para cambiar
 *  los datos del negocio: nombre, WhatsApp, horarios, zonas de
 *  reparto y redes sociales.
 *
 *  Los valores que cambian según el entorno (WhatsApp, correo,
 *  dominio) se leen de variables de entorno con un valor por
 *  defecto seguro. Ver el archivo .env.example en la raíz.
 * ============================================================
 */

import { config } from '@/lib/config';

/** Deja solo dígitos: WhatsApp no acepta espacios ni símbolos. */
const onlyDigits = (value: string): string => value.replace(/\D/g, '');

export const SHOP = {
  /** Nombre comercial: header, footer, títulos y mensajes de WhatsApp */
  name: 'Itzabela',
  /** Nombre completo para títulos y SEO */
  fullName: 'Itzabela',
  /** Frase corta de posicionamiento */
  tagline: 'Arreglos florales que dicen lo que sientes',
  /** Descripción usada en SEO y en el footer */
  description:
    'Florería Itzabela: ramos de rosas, arreglos florales, cajas de flores, ' +
    'girasoles y diseños personalizados hechos con mucho amor.',

  /** Dominio final, sin barra al final */
  siteUrl: config('VITE_SITE_URL', 'https://itzabela.com').replace(/\/$/, ''),

  // --- Contacto ------------------------------------------------
  /** WhatsApp: código de país + número, solo dígitos */
  whatsapp: onlyDigits(config('VITE_WHATSAPP_NUMBER', '51935826674')),
  /** Teléfono tal como se muestra al cliente */
  phoneDisplay: config('VITE_PHONE_DISPLAY', '+51 935 826 674'),
  /** Correo (déjalo vacío si no quieres mostrarlo) */
  email: config('VITE_CONTACT_EMAIL'),

  // --- Operación -----------------------------------------------
  schedule: 'Todos los días, 8:00 a 21:00',
  deliveryArea: 'Entregas a domicilio en todo Tingo María',
  deliveryNote: 'Pedidos antes de las 4:00 p. m. se entregan el mismo día.',

  /** Moneda y formato de precios */
  currency: 'PEN',
  locale: 'es-PE',

  // --- Redes sociales -------------------------------------------
  // Deja en cadena vacía las que no existan: el footer las oculta.
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
} as const;

/** Mensaje precargado en los botones generales de WhatsApp. */
export const WHATSAPP_DEFAULT_MESSAGE = `Hola ${SHOP.name}, quiero hacer un pedido de flores.`;

/** Mensaje precargado en el botón de diseño personalizado. */
export const WHATSAPP_CUSTOM_MESSAGE =
  `Hola ${SHOP.name}, quiero un DISEÑO PERSONALIZADO.\n\n` +
  `Ocasión: \n` +
  `Flores favoritas: \n` +
  `Presupuesto aproximado: \n` +
  `Fecha de entrega: \n\n` +
  `¿Me ayudan a armarlo?`;

export type SocialNetwork = keyof typeof SHOP.social;
