'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  bucket: 0 | 1 | 2 | 3; // 0 = accent, 1..3 = opacity tiers for batched path drawing
  speed: number;
}

const FRAME_INTERVAL_MS = 1000 / 30; // 30 FPS frame-pacing (cuts Canvas CPU/GPU load by 50%)

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const starCount = Math.min(130, Math.floor((width * height) / 12000));
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.8 + 0.5,
      size: Math.random() * 1.6 + 0.5,
      bucket: i % 9 === 0 ? 0 : ((1 + (i % 3)) as 1 | 2 | 3),
      speed: (Math.random() * 0.55 + 0.14) * (prefersReducedMotion ? 0 : 1),
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
    let lastFrameTime = 0;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const offsetX = (mouseX - width / 2) * 0.012;
      const offsetY = (mouseY - height / 2) * 0.012;

      const bucketStyles = [
        accentColor,
        isLight ? 'rgba(51, 65, 85, 0.26)' : 'rgba(226, 232, 240, 0.32)',
        isLight ? 'rgba(51, 65, 85, 0.45)' : 'rgba(226, 232, 240, 0.58)',
        isLight ? 'rgba(51, 65, 85, 0.66)' : 'rgba(226, 232, 240, 0.85)',
      ];

      // Batch all stars into 4 draw calls per frame instead of 130+ individual ctx.fill() calls
      for (let b = 0; b < 4; b += 1) {
        ctx.beginPath();
        for (let i = 0; i < stars.length; i += 1) {
          const star = stars[i];
          if (star.bucket !== b) continue;

          star.y -= star.speed;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }

          const drawX = (star.x + offsetX * star.z + width) % width;
          const drawY = (star.y + offsetY * star.z + height) % height;

          ctx.moveTo(drawX + star.size, drawY);
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        }
        ctx.fillStyle = bucketStyles[b];
        ctx.fill();
      }
    };

    const loop = (timestamp: number) => {
      if (!isPageVisible || prefersReducedMotion) {
        isRunning = false;
        return;
      }

      if (timestamp - lastFrameTime >= FRAME_INTERVAL_MS) {
        lastFrameTime = timestamp;
        drawFrame();
      }

      animationFrameId = window.requestAnimationFrame(loop);
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible && !prefersReducedMotion && !isRunning) {
        isRunning = true;
        animationFrameId = window.requestAnimationFrame(loop);
      } else if (!isPageVisible && isRunning) {
        window.cancelAnimationFrame(animationFrameId);
        isRunning = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new MutationObserver(() => {
      syncThemeTokens();
      if (prefersReducedMotion || !isPageVisible) {
        drawFrame();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-accent', 'style'],
    });

    drawFrame();
    if (!prefersReducedMotion && isPageVisible) {
      isRunning = true;
      animationFrameId = window.requestAnimationFrame(loop);
    }

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
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}
