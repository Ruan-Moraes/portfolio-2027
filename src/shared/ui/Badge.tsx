import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'outline';
}

export function Badge({
  children,
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
        variant === 'default' &&
          'border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] text-[var(--ui-text-secondary)]',
        variant === 'accent' &&
          'border border-[var(--ui-accent)]/40 bg-[var(--ui-accent)]/12 text-[var(--ui-accent)]',
        variant === 'outline' &&
          'border border-[var(--ui-border)] bg-transparent text-[var(--ui-text-muted)] hover:border-[var(--ui-accent)]/50 hover:text-[var(--ui-text-primary)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
