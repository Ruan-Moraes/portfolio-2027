'use client';

import { memo, type MouseEvent } from 'react';
import { cn } from '@/shared/lib';

interface AnimatedLettersProps {
  text: string;
  className?: string;
  letterClassName?: string;
  delayOffset?: number;
}

const RUBBER_BAND_CLASSES = ['animate-rubber-band', 'text-[var(--ui-accent)]'];

function AnimatedLettersComponent({
  text,
  className,
  letterClassName,
  delayOffset = 0,
}: AnimatedLettersProps) {
  const handleMouseEnter = (event: MouseEvent<HTMLSpanElement>) => {
    event.currentTarget.classList.add(...RUBBER_BAND_CLASSES);
  };

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLSpanElement>) => {
    event.currentTarget.classList.remove(...RUBBER_BAND_CLASSES);
  };

  return (
    <span aria-label={text} className={cn('inline-block', className)}>
      {Array.from(text).map((char, index) => {
        const isSpace = char === ' ';

        return (
          <span
            key={`${char}-${index}`}
            aria-hidden="true"
            onMouseEnter={isSpace ? undefined : handleMouseEnter}
            onAnimationEnd={isSpace ? undefined : handleAnimationEnd}
            style={{
              animationDelay: `${(index + delayOffset) * 35}ms`,
            }}
            className={cn(
              'inline-block transition-colors duration-200 select-none',
              isSpace ? 'w-[0.3em]' : 'cursor-default hover:text-[var(--ui-accent)]',
              letterClassName
            )}
          >
            {isSpace ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
}

export const AnimatedLetters = memo(AnimatedLettersComponent);
