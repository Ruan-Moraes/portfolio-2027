'use client';

import { useEffect, useState, type RefObject } from 'react';

interface UseElementVisibilityOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Tracks whether a DOM element is currently intersecting the viewport AND
 * the browser tab is visible (`document.visibilityState === 'visible'`).
 * Ideal for pausing expensive WebGL / Canvas / requestAnimationFrame loops off-screen.
 */
export function useElementVisibility(
  elementRef: RefObject<HTMLElement | null>,
  options?: UseElementVisibilityOptions
): boolean {
  const rootMargin = options?.rootMargin ?? '120px';
  const threshold = options?.threshold ?? 0.01;

  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, rootMargin, threshold]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isIntersecting && isPageVisible;
}
