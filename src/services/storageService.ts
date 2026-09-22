import { requireSupabase } from '@/lib/supabase';
import { slugify } from '@/utils/format';

/**
 * ============================================================
 *  SUBIDA DE FOTOS DE PRODUCTO
 * ============================================================
 *  Las fotos viven en Supabase Storage, en un depósito público
 *  llamado `productos`. El depósito se crea junto con la tabla
 *  al ejecutar supabase/schema.sql.
 *
 *  Público significa que cualquiera puede VER la foto (hace
 *  falta: es el catálogo de la tienda), pero solo alguien con
 *  sesión iniciada puede subir, reemplazar o borrar.
 * ============================================================
 */

export const PRODUCT_BUCKET = 'productos';

/** Tamaño máximo aceptado. Por encima, la web cargaría lentísimo. */
const MAX_BYTES = 5 * 1024 * 1024;

/** Traduce el peso a algo legible para el mensaje de error. */
function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Sube una foto y devuelve su dirección pública, lista para
 * guardarla en el campo `imageUrl` del producto.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Ese archivo no es una imagen. Elige un JPG, PNG o WebP.');
  }

  if (file.size > MAX_BYTES) {
    throw new Error(
      `La foto pesa ${formatSize(file.size)} y el máximo son 5 MB. ` +
        'Redúcela antes de subirla.',
    );
  }

  const client = requireSupabase();

  // Nombre limpio y único: sin tildes ni espacios (rompen las URLs)
  // y con la fecha en milisegundos para no pisar una foto anterior.
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'foto';
  const path = `${base}-${Date.now()}.${extension}`;

  const { error } = await client.storage.from(PRODUCT_BUCKET).upload(path, file, {
    contentType: file.type,
    // Un año de caché: la foto nunca cambia, cada subida tiene nombre nuevo.
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    if (/bucket/i.test(error.message)) {
      throw new Error(
        `Falta el depósito "${PRODUCT_BUCKET}" en Supabase. Créalo en Storage → ` +
          'New bucket, con el nombre exacto y marcado como Public.',
      );
    }

    // Postgres rechaza la escritura: el depósito existe pero le faltan
    // las políticas de subida. Ver supabase/schema.sql, apartado de fotos.
    if (/row-level security|policy|fila/i.test(error.message)) {
      throw new Error(
        `El depósito "${PRODUCT_BUCKET}" no permite subir archivos. En Supabase, ` +
          'Storage → productos → Policies, crea una política de INSERT para el rol ' +
          "authenticated con la expresión bucket_id = 'productos'. " +
          'El SQL está en supabase/schema.sql.',
      );
    }

    throw new Error(error.message);
  }

  const { data } = client.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Borra del almacén una foto subida por error.
 *
 * Solo actúa sobre direcciones de nuestro propio depósito: si le pasas
 * un enlace externo no hace nada. Tampoco lanza error si falla, porque
 * quitar la foto del formulario debe funcionar igual.
 */
export async function deleteProductImage(publicUrl: string): Promise<void> {
  const marker = `/object/public/${PRODUCT_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return;

  const path = decodeURIComponent(publicUrl.slice(index + marker.length));
  if (!path) return;

  try {
    await requireSupabase().storage.from(PRODUCT_BUCKET).remove([path]);
  } catch {
    // Quedará un archivo huérfano en el depósito; no es motivo para
    // interrumpir a quien está editando el producto.
  }
}
