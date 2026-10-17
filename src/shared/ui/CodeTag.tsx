import { cn } from '@/shared/lib';

interface CodeTagProps {
  tag: string;
  closing?: boolean;
  selfClosing?: boolean;
  className?: string;
}

export function CodeTag({
  tag,
  closing = false,
  selfClosing = false,
  className,
}: CodeTagProps) {
  const formatted = selfClosing
    ? `<${tag} />`
    : closing
      ? `</${tag}>`
      : `<${tag}>`;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'font-script pointer-events-none inline-block text-lg tracking-wide text-[var(--ui-accent)] opacity-75 select-none',
        className
      )}
    >
      {formatted}
    </span>
  );
}
