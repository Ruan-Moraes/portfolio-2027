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
      const rootStyle = getComputedStyle(document.documentElement);
      const themeAccent =
        rootStyle.getPropertyValue('--ui-accent').trim() || '#00ff7f';

      return CUBE_FACES_TECH.map((item) => {
        const canvas = document.createElement('canvas');
        canvas.width = texSize;
        canvas.height = texSize;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Matte deep-space dark surface (including rounded bevel corners)
          ctx.fillStyle = '#070e1e';
          ctx.fillRect(0, 0, texSize, texSize);

          // Border sits right along the rounded bevel boundary (bevel is ~48px on 512px texture)
          const pad = 52;
          const radius = 52;
          const frameSize = texSize - pad * 2; // 408px

          // Subtle inner surface fill
          const panelGrad = ctx.createLinearGradient(
            pad,
            pad,
            pad + frameSize,
            pad + frameSize
          );
          panelGrad.addColorStop(0, '#0d162c');
          panelGrad.addColorStop(0.5, '#060b18');
          panelGrad.addColorStop(1, '#0d162c');

          ctx.beginPath();
          ctx.roundRect(pad, pad, frameSize, frameSize, radius);
          ctx.fillStyle = panelGrad;
          ctx.fill();

          // Consistent border color matching the portfolio's active accent (--ui-accent)
          ctx.lineWidth = 4;
          ctx.strokeStyle = themeAccent;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Content strictly centered inside a 320px safe zone so text never touches the border
          const safeTextWidth = 310;

          // 1. Tech Symbol
          ctx.fillStyle = item.color;
          ctx.font =
            '900 84px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.symbol, texSize / 2, texSize / 2 - 50);

          // 2. Tech Name
          ctx.fillStyle = '#f8fafc';
          ctx.font = '700 32px system-ui, -apple-system, sans-serif';
          ctx.fillText(item.name, texSize / 2, texSize / 2 + 26, safeTextWidth);

          // 3. Tech Subtitle (auto-fitted so it never overflows the safe zone)
          ctx.fillStyle = '#94a3b8';
          let subtitleFontPx = 18;
          ctx.font = `500 ${subtitleFontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          while (
            ctx.measureText(item.subtitle).width > safeTextWidth &&
            subtitleFontPx > 12
          ) {
            subtitleFontPx -= 1;
            ctx.font = `500 ${subtitleFontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          }
          ctx.fillText(item.subtitle, texSize / 2, texSize / 2 + 72);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;

        // MeshLambertMaterial = pure matte surface (0 specular glare/reflections when spinning)
        return new THREE.MeshLambertMaterial({
          map: texture,
        });
      });
    };

    let materials = buildMaterials();

    // True 3D RoundedBoxGeometry (smooth curved corners and edges with 0 gaps)
    const geometry = new RoundedBoxGeometry(2.15, 2.15, 2.15, 8, 0.24);
    const cubeMesh = new THREE.Mesh(geometry, materials);
    cubeMesh.rotation.set(-0.35, 0.55, 0);
    scene.add(cubeMesh);

    // Soft uniform lighting without specular glare
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const softFrontLight = new THREE.DirectionalLight(0xffffff, 0.55);
    softFrontLight.position.set(2, 3, 6);
    scene.add(softFrontLight);

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
