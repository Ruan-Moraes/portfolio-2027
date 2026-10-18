'use client';

import { useEffect, useState } from 'react';

export function useActiveSection<T extends string>(
  sectionIds: readonly T[],
  defaultSection: T
): T {
  const [activeSection, setActiveSection] = useState<T>(defaultSection);

  useEffect(() => {
    if (
      typeof document === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const visibleSections = new Map<T, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i += 1) {
          const entry = entries[i];

          const id = entry.target.id as T;

          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        }

        for (let i = sectionIds.length - 1; i >= 0; i -= 1) {
          const candidate = sectionIds[i];

          if (visibleSections.has(candidate)) {
            setActiveSection((prev) => (prev === candidate ? prev : candidate));

            return;
          }
        }
      },
      {
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0, 0.25],
      }
    );

    for (let i = 0; i < sectionIds.length; i += 1) {
      const el = document.getElementById(sectionIds[i]);

      if (el) {
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

