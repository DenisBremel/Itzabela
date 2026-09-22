import type { JSX, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Ancho máximo del contenido. */
  width?: 'default' | 'narrow';
}

/** Contenedor centrado con los márgenes laterales estándar del sitio. */
export function Container({ children, className, width = 'default' }: ContainerProps): JSX.Element {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-6 lg:px-8',
        width === 'narrow' ? 'max-w-3xl' : 'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
