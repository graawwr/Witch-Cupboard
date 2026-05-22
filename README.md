# Witch Cupboard

A mobile-first witchy inventory app — illuminated parchment meets apothecary grimoire. Stock herbs, candles, crystals, and curios on an illustrated cupboard; gather ingredients in the Cauldron; scribe recipes into the Grimoire and export them as shareable PNGs.

**Live demo:** [https://graawwr.github.io/witch-cupboard/](https://graawwr.github.io/witch-cupboard/)

Built with **React 19 + Vite**. All data stays in your browser (`localStorage`). Installable as a PWA — no account, no server.

---

## Changelog (recent)

### Cupboard
- **Inventory dropdown** — “Upon the shelf” expands a panel (search lives here, not on the art view)
- **Grouped by element** — Wood → Water → Fire → Earth → Metal; each group collapsible (expanded by default)
- **Out of stock** — zero-quantity curios in a collapsible section (hidden while searching); grey name + ochre stock label
- **Quick cauldron add** — basket button on every row adds 1 unit without opening the item

### Cauldron
- **Brew** — deducts gathered amounts from cupboard stock (batch multiplier in confirm dialog)
- **Gather/Restock** — export a **Gathering list** PNG (shopping list, cauldron unchanged) or **Restock cupboard** (add amounts to inventory, including out-of-stock curios, then clear cauldron)
- **Scribe as recipe** — saves to Grimoire without touching inventory

### Grimoire
- **Recipe panel** — modal with Brew, Stock to cupboard, Save as image, Edit, Remove
- **Brew from recipe** — on list tiles and in the panel; deducts saved ingredient amounts (batch support)
- Recipe editor supports **modifiable units** per ingredient (defaults from cupboard entry)

### Shared
- `BrewConfirmDialog` + `src/lib/brew.js` — shared stock checks and batch brewing UI
- `src/data/units.js` — shared unit list for forms and recipe editor

---

## Progress summary

What’s built so far:

### Cupboard (art-first inventory)
- Full-screen **illustrated cupboard** background with decor sprites that reflect your stock
- **Five elements**: Wood 🌿 · Fire 🔥 · Earth 🪨 · Metal 🗝️ · Water 🧴 (`ELEMENT_ORDER` in `categories.js`)
- **Expandable inventory dropdown** — search, filter by element, sort, collapsible element groups, collapsible out-of-stock section
- **ItemCard ledger rows** — tap to expand actions; one-tap basket to Cauldron; quantity stepper, grimoire note, edit, remove
- **Stock a curio** — add/edit modal with emoji, quantity, units, and notes
- Herbarium autocomplete + **Reference panel** per item (~190 catalog entries)
- Legacy category migration for existing saved data

### Cauldron & Grimoire
- **Cauldron** — working basket; pull from Cupboard, adjust amounts, **Brew** (deduct stock), **Gather/Restock** (PNG list or add to shelf), **Scribe as recipe**
- **Grimoire** — saved recipes; **Brew** from list or detail panel; illustrated **PNG export** for recipe cards and gathering lists
- **Recipe panel** modal — view, brew, stock finished brew as new curio, edit, export, delete

### Design & tech
- OKLCH parchment palette, **Unna** + **Literata** typography, copper/bottle-green accents
- Mobile shell: bottom nav, safe areas, large tap targets, reduced-motion respect
- PWA manifest for Add to Home Screen
- GitHub Actions workflow for **GitHub Pages** deployment

### Still on the shelf (next)
- Align decor sprites to painted shelf positions in `background.png`
- Drop-in decor PNG crops under `public/cupboard/decor/`
- Capacitor wrap for native iOS/Android
- Optional: export/import inventory backup

---

## Features

| Tab | What it does |
|-----|----------------|
| **Cupboard** | Illustrated shelf + expandable inventory (search, element groups, out-of-stock section) |
| **Cauldron** | Working basket — brew, gather/restock shopping list, scribe recipes |
| **Grimoire** | Saved recipes — brew from stock, export PNGs, stock finished brews |

---

## Getting started (local)

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Phone on the same Wi-Fi

```bash
npm run dev -- --host
```

Open the LAN URL on your phone → browser menu → **Add to Home Screen**.

---

## Share it (GitHub Pages)

This folder is its **own Git repository** — separate from any Structure / other projects.

### 1. Create a new repo on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: **`witch-cupboard`** (recommended — matches the live URL below)
3. Leave it **empty** — no README, no `.gitignore`, no license (this project already has those)
4. Click **Create repository**

### 2. Connect and push (first time)

From this folder (`Witch-cupboard/`):

```powershell
git init
git add .
git commit -m "Initial commit — Witch Cupboard PWA"
git branch -M main
git remote add origin https://github.com/graawwr/witch-cupboard.git
git push -u origin main
```

Replace `graawwr/witch-cupboard` with your username and repo name if different.

### 3. Enable GitHub Pages

1. On GitHub: **Settings → Pages → Build and deployment**
2. Source: **GitHub Actions**
3. The **Deploy Pages** workflow runs automatically on push to `main`

Your app will be live at:

```
https://graawwr.github.io/witch-cupboard/
```

The workflow sets `VITE_BASE` from the repo name, so if you pick a different name the URL follows (`/<repo-name>/`).

### Test a Pages build locally

```powershell
$env:VITE_BASE="/witch-cupboard/"
npm run build
npm run preview
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Project structure

```
src/
  App.jsx                      Tab shell + bottom nav
  screens/
    CupboardScreen.jsx         Art cupboard + inventory dropdown
    CauldronScreen.jsx         Brew, gather/restock, scribe
    GrimoireScreen.jsx         Recipe list + brew shortcuts
  components/
    AestheticCupboard.jsx        Illustrated cupboard + decor layer
    BrewConfirmDialog.jsx      Shared brew confirmation + batches
    RestockModal.jsx             Gather list PNG or restock cupboard
    GatheringListCard.jsx        Export artifact for shopping lists
    RecipePanel.jsx              Recipe detail modal
    ReferencePanel.jsx           Herbarium reference sheet
    ItemForm.jsx, ItemCard.jsx, RecipeCard.jsx, …
  store/                       Reducer + localStorage persistence
  data/
    herbarium.json               ~190 catalog entries
    herbariumEnrichment.js       Parts used + cautions
    categories.js                Five elements + ELEMENT_ORDER
    units.js                     Shared unit options
    decorPools.js                Element → decor sprite pools
  lib/
    brew.js                      Stock checks + brew row helpers
    herbarium.js                 Search + match by name
    cupboardDecor.js             Shelf decoration layout
    exportImage.js               Recipe / gathering list PNG export
  assets/
    background.png               Cupboard illustration
public/
  manifest.webmanifest         PWA manifest
  cupboard/decor/              Drop-in decor sprites (see README there)
```

---

## Storage

Everything under one `localStorage` key: `witch-cupboard:v1`

```json
{
  "items": [{ "id", "name", "category", "quantity", "unit", "emoji", "notes", "createdAt", "updatedAt" }],
  "cauldron": [{ "itemId", "amount", "unit", "name?", "emoji?", "category?" }],
  "recipes": [{ "id", "title", "intention", "steps", "ingredients", "createdAt" }]
}
```

First run seeds a starter set. Wipe the key in DevTools to reset.

---

## License

Personal project — do what you like.
