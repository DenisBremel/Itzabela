import type { JSX } from 'react';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  /** Texto pequeño sobre el título */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  /** Nivel semántico (mantener un solo <h1> por página) */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  tone?: 'light' | 'dark';
}

/** Encabezado reutilizable de sección: eyebrow + título + bajada. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  as: Tag = 'h2',
  className,
  tone = 'light',
}: SectionHeadingProps): JSX.Element {
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'reveal max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-sm font-semibold tracking-[0.18em] uppercase',
            isDark ? 'text-rose-200' : 'text-rose-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          'text-4xl leading-tight font-semibold tracking-tight sm:text-5xl',
          isDark && 'text-white',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed',
            isDark ? 'text-rose-100' : 'text-stone-600',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
