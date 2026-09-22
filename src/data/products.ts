import type { Product } from '@/types/product';

/**
 * ============================================================
 *  CATÁLOGO DE EJEMPLO
 * ============================================================
 *  Estos productos se usan en dos casos:
 *   1. Mientras Supabase no esté configurado, para que la web
 *      funcione desde el primer `bun dev`.
 *   2. Como semilla: el panel de administración los copia a
 *      Supabase con un clic ("Importar catálogo de ejemplo").
 *
 *  Las fotos son de Unsplash (uso libre) y están puestas como
 *  relleno. Cuando tengas las fotos reales de la tienda, súbelas
 *  a /public/images/productos y cambia `imageUrl` por
 *  "/images/productos/tu-foto.jpg".
 * ============================================================
 */

/** Construye la URL de una foto de Unsplash con el recorte correcto. */
const photo = (id: string): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const SEED_PRODUCTS: readonly Product[] = [
  {
    id: 'ramo-12-rosas-rojas',
    name: 'Ramo de 12 rosas rojas',
    description: 'El clásico que nunca falla. Doce rosas frescas con follaje y papel coreano.',
    price: 129,
    imageUrl: photo('photo-1494972308805-463bc619d34e'),
    category: 'ramos',
    stock: 8,
    featured: true,
    active: true,
    sortOrder: 1,
  },
  {
    id: 'ramo-tulipanes',
    name: 'Ramo primaveral de tulipanes',
    description: 'Quince tulipanes de temporada en tonos pastel, envueltos a mano.',
    price: 149,
    imageUrl: photo('photo-1561181286-d3fee7d55364'),
    category: 'ramos',
    stock: 5,
    featured: true,
    active: true,
    sortOrder: 2,
  },
  {
    id: 'bouquet-girasoles',
    name: 'Bouquet de girasoles',
    description: 'Seis girasoles grandes con gypsophila. Alegría instantánea.',
    price: 99,
    imageUrl: photo('photo-1470509037663-253afd7f0f51'),
    category: 'ramos',
    // Dejamos dos productos agotados a propósito para que veas el cartel.
    stock: 0,
    featured: false,
    active: true,
    sortOrder: 3,
  },
  {
    id: 'caja-rosas-premium',
    name: 'Caja premium de rosas',
    description: 'Veinticinco rosas en caja de sombrero, con tarjeta dedicada incluida.',
    price: 189,
    imageUrl: photo('photo-1596438459194-f275f413d6ff'),
    category: 'cajas',
    stock: 3,
    featured: true,
    active: true,
    sortOrder: 4,
  },
  {
    id: 'caja-corazon',
    name: 'Corazón de flores',
    description: 'Arreglo en forma de corazón con rosas y flores de temporada.',
    price: 159,
    imageUrl: photo('photo-1526047932273-341f2a7631f9'),
    category: 'cajas',
    stock: 4,
    featured: false,
    active: true,
    sortOrder: 5,
  },
  {
    id: 'arreglo-peonias',
    name: 'Arreglo de peonías',
    description: 'Peonías importadas en base de cerámica. Edición limitada por temporada.',
    price: 219,
    imageUrl: photo('photo-1464982326199-86f32f81b211'),
    category: 'arreglos',
    stock: 2,
    featured: true,
    active: true,
    sortOrder: 6,
  },
  {
    id: 'arreglo-jarron-blanco',
    name: 'Arreglo en jarrón blanco',
    description: 'Mezcla de flores blancas y durazno en jarrón de vidrio. Ideal para oficina.',
    price: 175,
    imageUrl: photo('photo-1563241527-3004b7be0ffd'),
    category: 'arreglos',
    stock: 6,
    featured: false,
    active: true,
    sortOrder: 7,
  },
  {
    id: 'lirios-florero',
    name: 'Lirios en florero',
    description: 'Lirios aromáticos con follaje fresco, listos para poner sobre la mesa.',
    price: 139,
    imageUrl: photo('photo-1502977249166-824b3a8a4d6d'),
    category: 'arreglos',
    stock: 7,
    featured: false,
    active: true,
    sortOrder: 8,
  },
  {
    id: 'flores-de-campo',
    name: 'Ramo de flores de campo',
    description: 'Amapolas y flores silvestres de estación. Rústico, colorido y abundante.',
    price: 165,
    imageUrl: photo('photo-1444930694458-01babf71870c'),
    category: 'ramos',
    stock: 0,
    featured: false,
    active: true,
    sortOrder: 9,
  },
  {
    id: 'ramo-pastel',
    name: 'Ramo en tonos pastel',
    description: 'Rosas rosadas y crema con eucalipto. El más pedido para cumpleaños.',
    price: 145,
    imageUrl: photo('photo-1591886960571-74d43a9d4166'),
    category: 'ramos',
    stock: 4,
    featured: true,
    active: true,
    sortOrder: 10,
  },
  {
    id: 'suculenta-ceramica',
    name: 'Suculenta en maceta de cerámica',
    description: 'Planta viva de bajo mantenimiento. Un regalo práctico que dura años.',
    price: 69,
    imageUrl: photo('photo-1485955900006-10f4d324d411'),
    category: 'plantas',
    stock: 12,
    featured: false,
    active: true,
    sortOrder: 11,
  },
  {
    id: 'plantas-interior',
    name: 'Trío de plantas de interior',
    description: 'Tres plantas verdes con sus macetas, listas para decorar una repisa.',
    price: 199,
    imageUrl: photo('photo-1534349762230-e0cadf78f5da'),
    category: 'plantas',
    stock: 5,
    featured: true,
    active: true,
    sortOrder: 12,
  },
] as const;
