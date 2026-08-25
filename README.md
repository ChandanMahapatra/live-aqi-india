# Live AQI // India

Cyberpunk / CRT-styled Air Quality Index dashboard for India — sample state data, cigarette-equivalent metric, and 14-day history.

**Live site (GitHub Pages):** [https://chandanmahapatra.github.io/live-aqi-india/](https://chandanmahapatra.github.io/live-aqi-india/)

> Enable Pages once (below) if the link 404s on first visit.

## Features

- Spatial map of states with AQI-colored glow
- Top polluted ranking
- State detail: gauge, pollutants, cigarette bars, 14-day chart
- CRT scanlines / HUD aesthetic
- Sample data only (no paid API)

## View the site

### GitHub Pages (recommended, free)

1. Open **Settings → Pages** on the repo:  
   https://github.com/ChandanMahapatra/live-aqi-india/settings/pages
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Wait for the workflow **Deploy to GitHub Pages** (Actions tab) to finish (~1–2 min)
4. Open: **https://chandanmahapatra.github.io/live-aqi-india/**

Pushes to `main` auto-redeploy.

### Local

```bash
git clone https://github.com/ChandanMahapatra/live-aqi-india.git
cd live-aqi-india
npm install
npm run dev
```

### Vercel (optional)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ChandanMahapatra/live-aqi-india)

Note: this repo uses `base: '/live-aqi-india/'` for Pages. For a Vercel root domain, change `base` to `'/'` in `vite.config.ts` (or use an env-based base).

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Framer Motion · Recharts · Lucide

## License

MIT
