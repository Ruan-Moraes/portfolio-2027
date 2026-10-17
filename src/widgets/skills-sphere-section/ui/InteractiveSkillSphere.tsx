'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SKILLS_DATA, type SkillCategoryKey } from '@/entities/skill';
import { cn } from '@/shared/lib';

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

export function InteractiveSkillSphere({
  selectedCategory,
}: InteractiveSkillSphereProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const speedRef = useRef({ vx: 0.0045, vy: 0.0065 });

  // Distribute skills evenly on a 3D Fibonacci Sphere
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

  const [projected, setProjected] = useState<SpherePoint[]>(basePoints);

  useEffect(() => {
    let frameId = 0;
    let currentPoints = [...basePoints];

    const animate = () => {
      const { vx, vy } = speedRef.current;

      const cosX = Math.cos(vx);
      const sinX = Math.sin(vx);
      const cosY = Math.cos(vy);
      const sinY = Math.sin(vy);

      currentPoints = currentPoints.map((pt) => {
        // Rotate around X
        const y1 = pt.y * cosX - pt.z * sinX;
        const z1 = pt.y * sinX + pt.z * cosX;
        // Rotate around Y
        const x2 = pt.x * cosY + z1 * sinY;
        const z2 = -pt.x * sinY + z1 * cosY;

        return {
          ...pt,
          x: x2,
          y: y1,
          z: z2,
        };
      });

      setProjected(currentPoints);
      setRotation((prev) => ({ x: prev.x + vx, y: prev.y + vy }));
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [basePoints]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    speedRef.current = {
      vx: -relY * 0.018,
      vy: relX * 0.018,
    };
  };

  const handleMouseLeave = () => {
    speedRef.current = { vx: 0.0045, vy: 0.0065 };
  };

  const radiusPx = 138;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-rotation={rotation.x.toFixed(2)}
      className="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-2xl select-none sm:h-[380px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-60 w-60 rounded-full bg-[var(--ui-accent)]/12 blur-3xl"
      />

      <div className="relative h-0 w-0">
        {projected.map((point) => {
          const scale = (point.z + 2) / 3;
          const opacity = Math.max(0.22, Math.min(1, (point.z + 1.35) / 2.1));
          const isMatchedCategory =
            selectedCategory === 'all' || point.category === selectedCategory;

          return (
            <span
              key={point.name}
              style={{
                transform: `translate3d(${(point.x * radiusPx).toFixed(1)}px, ${(
                  point.y * radiusPx
                ).toFixed(1)}px, 0) scale(${scale.toFixed(2)})`,
                opacity: isMatchedCategory ? opacity : opacity * 0.25,
                zIndex: Math.round(scale * 100),
              }}
              className={cn(
                'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-0.5 font-mono text-xs whitespace-nowrap transition-colors duration-200',
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
