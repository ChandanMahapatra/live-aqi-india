# Sources and licenses

These credits describe the assets and services used by the current implementation.

| Resource | Use | Source / license |
| --- | --- | --- |
| Open-Meteo / Copernicus CAMS | Current and historical modeled air quality | [Air Quality API](https://open-meteo.com/en/docs/air-quality-api), [Copernicus CAMS](https://atmosphere.copernicus.eu/). Data: CC BY 4.0. Hosted keyless API: noncommercial use within [published terms and limits](https://open-meteo.com/en/terms). |
| geoBoundaries / DataMeet / Election Commission of India | State/UT polygons used to generate square dots and outlines | [geoBoundaries gbOpen IND ADM1](https://www.geoboundaries.org/api/current/gbOpen/IND/ADM1/), boundary ID `IND-ADM1-1811400`. [CC BY 2.5 India](https://creativecommons.org/licenses/by/2.5/in/). |
| Departure Mono | All interface typography | [Departure Mono](https://departuremono.com/), copyright 2022–2024 Helena Zhang. SIL Open Font License 1.1; bundled [license](public/licenses/departure-mono.txt) and local WOFF2. |
| Pixelarticons | Search icon, recolored amber | [Pixelarticons](https://github.com/halfmage/pixelarticons), copyright 2019 Gerrit Halfmann. MIT; bundled [license](public/licenses/pixelarticons.txt). |
| Berkeley Earth | Approximate PM2.5-to-cigarette exposure comparison | Richard A. Muller and Elizabeth A. Muller, [Air Pollution and Cigarette Equivalence](https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/). One cigarette/day per 22 µg/m³ daily PM2.5 exposure. |
| AmberConsole | Visual inspiration | [DutchDiederik/AmberConsole](https://github.com/DutchDiederik/AmberConsole). The app's CSS and components are independently implemented; no AmberConsole code is bundled. |

## Map modifications

[Source polygons](data/india-adm1-source.geojson) and [dataset metadata](data/india-adm1-metadata.json) preserve provenance. [The original geoBoundaries download](https://github.com/wmgeolab/geoBoundaries/blob/9469f09/releaseData/gbOpen/IND/ADM1/geoBoundaries-IND-ADM1.geojson) identifies DataMeet / Election Commission as its source. `scripts/generate-map.py` converts the geometry into square dots and simplified outlines in `src/india-map.json`; these are modified data. Boundaries follow that dataset and are not an official political map.

Regional colors are app-generated summaries of available listed-city model values. They are not statewide measurements or part of the geographic source data.

## Original artwork and design

The vertical pixel cigarettes, fractional rendering, animated SVG smoke, chart and map interface are authored for this app. The screenshot in `docs/screenshot.png` is captured from the working interface. Initial design exploration used GPT Image; `design/selected.png` preserves the selected concept. Subsequent layout, typography and interaction decisions came from human design feedback.

The CRT appearance uses CSS scanlines, shading and glow. No raster cigarette image, shader package, chart library or map SDK is used. Departure Mono is the only bundled typeface; unused Geist Mono and Geist Pixel files have been removed.

## Interpretation

CAMS values are model estimates, not direct CPCB station readings. The interface uses the US EPA AQI scale. Cigarette equivalence averages the prior complete 24-hour PM2.5 window and divides by 22; it is an illustrative population-level comparison, not cigarettes actually smoked, personal dose, or an individual health prediction.

React, React DOM, Vite and the Vite React plugin are npm dependencies. Their upstream license notices remain with the respective packages. Third-party assets retain the licenses above.
