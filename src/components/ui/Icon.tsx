import type { JSX, SVGProps } from 'react';
import { cn } from '@/utils/cn';

/**
 * ============================================================
 *  ICONOGRAFÍA
 * ============================================================
 *  Iconos SVG en línea, sin librerías externas:
 *   - Cero peticiones de red y cero JavaScript adicional.
 *   - Heredan el color del texto (currentColor).
 *   - Trazo uniforme y estilo coherente en todo el sitio.
 *
 *  Para añadir uno: agrega una entrada a ICONS y queda
 *  disponible con tipado automático en toda la aplicación.
 * ============================================================
 */

const ICONS = {
  flower: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8c0-2 .9-3.8 2.2-3.8S16.4 7.4 15.5 9c-.4.7-1.1 1.2-1.9 1.4" />
      <path d="M12 9.8c0-2-.9-3.8-2.2-3.8S7.6 7.4 8.5 9c.4.7 1.1 1.2 1.9 1.4" />
      <path d="M14.2 12c2 0 3.8.9 3.8 2.2s-1.4 2.2-3 1.3c-.7-.4-1.2-1.1-1.4-1.9" />
      <path d="M9.8 12c-2 0-3.8.9-3.8 2.2s1.4 2.2 3 1.3c.7-.4 1.2-1.1 1.4-1.9" />
      <path d="M12 14.2V21" />
      <path d="M12 18.5c1.8 0 3.2-1 3.6-2.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M4.5 19.5c-1.5-6 2.5-12 11-13 1 6.5-2.5 12.5-8.5 13.5a4 4 0 0 1-2.5-.5Z" />
      <path d="M9 15c1.5-2.5 3.5-4.5 6.5-6" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />,
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11.5" rx="2" />
      <path d="M3 9h18M12 9v11.5" />
      <path d="M12 9S9 3.5 6.8 5c-1.8 1.2-.6 4 5.2 4Z" />
      <path d="M12 9s3-5.5 5.2-4c1.8 1.2.6 4-5.2 4Z" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 16V6.5A1.5 1.5 0 0 1 4 5h9.5v11" />
      <path d="M13.5 9H17l3.5 3.5V16" />
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
      <path d="M9 17.5h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8.5 3v4M15.5 3v4" />
    </>
  ),
  sparkles: (
    <>
      <path d="m11 3 1.5 4.2L16.7 9l-4.2 1.5L11 14.7 9.5 10.5 5.3 9l4.2-1.5L11 3Z" />
      <path d="m17.5 14.5.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" />
    </>
  ),
  star: (
    <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.6Z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  'arrow-right': (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 7.5 8.2 5.8 8.2-5.8" />
    </>
  ),
  phone: (
    <path d="M6.6 3.2H4.9A1.9 1.9 0 0 0 3 5.3C3 13.4 9.9 20.3 18 20.3a1.9 1.9 0 0 0 1.9-1.9v-1.7a1.6 1.6 0 0 0-1.3-1.6l-2.5-.5a1.6 1.6 0 0 0-1.6.7l-.6.9a12.5 12.5 0 0 1-5.3-5.3l.9-.6a1.6 1.6 0 0 0 .7-1.6l-.5-2.5a1.6 1.6 0 0 0-1.1-1Z" />
  ),
  location: (
    <>
      <path d="M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.2a4 4 0 0 1 8 0V10" />
    </>
  ),
  logout: (
    <>
      <path d="M14.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h7a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
      <path d="M10 12h10m0 0-3-3m3 3-3 3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 15.5v3A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v12" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 15.5v3A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
      <path d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
      <path d="M10.5 10v6.5M13.5 10v6.5" />
    </>
  ),
  edit: (
    <>
      <path d="M4.5 19.5h4l9-9a2.1 2.1 0 0 0-3-3l-9 9v3Z" />
      <path d="m14 7.5 2.5 2.5" />
    </>
  ),
  save: (
    <>
      <path d="M4.5 6a1.5 1.5 0 0 1 1.5-1.5h9.5L19.5 8.6V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V6Z" />
      <path d="M8 4.5v5h7v-5M8 19.5v-5h8v5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M4 4.5 20 20.5" />
      <path d="M9.9 6.1A8.9 8.9 0 0 1 12 5.9c6 0 9.5 6.1 9.5 6.1a17 17 0 0 1-3.3 3.9" />
      <path d="M6.4 8.1A16.6 16.6 0 0 0 2.5 12s3.5 6.1 9.5 6.1a9.4 9.4 0 0 0 3.4-.6" />
      <path d="M10.3 10.4a2.4 2.4 0 0 0 3.3 3.4" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8.5 4.3v9.4L12 21l-8.5-4.3V7.3L12 3Z" />
      <path d="M3.7 7.4 12 11.6l8.3-4.2M12 11.6V21" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v4.7M12 16.1h.01" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M16.9 7.1h.01" />
    </>
  ),
  facebook: (
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.8c0-.9.3-1.5 1.6-1.5H17V4.6A20 20 0 0 0 14.8 4.5c-2.3 0-3.8 1.4-3.8 3.9v2.1H8.5v3H11V21h2.5Z" />
  ),
  tiktok: (
    <path d="M14.2 3.5v9.9a2.8 2.8 0 1 1-2.4-2.8v2.6a.9.9 0 1 0 .9.9V3.5h1.5c.3 1.8 1.6 3.1 3.4 3.3v2.4a5.7 5.7 0 0 1-3.4-1.2" />
  ),
  whatsapp: null, // Se dibuja con relleno, ver más abajo
} as const;

export type IconName = keyof typeof ICONS;

const WHATSAPP_PATH =
  'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.21-8.22 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43l-.47-.01c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z';

/** Iconos que se dibujan con relleno en lugar de trazo. */
const FILLED: readonly IconName[] = ['whatsapp', 'heart', 'star', 'facebook', 'tiktok'];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** Tamaño en píxeles (ancho y alto). Por defecto 24. */
  size?: number;
}

export function Icon({ name, size = 24, className, ...props }: IconProps): JSX.Element {
  const isFilled = FILLED.includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={isFilled ? undefined : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
      {...props}
    >
      {name === 'whatsapp' ? <path d={WHATSAPP_PATH} /> : ICONS[name]}
    </svg>
  );
}
