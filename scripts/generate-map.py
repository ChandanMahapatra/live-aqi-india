"""Reduce geoBoundaries India ADM1 polygons into map-ready square dots and outlines.

Source: geoBoundaries gbOpen India ADM1, DataMeet India / Election Commission
of India, CC BY 2.5 IN. See ATTRIBUTION.md.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "india-adm1-source.geojson"
DEST = ROOT / "src" / "india-map.json"
LON_MIN, LON_MAX = 67.0, 98.5
LAT_MIN, LAT_MAX = 6.0, 38.0
WIDTH, HEIGHT = 800, 720
STEP = 0.24


def project(lon: float, lat: float) -> tuple[float, float]:
    return ((lon - LON_MIN) / (LON_MAX - LON_MIN) * WIDTH,
            (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * HEIGHT)


def inside_ring(lon: float, lat: float, ring: list[list[float]]) -> bool:
    inside = False
    previous = ring[-1]
    for point in ring:
        x1, y1 = previous[:2]
        x2, y2 = point[:2]
        if (y1 > lat) != (y2 > lat):
            crossing = x1 + (lat - y1) * (x2 - x1) / (y2 - y1)
            if lon < crossing:
                inside = not inside
        previous = point
    return inside


def inside_polygon(lon: float, lat: float, rings: list[list[list[float]]]) -> bool:
    return inside_ring(lon, lat, rings[0]) and not any(
        inside_ring(lon, lat, hole) for hole in rings[1:]
    )


def simplify(points: list[list[float]], threshold: float = 0.08) -> list[list[float]]:
    """Small Ramer–Douglas–Peucker pass for thin state outlines only."""
    if len(points) <= 3:
        return points
    first, last = points[0], points[-1]
    dx, dy = last[0] - first[0], last[1] - first[1]
    longest, at = 0.0, 0
    for i, point in enumerate(points[1:-1], start=1):
        if dx == dy == 0:
            distance = ((point[0] - first[0]) ** 2 + (point[1] - first[1]) ** 2) ** 0.5
        else:
            distance = abs(dy * point[0] - dx * point[1] + last[0] * first[1] - last[1] * first[0]) / (dx * dx + dy * dy) ** 0.5
        if distance > longest:
            longest, at = distance, i
    if longest <= threshold:
        return [first, last]
    return simplify(points[:at + 1], threshold)[:-1] + simplify(points[at:], threshold)


def state_paths(feature: dict) -> tuple[str, str]:
    geometry = feature["geometry"]
    polygons = [geometry["coordinates"]] if geometry["type"] == "Polygon" else geometry["coordinates"]
    dots: list[str] = []
    outlines: list[str] = []
    for polygon in polygons:
        outer = polygon[0]
        min_lon = min(point[0] for point in outer)
        max_lon = max(point[0] for point in outer)
        min_lat = min(point[1] for point in outer)
        max_lat = max(point[1] for point in outer)
        start_x = int((min_lon - LON_MIN) / STEP) - 1
        end_x = int((max_lon - LON_MIN) / STEP) + 2
        start_y = int((min_lat - LAT_MIN) / STEP) - 1
        end_y = int((max_lat - LAT_MIN) / STEP) + 2
        for yi in range(start_y, end_y):
            lat = LAT_MIN + yi * STEP
            if not (min_lat <= lat <= max_lat):
                continue
            for xi in range(start_x, end_x):
                lon = LON_MIN + xi * STEP
                if min_lon <= lon <= max_lon and inside_polygon(lon, lat, polygon):
                    x, y = project(lon, lat)
                    dots.append(f"M{round(x, 1)} {round(y, 1)}h2.6v2.6h-2.6z")
        for ring in polygon:
            reduced = simplify(ring)
            if len(reduced) > 2:
                coordinates = [project(point[0], point[1]) for point in reduced]
                outlines.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in coordinates) + "Z")
    return "".join(dots), "".join(outlines)


def main() -> None:
    source = json.loads(SOURCE.read_text())
    states = []
    for feature in source["features"]:
        dots, outline = state_paths(feature)
        states.append({
            "id": feature["properties"]["shapeISO"],
            "name": feature["properties"]["shapeName"],
            "dots": dots,
            "outline": outline,
        })
    DEST.write_text(json.dumps({"viewBox": [0, 0, WIDTH, HEIGHT], "states": states}, separators=(",", ":")))
    print(f"Wrote {len(states)} states to {DEST} ({DEST.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
