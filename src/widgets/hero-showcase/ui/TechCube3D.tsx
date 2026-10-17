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

    // Subtle procedural micro-texture bump map for tactile anodized surface feel (zero glare)
    const createBumpTexture = () => {
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = texSize;
      bumpCanvas.height = texSize;
      const bCtx = bumpCanvas.getContext('2d');
      if (bCtx) {
        const pad = 8;
        const frameSize = texSize - pad * 2;
        const frameRadius = 62;

        // Smooth neutral height outside the border (no texture outside the border)
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, texSize, texSize);

        // Fine micro-grid relief strictly inside the content border
        bCtx.save();
        bCtx.beginPath();
        bCtx.roundRect(pad, pad, frameSize, frameSize, frameRadius);
        bCtx.clip();

        bCtx.strokeStyle = '#969696';
        bCtx.lineWidth = 1;
        const step = 16;
        for (let i = 0; i <= texSize; i += step) {
          bCtx.beginPath();
          bCtx.moveTo(i, 0);
          bCtx.lineTo(i, texSize);
          bCtx.stroke();
          bCtx.beginPath();
          bCtx.moveTo(0, i);
          bCtx.lineTo(texSize, i);
          bCtx.stroke();
        }
        bCtx.restore();
      }
      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.anisotropy = 4;
      return bumpTex;
    };

    const sharedBumpMap = createBumpTexture();

    const buildMaterials = () => {
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light';

      return CUBE_FACES_TECH.map((item, faceIdx) => {
        const canvas = document.createElement('canvas');
        canvas.width = texSize;
        canvas.height = texSize;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const pad = 8;
          const frameSize = texSize - pad * 2;
          const frameRadius = 62;

          // 1. Area outside the border (no content): clean solid background with a slightly shifted tone
          ctx.fillStyle = isLight ? '#e2e8f0' : '#182642';
          ctx.fillRect(0, 0, texSize, texSize);

          // 2. Content area (strictly inside the border at pad = 8): base + textures
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(pad, pad, frameSize, frameSize, frameRadius);
          ctx.fillStyle = isLight ? '#ffffff' : '#111c35';
          ctx.fill();
          ctx.clip();

          // Tactile architectural tech grid + micro-dots inside the content container
          const gridStep = 32;
          ctx.strokeStyle = isLight
            ? 'rgba(15, 23, 42, 0.075)'
            : 'rgba(148, 163, 184, 0.055)';
          ctx.lineWidth = 1;
          for (let i = gridStep; i < texSize; i += gridStep) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, texSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(texSize, i);
            ctx.stroke();
          }

          // Micro intersection nodes inside the face
          ctx.fillStyle = isLight ? `${item.color}55` : `${item.color}2e`;
          for (let x = gridStep; x <= texSize - gridStep; x += gridStep) {
            for (let y = gridStep; y <= texSize - gridStep; y += gridStep) {
              ctx.fillRect(x - 1, y - 1, 2, 2);
            }
          }

          // Vibrant multi-layered radial color infusion
          const primaryAura = ctx.createRadialGradient(
            texSize / 2,
            texSize / 2 - 36,
            12,
            texSize / 2,
            texSize / 2,
            225
          );
          primaryAura.addColorStop(0, isLight ? `${item.color}2e` : `${item.color}42`);
          primaryAura.addColorStop(0.45, isLight ? `${item.color}14` : `${item.color}1c`);
          primaryAura.addColorStop(0.78, isLight ? `${item.color}06` : `${item.color}08`);
          primaryAura.addColorStop(
            1,
            isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(17, 28, 53, 0)'
          );
          ctx.fillStyle = primaryAura;
          ctx.fillRect(pad, pad, frameSize, frameSize);

          // Subtle top-left anodized highlight wash for extra depth
          const sheenAura = ctx.createRadialGradient(
            140,
            120,
            10,
            140,
            120,
            180
          );
          sheenAura.addColorStop(
            0,
            isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)'
          );
          sheenAura.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = sheenAura;
          ctx.fillRect(pad, pad, frameSize, frameSize);

          // Technical dual circuit traces emerging from the 4 corners, each with a unique trajectory
          ctx.save();
          ctx.strokeStyle = isLight ? `${item.color}90` : `${item.color}55`;
          ctx.fillStyle = item.color;
          ctx.lineWidth = 2;

          const drawTrace = (points: Array<[number, number]>) => {
            if (points.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i += 1) {
              ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.stroke();

            const last = points[points.length - 1];
            ctx.beginPath();
            ctx.arc(last[0], last[1], 3, 0, Math.PI * 2);
            ctx.fill();
          };

          const shift = (faceIdx % 3) * 6;
          const tlX = pad + 12;
          const tlY = pad + 12;
          const trX = texSize - pad - 12;
          const trY = pad + 12;
          const blX = pad + 12;
          const blY = texSize - pad - 12;
          const brX = texSize - pad - 12;
          const brY = texSize - pad - 12;

          // Top-Left corner: 2 lines with unique stepped + angled paths
          drawTrace([
            [tlX + 38, tlY + 16],
            [tlX + 94 + shift, tlY + 16],
            [tlX + 114 + shift, tlY + 36],
            [tlX + 136 + shift, tlY + 36],
          ]);
          drawTrace([
            [tlX + 16, tlY + 42],
            [tlX + 16, tlY + 86 + shift],
            [tlX + 38, tlY + 108 + shift],
          ]);

          // Top-Right corner: 2 lines with unique jogged trajectory
          drawTrace([
            [trX - 36, trY + 18],
            [trX - 72 - shift, trY + 18],
            [trX - 92 - shift, trY + 38],
          ]);
          drawTrace([
            [trX - 18, trY + 40],
            [trX - 18, trY + 70],
            [trX - 36, trY + 88],
            [trX - 36, trY + 120 + shift],
          ]);

          // Bottom-Left corner: 2 lines with asymmetric dogleg trajectory
          drawTrace([
            [blX + 42, blY - 18],
            [blX + 78 + shift, blY - 18],
            [blX + 102 + shift, blY - 42],
          ]);
          drawTrace([
            [blX + 18, blY - 38],
            [blX + 18, blY - 66],
            [blX + 36, blY - 84],
            [blX + 36, blY - 112 - shift],
            [blX + 52, blY - 128 - shift],
          ]);

          // Bottom-Right corner: 2 lines with stepped horizontal & long vertical trace
          drawTrace([
            [brX - 38, brY - 16],
            [brX - 66, brY - 16],
            [brX - 84, brY - 34],
            [brX - 116 - shift, brY - 34],
            [brX - 132 - shift, brY - 50],
          ]);
          drawTrace([
            [brX - 16, brY - 44],
            [brX - 16, brY - 98 - shift],
            [brX - 38, brY - 120 - shift],
          ]);

          ctx.restore();

          ctx.restore(); // End clip for inner content container

          // 3. Harmonious single content container border right at the face limit (pad = 8)
          const borderGrad = ctx.createLinearGradient(
            pad,
            pad,
            texSize - pad,
            texSize - pad
          );
          borderGrad.addColorStop(0, isLight ? `${item.color}cc` : `${item.color}99`);
          borderGrad.addColorStop(
            0.5,
            isLight ? 'rgba(100, 116, 139, 0.42)' : 'rgba(148, 163, 184, 0.34)'
          );
          borderGrad.addColorStop(1, isLight ? `${item.color}99` : `${item.color}75`);

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(pad, pad, frameSize, frameSize, frameRadius);
          ctx.strokeStyle = borderGrad;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = isLight ? 8 : 12;
          ctx.stroke();
          ctx.restore();

          // 4. Layered circular tech emblem behind the symbol
          const badgeRadius = 82;
          const badgeY = texSize / 2 - 66;
          const badgeGrad = ctx.createRadialGradient(
            texSize / 2,
            badgeY,
            8,
            texSize / 2,
            badgeY,
            badgeRadius
          );
          badgeGrad.addColorStop(0, isLight ? `${item.color}2e` : `${item.color}32`);
          badgeGrad.addColorStop(0.7, isLight ? `${item.color}16` : `${item.color}18`);
          badgeGrad.addColorStop(1, `${item.color}08`);

          ctx.beginPath();
          ctx.arc(texSize / 2, badgeY, badgeRadius, 0, Math.PI * 2);
          ctx.fillStyle = badgeGrad;
          ctx.fill();

          // Crisp concentric ring around the badge
          ctx.beginPath();
          ctx.arc(texSize / 2, badgeY, badgeRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isLight ? `${item.color}66` : `${item.color}48`;
          ctx.lineWidth = 1.75;
          ctx.stroke();

          // Outer dashed orbital ring for technical detail
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([6, 8]);
          ctx.arc(texSize / 2, badgeY, badgeRadius + 11, 0, Math.PI * 2);
          ctx.strokeStyle = isLight ? `${item.color}42` : `${item.color}28`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
          ctx.restore();

          // 5. Tech Symbol with soft neon glow
          ctx.save();
          ctx.shadowColor = item.color;
          ctx.shadowBlur = isLight ? 10 : 18;
          ctx.fillStyle = item.color;
          ctx.font =
            '900 62px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.symbol, texSize / 2, badgeY + 2);
          ctx.restore();

          // Content strictly centered inside a 320px safe zone
          const safeTextWidth = 320;

          // 6. Tech Name
          ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
          ctx.font = '800 34px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.name, texSize / 2, texSize / 2 + 48, safeTextWidth);

          // 7. Subtle glowing accent divider bar between title and subtitle
          const barWidth = 64;
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

          // 8. Tech Subtitle (auto-fitted so it never overflows the safe zone)
          ctx.fillStyle = isLight ? '#334155' : '#dbeafe';
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

        // Matte Lambert material with subtle micro-bump texture — rich 3D depth with zero glare
        return new THREE.MeshLambertMaterial({
          map: texture,
          bumpMap: sharedBumpMap,
          bumpScale: isLight ? 0.003 : 0.008,
        });
      });
    };

    let materials = buildMaterials();

    // True 3D RoundedBoxGeometry (smooth curved corners and edges with 0 gaps)
    const geometry = new RoundedBoxGeometry(2.15, 2.15, 2.15, 8, 0.26);
    const cubeMesh = new THREE.Mesh(geometry, materials);
    cubeMesh.rotation.set(-0.35, 0.55, 0);
    scene.add(cubeMesh);

    // Balanced 3-point matte lighting adapted to theme (Three.js BRDF_Lambert divides by Math.PI)
    const isInitialLight =
      document.documentElement.getAttribute('data-theme') === 'light';
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      isInitialLight ? 2.25 : 1.05
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      isInitialLight ? 1.25 : 1.65
    );
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
      0x94a3b8,
      isInitialLight ? 0.75 : 0.55
    );
    fillLight.position.set(-5, -3, 2);
    scene.add(fillLight);

    // Rebuild textures and rebalance lighting if user switches theme mode or accent color
    const observer = new MutationObserver(() => {
      const isLightNow =
        document.documentElement.getAttribute('data-theme') === 'light';
      ambientLight.intensity = isLightNow ? 2.25 : 1.05;
      keyLight.intensity = isLightNow ? 1.25 : 1.65;
      fillLight.intensity = isLightNow ? 0.75 : 0.55;

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

    // Animation Loop with smooth real-time damping (lerp) during and after drag
    let frameId = 0;
    let clockTime = 0;
    let currentRx = -0.32;
    let currentRy = 0.55;

    const animate = () => {
      if (!isDraggingRef.current) {
        const speed = isHoveredRef.current ? 0.0025 : 0.009;
        clockTime += speed;
      }

      const targetRy = 0.55 + clockTime + manualRotationRef.current.ry;
      const targetRx =
        -0.32 +
        Math.sin(clockTime * 0.7) * 0.34 +
        manualRotationRef.current.rx;

      // Smoothly interpolate (lerp) every frame so dragging moves the cube in real time with fluid inertia
      currentRy += (targetRy - currentRy) * 0.16;
      currentRx += (targetRx - currentRx) * 0.16;

      cubeMesh.rotation.y = currentRy;
      cubeMesh.rotation.x = currentRx;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      geometry.dispose();
      sharedBumpMap.dispose();
      materials.forEach((mat) => {
        mat.map?.dispose();
        mat.dispose();
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
      {/* Subtle spherical orb behind the 3D cube with smooth radial falloff to 0% (never clips) */}
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
