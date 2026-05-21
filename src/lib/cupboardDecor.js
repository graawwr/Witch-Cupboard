import {
  POOL_LAYER_ORDER,
  POOL_VARIANT_COUNT,
  poolForCategory,
} from '../data/decorPools.js';

const MIN_SHELVES = 3;
const DECOR_PER_ROW = 5;

function pad2(n) {
  return String(n + 1).padStart(2, '0');
}

/** Deterministic 0..1 from a numeric seed. */
export function seededUnit(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Build decorative sprites from inventory — one per stocked item, grouped by pool.
 * Not linked to item ids; order is stable for a given inventory snapshot.
 */
export function buildDecorations(items) {
  const byPool = {};
  for (const pool of POOL_LAYER_ORDER) {
    byPool[pool] = [];
  }

  const sorted = [...items].sort(
    (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
  );

  return sorted.flatMap((item) => {
    const pool = poolForCategory(item.category);
    const variant = byPool[pool].length % (POOL_VARIANT_COUNT[pool] || 6);
    const decor = {
      id: `decor-${pool}-${byPool[pool].length}-${item.id}`,
      pool,
      variant,
      assetName: `${pool}-${pad2(variant)}`,
      seed: byPool[pool].length * 17 + variant * 31 + POOL_LAYER_ORDER.indexOf(pool),
    };
    byPool[pool].push(decor);
    return decor;
  });
}

/** Split decorations into shelf rows. */
export function chunkDecorRows(decorations, perRow = DECOR_PER_ROW) {
  const rows = [];
  for (let i = 0; i < decorations.length; i += perRow) {
    rows.push(decorations.slice(i, i + perRow));
  }
  while (rows.length < MIN_SHELVES) {
    rows.push([]);
  }
  return rows;
}

/**
 * Overlapping placement within one shelf row.
 * @returns {{ left: string, bottom: string, scale: number, zIndex: number, rotate: number }}
 */
export function decorPlacement(decor, indexInRow, rowLength) {
  const u = seededUnit(decor.seed);
  const v = seededUnit(decor.seed + 1);
  const slots = Math.max(rowLength, 1);
  const slotWidth = 100 / slots;
  const baseLeft = indexInRow * slotWidth;
  const overlap = slotWidth * 0.35;
  const left = baseLeft - indexInRow * overlap + (u - 0.5) * 4;
  const bottom = (v - 0.5) * 6;
  const scale = 0.82 + (decor.variant % 4) * 0.06 + u * 0.08;
  const rotate = (v - 0.5) * 5;
  const zIndex = indexInRow + 1;

  return {
    left: `${Math.max(0, Math.min(88, left))}%`,
    bottom: `${bottom}px`,
    scale,
    zIndex,
    rotate,
  };
}

export { MIN_SHELVES, DECOR_PER_ROW };
