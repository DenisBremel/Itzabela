import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { SHOP } from '@/constants/shop';
import { cn } from '@/utils/cn';

interface LogoProps {
  /** `inverse` se usa sobre fondos oscuros (footer, hero). */
  tone?: 'default' | 'inverse';
  className?: string;
}

/**
 * Marca de la tienda: flor dibujada en SVG + nombre.
 * Al ser vectorial no pesa nada y se ve nítida en cualquier pantalla.
 * Si algún día tienes un logo definitivo, reemplaza el <svg> por
 * <img src="/images/logo.svg" alt={SHOP.fullName} />.
 */
export function Logo({ tone = 'default', className }: LogoProps): JSX.Element {
  const isInverse = tone === 'inverse';

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5', className)}
      aria-label={`${SHOP.fullName} — ir al inicio`}
    >
      <svg
        viewBox="0 0 40 40"
        width="38"
        height="38"
        aria-hidden="true"
        className="shrink-0"
        fill="none"
      >
        <circle cx="20" cy="20" r="19" className={isInverse ? 'fill-white/10' : 'fill-rose-100'} />
        {/* Pétalos */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="20"
            cy="13"
            rx="4.6"
            ry="6.8"
            transform={`rotate(${angle} 20 20)`}
            className={isInverse ? 'fill-rose-200' : 'fill-rose-500'}
            opacity="0.9"
          />
        ))}
        <circle cx="20" cy="20" r="3.6" className={isInverse ? 'fill-white' : 'fill-cream-100'} />
        <circle
          cx="20"
          cy="20"
          r="1.6"
          className={isInverse ? 'fill-rose-400' : 'fill-rose-700'}
        />
      </svg>

      <span
        className={cn(
          'font-display text-2xl leading-none font-semibold tracking-tight',
          isInverse ? 'text-white' : 'text-stone-900',
        )}
      >
        {SHOP.name}
      </span>
    </Link>
  );
}
