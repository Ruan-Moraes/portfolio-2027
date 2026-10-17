'use client';

import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  type MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useElementVisibility } from '@/shared/lib';
import {
  buildCubeMaterials,
  createCubeBumpTexture,
} from '../lib/cube-face-texture';

export function TechCube3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useElementVisibility(containerRef, { rootMargin: '100px' });
  const isVisibleRef = useRef(isVisible);
  const resumeLoopRef = useRef<(() => void) | null>(null);

  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible) {
      resumeLoopRef.current?.();
    }
  }, [isVisible]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = 300;
    const height = 300;

    // 1. WebGL Scene & Camera
    const scene = new Scene();
    const camera = new PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const sharedBumpMap = createCubeBumpTexture();
    const isInitialLight =
      document.documentElement.getAttribute('data-theme') === 'light';

    const materialCache: {
      dark: MeshLambertMaterial[] | null;
      light: MeshLambertMaterial[] | null;
    } = {
      dark: isInitialLight ? null : buildCubeMaterials(sharedBumpMap, false),
      light: isInitialLight ? buildCubeMaterials(sharedBumpMap, true) : null,
    };

    const getOrCreateMaterials = (isLight: boolean) => {
      const key = isLight ? 'light' : 'dark';
      if (!materialCache[key]) {
        materialCache[key] = buildCubeMaterials(sharedBumpMap, isLight);
      }
      return materialCache[key];
    };

    // 2. True 3D RoundedBoxGeometry
    const geometry = new RoundedBoxGeometry(2.15, 2.15, 2.15, 8, 0.26);
    const cubeMesh = new Mesh(
      geometry,
      getOrCreateMaterials(isInitialLight)
    );
    cubeMesh.rotation.set(-0.35, 0.55, 0);
    scene.add(cubeMesh);

    // 3. Balanced 3-point matte lighting adapted to theme
    const ambientLight = new AmbientLight(
      0xffffff,
      isInitialLight ? 2.25 : 1.05
    );
    scene.add(ambientLight);

    const keyLight = new DirectionalLight(
      0xffffff,
      isInitialLight ? 1.25 : 1.65
    );
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new DirectionalLight(
      0x94a3b8,
      isInitialLight ? 0.75 : 0.55
    );
    fillLight.position.set(-5, -3, 2);
    scene.add(fillLight);

    // 4. Swap cached textures when data-theme changes (builds alternate set at most once)
    let currentThemeAttr =
      document.documentElement.getAttribute('data-theme') || 'dark';
    const observer = new MutationObserver(() => {
      const nextThemeAttr =
        document.documentElement.getAttribute('data-theme') || 'dark';
      if (nextThemeAttr === currentThemeAttr) return;
      currentThemeAttr = nextThemeAttr;

      const isLightNow = nextThemeAttr === 'light';
      ambientLight.intensity = isLightNow ? 2.25 : 1.05;
      keyLight.intensity = isLightNow ? 1.25 : 1.65;
      fillLight.intensity = isLightNow ? 0.75 : 0.55;

      cubeMesh.material = getOrCreateMaterials(isLightNow);
      renderer.render(scene, camera);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 5. Viewport-gated Animation Loop with smooth real-time damping (lerp)
    let frameId = 0;
    let isRunning = false;
    let clockTime = 0;
    let currentRx = -0.32;
    let currentRy = 0.55;

    const animate = () => {
      if (!isVisibleRef.current) {
        isRunning = false;
        return;
      }

      if (!isDraggingRef.current) {
        const speed = isHoveredRef.current ? 0.0025 : 0.009;
        clockTime += speed;
      }

      const targetRy = 0.55 + clockTime + manualRotationRef.current.ry;
      const targetRx =
        -0.32 +
        Math.sin(clockTime * 0.7) * 0.34 +
        manualRotationRef.current.rx;

      currentRy += (targetRy - currentRy) * 0.16;
      currentRx += (targetRx - currentRx) * 0.16;

      cubeMesh.rotation.y = currentRy;
      cubeMesh.rotation.x = currentRx;

      renderer.render(scene, camera);
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
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      geometry.dispose();
      sharedBumpMap.dispose();
      [materialCache.dark, materialCache.light].forEach((set) => {
        set?.forEach((mat) => {
          mat.map?.dispose();
          mat.dispose();
        });
      });
      renderer.dispose();
    };
  }, []);

  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - lastPointerRef.current.x;
    const dy = clientY - lastPointerRef.current.y;
    manualRotationRef.current.ry += dx * 0.011;
    manualRotationRef.current.rx += dy * 0.011;
    lastPointerRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <div
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--ui-accent) 16%, transparent) 0%, color-mix(in srgb, var(--ui-accent) 7%, transparent) 38%, color-mix(in srgb, var(--ui-accent) 2%, transparent) 62%, transparent 76%)',
        }}
        className="pointer-events-none absolute h-[380px] w-[380px] rounded-full sm:h-[420px] sm:w-[420px]"
      />

      <div
        ref={containerRef}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          handlePointerUp();
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch) handlePointerDown(touch.clientX, touch.clientY);
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) handlePointerMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={handlePointerUp}
        aria-label="Interactive 3D Rounded Technology Cube"
        className="relative z-10 flex h-[280px] w-[280px] cursor-grab items-center justify-center select-none active:cursor-grabbing sm:h-[300px] sm:w-[300px]"
      />
    </div>
  );
}
