'use client';

import { useEffect, useState } from 'react';

export function useActiveSection<T extends string>(
  sectionIds: readonly T[],
  defaultSection: T
): T {
  const [activeSection, setActiveSection] = useState<T>(defaultSection);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      const scrollPosition = window.scrollY + window.innerHeight * 0.32;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection((prev) => (prev === id ? prev : id));
          break;
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [sectionIds]);

  return activeSection;
}
