# Witch Cupboard

A mobile-first witchy inventory app — illuminated parchment meets apothecary grimoire. Stock herbs, candles, crystals, and curios on an illustrated cupboard; gather ingredients in the Cauldron; scribe recipes into the Grimoire and export them as shareable PNGs.

**Live demo:** after deploying (see below) → `https://<your-username>.github.io/<repo-name>/`

Built with **React 19 + Vite**. All data stays in your browser (`localStorage`). Installable as a PWA — no account, no server.

---

## Progress summary

What’s built so far:

### Cupboard (art-first inventory)
- Full-screen **illustrated cupboard** background with decor sprites that reflect your stock (herbs, candles, jars, crystals, curios)
- **Five elements** instead of generic categories: Wood 🌿 · Fire 🔥 · Earth 🪨 · Metal 🗝️ · Water 🧴
- **Ledger overlay** — search, filter by element, sort, and edit via ItemCards; closes back to the cupboard view
- **Stock a curio** — add/edit modal with emoji, quantity, units, and notes
- Legacy category migration for existing saved data

### Herbarium reference catalog (~190 entries)
- Autocomplete when naming items — herbs, oils, waxes, salts, and officinal/alchemical staples (beeswax, aqua vitae, aqua regia, lye, tartar, brimstone, etc.)
- **Reference panel** per item: folk tradition, parts commonly used, worth-heeding cautions (non-obvious hazards only)
- Correspondence/magical fields removed in favour of practical folk notes

### Cauldron & Grimoire
- **Cauldron** — working basket; pull from Cupboard, adjust amounts, brew into a recipe
- **Grimoire** — saved recipes on an illustrated parchment card frame
- **PNG export** — share recipe cards to Instagram, group chats, etc.

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
| **Cupboard** | Illustrated shelf view + searchable ledger; stock and edit curios |
| **Cauldron** | Working basket — gather amounts before scribing a recipe |
| **Grimoire** | Saved recipe cards with PNG export |

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
    CupboardScreen.jsx         Art-first cupboard + ledger
    CauldronScreen.jsx
    GrimoireScreen.jsx
    RecipeDetailScreen.jsx
  components/
    AestheticCupboard.jsx      Illustrated cupboard + decor layer
    ReferencePanel.jsx         Herbarium reference sheet
    ItemForm.jsx, ItemCard.jsx, RecipeCard.jsx, …
  store/                       Reducer + localStorage persistence
  data/
    herbarium.json             ~190 catalog entries
    herbariumEnrichment.js     Parts used + cautions
    categories.js              Five elements + migration
    decorPools.js              Element → decor sprite pools
  lib/
    herbarium.js               Search + match by name
    cupboardDecor.js           Shelf decoration layout
    exportImage.js             Recipe PNG export
  assets/
    background.png             Cupboard illustration
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
  "cauldron": [{ "itemId", "amount", "unit" }],
  "recipes": [{ "id", "title", "intention", "steps", "ingredients", "createdAt" }]
}
```

First run seeds a starter set. Wipe the key in DevTools to reset.

---

## License

Personal project — do what you like.
