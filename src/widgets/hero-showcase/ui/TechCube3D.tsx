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
        bCtx.fillStyle = '#808080';
        bCtx.fillRect(0, 0, texSize, texSize);

        // Fine micro-grid relief
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
      }
      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.anisotropy = 4;
      return bumpTex;
    };

    const sharedBumpMap = createBumpTexture();

    const buildMaterials = () => {
      return CUBE_FACES_TECH.map((item) => {
        const canvas = document.createElement('canvas');
        canvas.width = texSize;
        canvas.height = texSize;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const pad = 8;
          const frameSize = texSize - pad * 2;
          const frameRadius = 62;

          // 1. OUTER RIM / BEVEL TEXTURE (outside the content border):
          // Deep metallic chassis base + 45° diagonal carbon/brushed hatch texture
          ctx.fillStyle = '#0c1528';
          ctx.fillRect(0, 0, texSize, texSize);

          ctx.save();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.13)';
          ctx.lineWidth = 1.5;
          const hatchStep = 10;
          for (let i = -texSize; i < texSize * 2; i += hatchStep) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + texSize, texSize);
            ctx.stroke();
          }
          ctx.restore();

          // 2. CLIP INSIDE THE CONTENT CONTAINER (right near the face limit)
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(pad, pad, frameSize, frameSize, frameRadius);
          ctx.clip();

          // Base fill inside the face container
          ctx.fillStyle = '#111c35';
          ctx.fillRect(pad, pad, frameSize, frameSize);

          // 3. NON-CONTENT AREA TEXTURE (Hexagonal/Isometric Dot-Matrix + Engineering Grid + Circuit Traces in empty zones)
          const gridStep = 28;
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
          ctx.lineWidth = 1;
          for (let i = gridStep; i < texSize; i += gridStep) {
            ctx.beginPath();
            ctx.moveTo(i, pad);
            ctx.lineTo(i, texSize - pad);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pad, i);
            ctx.lineTo(texSize - pad, i);
            ctx.stroke();
          }

          // Dense staggered micro-dot matrix across the empty peripheral areas
          const dotSpacing = 18;
          for (let y = pad + 14; y < texSize - pad - 10; y += dotSpacing) {
            const offsetX =
              Math.floor((y - pad) / dotSpacing) % 2 === 0 ? 0 : dotSpacing / 2;
            for (
              let x = pad + 14 + offsetX;
              x < texSize - pad - 10;
              x += dotSpacing
            ) {
              // Calculate distance from the central content zone so non-content areas have stronger texture
              const dx = x - texSize / 2;
              const dy = y - (texSize / 2 + 10);
              const dist = Math.hypot(dx, dy);
              if (dist > 135) {
                ctx.fillStyle = `${item.color}42`;
                ctx.beginPath();
                ctx.arc(x, y, 1.6, 0, Math.PI * 2);
                ctx.fill();
              } else {
                ctx.fillStyle = 'rgba(148, 163, 184, 0.08)';
                ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
              }
            }
          }

          // Diagonal micro-stripes in top & bottom non-content zones (y < 96 and y > 406)
          ctx.save();
          ctx.strokeStyle = `${item.color}1f`;
          ctx.lineWidth = 1.5;
          for (let i = -texSize; i < texSize * 2; i += 12) {
            // Top empty zone stripe band
            ctx.beginPath();
            ctx.moveTo(i, pad);
            ctx.lineTo(i + 72, pad + 72);
            ctx.stroke();

            // Bottom empty zone stripe band
            ctx.beginPath();
            ctx.moveTo(i, texSize - pad - 76);
            ctx.lineTo(i + 76, texSize - pad);
            ctx.stroke();
          }
          ctx.restore();

          // Technical PCB / HUD circuit traces in the 4 non-content corners
          ctx.save();
          ctx.strokeStyle = `${item.color}55`;
          ctx.fillStyle = item.color;
          ctx.lineWidth = 2;

          const drawCornerCircuit = (cx: number, cy: number, sx: number, sy: number) => {
            ctx.beginPath();
            ctx.moveTo(cx + sx * 42, cy + sy * 18);
            ctx.lineTo(cx + sx * 92, cy + sy * 18);
            ctx.lineTo(cx + sx * 112, cy + sy * 38);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx + sx * 112, cy + sy * 38, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx + sx * 18, cy + sy * 42);
            ctx.lineTo(cx + sx * 18, cy + sy * 92);
            ctx.lineTo(cx + sx * 38, cy + sy * 112);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx + sx * 38, cy + sy * 112, 3, 0, Math.PI * 2);
            ctx.fill();
          };

          drawCornerCircuit(pad + 12, pad + 12, 1, 1);
          drawCornerCircuit(texSize - pad - 12, pad + 12, -1, 1);
          drawCornerCircuit(pad + 12, texSize - pad - 12, 1, -1);
          drawCornerCircuit(texSize - pad - 12, texSize - pad - 12, -1, -1);
          ctx.restore();

          // 4. Vibrant multi-layered radial color infusion around the center content
          const primaryAura = ctx.createRadialGradient(
            texSize / 2,
            texSize / 2 - 36,
            12,
            texSize / 2,
            texSize / 2,
            230
          );
          primaryAura.addColorStop(0, `${item.color}44`);
          primaryAura.addColorStop(0.48, `${item.color}1e`);
          primaryAura.addColorStop(0.82, `${item.color}0a`);
          primaryAura.addColorStop(1, 'rgba(17, 28, 53, 0)');
          ctx.fillStyle = primaryAura;
          ctx.fillRect(pad, pad, frameSize, frameSize);

          ctx.restore(); // End clip for inner container

          // 5. Harmonious content container border positioned right at the face limit (pad = 8)
          const borderGrad = ctx.createLinearGradient(
            pad,
            pad,
            texSize - pad,
            texSize - pad
          );
          borderGrad.addColorStop(0, `${item.color}b3`);
          borderGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.42)');
          borderGrad.addColorStop(1, `${item.color}88`);

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(pad, pad, frameSize, frameSize, frameRadius);
          ctx.strokeStyle = borderGrad;
          ctx.lineWidth = 4;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();

          // 6. Layered circular tech emblem behind the symbol
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
          badgeGrad.addColorStop(0, `${item.color}36`);
          badgeGrad.addColorStop(0.7, `${item.color}1a`);
          badgeGrad.addColorStop(1, `${item.color}0a`);

          ctx.beginPath();
          ctx.arc(texSize / 2, badgeY, badgeRadius, 0, Math.PI * 2);
          ctx.fillStyle = badgeGrad;
          ctx.fill();

          // Crisp concentric ring around the badge
          ctx.beginPath();
          ctx.arc(texSize / 2, badgeY, badgeRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `${item.color}50`;
          ctx.lineWidth = 1.75;
          ctx.stroke();

          // Outer dashed orbital ring for technical detail
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([6, 8]);
          ctx.arc(texSize / 2, badgeY, badgeRadius + 11, 0, Math.PI * 2);
          ctx.strokeStyle = `${item.color}30`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
          ctx.restore();

          // 6. Tech Symbol with soft neon glow
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

          // 7. Tech Name
          ctx.fillStyle = '#f8fafc';
          ctx.font = '800 34px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.name, texSize / 2, texSize / 2 + 48, safeTextWidth);

          // 8. Subtle glowing accent divider bar between title and subtitle
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

          // 9. Tech Subtitle (auto-fitted so it never overflows the safe zone)
          ctx.fillStyle = '#dbeafe';
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
          bumpScale: 0.008,
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
