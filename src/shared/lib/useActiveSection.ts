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
    let elementsCache: Array<{ id: T; el: HTMLElement }> = [];

    const refreshElements = () => {
      elementsCache = [];
      for (let i = 0; i < sectionIds.length; i += 1) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          elementsCache.push({ id, el });
        }
      }
    };

    const updateActiveSection = () => {
      ticking = false;
      if (elementsCache.length !== sectionIds.length) {
        refreshElements();
      }

      const scrollPosition = window.scrollY + window.innerHeight * 0.32;

      for (let i = elementsCache.length - 1; i >= 0; i -= 1) {
        const { id, el } = elementsCache[i];
        if (el.offsetTop <= scrollPosition) {
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

    refreshElements();
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
