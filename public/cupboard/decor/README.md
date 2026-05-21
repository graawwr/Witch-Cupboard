# Cupboard decoration sprites

The shelf view is **atmosphere only** — illustrations are drawn from pools, not tied to specific inventory records. One sprite appears per stocked item (by category pool).

## Folder layout

```
public/cupboard/decor/
  jars/       jars-01.webp … jars-12.webp
  herbs/      herbs-01.webp … herbs-08.webp
  crystals/   crystals-01.webp … crystals-08.webp
  candles/    candles-01.webp … candles-06.webp
  curios/     curios-01.webp … curios-06.webp
```

`.png` and `.jpg` also work. Until files exist, inline SVG fallbacks render.

## Export tips (Midjourney / crops)

- **Square or tall portrait**, ~256–512px on the long edge
- Transparent or parchment background
- Consistent lighting (warm, apothecary)
- Crop individual jars/herbs from composite sheets (e.g. `Assets/Untitled design (1)/jars3.png`)

Category → element mapping lives in `src/data/categories.js` and `src/data/decorPools.js`.

Elements: **Wood** (herbs), **Fire** (candles, wax, alcohol), **Earth** (stones), **Metal** (tools, curios), **Water** (oils, tinctures).
