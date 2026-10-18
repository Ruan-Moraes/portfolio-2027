'use client';

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';

interface UseElementVisibilityOptions {
  rootMargin?: string;
  threshold?: number;
}

function subscribePageVisibility(onStoreChange: () => void): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  document.addEventListener('visibilitychange', onStoreChange);

  return () => document.removeEventListener('visibilitychange', onStoreChange);
}

function getPageVisibilitySnapshot(): boolean {
  if (typeof document === 'undefined') return true;

  return document.visibilityState === 'visible';
}

function getServerVisibilitySnapshot(): boolean {
  return true;
}

export function useElementVisibility(
  elementRef: RefObject<HTMLElement | null>,
  options?: UseElementVisibilityOptions
): boolean {
  const rootMargin = options?.rootMargin ?? '120px';

  const threshold = options?.threshold ?? 0.01;

  const [isIntersecting, setIsIntersecting] = useState(true);

  const isPageVisible = useSyncExternalStore(
    subscribePageVisibility,
    getPageVisibilitySnapshot,
    getServerVisibilitySnapshot
  );

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

  return isIntersecting && isPageVisible;
}

