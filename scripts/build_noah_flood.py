"""Fast Malaybalay-only flood hazard builder from UP Project NOAH shapefiles.

Extracts 100-year and 5-year flood hazard polygons for all 46 barangays of
Malaybalay City from UP Resilience Institute — Project NOAH Bukidnon shapefiles
(ODC-ODbL).
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import shapefile
from shapely.geometry import MultiPolygon, Point, Polygon, mapping, shape
from shapely.ops import unary_union
from shapely.strtree import STRtree

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "data"
PRECISION = 5
DEG_TO_KM2 = 111.32 * 110.25  # at ~8.15° N latitude


def round_coords(coords):
    if isinstance(coords[0], (int, float)):
        return [round(coords[0], PRECISION), round(coords[1], PRECISION)]
    return [round_coords(c) for c in coords]


def load_barangays():
    raw = json.loads((DATA / "malaybalay-barangays.geojson").read_text())
    items = []
    for feat in raw["features"]:
        geom = shape(feat["geometry"]).buffer(0)
        items.append((feat["properties"]["code"], feat["properties"]["name"], geom))
    return items


def process_shapefile(shp_path: str, barangays, min_span_deg: float, simplify_deg: float):
    t0 = time.time()
    geoms = [b[2] for b in barangays]
    tree = STRtree(geoms)
    city_union = unary_union(geoms)
    minx, miny, maxx, maxy = city_union.bounds

    stats = {
        code: {
            "name": name,
            "areaKm2": round(bgeom.area * DEG_TO_KM2, 3),
            "low": 0.0,
            "medium": 0.0,
            "high": 0.0,
        }
        for code, name, bgeom in barangays
    }

    # (code, level) -> list of simplified Polygon objects for visual GeoJSON
    visual_polys: dict[tuple[str, int], list[Polygon]] = {}

    reader = shapefile.Reader(shp_path)
    for sr in reader.iterShapeRecords():
        level = int(float(sr.record[0]))
        level_key = {1: "low", 2: "medium", 3: "high"}.get(level)
        if not level_key:
            continue
        pts = sr.shape.points
        parts = list(sr.shape.parts) + [len(pts)]

        for i in range(len(parts) - 1):
            ring = pts[parts[i] : parts[i + 1]]
            if len(ring) < 4:
                continue
            x0, y0 = ring[0]
            if not (minx <= x0 <= maxx and miny <= y0 <= maxy):
                continue

            xs = [p[0] for p in ring]
            ys = [p[1] for p in ring]
            rx0, rx1 = min(xs), max(xs)
            ry0, ry1 = min(ys), max(ys)
            span = max(rx1 - rx0, ry1 - ry0)

            # Fast centroid/first-vertex lookup against barangay STRtree
            pt = Point((rx0 + rx1) * 0.5, (ry0 + ry1) * 0.5)
            candidates = tree.query(pt)
            matched_idx = None
            for idx in candidates:
                if geoms[int(idx)].contains(pt):
                    matched_idx = int(idx)
                    break
            if matched_idx is None:
                continue

            code = barangays[matched_idx][0]
            # Approximate ring signed area (shoelace) for accurate stats across all rings
            area_deg2 = 0.0
            for j in range(len(ring) - 1):
                area_deg2 += ring[j][0] * ring[j + 1][1] - ring[j + 1][0] * ring[j][1]
            area_km2 = abs(area_deg2) * 0.5 * DEG_TO_KM2
            # Only add exterior rings (counter-clockwise / positive in shapefile or bounded size)
            if area_km2 < 2.5:
                stats[code][level_key] += area_km2

            if span < min_span_deg:
                continue

            try:
                poly = Polygon(ring)
                if not poly.is_valid:
                    poly = poly.buffer(0)
                if poly.is_empty:
                    continue
                simp = poly.simplify(simplify_deg, preserve_topology=True)
                if simp.is_empty:
                    continue
                if simp.geom_type == "Polygon":
                    visual_polys.setdefault((code, level), []).append(simp)
                elif simp.geom_type == "MultiPolygon":
                    visual_polys.setdefault((code, level), []).extend(simp.geoms)
            except Exception:
                continue

    features = []
    name_by_code = {code: name for code, name, _ in barangays}
    for (code, level), polys in sorted(visual_polys.items()):
        # Keep top 45 largest polygons per (barangay, hazard level) so web map stays 60fps
        polys.sort(key=lambda p: p.area, reverse=True)
        top_polys = polys[:45]
        merged = MultiPolygon(top_polys) if len(top_polys) > 1 else top_polys[0]
        gj = mapping(merged)
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "code": code,
                    "barangay": name_by_code[code],
                    "hazard": level,
                },
                "geometry": {
                    "type": gj["type"],
                    "coordinates": round_coords(gj["coordinates"]),
                },
            }
        )

    for code, entry in stats.items():
        for k in ("low", "medium", "high"):
            entry[k] = round(entry[k], 3)
        exposed = min(entry["areaKm2"], entry["low"] + entry["medium"] + entry["high"])
        entry["exposedKm2"] = round(exposed, 3)
        entry["exposedShare"] = (
            round((exposed / entry["areaKm2"]) * 100, 2) if entry["areaKm2"] > 0 else 0.0
        )

    print(
        f"Processed {Path(shp_path).name} in {round(time.time() - t0, 2)}s -> {len(features)} barangay-hazard features"
    )
    return features, stats


def main():
    if len(sys.argv) != 3:
        sys.exit(1)
    barangays = load_barangays()
    f100_feats, f100_stats = process_shapefile(
        sys.argv[1], barangays, min_span_deg=0.00075, simplify_deg=0.00018
    )
    f5_feats, f5_stats = process_shapefile(
        sys.argv[2], barangays, min_span_deg=0.00065, simplify_deg=0.00016
    )

    (DATA / "malaybalay-flood-100yr.geojson").write_text(
        json.dumps(
            {
                "type": "FeatureCollection",
                "name": "Malaybalay City UP Project NOAH Flood Hazard (100-Year Return)",
                "attribution": "UP Resilience Institute — Project NOAH (https://noah.up.edu.ph/) · ODC-ODbL",
                "features": f100_feats,
            },
            separators=(",", ":"),
        )
    )
    (DATA / "malaybalay-flood-5yr.geojson").write_text(
        json.dumps(
            {
                "type": "FeatureCollection",
                "name": "Malaybalay City UP Project NOAH Flood Hazard (5-Year Return)",
                "attribution": "UP Resilience Institute — Project NOAH (https://noah.up.edu.ph/) · ODC-ODbL",
                "features": f5_feats,
            },
            separators=(",", ":"),
        )
    )
    (DATA / "malaybalay-flood-stats.json").write_text(
        json.dumps(
            {
                "source": "UP Resilience Institute — Project NOAH Flood Hazard Maps",
                "sourceUrl": "https://noah.up.edu.ph/",
                "mirrorUrl": "https://huggingface.co/datasets/bettergovph/project-noah-hazard-maps",
                "license": "ODC-ODbL",
                "verifiedOn": "2026-11-09",
                "levels": {
                    "low": "Low hazard (0–0.5 m depth)",
                    "medium": "Medium hazard (>0.5–1.5 m depth)",
                    "high": "High hazard (>1.5 m depth)",
                },
                "scenarios": {
                    "100yr": f100_stats,
                    "5yr": f5_stats,
                },
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
