# Cupboard item icons

Drop illustrated icons here to appear on the witch cupboard shelves.

## Naming

Use the **herbarium id** or **category fallback** as the filename:

```
lavender.webp
white-candle.png
amethyst.webp
_cat-herb.svg
```

Resolution order: `webp` → `png` → `jpg` → `svg`

If no file exists, the app uses built-in illustrated SVG fallbacks.

## Midjourney tips

- Square or tall-narrow (~256–512px) works well on shelves
- Transparent or parchment-toned backgrounds blend best
- Name files to match `src/data/herbarium.json` `id` fields when possible

## Category fallbacks

| File | Used when |
|------|-----------|
| `_cat-herb.svg` | Herbs without a specific icon |
| `_cat-candle.svg` | Candles |
| `_cat-crystal.svg` | Crystals |
| `_cat-jar.svg` | Jars |
| `_cat-oil.svg` | Oils |
| `_cat-salt.svg` | Salts |
| `_cat-powder.svg` | Powders |
| `_cat-resin.svg` | Resins |
| `_cat-flower.svg` | Flowers |
| `_cat-tool.svg` | Tools |
| `_cat-other.svg` | Everything else |
