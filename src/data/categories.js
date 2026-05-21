export const CATEGORIES = [
  { id: 'wood',  label: 'Wood',  emoji: '🌿', unit: 'g'   },
  { id: 'fire',  label: 'Fire',  emoji: '🔥', unit: 'pcs' },
  { id: 'earth', label: 'Earth', emoji: '🪨', unit: 'pcs' },
  { id: 'metal', label: 'Metal', emoji: '🗝️', unit: 'pcs' },
  { id: 'water', label: 'Water', emoji: '🧴', unit: 'ml'  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

/** Old cupboard categories → five elements (for saved inventory). */
export const LEGACY_CATEGORY_MAP = {
  herb: 'wood',
  flower: 'wood',
  powder: 'wood',
  candle: 'fire',
  resin: 'fire',
  crystal: 'earth',
  salt: 'earth',
  oil: 'water',
  jar: 'metal',
  tool: 'metal',
  other: 'metal',
};

export function categoryMeta(id) {
  if (CATEGORY_MAP[id]) return CATEGORY_MAP[id];
  const element = LEGACY_CATEGORY_MAP[id];
  if (element && CATEGORY_MAP[element]) return CATEGORY_MAP[element];
  return CATEGORY_MAP.metal;
}

export function migrateItemCategory(id) {
  if (CATEGORY_MAP[id]) return id;
  return LEGACY_CATEGORY_MAP[id] || 'metal';
}

export function migrateStoredItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map((it) => ({
    ...it,
    category: migrateItemCategory(it.category),
    emoji: it.emoji || categoryMeta(migrateItemCategory(it.category)).emoji,
  }));
}

/** Popular emoji selection for the picker (kept small and witchy). */
export const EMOJI_PALETTE = [
  '🌿','🍃','🌱','🌾','🌸','🌹','🌺','🌻',
  '🌼','🌷','🪷','🍄','🪻','🌵','🌴','🌳',
  '🔥','🕯️','🪔','🍯','🥃','🧨',
  '🪨','🔮','💎','🧂','✨','⭐',
  '🗝️','🪄','⚗️','🧪','📜','🖋️','🫙','🏺',
  '🧴','💧','🍶','🫗','🧪','🍋',
  '🌙','☀️','🦉','🐍','🦇','🕸️',
];
