'use client';

import { useEffect, useRef } from 'react';
import { CUBE_FACES_TECH } from '@/entities/skill';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface FaceDef {
  // Ordered as [topLeft, topRight, bottomRight, bottomLeft] when looking at the face from outside
  indices: [number, number, number, number];
  normal: Vec3;
  center: Vec3;
}

// Screen-space 3D coordinate system:
// +X = right, +Y = down, +Z = towards viewer
const CUBE_VERTICES: Vec3[] = [
  { x: -1, y: -1, z: 1 }, // 0: front-top-left
  { x: 1, y: -1, z: 1 }, // 1: front-top-right
  { x: 1, y: 1, z: 1 }, // 2: front-bottom-right
  { x: -1, y: 1, z: 1 }, // 3: front-bottom-left
  { x: -1, y: -1, z: -1 }, // 4: back-top-left
  { x: 1, y: -1, z: -1 }, // 5: back-top-right
  { x: 1, y: 1, z: -1 }, // 6: back-bottom-right
  { x: -1, y: 1, z: -1 }, // 7: back-bottom-left
];

const FACES: FaceDef[] = [
  // Front (+Z)
  {
    indices: [0, 1, 2, 3],
    normal: { x: 0, y: 0, z: 1 },
    center: { x: 0, y: 0, z: 1 },
  },
  // Right (+X)
  {
    indices: [1, 5, 6, 2],
    normal: { x: 1, y: 0, z: 0 },
    center: { x: 1, y: 0, z: 0 },
  },
  // Back (-Z)
  {
    indices: [5, 4, 7, 6],
    normal: { x: 0, y: 0, z: -1 },
    center: { x: 0, y: 0, z: -1 },
  },
  // Left (-X)
  {
    indices: [4, 0, 3, 7],
    normal: { x: -1, y: 0, z: 0 },
    center: { x: -1, y: 0, z: 0 },
  },
  // Top (-Y)
  {
    indices: [4, 5, 1, 0],
    normal: { x: 0, y: -1, z: 0 },
    center: { x: 0, y: -1, z: 0 },
  },
  // Bottom (+Y)
  {
    indices: [3, 2, 6, 7],
    normal: { x: 0, y: 1, z: 0 },
    center: { x: 0, y: 1, z: 0 },
  },
];

function rotatePoint(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

const DISPLAY_SIZE = 300;
const TEX_SIZE = 256;

export function TechCube3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ rx: -0.45, ry: -0.62, rz: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = DISPLAY_SIZE * dpr;
    canvas.height = DISPLAY_SIZE * dpr;

    const textures = CUBE_FACES_TECH.map((item) => {
      const off = document.createElement('canvas');
      off.width = TEX_SIZE;
      off.height = TEX_SIZE;
      const octx = off.getContext('2d');
      if (!octx) return off;

      // Solid dark base so cube edges meet seamlessly
      octx.fillStyle = '#050b1a';
      octx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

      // Rounded inner card on the face
      const pad = 16;
      const radius = 28;
      const w = TEX_SIZE - pad * 2;
      const h = TEX_SIZE - pad * 2;

      const grad = octx.createLinearGradient(pad, pad, pad + w, pad + h);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#060c1d');
      grad.addColorStop(1, '#0f172a');

      octx.beginPath();
      octx.roundRect(pad, pad, w, h, radius);
      octx.fillStyle = grad;
      octx.fill();

      octx.lineWidth = 3.5;
      octx.strokeStyle = item.color;
      octx.globalAlpha = 0.85;
      octx.stroke();
      octx.globalAlpha = 1;

      // Subtle inner glow circle
      const radial = octx.createRadialGradient(
        TEX_SIZE / 2,
        TEX_SIZE / 2 - 12,
        8,
        TEX_SIZE / 2,
        TEX_SIZE / 2,
        105
      );
      radial.addColorStop(0, `${item.color}38`);
      radial.addColorStop(1, 'transparent');
      octx.fillStyle = radial;
      octx.beginPath();
      octx.roundRect(pad, pad, w, h, radius);
      octx.fill();

      // Tech Symbol
      octx.fillStyle = item.color;
      octx.font = '900 56px ui-monospace, SFMono-Regular, Menlo, monospace';
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText(item.symbol, TEX_SIZE / 2, TEX_SIZE / 2 - 28);

      // Tech Title
      octx.fillStyle = '#f8fafc';
      octx.font = '700 22px system-ui, -apple-system, sans-serif';
      octx.fillText(item.name, TEX_SIZE / 2, TEX_SIZE / 2 + 24);

      // Tech Subtitle
      octx.fillStyle = '#cbd5e1';
      octx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace';
      octx.fillText(item.subtitle, TEX_SIZE / 2, TEX_SIZE / 2 + 54);

      return off;
    });

    let animationFrameId = 0;

    const renderFrame = (advanceRotation: boolean) => {
      if (advanceRotation && !isDraggingRef.current) {
        const speedFactor = isHoveredRef.current ? 0.25 : 1;
        rotationRef.current.ry += 0.009 * speedFactor;
        rotationRef.current.rx =
          -0.42 + Math.sin(rotationRef.current.ry * 0.65) * 0.32;
      }

      const { rx, ry, rz } = rotationRef.current;
      const scale = 80 * dpr;
      const center = (DISPLAY_SIZE * dpr) / 2;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rotatedVertices = CUBE_VERTICES.map((v) =>
        rotatePoint(v, rx, ry, rz)
      );

      // Sort faces back-to-front and cull backfaces
      const visibleFaces = FACES.map((face, idx) => {
        const rNormal = rotatePoint(face.normal, rx, ry, rz);
        const rCenter = rotatePoint(face.center, rx, ry, rz);
        return {
          face,
          idx,
          normalZ: rNormal.z,
          centerZ: rCenter.z,
        };
      })
        .filter((f) => f.normalZ > 0.01)
        .sort((a, b) => a.centerZ - b.centerZ);

      for (const { face, idx, normalZ } of visibleFaces) {
        // pts[0]=topLeft, pts[1]=topRight, pts[2]=bottomRight, pts[3]=bottomLeft
        const pts = face.indices.map((vi) => {
          const v = rotatedVertices[vi];
          return {
            x: center + v.x * scale,
            y: center + v.y * scale,
          };
        });

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.lineTo(pts[3].x, pts[3].y);
        ctx.closePath();
        ctx.clip();

        // Exact affine transform from texture (0..TEX_SIZE, 0..TEX_SIZE) to parallelogram (pts[0], pts[1], pts[3])
        const a = (pts[1].x - pts[0].x) / TEX_SIZE;
        const b = (pts[1].y - pts[0].y) / TEX_SIZE;
        const c = (pts[3].x - pts[0].x) / TEX_SIZE;
        const d = (pts[3].y - pts[0].y) / TEX_SIZE;

        ctx.setTransform(a, b, c, d, pts[0].x, pts[0].y);
        ctx.drawImage(textures[idx], 0, 0);

        // Directional shading based on face normal angle
        const shadeAlpha = Math.max(0, Math.min(0.42, (1 - normalZ) * 0.5));
        if (shadeAlpha > 0) {
          ctx.fillStyle = `rgba(2, 6, 23, ${shadeAlpha})`;
          ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);
        }
        ctx.restore();

        // Crisp outer cube edge line in identity device-pixel space
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.lineTo(pts[3].x, pts[3].y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0, 255, 127, 0.38)';
        ctx.lineWidth = 1.6 * dpr;
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    };

    // Draw initial frame synchronously
    renderFrame(false);

    const loop = () => {
      renderFrame(true);
      animationFrameId = window.requestAnimationFrame(loop);
    };

    animationFrameId = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* Glow Halo behind the 3D cube */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[var(--ui-accent)]/15 blur-3xl"
      />

      <canvas
        ref={canvasRef}
        width={DISPLAY_SIZE}
        height={DISPLAY_SIZE}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          isDraggingRef.current = false;
        }}
        onMouseDown={(e) => {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseMove={(e) => {
          if (!isDraggingRef.current) return;
          const dx = e.clientX - lastMouseRef.current.x;
          const dy = e.clientY - lastMouseRef.current.y;
          rotationRef.current.ry += dx * 0.01;
          rotationRef.current.rx += dy * 0.01;
          lastMouseRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
        }}
        aria-label="Interactive 3D Technology Stack Cube"
        className="relative z-10 h-[280px] w-[280px] cursor-grab active:cursor-grabbing sm:h-[300px] sm:w-[300px]"
      />
    </div>
  );
}
