import type { IconName } from '@/components/ui/Icon';
import { SHOP } from './shop';

/**
 * ============================================================
 *  TEXTOS DE LA PORTADA
 * ============================================================
 *  Ocasiones, pasos del pedido y preguntas frecuentes.
 *  Edita estas listas y la web cambia sola: no hay que tocar
 *  ningún componente.
 * ============================================================
 */

export interface Occasion {
  icon: IconName;
  title: string;
  description: string;
}

export const OCCASIONS: readonly Occasion[] = [
  {
    icon: 'heart',
    title: 'Aniversarios',
    description: 'Rosas rojas, peonías y cajas premium para celebrar los años juntos.',
  },
  {
    icon: 'gift',
    title: 'Cumpleaños',
    description: 'Ramos coloridos y alegres, con globo o tarjeta si lo pides.',
  },
  {
    icon: 'sparkles',
    title: 'Pedidas de mano',
    description: 'Diseños grandes y arreglos a medida para el momento más importante.',
  },
  {
    icon: 'flower',
    title: 'Día de la Madre',
    description: 'El regalo más esperado del año, y este no se marchita. Reserva con tiempo.',
  },
  {
    icon: 'star',
    title: 'Agradecimientos',
    description: 'Detalles para decir gracias a un cliente, un profesor o una amiga.',
  },
  {
    icon: 'box',
    title: 'Empresas y eventos',
    description: 'Decoración floral y pedidos recurrentes para oficinas y locales.',
  },
] as const;

export interface Step {
  icon: IconName;
  title: string;
  description: string;
}

export const ORDER_STEPS: readonly Step[] = [
  {
    icon: 'flower',
    title: '1. Elige tu arreglo',
    description:
      'Mira el catálogo y toca "Comprar". Si quieres algo distinto, pide un diseño personalizado.',
  },
  {
    icon: 'whatsapp',
    title: '2. Escríbenos por WhatsApp',
    description:
      'El mensaje se abre ya escrito con el producto y el precio. Solo tienes que enviarlo.',
  },
  {
    icon: 'calendar',
    title: '3. Coordinamos la entrega',
    description:
      'Nos dices fecha, hora, dirección y qué debe decir la tarjeta. Confirmamos todo por chat.',
  },
  {
    icon: 'truck',
    title: '4. Entregamos en mano',
    description: 'Llevamos el arreglo y te enviamos la foto de la entrega cuando llega.',
  },
] as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    question: '¿Hacen entregas el mismo día?',
    answer: `Sí. ${SHOP.deliveryNote} Para pedidos más tarde, coordinamos la entrega para la mañana siguiente.`,
  },
  {
    question: '¿Cómo pago mi pedido?',
    answer:
      'El pago se coordina por WhatsApp: aceptamos Yape, Plin, transferencia bancaria y efectivo contra entrega dentro de la ciudad.',
  },
  {
    question: '¿Puedo pedir un arreglo que no está en el catálogo?',
    answer:
      'Claro, para eso está el botón de diseño personalizado. Cuéntanos la ocasión, las flores que te gustan y tu presupuesto, y te enviamos una propuesta con el precio.',
  },
  {
    question: '¿Incluyen tarjeta con dedicatoria?',
    answer:
      'Sí, todos los arreglos llevan tarjeta sin costo. Nos escribes la dedicatoria por WhatsApp y la incluimos en tu pedido.',
  },
  {
    question: '¿Qué pasa si un producto aparece agotado?',
    answer:
      'Significa que esas flores no están disponibles hoy. Toca "Avísame cuando llegue" y te escribimos apenas vuelvan, o te proponemos una alternativa parecida.',
  },
  {
    question: '¿Entregan a otras ciudades?',
    answer:
      'Por el momento no contamos con entregas a otras ciudades: solo entregamos dentro de la ciudad. Esperamos poder llegar a más lugares pronto.',
  },
] as const;
