import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

function ButtonComponent({
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
          'border border-transparent bg-[var(--ui-accent)] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] shadow-[0_0_24px_-4px_var(--ui-accent-glow)] hover:brightness-110',
        variant === 'secondary' &&
          'border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] text-[var(--ui-text-primary)] hover:border-[var(--ui-accent)]/60 hover:text-[var(--ui-accent)]',
        variant === 'ghost' &&
          'border border-[var(--ui-border)]/70 bg-[var(--ui-surface)]/60 text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)]/50 hover:bg-[var(--ui-surface-elevated)] hover:text-[var(--ui-text-primary)]',
        size === 'sm' && 'h-9 px-3 text-xs',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'lg' && 'h-12 px-6 text-base font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);

