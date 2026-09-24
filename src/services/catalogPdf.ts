import { SHOP } from '@/constants/shop';
import { formatPrice } from '@/utils/format';
import { isAvailable, type Product } from '@/types/product';

/**
 * ============================================================
 *  CATÁLOGO EN PDF
 * ============================================================
 *  Genera un PDF con fotos y precios para mandar por WhatsApp.
 *
 *  Las fotos van INCRUSTADAS dentro del archivo, no enlazadas:
 *  quien lo reciba puede abrirlo sin internet, que es justo para
 *  lo que sirve.
 *
 *  La librería se carga solo al pulsar el botón (import dinámico).
 *  Quien nunca descarga el catálogo no paga ese peso.
 * ============================================================
 */

// --- Medidas de la hoja, en milímetros -----------------------
const PAGE = { width: 210, height: 297 };
const MARGIN = 12;
const COLUMNS = 2;
const COLUMN_GAP = 8;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;
const CARD_WIDTH = (CONTENT_WIDTH - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS;
const IMAGE_HEIGHT = 60;
const CARD_HEIGHT = 88;
const FOOTER_HEIGHT = 12;

/** Ancho en píxeles al que se reducen las fotos antes de incrustarlas. */
const IMAGE_PIXEL_WIDTH = 620;

/** Colores de marca, en RGB. */
const ROSE = [178, 58, 107] as const;
const STONE = [68, 64, 60] as const;
const GREY = [120, 113, 108] as const;

interface EmbeddedImage {
  dataUrl: string;
  format: 'JPEG';
}

/**
 * Descarga una foto y la deja lista para el PDF: recortada a la
 * proporción de la tarjeta y reducida de tamaño.
 *
 * Devuelve null si la foto no se puede cargar (enlace roto, permisos):
 * un producto sin foto no debe impedir generar el catálogo entero.
 */
async function embedImage(url: string): Promise<EmbeddedImage | null> {
  return new Promise((resolve) => {
    const image = new Image();
    // Sin esto el navegador "mancha" el lienzo y no deja exportarlo.
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      try {
        const targetRatio = CARD_WIDTH / IMAGE_HEIGHT;
        const width = IMAGE_PIXEL_WIDTH;
        const height = Math.round(width / targetRatio);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) return resolve(null);

        // Recorte centrado, igual que `object-cover` en la web.
        const sourceRatio = image.width / image.height;
        let sx = 0;
        let sy = 0;
        let sw = image.width;
        let sh = image.height;

        if (sourceRatio > targetRatio) {
          sw = image.height * targetRatio;
          sx = (image.width - sw) / 2;
        } else {
          sh = image.width / targetRatio;
          sy = (image.height - sh) / 2;
        }

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);

        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.72), format: 'JPEG' });
      } catch {
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
    image.src = url;
  });
}

/** Fecha en formato legible: "24 de septiembre de 2026". */
function today(): string {
  return new Date().toLocaleDateString(SHOP.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Arma el catálogo y lo descarga.
 * Solo incluye productos visibles y con stock: el archivo va a
 * circular durante semanas y no conviene ofrecer lo que no hay.
 */
export async function downloadCatalogPdf(products: Product[]): Promise<number> {
  const visible = products
    .filter(isAvailable)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (visible.length === 0) {
    throw new Error('No hay productos disponibles para armar el catálogo.');
  }

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

  // El logo es opcional: si no está el archivo, la portada usa solo texto.
  const logo = await embedImage('/images/logo.png');
  const images = await Promise.all(visible.map((product) => embedImage(product.imageUrl)));

  /** Pie de página: a quién escribir, en cada hoja. */
  const drawFooter = (page: number, total: number): void => {
    const y = PAGE.height - FOOTER_HEIGHT;
    doc.setDrawColor(238, 215, 205);
    doc.line(MARGIN, y - 4, PAGE.width - MARGIN, y - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(`Pedidos por WhatsApp ${SHOP.phoneDisplay} · ${SHOP.deliveryArea}`, MARGIN, y);
    doc.text(`${page} / ${total}`, PAGE.width - MARGIN, y, { align: 'right' });
  };

  // ---------- Portada de la primera página ----------
  let cursorY = MARGIN;

  if (logo) {
    doc.addImage(logo.dataUrl, logo.format, MARGIN, cursorY, 26, 26 / (CARD_WIDTH / IMAGE_HEIGHT));
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...ROSE);
  doc.text(SHOP.fullName, logo ? MARGIN + 32 : MARGIN, cursorY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...STONE);
  doc.text('Flores eternas hechas a mano', logo ? MARGIN + 32 : MARGIN, cursorY + 17);

  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text(
    `WhatsApp ${SHOP.phoneDisplay} · ${SHOP.siteUrl.replace(/^https?:\/\//, '')}`,
    logo ? MARGIN + 32 : MARGIN,
    cursorY + 23,
  );
  doc.text(`Catálogo del ${today()}`, PAGE.width - MARGIN, cursorY + 23, { align: 'right' });

  cursorY += 32;
  doc.setDrawColor(238, 215, 205);
  doc.line(MARGIN, cursorY, PAGE.width - MARGIN, cursorY);
  cursorY += 8;

  // ---------- Los productos ----------
  let column = 0;

  visible.forEach((product, index) => {
    // ¿Cabe otra fila en esta hoja?
    if (column === 0 && cursorY + CARD_HEIGHT > PAGE.height - FOOTER_HEIGHT - 6) {
      doc.addPage();
      cursorY = MARGIN;
    }

    const x = MARGIN + column * (CARD_WIDTH + COLUMN_GAP);
    const picture = images[index];

    if (picture) {
      doc.addImage(picture.dataUrl, picture.format, x, cursorY, CARD_WIDTH, IMAGE_HEIGHT);
    } else {
      // Hueco discreto en vez de un salto raro en la maqueta.
      doc.setFillColor(250, 240, 236);
      doc.rect(x, cursorY, CARD_WIDTH, IMAGE_HEIGHT, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...GREY);
      doc.text('Sin foto', x + CARD_WIDTH / 2, cursorY + IMAGE_HEIGHT / 2, { align: 'center' });
    }

    let textY = cursorY + IMAGE_HEIGHT + 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...STONE);
    // Solo dos líneas de nombre: más desbordaría la tarjeta.
    doc.text(doc.splitTextToSize(product.name, CARD_WIDTH).slice(0, 2), x, textY);

    textY += product.name.length > 34 ? 10 : 5;

    if (product.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...GREY);
      doc.text(doc.splitTextToSize(product.description, CARD_WIDTH).slice(0, 2), x, textY);
      textY += 8;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...ROSE);
    doc.text(formatPrice(product.price), x, cursorY + CARD_HEIGHT - 3);

    column += 1;
    if (column === COLUMNS) {
      column = 0;
      cursorY += CARD_HEIGHT;
    }
  });

  // ---------- Pies, cuando ya se sabe cuántas hojas hay ----------
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page += 1) {
    doc.setPage(page);
    drawFooter(page, total);
  }

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`catalogo-${SHOP.fullName.toLowerCase()}-${stamp}.pdf`);

  return visible.length;
}
