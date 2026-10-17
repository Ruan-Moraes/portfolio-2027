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
      <div className="ml-8 flex items-center gap-2 sm:ml-10">
        <CodeTag tag={tag} />
        <span className="h-px max-w-24 flex-1 bg-gradient-to-r from-[var(--ui-accent)]/50 to-transparent" />
      </div>
      <div className="pl-12 sm:pl-14 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--ui-text-primary)] sm:text-4xl lg:text-5xl">
          <AnimatedLetters text={title} />
        </h2>
        {subtitle && (
          <p className="max-w-3xl text-base text-[var(--ui-text-secondary)] sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      <CodeTag tag={tag} closing className="ml-8 sm:ml-10" />
    </div>
  );
}
