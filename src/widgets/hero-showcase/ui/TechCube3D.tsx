'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CUBE_FACES_TECH } from '@/entities/skill';

export function TechCube3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = 300;
    const height = 300;

    // 1. WebGL Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const texSize = 512;

    const buildMaterials = () => {
      return CUBE_FACES_TECH.map((item) => {
        const canvas = document.createElement('canvas');
        canvas.width = texSize;
        canvas.height = texSize;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // 1. Single unified surface across the entire cube face and rounded corners (0 outer borders, 0 background seams)
          ctx.fillStyle = '#0d1527';
          ctx.fillRect(0, 0, texSize, texSize);

          // 2. Soft radial ambient aura in the center that fades to 0% before reaching the rounded bevels
          const aura = ctx.createRadialGradient(
            texSize / 2,
            texSize / 2 - 20,
            10,
            texSize / 2,
            texSize / 2,
            195
          );
          aura.addColorStop(0, `${item.color}26`);
          aura.addColorStop(0.55, `${item.color}0c`);
          aura.addColorStop(1, 'rgba(13, 21, 39, 0)');
          ctx.fillStyle = aura;
          ctx.fillRect(0, 0, texSize, texSize);

          // 3. Subtle circular tech emblem behind the symbol (sized generously for 2- and 3-letter symbols like OPS)
          const badgeRadius = 82;
          const badgeY = texSize / 2 - 66;
          ctx.beginPath();
          ctx.arc(texSize / 2, badgeY, badgeRadius, 0, Math.PI * 2);
          ctx.fillStyle = `${item.color}16`;
          ctx.fill();

          // 4. Tech Symbol with soft neon glow and comfortable letter spacing
          ctx.save();
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 18;
          ctx.fillStyle = item.color;
          ctx.font =
            '900 62px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.symbol, texSize / 2, badgeY + 2);
          ctx.restore();

          // Content strictly centered inside a 320px safe zone
          const safeTextWidth = 320;

          // 5. Tech Name
          ctx.fillStyle = '#f8fafc';
          ctx.font = '800 34px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.name, texSize / 2, texSize / 2 + 48, safeTextWidth);

          // 6. Subtle glowing accent divider bar between title and subtitle
          const barWidth = 56;
          const barY = texSize / 2 + 76;
          const barGrad = ctx.createLinearGradient(
            texSize / 2 - barWidth,
            barY,
            texSize / 2 + barWidth,
            barY
          );
          barGrad.addColorStop(0, 'rgba(255,255,255,0)');
          barGrad.addColorStop(0.5, item.color);
          barGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = barGrad;
          ctx.fillRect(texSize / 2 - barWidth, barY - 1.5, barWidth * 2, 3);

          // 7. Tech Subtitle (auto-fitted so it never overflows the safe zone)
          ctx.fillStyle = '#cbd5e1';
          let subtitleFontPx = 19;
          ctx.font = `600 ${subtitleFontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          while (
            ctx.measureText(item.subtitle).width > safeTextWidth &&
            subtitleFontPx > 12
          ) {
            subtitleFontPx -= 1;
            ctx.font = `600 ${subtitleFontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          }
          ctx.fillText(item.subtitle, texSize / 2, texSize / 2 + 106);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;

        // Matte Lambert material — natural 3D depth shading across faces & curved corners
        return new THREE.MeshLambertMaterial({
          map: texture,
        });
      });
    };

    let materials = buildMaterials();

    // True 3D RoundedBoxGeometry (smooth curved corners and edges with 0 gaps)
    const geometry = new RoundedBoxGeometry(2.15, 2.15, 2.15, 8, 0.26);
    const cubeMesh = new THREE.Mesh(geometry, materials);
    cubeMesh.rotation.set(-0.35, 0.55, 0);
    scene.add(cubeMesh);

    // Balanced 3-point matte lighting so front, side, top, and curved bevels have clear 3D volume
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.05);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.55);
    fillLight.position.set(-5, -3, 2);
    scene.add(fillLight);

    // Rebuild textures if user switches theme accent color
    const observer = new MutationObserver(() => {
      const nextMaterials = buildMaterials();
      cubeMesh.material = nextMaterials;
      materials.forEach((mat) => {
        mat.map?.dispose();
        mat.dispose();
      });
      materials = nextMaterials;
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'data-theme'],
    });

    // Animation Loop
    let frameId = 0;
    let clockTime = 0;

    const animate = () => {
      if (!isDraggingRef.current) {
        const speed = isHoveredRef.current ? 0.003 : 0.01;
        clockTime += speed;
        cubeMesh.rotation.y =
          0.55 + clockTime + manualRotationRef.current.ry;
        cubeMesh.rotation.x =
          -0.32 +
          Math.sin(clockTime * 0.7) * 0.36 +
          manualRotationRef.current.rx;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      geometry.dispose();
      materials.forEach((mat) => {
        mat.map?.dispose();
        mat.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* Glow Halo behind the 3D cube */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[var(--ui-accent)]/15 blur-3xl"
      />

      <div
        ref={containerRef}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          isDraggingRef.current = false;
        }}
        onMouseDown={(e) => {
          isDraggingRef.current = true;
          lastPointerRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseMove={(e) => {
          if (!isDraggingRef.current) return;
          const dx = e.clientX - lastPointerRef.current.x;
          const dy = e.clientY - lastPointerRef.current.y;
          manualRotationRef.current.ry += dx * 0.01;
          manualRotationRef.current.rx += dy * 0.01;
          lastPointerRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseUp={() => {
          isDraggingRef.current = false;
        }}
        aria-label="Interactive 3D Rounded Technology Cube"
        className="relative z-10 flex h-[280px] w-[280px] cursor-grab items-center justify-center active:cursor-grabbing sm:h-[300px] sm:w-[300px]"
      />
    </div>
  );
}
