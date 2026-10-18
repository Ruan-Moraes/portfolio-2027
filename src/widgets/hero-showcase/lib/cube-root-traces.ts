interface DrawCornerRootsParams {
  ctx: CanvasRenderingContext2D;
  texSize: number;
  pad: number;
  faceIdx: number;
  accentHex: string;
  isLight: boolean;
}

function createDeterministicRng(seedInput: number): () => number {
  let state = (seedInput ^ 0x9e3779b9) >>> 0;

  return () => {
    state = Math.imul(state ^ (state >>> 16), 0x85ebca6b) >>> 0;
    state = Math.imul(state ^ (state >>> 13), 0xc2b2ae35) >>> 0;
    state = (state ^ (state >>> 16)) >>> 0;

    return state / 4294967296;
  };
}

function isSafeRootPoint(
  x: number,
  y: number,
  isLeft: boolean,
  isTop: boolean,
  texSize: number,
  pad: number
): boolean {
  // Stay inside the rounded framex
  if (x < pad + 12 || x > texSize - pad - 12) return false;
  if (y < pad + 12 || y > texSize - pad - 12) return false;

  // Keep each corner's roots within its own quadrant/corridor so opposite corners don't cross
  if (isLeft && x > 244) return false;
  if (!isLeft && x < 268) return false;
  if (isTop && y > 250) return false;
  if (!isTop && y < 252) return false;

  // Circular badge + outer orbital ring exclusion (radius 93 + 23px margin = 116px)
  const distToBadge = Math.hypot(x - texSize / 2, y - (texSize / 2 - 66));

  if (distToBadge < 116) return false;

  // Title + divider + subtitle exclusion zone
  if (x > 76 && x < 436 && y > 268 && y < 388) return false;

  return true;
}

function drawRootSegmentChain(
  ctx: CanvasRenderingContext2D,
  pts: Array<[number, number]>,
  baseWidth: number,
  isSubBranch: boolean,
  accentHex: string,
  isLight: boolean
) {
  if (pts.length < 2) return;

  for (let i = 0; i < pts.length - 1; i += 1) {
    const progress = i / Math.max(1, pts.length - 1);

    ctx.beginPath();
    ctx.moveTo(pts[i][0], pts[i][1]);
    ctx.lineTo(pts[i + 1][0], pts[i + 1][1]);
    ctx.lineWidth = Math.max(0.9, baseWidth * (1 - progress * 0.38));
    ctx.strokeStyle = isSubBranch
      ? isLight
        ? `${accentHex}78`
        : `${accentHex}48`
      : isLight
        ? `${accentHex}a8`
        : `${accentHex}6e`;
    ctx.stroke();
  }

  const tip = pts[pts.length - 1];

  ctx.beginPath();
  ctx.arc(tip[0], tip[1], isSubBranch ? 2.1 : 3, 0, Math.PI * 2);
  ctx.fillStyle = accentHex;
  ctx.fill();
}

interface ComputedRootTrace {
  mainPts: Array<[number, number]>;
  subBranches: Array<Array<[number, number]>>;
}

const rootGeometryCache = new Map<string, ComputedRootTrace[]>();

function getOrComputeFaceRoots(
  faceIdx: number,
  texSize: number,
  pad: number
): ComputedRootTrace[] {
  const cacheKey = `${faceIdx}:${texSize}:${pad}`;

  const cached = rootGeometryCache.get(cacheKey);

  if (cached) return cached;

  const corners = [
    { cornerIdx: 0, isLeft: true, isTop: true, cx: pad + 14, cy: pad + 14 },
    {
      cornerIdx: 1,
      isLeft: false,
      isTop: true,
      cx: texSize - pad - 14,
      cy: pad + 14,
    },
    {
      cornerIdx: 2,
      isLeft: true,
      isTop: false,
      cx: pad + 14,
      cy: texSize - pad - 14,
    },
    {
      cornerIdx: 3,
      isLeft: false,
      isTop: false,
      cx: texSize - pad - 14,
      cy: texSize - pad - 14,
    },
  ];

  const traces: ComputedRootTrace[] = [];

  corners.forEach(({ cornerIdx, isLeft, isTop, cx, cy }) => {
    const dirX = isLeft ? 1 : -1;
    const dirY = isTop ? 1 : -1;

    // 2 distinct primary roots per corner (0 = horizontal-corridor root, 1 = vertical-corridor root)
    for (let rootIdx = 0; rootIdx < 2; rootIdx += 1) {
      const rng = createDeterministicRng(
        (faceIdx + 1) * 7919 +
          (cornerIdx + 1) * 104729 +
          (rootIdx + 1) * 15485863
      );

      const startAlong = Math.round(34 + rng() * 14);
      const startPerp = Math.round(12 + rng() * 8);

      const startX =
        rootIdx === 0 ? cx + dirX * startAlong : cx + dirX * startPerp;
      const startY =
        rootIdx === 0 ? cy + dirY * startPerp : cy + dirY * startAlong;

      const mainPts: Array<[number, number]> = [[startX, startY]];
      const subBranches: Array<Array<[number, number]>> = [];

      let currentAngle =
        rootIdx === 0
          ? isLeft
            ? 0.08 + rng() * 0.16
            : Math.PI - (0.08 + rng() * 0.16)
          : isTop
            ? Math.PI / 2 - dirX * (0.08 + rng() * 0.16)
            : -Math.PI / 2 + dirX * (0.08 + rng() * 0.16);

      const numSteps = 4 + Math.floor(rng() * 2);

      for (let step = 0; step < numSteps; step += 1) {
        const prev = mainPts[mainPts.length - 1];
        const segLen = 30 + rng() * 18;

        let placed = false;

        const turnCandidates = [
          (rng() - 0.42) * 0.68,
          (rng() - 0.5) * 0.45,
          0,
          -0.28 * dirY * dirX,
          0.28 * dirY * dirX,
        ];

        for (const deltaAngle of turnCandidates) {
          const candidateAngle = currentAngle + deltaAngle;

          const nx = Math.round(prev[0] + Math.cos(candidateAngle) * segLen);
          const ny = Math.round(prev[1] + Math.sin(candidateAngle) * segLen);

          if (isSafeRootPoint(nx, ny, isLeft, isTop, texSize, pad)) {
            mainPts.push([nx, ny]);
            currentAngle = candidateAngle;
            placed = true;

            if (step >= 1 && step <= 3 && rng() > 0.22) {
              const forkSign = step % 2 === 0 ? 1 : -1;
              const forkAngle =
                currentAngle + forkSign * (0.42 + rng() * 0.36);

              const forkLen1 = 18 + rng() * 14;

              const fx1 = Math.round(prev[0] + Math.cos(forkAngle) * forkLen1);
              const fy1 = Math.round(prev[1] + Math.sin(forkAngle) * forkLen1);

              if (isSafeRootPoint(fx1, fy1, isLeft, isTop, texSize, pad)) {
                const branchPts: Array<[number, number]> = [
                  [prev[0], prev[1]],
                  [fx1, fy1],
                ];

                const forkAngle2 = forkAngle + (rng() - 0.5) * 0.52;
                const forkLen2 = 14 + rng() * 12;

                const fx2 = Math.round(
                  fx1 + Math.cos(forkAngle2) * forkLen2
                );

                const fy2 = Math.round(
                  fy1 + Math.sin(forkAngle2) * forkLen2
                );

                if (isSafeRootPoint(fx2, fy2, isLeft, isTop, texSize, pad)) {
                  branchPts.push([fx2, fy2]);
                }

                subBranches.push(branchPts);
              }
            }

            break;
          }
        }

        if (!placed) break;
      }

      traces.push({ mainPts, subBranches });
    }
  });

  rootGeometryCache.set(cacheKey, traces);

  return traces;
}

/**
 * Renders 2 unique, organic tree-root trajectories per corner (8 roots per face, 48 across the cube).
 */
export function drawCornerRoots({
  ctx,
  texSize,
  pad,
  faceIdx,
  accentHex,
  isLight,
}: DrawCornerRootsParams): void {
  ctx.save();

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const traces = getOrComputeFaceRoots(faceIdx, texSize, pad);

  for (let i = 0; i < traces.length; i += 1) {
    const { mainPts, subBranches } = traces[i];

    drawRootSegmentChain(ctx, mainPts, 2.35, false, accentHex, isLight);

    for (let j = 0; j < subBranches.length; j += 1) {
      drawRootSegmentChain(ctx, subBranches[j], 1.45, true, accentHex, isLight);
    }
  }

  ctx.restore();
}

