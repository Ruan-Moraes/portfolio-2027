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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Build 6 high-DPI CanvasTextures for the 6 faces of RoundedBoxGeometry
    const texSize = 512;
    const materials = CUBE_FACES_TECH.map((item) => {
      const canvas = document.createElement('canvas');
      canvas.width = texSize;
      canvas.height = texSize;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Deep slate base covering the entire UV including rounded fillets/corners
        const bgGrad = ctx.createLinearGradient(0, 0, texSize, texSize);
        bgGrad.addColorStop(0, '#091124');
        bgGrad.addColorStop(0.5, '#030712');
        bgGrad.addColorStop(1, '#091124');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, texSize, texSize);

        // Glowing rounded frame inside the flat region of the RoundedBoxGeometry face
        const pad = 74;
        const radius = 48;
        const frameSize = texSize - pad * 2;

        const radialGlow = ctx.createRadialGradient(
          texSize / 2,
          texSize / 2 - 20,
          16,
          texSize / 2,
          texSize / 2,
          180
        );
        radialGlow.addColorStop(0, `${item.color}38`);
        radialGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');

        ctx.beginPath();
        ctx.roundRect(pad, pad, frameSize, frameSize, radius);
        ctx.fillStyle = radialGlow;
        ctx.fill();

        ctx.lineWidth = 4.5;
        ctx.strokeStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tech Symbol
        ctx.fillStyle = item.color;
        ctx.font = '900 94px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.symbol, texSize / 2, texSize / 2 - 48);

        // Tech Name
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 36px system-ui, -apple-system, sans-serif';
        ctx.fillText(
          item.name,
          texSize / 2,
          texSize / 2 + 34,
          frameSize - 32
        );

        // Tech Subtitle
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 18px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText(
          item.subtitle,
          texSize / 2,
          texSize / 2 + 80,
          frameSize - 36
        );
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;

      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.15,
      });
    });

    // 3. True 3D RoundedBoxGeometry (smooth curved corners and edges with 0 gaps)
    const geometry = new RoundedBoxGeometry(2.15, 2.15, 2.15, 8, 0.28);
    const cubeMesh = new THREE.Mesh(geometry, materials);
    cubeMesh.rotation.set(-0.35, 0.55, 0);
    scene.add(cubeMesh);

    // 4. Studio Lighting so curved corners catch subtle specular highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00ff7f, 1.1);
    rimLight.position.set(-5, -4, 3);
    scene.add(rimLight);

    // 5. Animation Loop
    let frameId = 0;
    let clockTime = 0;

    const animate = () => {
      if (!isDraggingRef.current) {
        const speed = isHoveredRef.current ? 0.003 : 0.011;
        clockTime += speed;
        cubeMesh.rotation.y =
          0.55 + clockTime + manualRotationRef.current.ry;
        cubeMesh.rotation.x =
          -0.32 +
          Math.sin(clockTime * 0.7) * 0.38 +
          manualRotationRef.current.rx;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
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
