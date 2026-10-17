import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  interactive = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 backdrop-blur-xl transition-all duration-300',
        interactive &&
          'hover:-translate-y-1 hover:border-[var(--ui-accent)]/50 hover:shadow-[0_12px_36px_-12px_var(--ui-accent-glow)]',
        glow && 'shadow-[0_0_32px_-8px_var(--ui-accent-glow)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
