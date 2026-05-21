/** Maps inventory element → illustration pool (not tied to specific items). */
export const CATEGORY_TO_POOL = {
  wood: 'herbs',
  earth: 'crystals',
  fire: 'candles',
  water: 'jars',
  metal: 'curios',
};

/** How many variants exist per pool (cycles when you stock more). Drop PNGs as {pool}/{pool}-01.webp … */
export const POOL_VARIANT_COUNT = {
  jars: 12,
  herbs: 8,
  crystals: 8,
  candles: 6,
  curios: 6,
};

/** Render order — back-of-cupboard categories first, jars forward. */
export const POOL_LAYER_ORDER = ['crystals', 'curios', 'herbs', 'candles', 'jars'];

export function poolForCategory(categoryId) {
  return CATEGORY_TO_POOL[categoryId] || 'curios';
}
