'use client';

import { CUBE_FACES_TECH } from '@/entities/skill';

export function TechCube3D() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Glow Halo behind the 3D cube */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[var(--ui-accent)]/15 blur-3xl"
      />

      <div className="cube-scene h-56 w-56 sm:h-64 sm:w-64">
        <div className="cube-spinner">
          {CUBE_FACES_TECH.map((item) => (
            <div
              key={item.face}
              className={`cube-face cube-face-${item.face} flex flex-col items-center justify-center rounded-2xl border border-[var(--ui-accent)]/45 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/95 p-4 text-center shadow-[0_0_24px_-6px_var(--ui-accent-glow)]`}
            >
              <span
                className="mb-1.5 font-mono text-3xl font-black tracking-tighter sm:text-4xl"
                style={{ color: item.color }}
              >
                {item.symbol}
              </span>
              <span className="text-sm font-bold text-white">{item.name}</span>
              <span className="mt-1 text-[10px] text-slate-300">
                {item.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
