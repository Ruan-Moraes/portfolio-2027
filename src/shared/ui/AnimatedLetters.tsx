'use client';

import {
  memo,
  type AnimationEvent,
  type MouseEvent,
} from 'react';
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
}: AnimatedLettersProps) {
  const handleMouseOver = (event: MouseEvent<HTMLSpanElement>) => {
    const target = event.target as HTMLElement;

    if (target.dataset.char === '1') {
      target.classList.add(...RUBBER_BAND_CLASSES);
    }
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    const target = event.target as HTMLElement;

    if (target.dataset.char === '1') {
      target.classList.remove(...RUBBER_BAND_CLASSES);
    }
  };

  return (
    <span
      aria-label={text}
      onMouseOver={handleMouseOver}
      onAnimationEnd={handleAnimationEnd}
      className={cn('inline-block', className)}
    >
      {Array.from(text).map((char, index) => {
        const isSpace = char === ' ';

        return (
          <span
            key={`${char}-${index}`}
            aria-hidden="true"
            data-char={isSpace ? undefined : '1'}
            className={cn(
              'inline-block transition-colors duration-200 select-none',
              isSpace
                ? 'w-[0.3em]'
                : 'cursor-default hover:text-[var(--ui-accent)]',
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
