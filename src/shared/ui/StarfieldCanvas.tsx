'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const starCount = Math.min(220, Math.floor((width * height) / 8500));
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.75 + 0.2,
      speed: (Math.random() * 0.35 + 0.08) * (prefersReducedMotion ? 0 : 1),
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let isLight =
      document.documentElement.getAttribute('data-theme') === 'light';
    let accentColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--ui-accent')
        .trim() || '#00ff7f';

    const syncThemeTokens = () => {
      isLight = document.documentElement.getAttribute('data-theme') === 'light';
      accentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--ui-accent')
          .trim() || '#00ff7f';
    };

    let isPageVisible = document.visibilityState === 'visible';
    let isRunning = false;

    const render = () => {
      isRunning = false;
      ctx.clearRect(0, 0, width, height);

      const offsetX = (mouseX - width / 2) * 0.012;
      const offsetY = (mouseY - height / 2) * 0.012;

      const lightFillPrefix = 'rgba(51, 65, 85, ';
      const darkFillPrefix = 'rgba(226, 232, 240, ';

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const drawX = (star.x + offsetX * star.z + width) % width;
        const drawY = (star.y + offsetY * star.z + height) % height;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        if (i % 9 === 0) {
          ctx.fillStyle = accentColor;
        } else if (isLight) {
          ctx.fillStyle = `${lightFillPrefix}${(star.opacity * 0.72).toFixed(2)})`;
        } else {
          ctx.fillStyle = `${darkFillPrefix}${star.opacity.toFixed(2)})`;
        }
        ctx.fill();
      }

      if (!prefersReducedMotion && isPageVisible) {
        isRunning = true;
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible && !prefersReducedMotion && !isRunning) {
        isRunning = true;
        animationFrameId = window.requestAnimationFrame(render);
      } else if (!isPageVisible && isRunning) {
        window.cancelAnimationFrame(animationFrameId);
        isRunning = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new MutationObserver(() => {
      syncThemeTokens();
      if (prefersReducedMotion || !isPageVisible) {
        render();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-accent', 'style'],
    });

    render();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-80 transition-opacity duration-500"
    />
  );
}
