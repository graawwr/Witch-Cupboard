import { useCallback, useState } from 'react';
import { ICON_EXTENSIONS, iconUrl, resolveIconKey } from '../lib/itemIcons.js';
import { categoryMeta } from '../data/categories.js';

/** Hand-drawn inline fallbacks when no file exists in public/icons/items/. */
const INLINE_ART = {
  '_cat-wood': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 54V28" />
      <path d="M32 38c-8-3-14-8-16-16M32 34c8-3 14-8 16-16" />
      <path d="M32 30c-5-2-8-5-9-10M32 26c5-2 8-5 9-10" />
      <ellipse cx="32" cy="20" rx="4" ry="6" />
    </svg>
  ),
  '_cat-fire': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M28 52V24c0-4 4-8 8-8s8 4 8 8v28" />
      <path d="M26 52h20" />
      <path d="M32 16c-2 2-3 4-3 6s1.5 3 3 3 3-1 3-3-1-4-3-6z" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  ),
  '_cat-earth': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M32 8 48 24v16L32 56 16 40V24z" />
      <path d="M32 8v48M16 24l32 16M48 24 16 40" opacity="0.45" />
    </svg>
  ),
  '_cat-water': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M26 14h12l-2 6H28z" />
      <path d="M24 20h16v28c0 4-3 8-8 8s-8-4-8-8V20z" />
      <path d="M28 32h8" opacity="0.4" />
    </svg>
  ),
  '_cat-metal': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M14 50 38 26" />
      <path d="M38 26l8-8 4 4-8 8" />
      <path d="M42 18 46 14" />
    </svg>
  ),
  '_cat-herb': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 54V28" />
      <path d="M32 38c-8-3-14-8-16-16M32 34c8-3 14-8 16-16" />
      <path d="M32 30c-5-2-8-5-9-10M32 26c5-2 8-5 9-10" />
      <ellipse cx="32" cy="20" rx="4" ry="6" />
    </svg>
  ),
  '_cat-candle': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M28 52V24c0-4 4-8 8-8s8 4 8 8v28" />
      <path d="M26 52h20" />
      <path d="M32 16c-2 2-3 4-3 6s1.5 3 3 3 3-1 3-3-1-4-3-6z" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  ),
  '_cat-crystal': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M32 8 48 24v16L32 56 16 40V24z" />
      <path d="M32 8v48M16 24l32 16M48 24 16 40" opacity="0.45" />
    </svg>
  ),
  '_cat-jar': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M22 22h20v4c6 2 10 8 10 14v12H12V40c0-6 4-12 10-14v-4z" />
      <path d="M24 22v-4c0-2 2-4 8-4s8 2 8 4v4" />
      <ellipse cx="32" cy="38" rx="10" ry="6" opacity="0.25" />
    </svg>
  ),
  '_cat-oil': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M26 14h12l-2 6H28z" />
      <path d="M24 20h16v28c0 4-3 8-8 8s-8-4-8-8V20z" />
      <path d="M28 32h8" opacity="0.4" />
    </svg>
  ),
  '_cat-salt': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M18 40h28l-4 14H22z" />
      <path d="M22 40 32 18l10 22" />
      <circle cx="28" cy="46" r="1" fill="currentColor" />
      <circle cx="34" cy="44" r="1" fill="currentColor" />
      <circle cx="36" cy="48" r="1" fill="currentColor" />
    </svg>
  ),
  '_cat-powder': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M20 24h24v28H20z" />
      <path d="M18 24h28" />
      <path d="M26 20h12v4H26z" />
      <path d="M24 36c4 2 12 2 16 0" opacity="0.45" />
    </svg>
  ),
  '_cat-resin': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M20 44c0-12 6-20 12-28 6 8 12 16 12 28H20z" />
      <path d="M26 36h12" opacity="0.4" />
    </svg>
  ),
  '_cat-flower': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M32 54V34" />
      <circle cx="32" cy="24" r="4" />
      <path d="M32 14v6M32 28v6M22 24h6M36 24h6M25 17l4 4M35 27l4 4M39 17l-4 4M29 27l-4 4" />
    </svg>
  ),
  '_cat-tool': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M14 50 38 26" />
      <path d="M38 26l8-8 4 4-8 8" />
      <path d="M42 18 46 14" />
    </svg>
  ),
  '_cat-other': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <circle cx="32" cy="32" r="14" />
      <path d="M32 22v4M32 38v4M22 32h4M38 32h4" />
    </svg>
  ),
  lavender: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M32 54V30" />
      <path d="M26 34c2-6 4-10 6-14M38 34c-2-6-4-10-6-14" />
      <circle cx="26" cy="18" r="3" /><circle cx="32" cy="14" r="3" /><circle cx="38" cy="18" r="3" />
    </svg>
  ),
  rosemary: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M32 54V22" />
      <path d="M32 40c-10-2-14-8-14-14M32 32c10-2 14-8 14-14" />
      <path d="M24 28l4 2M40 28l-4 2" opacity="0.5" />
    </svg>
  ),
  sage: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M32 54V26" />
      <path d="M32 26c-10 0-16-6-16-12 0 8 4 14 16 16 12-2 16-8 16-16 0 6-6 12-16 12z" />
    </svg>
  ),
  'white-candle': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M28 52V26c0-3 2-6 4-6s4 3 4 6v26" />
      <path d="M26 52h12" />
      <path d="M32 18c-1.5 1.5-2 3-2 4.5S31 24 32 24s2-1 2-1.5S33.5 19.5 32 18z" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  ),
  'black-candle': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M28 52V26c0-3 2-6 4-6s4 3 4 6v26" fill="currentColor" fillOpacity="0.12" />
      <path d="M26 52h12" />
      <path d="M32 18c-1.5 1.5-2 3-2 4.5S31 24 32 24s2-1 2-1.5S33.5 19.5 32 18z" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  ),
  amethyst: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M32 10 46 26v14L32 54 18 40V26z" />
      <path d="M32 10v44M18 26l28 14M46 26 18 40" opacity="0.35" />
    </svg>
  ),
  'rose-quartz': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M32 12 44 28v12L32 52 20 40V28z" />
      <path d="M26 30h12M28 36h8" opacity="0.35" />
    </svg>
  ),
  'sea-salt': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M16 42h32l-6 12H22z" />
      <path d="M20 42 32 16l12 26" />
    </svg>
  ),
  frankincense: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M22 46c0-14 8-22 10-30 2 8 10 16 10 30H22z" />
      <path d="M28 28c2 2 6 2 8 0" opacity="0.4" />
    </svg>
  ),
  'small-glass-jar': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M24 20h16v6c8 2 12 10 12 16v12H12V42c0-6 4-14 12-16v-6z" />
      <path d="M26 20v-6c0-2 3-4 6-4s6 2 6 4v6" />
    </svg>
  ),
};

function InlineFallback({ iconKey, category, emoji }) {
  const art = INLINE_ART[iconKey] || INLINE_ART[`_cat-${category}`] || INLINE_ART['_cat-metal'];
  if (art) {
    return <span className="item-icon-inline" aria-hidden>{art}</span>;
  }
  return <span className="item-icon-emoji" aria-hidden>{emoji}</span>;
}

/**
 * Illustrated cupboard icon — tries public/icons/items/{key}.* then inline art.
 */
export default function ItemIcon({ item, size = 'md', className = '' }) {
  const iconKey = resolveIconKey(item);
  const cat = categoryMeta(item.category);
  const emoji = item.emoji || cat.emoji;
  const [extIndex, setExtIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (extIndex < ICON_EXTENSIONS.length - 1) {
      setExtIndex((i) => i + 1);
    } else {
      setFailed(true);
    }
  }, [extIndex]);

  const sizeClass = size === 'lg' ? 'item-icon-lg' : size === 'sm' ? 'item-icon-sm' : 'item-icon-md';

  if (!failed && extIndex < ICON_EXTENSIONS.length) {
    const src = iconUrl(iconKey, ICON_EXTENSIONS[extIndex]);
    return (
      <span className={`item-icon ${sizeClass} ${className}`.trim()}>
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
      </span>
    );
  }

  return (
    <span className={`item-icon ${sizeClass} item-icon-fallback ${className}`.trim()}>
      <InlineFallback iconKey={iconKey} category={item.category} emoji={emoji} />
    </span>
  );
}

export { INLINE_ART };
