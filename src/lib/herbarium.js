import plants from '../data/herbarium.json';
import { enrichHerbariumEntry } from '../data/herbariumEnrichment.js';

/** Folklore and traditional handling only — not medical or health advice. */
export const HERBARIUM_DISCLAIMER =
  'These notes record old beliefs, folk practice, and traditional handling — not counsel for the body.';

const enriched = plants.map(enrichHerbariumEntry);

/** Full reference catalog: herbs, oils, stones, candles, tools, and curios. */
export const HERBARIUM = enriched;

const byId = new Map(enriched.map((p) => [p.id, p]));

function normalize(s) {
  return (s || '').toLowerCase().trim();
}

/** Lookup by stable catalog id. */
export function getById(id) {
  return byId.get(id) ?? null;
}

/** All entries in a cupboard category (`herb`, `crystal`, `oil`, `candle`, …). */
export function filterByCategory(category) {
  return enriched.filter((p) => p.category === category);
}

/** All entries carrying a tag (`common-us`, `officinal`, `monastic`, `curio`, …). */
export function filterByTag(tag) {
  return enriched.filter((p) => p.tags?.includes(tag));
}

/**
 * Best match for a cupboard item name (exact common name, then partial).
 * Returns null if nothing plausible matches.
 */
export function matchByName(name) {
  const q = normalize(name);
  if (!q) return null;

  const exact = enriched.find((p) =>
    p.commonNames.some((n) => normalize(n) === q),
  );
  if (exact) return exact;

  const partial = enriched.find((p) =>
    p.commonNames.some((n) => {
      const nn = normalize(n);
      return nn.includes(q) || q.includes(nn);
    }),
  );
  if (partial) return partial;

  return enriched.find((p) => normalize(p.id).replace(/-/g, ' ') === q) ?? null;
}

/**
 * Search common names, latin name, id, category, and tag labels.
 * @param {string} query
 * @param {{ limit?: number, tags?: string[], category?: string }} [opts]
 */
export function search(query, { limit = 12, tags, category } = {}) {
  const q = normalize(query);
  let pool = enriched;

  if (tags?.length) {
    pool = pool.filter((p) => tags.every((t) => p.tags?.includes(t)));
  }
  if (category) {
    pool = pool.filter((p) => p.category === category);
  }

  if (!q) return pool.slice(0, limit);

  const scored = pool
    .map((p) => {
      let score = 0;
      const names = p.commonNames.map(normalize);
      if (names.some((n) => n === q)) score += 100;
      if (names.some((n) => n.startsWith(q))) score += 50;
      if (names.some((n) => n.includes(q))) score += 30;
      if (normalize(p.latinName).includes(q)) score += 20;
      if (normalize(p.id).includes(q.replace(/\s+/g, '-'))) score += 15;
      if (normalize(p.category).includes(q)) score += 12;
      if (p.tags?.some((t) => t.includes(q))) score += 10;
      return { p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ p }) => p);
}

/** One-line summary for notes pre-fill from folk tradition. */
export function summaryForNotes(entry) {
  if (!entry) return '';
  const e = enrichHerbariumEntry(entry);
  const bits = [...(e.folkTradition ?? []).slice(0, 2)];
  return bits.join(', ').slice(0, 120);
}
