import { SHOP } from '@/constants/shop';
import { formatPrice } from '@/utils/format';
import { isAvailable, type Product } from '@/types/product';

/**
 * ============================================================
 *  CATÁLOGO EN PDF
 * ============================================================
 *  Genera un catálogo para mandar por WhatsApp o imprimir.
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
const MARGIN = 15;
const FOOTER_SPACE = 14;
const ROW_GAP = 8;
const IMAGE_TEXT_GAP = 10;

/**
 * Cuántos productos entran en cada hoja.
 * Todo el diseño se recalcula a partir de este número: cambiándolo,
 * las fotos y el espacio del texto se ajustan solos.
 */
const PRODUCTS_PER_PAGE = 3;

const CONTENT_WIDTH = PAGE.width - MARGIN * 2;

/** Altura de la línea que separa el pie. Se usa al dibujarlo y al medir. */
const FOOTER_LINE_Y = PAGE.height - FOOTER_SPACE - 5;

/**
 * Hasta dónde puede llegar la última foto. Deja aire sobre la línea del
 * pie: sin este margen, la tercera imagen la tocaba y quedaba sucio.
 */
const CONTENT_BOTTOM = FOOTER_LINE_Y - 8;

const AREA_HEIGHT = CONTENT_BOTTOM - MARGIN;
const ROW_HEIGHT = (AREA_HEIGHT - ROW_GAP * (PRODUCTS_PER_PAGE - 1)) / PRODUCTS_PER_PAGE;

/** La foto conserva el 4:5 vertical de las tarjetas de la web. */
const IMAGE_HEIGHT = ROW_HEIGHT;
const IMAGE_WIDTH = IMAGE_HEIGHT * 0.8;
const TEXT_X = MARGIN + IMAGE_WIDTH + IMAGE_TEXT_GAP;
const TEXT_WIDTH = CONTENT_WIDTH - IMAGE_WIDTH - IMAGE_TEXT_GAP;

/** Renglones de descripción que caben en una fila sin pisar el precio. */
const MAX_DESCRIPTION_LINES = 4;

/** Ancho en píxeles al que se reducen las fotos. Pensado para imprimir. */
const IMAGE_PIXEL_WIDTH = 760;

/** Colores de marca, en RGB. */
const ROSE = [178, 58, 107] as const;
const STONE = [68, 64, 60] as const;
const GREY = [120, 113, 108] as const;
const FRAME = [222, 188, 175] as const;

interface EmbeddedImage {
  dataUrl: string;
  format: 'JPEG';
}

/**
 * Descarga una imagen y la deja lista para el PDF: recortada a la
 * proporción pedida y reducida de tamaño.
 *
 * Devuelve null si la foto no se puede cargar (enlace roto, permisos):
 * un producto sin foto no debe impedir generar el catálogo entero.
 */
async function embedImage(url: string, targetRatio: number): Promise<EmbeddedImage | null> {
  return new Promise((resolve) => {
    const image = new Image();
    // Sin esto el navegador "mancha" el lienzo y no deja exportarlo.
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      try {
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

        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.75), format: 'JPEG' });
      } catch {
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
    image.src = url;
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
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    compress: true,
    // No arrastra al archivo las tipografías que no se llegan a usar.
    putOnlyUsedFonts: true,
  });


  // El logo es opcional: si no está el archivo, la portada usa solo texto.
  const logo = await embedImage('/images/logo.webp', 1);
  const images = await Promise.all(
    visible.map((product) => embedImage(product.imageUrl, IMAGE_WIDTH / IMAGE_HEIGHT)),
  );

  const center = PAGE.width / 2;

  // ============ Hoja 1: solo la portada ============
  // Marco doble, como el de un diploma: acompaña al sello dorado del
  // logo sin competir con él.
  doc.setDrawColor(...FRAME);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, PAGE.width - 20, PAGE.height - 20, 'S');
  doc.setLineWidth(0.4);
  doc.rect(13.5, 13.5, PAGE.width - 27, PAGE.height - 27, 'S');
  doc.setLineWidth(0.2);

  if (logo) {
    const size = 88;
    doc.addImage(logo.dataUrl, logo.format, center - size / 2, 32, size, size);
  }

  // Serif en negrita y con las letras separadas: se lee de un vistazo y
  // acompaña al sello dorado del logo. Una caligráfica en mayúsculas
  // quedaba preciosa de lejos e ilegible de cerca.
  doc.setTextColor(...ROSE);
  doc.setFont('times', 'bold');
  doc.setFontSize(50);
  doc.setCharSpace(1.2);
  doc.text(SHOP.fullName.toUpperCase(), center, logo ? 146 : 124, { align: 'center' });
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(...STONE);
  doc.text('Flores eternas hechas a mano', center, logo ? 158 : 134, { align: 'center' });

  // Filete corto para separar la marca de los datos de contacto.
  const dividerY = logo ? 170 : 146;
  doc.setDrawColor(...FRAME);
  doc.setLineWidth(0.6);
  doc.line(center - 32, dividerY, center + 32, dividerY);
  doc.setLineWidth(0.2);

  doc.setFontSize(15);
  doc.setTextColor(...STONE);
  doc.text(`WhatsApp ${SHOP.phoneDisplay}`, center, dividerY + 14, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(...GREY);
  doc.text(SHOP.siteUrl, center, dividerY + 23, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(...GREY);
  doc.text('Tingo María', center, PAGE.height - 34, { align: 'center' });

  // ============ Hojas siguientes: los productos ============
  let row = 0;

  visible.forEach((product, index) => {
    if (row === 0) doc.addPage();

    const top = MARGIN + row * (ROW_HEIGHT + ROW_GAP);
    const picture = images[index];

    // Zigzag: la foto va a la izquierda, a la derecha, a la izquierda...
    // La vista rebota de un lado a otro y la hoja deja de parecer una
    // lista para parecer un catálogo.
    const mirrored = row % 2 === 1;
    const imageX = mirrored ? MARGIN + TEXT_WIDTH + IMAGE_TEXT_GAP : MARGIN;
    const textX = mirrored ? MARGIN : TEXT_X;

    // --- Foto grande, con marco ---
    if (picture) {
      doc.addImage(picture.dataUrl, picture.format, imageX, top, IMAGE_WIDTH, IMAGE_HEIGHT);

      // El marco va 1,5 mm por fuera: enmarca sin comerse ni un píxel
      // de la foto, como el pase de un cuadro.
      doc.setDrawColor(...FRAME);
      doc.setLineWidth(0.7);
      doc.rect(imageX - 1.5, top - 1.5, IMAGE_WIDTH + 3, IMAGE_HEIGHT + 3, 'S');
      doc.setLineWidth(0.2);
    } else {
      doc.setFillColor(250, 240, 236);
      doc.rect(imageX, top, IMAGE_WIDTH, IMAGE_HEIGHT, 'F');
      doc.setFontSize(10);
      doc.setTextColor(...GREY);
      doc.text('Sin foto', imageX + IMAGE_WIDTH / 2, top + IMAGE_HEIGHT / 2, { align: 'center' });
    }

    // --- Texto al otro lado ---
    let textY = top + 9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...STONE);
    const nameLines = doc.splitTextToSize(product.name, TEXT_WIDTH).slice(0, 2);
    doc.text(nameLines, textX, textY);
    textY += nameLines.length * 8.8;

    if (product.description) {
      // Serif y en gris oscuro: la Helvetica clara se perdía sobre el
      // papel blanco, sobre todo impresa.
      doc.setFont('times', 'normal');
      doc.setFontSize(17);
      doc.setTextColor(...STONE);

      // Los saltos de línea que escribes en el panel se respetan aquí:
      // cada renglón se parte por separado y luego se ajusta al ancho.
      // En la web siguen colapsando, que es como debe verse una tarjeta.
      const descriptionLines = product.description
        .split(/\r?\n/)
        .flatMap((line) =>
          line.trim() === '' ? [''] : (doc.splitTextToSize(line, TEXT_WIDTH) as string[]),
        )
        .slice(0, MAX_DESCRIPTION_LINES);

      textY += 3;
      doc.text(descriptionLines, textX, textY);
      textY += descriptionLines.length * 7.4;
    }

    textY += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...ROSE);
    doc.text(formatPrice(product.price), textX, textY);

    row = (row + 1) % PRODUCTS_PER_PAGE;
  });

  // ============ Pies de página (la portada no lleva) ============
  const total = doc.getNumberOfPages();
  for (let page = 2; page <= total; page += 1) {
    doc.setPage(page);

    const y = PAGE.height - FOOTER_SPACE;
    doc.setDrawColor(238, 215, 205);
    doc.line(MARGIN, FOOTER_LINE_Y, PAGE.width - MARGIN, FOOTER_LINE_Y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text(`${SHOP.fullName} · WhatsApp ${SHOP.phoneDisplay}`, MARGIN, y);
    doc.text(`${page - 1} / ${total - 1}`, PAGE.width - MARGIN, y, { align: 'right' });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`catalogo-${SHOP.fullName.toLowerCase()}-${stamp}.pdf`);

  return visible.length;
}
