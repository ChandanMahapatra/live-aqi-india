# Live AQI // India

Cyberpunk / CRT-styled Air Quality Index dashboard for India — sample state data, cigarette-equivalent metric, and 14-day history.

> From the design notes in *Live AQI App - India/country (with historical data ?)*.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ChandanMahapatra/live-aqi-india)

## Features

- **Spatial view** — interactive state nodes with AQI-colored glow and animated highlight
- **Top polluted ranking** — sorted list of worst states
- **State detail panel**
  - CPCB-style AQI gauge + pollutant breakdown (PM2.5, PM10, NO₂, SO₂, O₃, CO)
  - **Cigarette bars** — visual “how many cigarettes would this air equal?”
  - 14-day historical area chart
- **CRT overlay** — scanlines, vignette, subtle flicker
- **National average** + cigarette equivalent in the top HUD

Sample data only (no paid API required). Swap in OpenAQ / data.gov.in / WAQI later if you want live feeds.

## Quick start (local)

```bash
git clone https://github.com/ChandanMahapatra/live-aqi-india.git
cd live-aqi-india
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Deploy to Vercel (previews + production)

### Option A — one-click

1. Open: [vercel.com/new/clone?repository-url=https://github.com/ChandanMahapatra/live-aqi-india](https://vercel.com/new/clone?repository-url=https://github.com/ChandanMahapatra/live-aqi-india)
2. Import the repo under your Vercel account
3. Framework preset is **Vite** (already set in `vercel.json`)
4. Deploy — you get a production URL + PR preview deployments automatically

### Option B — CLI

```bash
npm i -g vercel
vercel          # link project, first deploy
vercel --prod   # production
```

Every push to `main` builds production. Every PR gets a **preview URL**.

### Option C — Vercel dashboard

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Select `ChandanMahapatra/live-aqi-india`
3. Leave build settings as detected (Vite / `npm run build` / `dist`)
4. Deploy

`vercel.json` already configures SPA rewrites so client routing works.

## Data

Illustrative sample for 20 states/UTs. Helpers:

- `getAqiLevel` / `getAqiColor` — CPCB-style bands
- `aqiToCigarettes` — ~22 µg/m³ PM2.5 ≈ 1 cig/day heuristic (intuition only, not medical advice)

To go live later: replace `src/data/indiaAqi.ts` with fetches from OpenAQ, data.gov.in CPCB, or WAQI.

## Design references

- [timezoneglobe.com](https://www.timezoneglobe.com/)
- [thegridcn.com](https://thegridcn.com/)
- [atlas-olive-sigma.vercel.app](https://atlas-olive-sigma.vercel.app/)
- [Territory Studio — Blade Runner 2049](https://territorystudio.com/project/blade-runner-2049/)
- [hud-crt](https://github.com/krzysztoff1/hud-crt)

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- Framer Motion · Recharts · Lucide

## License

MIT
