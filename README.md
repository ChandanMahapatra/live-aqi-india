# Live AQI // India

Cyberpunk / CRT-styled live Air Quality Index dashboard focused on India, with historical trends and a **cigarette-equivalent** intuition metric.

> Built from the design notes in *Live AQI App - India/country (with historical data ?)*.

![HUD aesthetic](https://img.shields.io/badge/aesthetic-CRT%20%2F%20HUD-00ff9f?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind%204-00e5ff?style=flat-square)

## Features

- **Spatial view** — interactive state nodes with AQI-colored glow and animated highlight
- **Top polluted ranking** — live-sorted list of worst states
- **State detail panel**
  - CPCB-style AQI gauge + full pollutant breakdown (PM2.5, PM10, NO₂, SO₂, O₃, CO)
  - **Cigarette bars** — visual “how many cigarettes would this air equal?” heuristic
  - 14-day historical area chart
- **CRT overlay** — scanlines, vignette, subtle flicker
- **National average** + cigarette equivalent in the top HUD bar

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview production build
```

## Data

Current build ships with **illustrative sample data** for 20 states/UTs (realistic ranges for late-monsoon / post-monsoon conditions).

To go live, replace the data layer in `src/data/indiaAqi.ts` with fetches from:

| Source | Notes |
|--------|--------|
| [OpenAQ v3](https://docs.openaq.org/) | Global, needs free API key |
| [data.gov.in CPCB resource](https://data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69) | Official Indian stations, needs API key |
| [WAQI / AQICN](https://aqicn.org/api/) | Simple token-based |
| ArcGIS Hub AQI layers | See design PDF links |

Suggested next step: a small `useAqiFeed` hook that polls every 15–30 min and falls back to the sample set offline.

## Design references (from the original brief)

- [timezoneglobe.com](https://www.timezoneglobe.com/)
- [thegridcn.com](https://thegridcn.com/)
- [atlas-olive-sigma.vercel.app](https://atlas-olive-sigma.vercel.app/)
- [Territory Studio — Blade Runner 2049](https://territorystudio.com/project/blade-runner-2049/)
- [hud-crt](https://github.com/krzysztoff1/hud-crt)
- ArcGIS AQI galleries & India data hubs listed in the PDF
- Cigarette-equivalent bars & “fog of war” visibility idea when AQI is severe

## Cigarette metric

Public-health rule-of-thumb used by several communicators (incl. Berkeley Earth style conversions):

> ≈ 22 µg/m³ PM2.5 ≈ 1 cigarette smoked per day

We invert approximate Indian AQI breakpoints to estimate PM2.5, then convert. **Not a medical claim** — purely for intuition so non-experts can feel the number.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion (selection / bar animations)
- Recharts (historical trend)
- Lucide icons

## Roadmap ideas from the brief

- [ ] Real API wiring + API-key env
- [ ] Full SVG / GeoJSON India state polygons with 3D tilt on select
- [ ] “Fog of war” that obscures map features when AQI > 300
- [ ] Pixel-art / departure-mono webfonts
- [ ] City / station drill-down
- [ ] Compare two dates / historical scrubber
- [ ] Deploy to Vercel / Cloudflare Pages

## License

MIT — do what you want. Attribution appreciated if you ship a public version.
