/** Inline illustrated fallbacks until PNGs land in public/cupboard/decor/ */

const JAR = (
  <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M22 18h20v6c8 2 12 10 12 18v28H12V42c0-8 4-16 12-18v-6z" />
    <path d="M24 18v-5c0-2 3-5 8-5s8 3 8 5v5" />
  </svg>
);

const HERB = (
  <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M32 72V38" />
    <path d="M32 52c-10-4-16-12-18-22M32 46c10-4 16-12 18-22" />
    <ellipse cx="32" cy="28" rx="5" ry="8" />
  </svg>
);

const CRYSTAL = (
  <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
    <path d="M32 8 50 28v20L32 72 14 48V28z" />
    <path d="M32 8v64M14 28l36 20M50 28 14 48" opacity="0.35" />
  </svg>
);

const CANDLE = (
  <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M26 72V32c0-4 3-8 6-8s6 4 6 8v40" />
    <path d="M24 72h16" />
    <path d="M32 22c-2 2-2.5 4-2.5 5.5S31 29 32 29s2.5-1 2.5-1.5S34 24 32 22z" fill="currentColor" stroke="none" opacity="0.35" />
  </svg>
);

const CURIO = (
  <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <circle cx="32" cy="36" r="14" />
    <path d="M32 50v18M22 68h20" />
  </svg>
);

const POOL_ART = {
  jars: [JAR, JAR, JAR, JAR],
  herbs: [HERB, HERB, HERB],
  crystals: [CRYSTAL, CRYSTAL, CRYSTAL],
  candles: [CANDLE, CANDLE],
  curios: [CURIO, CURIO, CURIO],
};

export function DecorFallback({ pool, variant }) {
  const set = POOL_ART[pool] || POOL_ART.curios;
  const art = set[variant % set.length];
  return <span className="decor-fallback-art">{art}</span>;
}
