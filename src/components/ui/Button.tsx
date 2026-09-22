import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-rose-700 text-white shadow-card hover:bg-rose-800 hover:shadow-card-hover active:bg-rose-900 focus-visible:outline-rose-800',
  secondary:
    'bg-white text-rose-800 ring-1 ring-rose-200 shadow-card hover:bg-rose-50 hover:ring-rose-300 focus-visible:outline-rose-600',
  whatsapp:
    'bg-[#25D366] text-white shadow-card hover:bg-[#1EBE5A] active:bg-[#17a34a] focus-visible:outline-[#128C7E]',
  outline:
    'border border-white/35 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:outline-white',
  ghost: 'text-rose-700 hover:bg-rose-50 focus-visible:outline-rose-600',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-[0.95rem]',
  lg: 'px-6 py-3.5 text-base',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Ruta interna (react-router) */
  to?: string;
  /** URL externa (se abre en pestaña nueva con rel seguro) */
  href?: string;
  /** Ocupa todo el ancho disponible */
  fullWidth?: boolean;
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

/**
 * Botón unificado del sitio. Renderiza <button>, <a> o <Link>
 * según las props recibidas, manteniendo siempre el mismo estilo.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  to,
  href,
  fullWidth,
  ...props
}: ButtonProps): JSX.Element {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);

  if (href) {
    const isExternal = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
