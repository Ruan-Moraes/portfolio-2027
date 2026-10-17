'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib';

interface AnimatedLettersProps {
  text: string;
  className?: string;
  letterClassName?: string;
  delayOffset?: number;
}

export function AnimatedLetters({
  text,
  className,
  letterClassName,
  delayOffset = 0,
}: AnimatedLettersProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <span aria-label={text} className={cn('inline-block', className)}>
      {Array.from(text).map((char, index) => {
        const isSpace = char === ' ';
        const isHovered = hoveredIndex === index;

        return (
          <span
            key={`${char}-${index}`}
            aria-hidden="true"
            onMouseEnter={() => setHoveredIndex(index)}
            onAnimationEnd={() => setHoveredIndex(null)}
            style={{
              animationDelay: `${(index + delayOffset) * 35}ms`,
            }}
            className={cn(
              'inline-block transition-colors duration-200 select-none',
              isSpace ? 'w-[0.3em]' : 'cursor-default hover:text-[var(--ui-accent)]',
              isHovered && 'animate-rubber-band text-[var(--ui-accent)]',
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
