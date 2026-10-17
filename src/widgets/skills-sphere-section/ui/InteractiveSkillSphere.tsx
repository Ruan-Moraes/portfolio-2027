'use client';

import { useEffect, useMemo, useRef } from 'react';
import { SKILLS_DATA, type SkillCategoryKey } from '@/entities/skill';
import { cn, useElementVisibility } from '@/shared/lib';

interface SpherePoint {
  name: string;
  category: SkillCategoryKey;
  highlight?: boolean;
  x: number;
  y: number;
  z: number;
}

interface InteractiveSkillSphereProps {
  selectedCategory: SkillCategoryKey | 'all';
}

const RADIUS_PX = 138;

export function InteractiveSkillSphere({
  selectedCategory,
}: InteractiveSkillSphereProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const isVisible = useElementVisibility(containerRef, { rootMargin: '100px' });
  const isVisibleRef = useRef(isVisible);
  const selectedCategoryRef = useRef(selectedCategory);
  const speedRef = useRef({ vx: 0.0045, vy: 0.0065 });
  const resumeLoopRef = useRef<(() => void) | null>(null);

  // Distribute skills evenly on a 3D Fibonacci Sphere once
  const basePoints = useMemo<SpherePoint[]>(() => {
    const count = SKILLS_DATA.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    return SKILLS_DATA.map((skill, index) => {
      const y = 1 - (index / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * index;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      return {
        ...skill,
        x,
        y,
        z,
      };
    });
  }, []);

  const pointsRef = useRef<SpherePoint[]>(
    basePoints.map((pt) => ({ ...pt }))
  );

  // Synchronize category filter and visibility without triggering 60fps React re-renders
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
    const pts = pointsRef.current;
    for (let i = 0; i < pts.length; i += 1) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const point = pts[i];
      const baseOpacity = Math.max(0.22, Math.min(1, (point.z + 1.35) / 2.1));
      const isMatched =
        selectedCategory === 'all' || point.category === selectedCategory;
      el.style.opacity = (isMatched ? baseOpacity : baseOpacity * 0.25).toFixed(3);
    }
  }, [selectedCategory]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible) {
      resumeLoopRef.current?.();
    }
  }, [isVisible]);

  useEffect(() => {
    let frameId = 0;
    let isRunning = false;
    const pts = pointsRef.current;

    const animate = () => {
      if (!isVisibleRef.current) {
        isRunning = false;
        return;
      }

      const { vx, vy } = speedRef.current;
      const cosX = Math.cos(vx);
      const sinX = Math.sin(vx);
      const cosY = Math.cos(vy);
      const sinY = Math.sin(vy);
      const activeCat = selectedCategoryRef.current;

      for (let i = 0; i < pts.length; i += 1) {
        const pt = pts[i];
        // Rotate around X
        const y1 = pt.y * cosX - pt.z * sinX;
        const z1 = pt.y * sinX + pt.z * cosX;
        // Rotate around Y
        const x2 = pt.x * cosY + z1 * sinY;
        const z2 = -pt.x * sinY + z1 * cosY;

        pt.x = x2;
        pt.y = y1;
        pt.z = z2;

        const el = itemRefs.current[i];
        if (!el) continue;

        const scale = (z2 + 2) / 3;
        const baseOpacity = Math.max(0.22, Math.min(1, (z2 + 1.35) / 2.1));
        const isMatched = activeCat === 'all' || pt.category === activeCat;

        el.style.transform = `translate3d(${(x2 * RADIUS_PX).toFixed(1)}px, ${(
          y1 * RADIUS_PX
        ).toFixed(1)}px, 0) scale(${scale.toFixed(2)})`;
        el.style.opacity = (
          isMatched ? baseOpacity : baseOpacity * 0.25
        ).toFixed(3);
        el.style.zIndex = String(Math.round(scale * 100));
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (!isRunning && isVisibleRef.current) {
        isRunning = true;
        frameId = window.requestAnimationFrame(animate);
      }
    };

    resumeLoopRef.current = startLoop;
    startLoop();

    return () => {
      resumeLoopRef.current = null;
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX =
      (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY =
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    speedRef.current = {
      vx: -relY * 0.018,
      vy: relX * 0.018,
    };
  };

  const handleMouseLeave = () => {
    speedRef.current = { vx: 0.0045, vy: 0.0065 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-2xl select-none sm:h-[380px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-60 w-60 rounded-full bg-[var(--ui-accent)]/12 blur-3xl"
      />

      <div className="relative h-0 w-0">
        {basePoints.map((point, index) => {
          const scale = (point.z + 2) / 3;
          const opacity = Math.max(0.22, Math.min(1, (point.z + 1.35) / 2.1));
          const isMatchedCategory =
            selectedCategory === 'all' || point.category === selectedCategory;

          return (
            <span
              key={point.name}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              style={{
                transform: `translate3d(${(point.x * RADIUS_PX).toFixed(1)}px, ${(
                  point.y * RADIUS_PX
                ).toFixed(1)}px, 0) scale(${scale.toFixed(2)})`,
                opacity: Number(
                  (isMatchedCategory ? opacity : opacity * 0.25).toFixed(3)
                ),
                zIndex: Math.round(scale * 100),
              }}
              className={cn(
                'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-0.5 font-mono text-xs whitespace-nowrap transition-colors duration-200 will-change-transform',
                point.highlight && isMatchedCategory
                  ? 'border border-[var(--ui-accent)]/50 bg-[var(--ui-accent)]/15 font-bold text-[var(--ui-accent)] shadow-[0_0_12px_-2px_var(--ui-accent-glow)]'
                  : 'text-[var(--ui-text-primary)]'
              )}
            >
              {point.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
