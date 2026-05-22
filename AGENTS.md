# Witch Cupboard — Agents Guide

This file gives AI coding agents the essential context needed to make changes that match the design direction of this project. It is a mirror of `.impeccable.md`; keep both in sync.

---

## Product

A mobile-first React app (Vite + React 19) for keeping a witchy personal inventory (herbs, candles, jars, crystals, oils…), a "Cauldron" working basket, and a "Grimoire" of saved recipe cards. The recipe cards can be exported as PNGs for sharing.

- Data lives in `localStorage` under `witch-cupboard:v1` — no backend.
- The app is built as a PWA today and wrapped with Capacitor later; do not rely on desktop-only APIs.
- Three tabs (`Cupboard`, `Cauldron`, `Grimoire`) managed by state in `src/App.jsx`.

## Design Context

### Users

A solo practitioner who keeps a personal inventory AND shares the recipe cards they build — to Instagram, group chats, friends. The exported recipe card is the featured artifact: it must look like a plate torn from an illuminated grimoire.

Primary usage context: kitchen counter, altar, garden, couch. Mixed lighting, often daytime. Phone in one hand.

### Brand Personality

Three words: **illuminated · apothecary · grimoire**.

Voice: warm, unhurried, botanically literate, slightly archaic ("scribe", "brew", "intention", "gathered", "method"). Never corporate, never jokey-TikTok, never tarot-edgelord. Opening the app should feel like opening a tooled-leather journal you've inherited.

### Aesthetic Direction

**Theme: LIGHT parchment with richly illustrated ornament.** App chrome (nav, lists, buttons) is clean and restrained so illustrated artifacts (recipe cards, hero banners, empty states) carry the aesthetic. Illuminated manuscript meets art-nouveau apothecary: cream parchment with wrought-iron pillar borders, vines, bronze apothecary pots, bottle-green potions, candle flames, botanical specimens.

Reference folder: `Assets/Untitled design (1)` — these PNGs ARE the target fidelity. When in doubt, ship illustrated imagery rather than hand-coded SVG.

Anti-references:
- Cottagecore / Etsy pastel linen
- Tarot apps with black backgrounds and neon sigils
- Gothic / Victorian mourning (too monochrome, too theatrical)
- Cyan-on-dark SaaS dashboards
- "Magical" apps with purple-to-blue gradients and glowing text
- Minimal Swiss/Notion productivity apps with Inter and white boxes

### Typography

- **Display**: `Unna` (Google Fonts). Used for screen titles, recipe card titles, card section labels.
- **Body**: `Literata` (Google Fonts). Used for item names, descriptions, UI copy, recipe body.
- **Do not use**: Inter, Roboto, Arial, Open Sans, system-ui defaults, Fraunces, Newsreader, Lora, Crimson family, Playfair Display, Cormorant family, Syne, IBM Plex family, Space Mono, Space Grotesk, DM Sans, DM Serif family, Outfit, Plus Jakarta Sans, Instrument Sans, Instrument Serif.
- On hand-illustrated artifacts (recipe cards), italic Unna in small-caps for section labels.

### Color Palette (OKLCH)

Warm parchment neutrals (~82° hue), accented with **copper as primary**, bottle-green as secondary, candle-amber for attention, pewter for structure, dried-violet and oxblood as rare.

```
/* Parchment */
--parchment-0:   oklch(0.95 0.022 82);
--parchment-1:   oklch(0.91 0.032 82);
--parchment-2:   oklch(0.86 0.040 78);
--parchment-3:   oklch(0.76 0.050 72);

/* Ink */
--ink:           oklch(0.25 0.035 55);
--ink-muted:     oklch(0.42 0.030 50);
--ink-soft:      oklch(0.58 0.025 50);

/* Iron pewter — structure, deep borders */
--pewter:        oklch(0.30 0.020 285);
--pewter-deep:   oklch(0.22 0.020 285);

/* Copper / bronze — primary accent */
--copper:        oklch(0.55 0.110 55);
--copper-deep:   oklch(0.45 0.120 50);

/* Bottle-green — secondary accent */
--bottle:        oklch(0.42 0.095 155);
--bottle-deep:   oklch(0.32 0.090 155);

/* Candle-amber — attention glow */
--candle:        oklch(0.78 0.120 78);
--candle-deep:   oklch(0.62 0.140 62);

--violet-dried:  oklch(0.55 0.090 315);
--oxblood:       oklch(0.42 0.120 25);   /* destructive only */
```

Primary CTA: copper. Success / herb-toned: bottle. Badge / glow: candle. Violet and oxblood rare.

### Spacing

Semantic 4pt scale — `--space-2xs 4`, `--space-xs 8`, `--space-sm 12`, `--space-md 16`, `--space-lg 24`, `--space-xl 32`, `--space-2xl 48`, `--space-3xl 64`. Use `gap`, not margin, for sibling spacing.

### Motion

Calm, paper-like. Exponential easing (`ease-out-quart/quint/expo`). No bounce, no elastic. Animate only `transform` / `opacity`. Always respect `prefers-reduced-motion`.

## Design Principles

1. **Illustrated artifacts do the heavy lifting.** The recipe card, hero banners, and empty states are hand-illustrated imagery. UI chrome (nav, lists, buttons) stays clean and serves the artifacts, never competes with them.
2. **Parchment, not plastic.** Surfaces read as aged paper with warmth and texture. Never glossy cards with generic drop shadow.
3. **Ink and copper earn their weight.** Rich accents stay rare — 10% of the surface at most. Overuse kills them.
4. **The recipe card is the hero.** It's designed to be screenshot and shared. Full-bleed illustrated frame, room for content in the parchment window.
5. **Every word smells of the garden.** Warm, slightly archaic copy: "scribe", "brew", "gathered", "method". Never "✨ Magic ✨", "Oopsie!", "Cast spell", "Conjuring…".

## Absolute CSS bans

Never ship these patterns:

- `border-left` or `border-right` > 1px as a colored accent stripe on cards, callouts, or list items.
- `background-clip: text` combined with any gradient background (gradient text).
- Glassmorphism used decoratively — acceptable only when it genuinely clarifies hierarchy (e.g. stacking contexts, not for every panel).
- Generic rounded-rectangle-with-drop-shadow card patterns. Prefer hairline borders on tinted surfaces.
- Bouncy / elastic easing. Use ease-out-quart or quint.

## Project conventions

- JSX file extension `.jsx`; hooks in `.js`.
- State lives in `src/store/StoreProvider.jsx` + `src/store/hooks.js` (split so fast-refresh works).
- All persistence is `localStorage` under `witch-cupboard:v1`.
- PNG export is via `html-to-image` in `src/lib/exportImage.js`.
- Emoji may be used as user-chosen item icons (they're flexible personality). Avoid emoji for decorative UI glyphs, section dividers, or ornaments — use SVG or typography there.

### Inventory & brewing flows

- **Cupboard list** — expandable dropdown (`CupboardScreen`); items grouped by `ELEMENT_ORDER` (wood → water → fire → earth → metal); out-of-stock (qty 0) in a collapsed section, hidden during search.
- **Cauldron brew** — `BREW_CAULDRON` deducts cauldron amounts × batch; clears cauldron.
- **Recipe brew** — `BREW_RECIPE` deducts saved ingredient amounts × batch; recipe stays in Grimoire.
- **Restock** — `RESTOCK_FROM_CAULDRON` adds amounts to existing shelf items (including qty 0); clears cauldron. Gathering list PNG export does not clear cauldron.
- Shared UI: `BrewConfirmDialog` + `src/lib/brew.js` for stock validation and batch count.
- Scribing a recipe (`SAVE_RECIPE`) never modifies cupboard stock.

## Scripts

- `npm run dev` — start the dev server (use `-- --host` to test on LAN / phone)
- `npm run build` — production build
- `npm run lint` — ESLint

## Known environment gotcha

On Windows + Node 20 with this lockfile, the `@rolldown/binding-win32-x64-msvc` optional binding may be missing after a fresh install ([npm#4828](https://github.com/npm/cli/issues/4828)). Fix: `npm install @rolldown/binding-win32-x64-msvc --no-save`.
