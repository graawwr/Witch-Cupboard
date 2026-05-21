import { matchByName } from './herbarium.js';

/** Try in order when resolving drop-in assets under public/icons/items/ */
export const ICON_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg', 'svg'];

/** Stable key for public/icons/items/{key}.{ext} — Midjourney PNGs drop in by this name. */
export function resolveIconKey(item) {
  if (item?.iconKey) return item.iconKey;
  const match = matchByName(item?.name || '');
  if (match?.id) return match.id;
  return `_cat-${item?.category || 'metal'}`;
}

export function iconUrl(key, ext) {
  return `/icons/items/${key}.${ext}`;
}

/** Suggest icon key when stocking from the grimoire catalog name. */
export function suggestIconKey(name, category) {
  const match = matchByName(name);
  if (match?.id) return match.id;
  return `_cat-${category || 'metal'}`;
}
