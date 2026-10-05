# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Accepted design decisions

- Use `design/selected.png`: option 1 atlas layout with option 3's dotted India map.
- Keep amber/charcoal console styling with locally bundled Departure Mono.
- Use actual geographic data for the map and city/state highlights.
- Include user-requested SVG pixel cigarette art and a sourced estimate from the last complete 24-hour PM2.5 mean divided by 22.
- Keep the app static and keyless, compatible with GitHub Pages.

## Refinements accepted 5 October 2026

- App name: Air Quality in India. Remove subtitle, header divider bars, and Live Model badge.
- Use Departure Mono throughout, with restrained CSS CRT bloom and scanlines.
- Vertical pixel SVG cigarettes, visibly shortened fractions and animated smoke. Respect reduced motion and provide a pause control.
- Show AQI as the compact heading; explain US EPA scale and CAMS modeled forecast source in Data & method.
- Fit the desktop viewport, with scrolling only in the left city list. Compact the right rail, two pollutants per row. Mobile may reflow and scroll for access.
- Keep map city points on true coordinates; latest feedback requires individual dots without cluster interactions.
- Chart hover readout follows the pointer and shows the nearest sample's timestamp/value.

## Coverage refinements accepted 5 October 2026

- Show every listed location as an individual geographic dot; remove cluster counts/popups. Select cities from the sidebar.
- Include state capitals and Guwahati/Bhubaneswar; provide alphabetic and highest AQI/PM2.5 sorting.
- Yellow-to-red region coloring must disclose that it summarizes listed-city model values, not statewide measurements.
- Keep cigarette section directly after the pollutant grid, leaving spare whitespace below.
- Filled severity badges; a slow glow pulse only for AQI above 150, respecting reduced motion.
- Footer credit: Made with AI · human-assisted.

- Map refinement: saturated yellow-to-red dots; legend occupies its own row outside map geometry so northern India stays visible. Individual city dots support pointer and keyboard selection without cluster popups. Overlapping hit areas resolve to the closest true coordinate.

- Remove Thane and Gandhinagar from city coverage; keep Pune (user correction). Reduce selected-city/AQI/cigarette sizes and add separation around cigarette method text. Above AQI 150, badge background and text alternate visibly over a slow two-second cycle; reduced motion keeps a filled static badge.

- At 1280 × 800, use a smaller 38px header row and 30px app title; keep the right rail above the history chart with modestly smaller cigarette art and spacing.

- Include Gurugram, Faridabad and Panchkula for Haryana regional data. Keep Chandigarh as its own union territory while explaining its shared-capital role. Pages must deploy the current main commit from dist/client and publish build provenance.

- Remove Panchkula. Delhi NCR alone uses a persistent three-city group marker with a chooser for Delhi, Gurugram and Faridabad; other map locations remain individually selectable. Selecting another city closes the chooser while retaining the NCR group marker.

- NCR chooser uses an × header button (no Close list option). Closing by ×, Escape or toggling the marker selects Delhi. Selecting Gurugram/Faridabad from the list opens the chooser; choosing an NCR city keeps it open and highlights the selected row while updating the side panel.
