import {
  CanvasTexture,
  MeshLambertMaterial,
  SRGBColorSpace,
} from 'three';
import { CUBE_FACES_TECH } from '@/entities/skill';
import { drawCornerRoots } from './cube-root-traces';

const TEX_SIZE = 512;
const FRAME_PAD = 8;
const FRAME_RADIUS = 62;

/**
 * Creates a shared procedural micro-texture bump map clipped strictly inside the face border.
 */
export function createCubeBumpTexture(): CanvasTexture {
  const bumpCanvas = document.createElement('canvas');

  bumpCanvas.width = TEX_SIZE;
  bumpCanvas.height = TEX_SIZE;

  const bCtx = bumpCanvas.getContext('2d');

  if (bCtx) {
    const frameSize = TEX_SIZE - FRAME_PAD * 2;

    // Smooth neutral height outside the border
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

    // Fine micro-grid relief strictly inside the content border
    bCtx.save();
    bCtx.beginPath();
    bCtx.roundRect(FRAME_PAD, FRAME_PAD, frameSize, frameSize, FRAME_RADIUS);
    bCtx.clip();

    bCtx.strokeStyle = '#969696';
    bCtx.lineWidth = 1;

    const step = 16;

    bCtx.beginPath();

    for (let i = 0; i <= TEX_SIZE; i += step) {
      bCtx.moveTo(i, 0);
      bCtx.lineTo(i, TEX_SIZE);
      bCtx.moveTo(0, i);
      bCtx.lineTo(TEX_SIZE, i);
    }

    bCtx.stroke();

    bCtx.restore();
  }

  const bumpTex = new CanvasTexture(bumpCanvas);

  bumpTex.anisotropy = 4;

  return bumpTex;
}

/**
 * Builds the 6 Lambert materials for the 3D technology cube adapted to the active theme mode.
 */
export function buildCubeMaterials(
  sharedBumpMap: CanvasTexture,
  isLight: boolean
): MeshLambertMaterial[] {
  const frameSize = TEX_SIZE - FRAME_PAD * 2;

  return CUBE_FACES_TECH.map((item, faceIdx) => {
    const canvas = document.createElement('canvas');

    canvas.width = TEX_SIZE;
    canvas.height = TEX_SIZE;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 1. Area outside the border (no content): clean solid background with a slightly shifted tone
      ctx.fillStyle = isLight ? '#e2e8f0' : '#182642';
      ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

      // 2. Content area (strictly inside the border at pad = 8): base + textures
      ctx.save();

      ctx.beginPath();

      ctx.roundRect(FRAME_PAD, FRAME_PAD, frameSize, frameSize, FRAME_RADIUS);

      ctx.fillStyle = isLight ? '#ffffff' : '#111c35';

      ctx.fill();
      ctx.clip();

      // Tactile architectural tech grid + micro-dots inside the content container (single batched stroke)
      const gridStep = 32;

      ctx.strokeStyle = isLight
        ? 'rgba(15, 23, 42, 0.075)'
        : 'rgba(148, 163, 184, 0.055)';

      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = gridStep; i < TEX_SIZE; i += gridStep) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, TEX_SIZE);
        ctx.moveTo(0, i);
        ctx.lineTo(TEX_SIZE, i);
      }

      ctx.stroke();

      // Micro intersection nodes inside the face
      ctx.fillStyle = isLight ? `${item.color}55` : `${item.color}2e`;

      for (let x = gridStep; x <= TEX_SIZE - gridStep; x += gridStep) {
        for (let y = gridStep; y <= TEX_SIZE - gridStep; y += gridStep) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      // Vibrant multi-layered radial color infusion
      const primaryAura = ctx.createRadialGradient(
        TEX_SIZE / 2,
        TEX_SIZE / 2 - 36,
        12,
        TEX_SIZE / 2,
        TEX_SIZE / 2,
        225
      );

      primaryAura.addColorStop(0, isLight ? `${item.color}2e` : `${item.color}42`);
      primaryAura.addColorStop(
        0.45,
        isLight ? `${item.color}14` : `${item.color}1c`
      );
      primaryAura.addColorStop(
        0.78,
        isLight ? `${item.color}06` : `${item.color}08`
      );
      primaryAura.addColorStop(
        1,
        isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(17, 28, 53, 0)'
      );

      ctx.fillStyle = primaryAura;
      ctx.fillRect(FRAME_PAD, FRAME_PAD, frameSize, frameSize);

      // Subtle top-left anodized highlight wash for extra depth
      const sheenAura = ctx.createRadialGradient(140, 120, 10, 140, 120, 180);

      sheenAura.addColorStop(
        0,
        isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)'
      );
      sheenAura.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = sheenAura;
      ctx.fillRect(FRAME_PAD, FRAME_PAD, frameSize, frameSize);

      // Unique organic root-like dual trajectories emerging from each of the 4 corners per face
      drawCornerRoots({
        ctx,
        texSize: TEX_SIZE,
        pad: FRAME_PAD,
        faceIdx,
        accentHex: item.color,
        isLight,
      });

      ctx.restore(); // End clip for inner content container

      // 3. Harmonious single content container border right at the face limit (pad = 8)
      const borderGrad = ctx.createLinearGradient(
        FRAME_PAD,
        FRAME_PAD,
        TEX_SIZE - FRAME_PAD,
        TEX_SIZE - FRAME_PAD
      );
      borderGrad.addColorStop(0, isLight ? `${item.color}cc` : `${item.color}99`);
      borderGrad.addColorStop(
        0.5,
        isLight ? 'rgba(100, 116, 139, 0.42)' : 'rgba(148, 163, 184, 0.34)'
      );
      borderGrad.addColorStop(1, isLight ? `${item.color}99` : `${item.color}75`);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(FRAME_PAD, FRAME_PAD, frameSize, frameSize, FRAME_RADIUS);
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = isLight ? 8 : 12;
      ctx.stroke();
      ctx.restore();

      // 4. Layered circular tech emblem behind the symbol
      const badgeRadius = 82;

      const badgeY = TEX_SIZE / 2 - 66;

      const badgeGrad = ctx.createRadialGradient(
        TEX_SIZE / 2,
        badgeY,
        8,
        TEX_SIZE / 2,
        badgeY,
        badgeRadius
      );

      badgeGrad.addColorStop(0, isLight ? `${item.color}2e` : `${item.color}32`);
      badgeGrad.addColorStop(0.7, isLight ? `${item.color}16` : `${item.color}18`);
      badgeGrad.addColorStop(1, `${item.color}08`);

      ctx.beginPath();
      ctx.arc(TEX_SIZE / 2, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = badgeGrad;
      ctx.fill();

      // Crisp concentric ring around the badge
      ctx.beginPath();
      ctx.arc(TEX_SIZE / 2, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isLight ? `${item.color}66` : `${item.color}48`;
      ctx.lineWidth = 1.75;
      ctx.stroke();

      // Outer dashed orbital ring for technical detail
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 8]);
      ctx.arc(TEX_SIZE / 2, badgeY, badgeRadius + 11, 0, Math.PI * 2);
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
      ctx.fillText(item.symbol, TEX_SIZE / 2, badgeY + 2);
      ctx.restore();

      // Content strictly centered inside a 320px safe zone
      const safeTextWidth = 320;

      // 6. Tech Name
      ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
      ctx.font = '800 34px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.name, TEX_SIZE / 2, TEX_SIZE / 2 + 48, safeTextWidth);

      // 7. Subtle glowing accent divider bar between title and subtitle
      const barWidth = 64;

      const barY = TEX_SIZE / 2 + 76;

      const barGrad = ctx.createLinearGradient(
        TEX_SIZE / 2 - barWidth,
        barY,
        TEX_SIZE / 2 + barWidth,
        barY
      );
      barGrad.addColorStop(0, 'rgba(255,255,255,0)');
      barGrad.addColorStop(0.5, item.color);
      barGrad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = barGrad;
      ctx.fillRect(TEX_SIZE / 2 - barWidth, barY - 1.5, barWidth * 2, 3);

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

      ctx.fillText(item.subtitle, TEX_SIZE / 2, TEX_SIZE / 2 + 106);
    }

    const texture = new CanvasTexture(canvas);

    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;

    return new MeshLambertMaterial({
      map: texture,
      bumpMap: sharedBumpMap,
      bumpScale: isLight ? 0.003 : 0.008,
    });
  });
}

