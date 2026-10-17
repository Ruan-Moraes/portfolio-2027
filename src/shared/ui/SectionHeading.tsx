import { AnimatedLetters } from './AnimatedLetters';
import { CodeTag } from './CodeTag';
import { cn } from '@/shared/lib';

interface SectionHeadingProps {
  tag: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  tag,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 space-y-2', className)}>
      <div className="flex items-center gap-2">
        <CodeTag tag={tag} />
        <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-[var(--ui-accent)]/50 to-transparent" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-[var(--ui-text-primary)] sm:text-4xl lg:text-5xl">
        <AnimatedLetters text={title} />
      </h2>
      {subtitle && (
        <p className="max-w-3xl text-base text-[var(--ui-text-secondary)] sm:text-lg">
          {subtitle}
        </p>
      )}
      <CodeTag tag={tag} closing />
    </div>
  );
}
