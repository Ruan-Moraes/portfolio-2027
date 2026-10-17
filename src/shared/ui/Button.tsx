import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ui-accent)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' &&
          'bg-[var(--ui-accent)] text-slate-950 shadow-[0_0_24px_-4px_var(--ui-accent-glow)] hover:brightness-110',
        variant === 'secondary' &&
          'border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)]/60 hover:text-[var(--ui-accent)]',
        variant === 'ghost' &&
          'bg-transparent text-[var(--ui-text-secondary)] hover:bg-[var(--ui-surface-elevated)] hover:text-[var(--ui-text-primary)]',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-base font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
