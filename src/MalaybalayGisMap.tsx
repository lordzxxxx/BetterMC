import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { FeatureCollection, Geometry } from "geojson";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Building2,
  Calendar,
  Compass,
  ExternalLink,
  LocateFixed,
  Minus,
  Navigation,
  Plus,
  RotateCcw,
  Waves,
  X,
} from "lucide-react";
import {
  barangayMicrosites,
  type BarangayMicrositeProfile,
} from "./barangayProfiles";
import {
  BARANGAY_GIS_COLORS,
  buildDeterministicDateSnapshot,
  fetchLiveHydroTimeline,
  MALAYBALAY_CENTROIDS,
  MALAYBALAY_ESTABLISHMENTS,
  MALAYBALAY_OUTER_PERIMETER,
  MALAYBALAY_WATERWAYS,
  type BarangayFloodStat,
  type DateHydroSnapshot,
  type MalaybalayEstablishment,
  type MalaybalayFloodStatsFile,
  type MalaybalayWaterway,
  type NoahHazardScenario,
} from "./malaybalayGisData";

type BoundaryCollection = FeatureCollection<
  Geometry,
  { name: string; code: string; validOn: string }
>;

type FloodHazardCollection = FeatureCollection<
  Geometry,
  {
    code: string;
    barangay: string;
    hazard?: number;
    var?: number;
    level?: "low" | "medium" | "high";
    depth?: string;
  }
>;

type SelectedGisEntity =
  | {
      kind: "barangay";
      barangay: BarangayMicrositeProfile;
      floodStat?: BarangayFloodStat;
    }
  | {
      kind: "waterway";
      waterway: MalaybalayWaterway;
    }
  | {
      kind: "establishment";
      establishment: MalaybalayEstablishment;
    }
  | {
      kind: "floodzone";
      barangayName: string;
      barangayCode: string;
      level: "low" | "medium" | "high";
      depth: string;
      floodStat?: BarangayFloodStat;
    };

const FLOOD_COLORS: Record<"low" | "medium" | "high", string> = {
  low: "#facc15", // UP Project NOAH Low (0 - 0.5m)
  medium: "#f97316", // UP Project NOAH Medium (0.5 - 1.5m)
  high: "#dc2626", // UP Project NOAH High (>1.5m)
};

function resolveHazardLevel(props: {
  level?: "low" | "medium" | "high";
  hazard?: number;
  var?: number;
}): "low" | "medium" | "high" {
  if (
    props.level === "low" ||
    props.level === "medium" ||
    props.level === "high"
  ) {
    return props.level;
  }
  const num = Number(props.hazard ?? props.var ?? 1);
  if (num === 3) return "high";
  if (num === 2) return "medium";
  return "low";
}

function resolveHazardDepth(level: "low" | "medium" | "high", depth?: string) {
  if (depth) return depth;
  if (level === "high") return ">1.5 m";
  if (level === "medium") return "0.5–1.5 m";
  return "0–0.5 m";
}

/**
 * Chaikin curve-smoothing for river polylines so waterways render as natural curves
 * rather than sharp jagged segments.
 */
function smoothRiverCoordinates(
  coords: [number, number][],
  iterations = 2,
): [number, number][] {
  let pts = coords;
  for (let iter = 0; iter < iterations; iter += 1) {
    if (pts.length < 3) break;
    const next: [number, number][] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      next.push([0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1]);
      next.push([0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts.map(([lng, lat]) => [lat, lng]);
}

function getTodayManila(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
  }).format(new Date());
}

function addDaysManila(baseDateStr: string, days: number): string {
  const d = new Date(`${baseDateStr}T12:00:00+08:00`);
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
  }).format(d);
}

export default function MalaybalayGisMap({
  profile,
  initialBarangayCode,
}: {
  profile?: BarangayMicrositeProfile;
  initialBarangayCode?: string;
  compactHeader?: boolean;
}) {
  const todayStr = useMemo(() => getTodayManila(), []);
  const maxForecastDateStr = useMemo(
    () => addDaysManila(todayStr, 14),
    [todayStr],
  );

  const [barangaySelection, setBarangaySelection] = useState<{
    propCode?: string;
    code: string;
  }>({
    propCode: profile?.code,
    code: profile?.code ?? initialBarangayCode ?? "ALL",
  });

  const activeBarangayCode =
    barangaySelection.propCode === profile?.code
      ? barangaySelection.code
      : (profile?.code ?? initialBarangayCode ?? "ALL");

  const setActiveBarangayCode = useCallback(
    (code: string) => {
      setBarangaySelection({ propCode: profile?.code, code });
    },
    [profile?.code],
  );

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [noahScenario, setNoahScenario] = useState<NoahHazardScenario>("100yr");
  const [basemapStyle, setBasemapStyle] = useState<
    "street" | "satellite" | "topo"
  >("street");
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [pitchDeg, setPitchDeg] = useState<number>(22);
  const [bearingDeg, setBearingDeg] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(profile ? 13 : 11);

  const [showFloodLayer, setShowFloodLayer] = useState<boolean>(true);
  const [showRiversLayer, setShowRiversLayer] = useState<boolean>(true);
  const [showEstablishmentsLayer, setShowEstablishmentsLayer] =
    useState<boolean>(true);

  const [floodStatsFile, setFloodStatsFile] =
    useState<MalaybalayFloodStatsFile | null>(null);
  const [liveHydroMap, setLiveHydroMap] = useState<
    Record<string, DateHydroSnapshot>
  >({});
  const [selectedEntity, setSelectedEntity] =
    useState<SelectedGisEntity | null>(null);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<boolean>(false);

  const mapElement = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import("leaflet").Map | null>(null);
  const boundariesRef = useRef<BoundaryCollection | null>(null);
  const flood100Ref = useRef<FloodHazardCollection | null>(null);
  const flood5Ref = useRef<FloodHazardCollection | null>(null);
  const layerGroupRef = useRef<import("leaflet").LayerGroup | null>(null);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);
  const barangayBoundsMapRef = useRef<
    Map<string, import("leaflet").LatLngBounds>
  >(new Map());
  const fullCityBoundsRef = useRef<import("leaflet").LatLngBounds | null>(null);
  const lastZoomedCodeRef = useRef<string | null>(null);

  // Fetch live Open-Meteo Weather & GloFAS River Discharge telemetry
  useEffect(() => {
    if (navigator.userAgent.includes("jsdom")) return;
    const controller = new AbortController();
    fetchLiveHydroTimeline(controller.signal)
      .then((data) => setLiveHydroMap(data))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const activeBarangayProfile = useMemo(
    () =>
      activeBarangayCode === "ALL"
        ? undefined
        : barangayMicrosites.find((b) => b.code === activeBarangayCode),
    [activeBarangayCode],
  );

  const currentHydroSnapshot: DateHydroSnapshot = useMemo(() => {
    return (
      liveHydroMap[selectedDate] ?? buildDeterministicDateSnapshot(selectedDate)
    );
  }, [liveHydroMap, selectedDate]);

  const activeBarangayFloodStat: BarangayFloodStat | undefined = useMemo(() => {
    if (!floodStatsFile || activeBarangayCode === "ALL") return undefined;
    return floodStatsFile.scenarios[noahScenario]?.[activeBarangayCode];
  }, [floodStatsFile, noahScenario, activeBarangayCode]);

  const citywideFloodTotals = useMemo(() => {
    const scenarioStats = floodStatsFile?.scenarios[noahScenario];
    if (!scenarioStats) {
      return { low: 54.15, medium: 39.7, high: 21.35, exposedKm2: 115.16 };
    }
    let low = 0;
    let medium = 0;
    let high = 0;
    let exposedKm2 = 0;
    Object.values(scenarioStats).forEach((st) => {
      low += st.low;
      medium += st.medium;
      high += st.high;
      exposedKm2 += st.exposedKm2;
    });
    return {
      low: Math.round(low * 100) / 100,
      medium: Math.round(medium * 100) / 100,
      high: Math.round(high * 100) / 100,
      exposedKm2: Math.round(exposedKm2 * 100) / 100,
    };
  }, [floodStatsFile, noahScenario]);

  // Initialize Leaflet Map bounded to Malaybalay City + preload NOAH datasets
  useEffect(() => {
    if (!mapElement.current || navigator.userAgent.includes("jsdom")) return;
    let disposed = false;

    const initMap = async () => {
      setMapLoading(true);
      setMapError(false);
      try {
        const [
          leafletModule,
          boundaryRes,
          flood100Res,
          flood5Res,
          floodStatsRes,
        ] = await Promise.all([
          import("leaflet"),
          fetch("/data/malaybalay-barangays.geojson"),
          fetch("/data/malaybalay-flood-100yr.geojson"),
          fetch("/data/malaybalay-flood-5yr.geojson"),
          fetch("/data/malaybalay-flood-stats.json"),
        ]);
        if (!boundaryRes.ok) throw new Error("Boundary data unavailable");
        const boundaries = (await boundaryRes.json()) as BoundaryCollection;
        boundariesRef.current = boundaries;

        if (flood100Res.ok) {
          flood100Ref.current =
            (await flood100Res.json()) as FloodHazardCollection;
        }
        if (flood5Res.ok) {
          flood5Ref.current = (await flood5Res.json()) as FloodHazardCollection;
        }
        if (floodStatsRes.ok) {
          const statsJson =
            (await floodStatsRes.json()) as MalaybalayFloodStatsFile;
          if (!disposed) setFloodStatsFile(statsJson);
        }

        if (disposed || !mapElement.current) return;

        const L = leafletModule.default;
        const malaybalayMaxBounds = L.latLngBounds(
          [7.9, 124.92],
          [8.36, 125.46],
        );

        const map = L.map(mapElement.current, {
          center: [8.145, 125.165],
          zoom: 11,
          minZoom: 10,
          maxZoom: 18,
          maxBounds: malaybalayMaxBounds,
          maxBoundsViscosity: 0.92,
          renderer: L.svg({ padding: 1.0 }),
          zoomControl: false,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
          touchZoom: true,
          boxZoom: true,
          keyboard: true,
        });
        leafletMapRef.current = map;

        map.on("zoomend", () => {
          setZoomLevel(Math.round(map.getZoom()));
        });

        // Dedicated panes so Outside Mask, Barangays, NOAH Flood, Rivers, Establishments, and Indicator Labels stack cleanly
        const maskPane = map.createPane("outsideCityMaskPane");
        maskPane.style.zIndex = "405";
        const brgyPane = map.createPane("barangayPane");
        brgyPane.style.zIndex = "415";
        const floodPane = map.createPane("noahFloodPane");
        floodPane.style.zIndex = "435";
        const riverPane = map.createPane("riverPane");
        riverPane.style.zIndex = "455";
        const markerPane = map.createPane("establishmentPane");
        markerPane.style.zIndex = "475";
        const labelPane = map.createPane("indicatorLabelPane");
        labelPane.style.zIndex = "490";

        const initialTile = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            keepBuffer: 8,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://noah.up.edu.ph/">UP Project NOAH</a>',
          },
        ).addTo(map);
        tileLayerRef.current = initialTile;

        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;

        // Precompute bounds for all 46 barangays + Malaybalay City
        const bMap = new Map<string, import("leaflet").LatLngBounds>();
        let cityBounds: import("leaflet").LatLngBounds | null = null;
        boundaries.features.forEach((f) => {
          const tempLayer = L.geoJSON(f);
          const b = tempLayer.getBounds();
          if (b.isValid()) {
            bMap.set(f.properties.code, b);
            if (!cityBounds) {
              cityBounds = L.latLngBounds(b.getSouthWest(), b.getNorthEast());
            } else {
              cityBounds.extend(b);
            }
          }
        });
        barangayBoundsMapRef.current = bMap;
        fullCityBoundsRef.current = cityBounds;

        window.setTimeout(() => {
          if (!disposed && leafletMapRef.current) {
            leafletMapRef.current.invalidateSize();
          }
        }, 100);

        if (!disposed) setMapLoading(false);
      } catch {
        if (!disposed) {
          setMapLoading(false);
          setMapError(true);
        }
      }
    };

    void initMap();
    return () => {
      disposed = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Switch between Street, Satellite, and Terrain basemaps without resetting zoom/pan
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || mapLoading) return;

    let cancelled = false;
    import("leaflet").then((leafletModule) => {
      if (cancelled || !leafletMapRef.current) return;
      const L = leafletModule.default;
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }
      const tileUrl =
        basemapStyle === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : basemapStyle === "topo"
            ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      const attribution =
        basemapStyle === "satellite"
          ? "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics · UP Project NOAH"
          : basemapStyle === "topo"
            ? "Map data: &copy; OpenStreetMap, SRTM | Style: &copy; OpenTopoMap · UP Project NOAH"
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://noah.up.edu.ph/">UP Project NOAH</a>';

      const tl = L.tileLayer(tileUrl, {
        maxZoom: 19,
        keepBuffer: 8,
        attribution,
      }).addTo(leafletMapRef.current);
      tl.bringToBack();
      tileLayerRef.current = tl;
    });

    return () => {
      cancelled = true;
    };
  }, [basemapStyle, mapLoading]);

  // Fly/Zoom ONLY when activeBarangayCode changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || mapLoading) return;
    if (lastZoomedCodeRef.current === activeBarangayCode) return;
    lastZoomedCodeRef.current = activeBarangayCode;

    map.invalidateSize();
    if (activeBarangayCode === "ALL") {
      if (fullCityBoundsRef.current?.isValid()) {
        map.flyToBounds(fullCityBoundsRef.current, {
          padding: [28, 28],
          maxZoom: 12,
          duration: 0.6,
        });
      }
    } else {
      const bBounds = barangayBoundsMapRef.current.get(activeBarangayCode);
      if (bBounds?.isValid()) {
        map.flyToBounds(bBounds, {
          padding: [54, 54],
          maxZoom: 14,
          duration: 0.6,
        });
      }
    }
  }, [activeBarangayCode, mapLoading]);

  // Render Outside-Malaybalay Blur Mask, 46 Barangays, 3D Extrusions, NOAH Flood Zones, Rivers, Establishments, and Line Indicators
  useEffect(() => {
    const map = leafletMapRef.current;
    const layerGroup = layerGroupRef.current;
    const boundaries = boundariesRef.current;
    if (!map || !layerGroup || !boundaries || mapLoading) return;

    let cancelled = false;
    import("leaflet").then((leafletModule) => {
      if (cancelled || !leafletMapRef.current || !layerGroupRef.current) return;
      const L = leafletModule.default;
      layerGroup.clearLayers();

      // 0. Blur & Mask Everything Outside Malaybalay City so focus stays 100% on Malaybalay City
      const cityHoleLatLngs = MALAYBALAY_OUTER_PERIMETER.map(
        ([lng, lat]) => [lat, lng] as [number, number],
      );
      const worldOuterLatLngs: [number, number][] = [
        [-85, -179],
        [-85, 179],
        [85, 179],
        [85, -179],
        [-85, -179],
      ];

      // Frosted mask covering all municipalities outside Malaybalay City
      L.polygon([worldOuterLatLngs, cityHoleLatLngs], {
        pane: "outsideCityMaskPane",
        fillRule: "evenodd",
        className: "gis-outside-malaybalay-mask",
        stroke: false,
        fillColor: basemapStyle === "satellite" ? "#0f172a" : "#e2e8f0",
        fillOpacity: basemapStyle === "satellite" ? 0.84 : 0.88,
        interactive: false,
      }).addTo(layerGroup);

      // Soft feathered blur halo around Malaybalay's outer city boundary
      L.polyline(cityHoleLatLngs, {
        pane: "outsideCityMaskPane",
        color: basemapStyle === "satellite" ? "#0f172a" : "#cbd5e1",
        weight: 22,
        opacity: 0.65,
        lineJoin: "round",
        interactive: false,
      }).addTo(layerGroup);

      // 3D City-Wide Extruded Pedestal when 3D Mode is active
      if (is3DMode) {
        const shiftedCityWall = MALAYBALAY_OUTER_PERIMETER.map(
          ([lng, lat]) => [lat - 0.0022, lng + 0.0016] as [number, number],
        );
        L.polyline(shiftedCityWall, {
          pane: "outsideCityMaskPane",
          color: "#0f172a",
          weight: 7,
          opacity: 0.55,
          lineJoin: "round",
          interactive: false,
        }).addTo(layerGroup);
      }

      // Crisp Malaybalay City Outer Jurisdiction Boundary Indicator Line
      const cityPerimeterLine = L.polyline(cityHoleLatLngs, {
        pane: "barangayPane",
        color: "#1e3a8a",
        weight: 3.5,
        opacity: 0.95,
        dashArray: "10, 5",
        interactive: false,
      });
      cityPerimeterLine.addTo(layerGroup);

      // 1. Render all 46 barangay polygons inside Malaybalay City
      boundaries.features.forEach((feature) => {
        const code = feature.properties.code;
        const name = feature.properties.name;
        const bProfile = barangayMicrosites.find((b) => b.code === code);
        const color = BARANGAY_GIS_COLORS[code] ?? "#2563eb";
        const isFocused =
          activeBarangayCode !== "ALL" && code === activeBarangayCode;

        // 3D Extruded Depth Wall for the active barangay (and subtle relief for all barangays)
        if (is3DMode) {
          const offsetLng = isFocused ? 0.0014 : 0.0005;
          const offsetLat = isFocused ? -0.0018 : -0.0007;
          const extrudedFeature = JSON.parse(
            JSON.stringify(feature),
          ) as typeof feature;
          const shiftCoords = (coords: unknown): unknown => {
            if (
              Array.isArray(coords) &&
              typeof coords[0] === "number" &&
              typeof coords[1] === "number"
            ) {
              return [coords[0] + offsetLng, coords[1] + offsetLat];
            }
            if (Array.isArray(coords)) return coords.map(shiftCoords);
            return coords;
          };
          if ("coordinates" in extrudedFeature.geometry) {
            extrudedFeature.geometry.coordinates = shiftCoords(
              extrudedFeature.geometry.coordinates,
            ) as never;
          }
          L.geoJSON(extrudedFeature, {
            pane: "barangayPane",
            style: {
              color: "#0f172a",
              weight: isFocused ? 3.5 : 1,
              opacity: isFocused ? 0.72 : 0.24,
              fillColor: "#0f172a",
              fillOpacity: isFocused ? 0.25 : 0.07,
            },
            interactive: false,
          }).addTo(layerGroup);
        }

        const brgyLayer = L.geoJSON(feature, {
          pane: "barangayPane",
          style: {
            className: isFocused
              ? "gis-brgy-polygon is-focused-active"
              : "gis-brgy-polygon",
            color: isFocused
              ? "#0f172a"
              : basemapStyle === "satellite"
                ? "#f8fafc"
                : color,
            weight: isFocused ? 4 : 1.8,
            opacity: isFocused ? 1 : 0.82,
            fillColor: color,
            fillOpacity: isFocused
              ? 0.22
              : activeBarangayCode !== "ALL"
                ? 0.13
                : 0.22,
          },
        });

        brgyLayer.on("click", () => {
          setActiveBarangayCode(code);
          if (bProfile) {
            setSelectedEntity({
              kind: "barangay",
              barangay: bProfile,
              floodStat: floodStatsFile?.scenarios[noahScenario]?.[code],
            });
          }
        });

        const stat = floodStatsFile?.scenarios[noahScenario]?.[code];
        brgyLayer.bindTooltip(
          `<strong>Brgy. ${name}</strong> (${bProfile?.classification ?? "Malaybalay"})<br/>` +
            `PSGC ${code} · Pop. ${bProfile?.population.toLocaleString("en-PH") ?? "—"}` +
            (stat
              ? `<br/>NOAH ${noahScenario.toUpperCase()} Flood Zone: <b>${stat.exposedKm2} km² (${stat.exposedShare}%)</b>`
              : ""),
          {
            sticky: true,
            direction: "top",
          },
        );

        brgyLayer.addTo(layerGroup);

        // Focused Barangay Boundary Indicator Line + On-Map Barangay Label Badge
        if (isFocused) {
          L.geoJSON(feature, {
            pane: "barangayPane",
            style: {
              color: "#facc15",
              weight: 2.5,
              opacity: 1,
              fillOpacity: 0,
              dashArray: "7, 5",
            },
            interactive: false,
          }).addTo(layerGroup);

          const centroid = MALAYBALAY_CENTROIDS[code];
          if (centroid) {
            const brgyBadge = L.marker([centroid[1], centroid[0]], {
              pane: "indicatorLabelPane",
              icon: L.divIcon({
                className: "gis-active-brgy-indicator",
                html: `<span><i style="background:${color}"></i>Brgy. ${name}</span>`,
                iconSize: [140, 26],
                iconAnchor: [70, 13],
              }),
            });
            brgyBadge.on("click", () => {
              if (bProfile) {
                setSelectedEntity({
                  kind: "barangay",
                  barangay: bProfile,
                  floodStat: stat,
                });
              }
            });
            brgyBadge.addTo(layerGroup);
          }
        }
      });

      // 2. Render UP Project NOAH Flood Hazard Polygons in 'noahFloodPane'
      const activeFloodCollection =
        noahScenario === "5yr" && flood5Ref.current
          ? flood5Ref.current
          : flood100Ref.current;

      if (showFloodLayer && activeFloodCollection) {
        const rainIntensityBoost =
          currentHydroSnapshot.alertLevel === "Red Critical"
            ? 0.14
            : currentHydroSnapshot.alertLevel === "Orange Watch"
              ? 0.08
              : 0;

        activeFloodCollection.features.forEach((f) => {
          const fCode = f.properties.code;
          const isTargetBrgy =
            activeBarangayCode === "ALL" || fCode === activeBarangayCode;
          const level = resolveHazardLevel(f.properties);
          const depth = resolveHazardDepth(level, f.properties.depth);
          const hazardColor = FLOOD_COLORS[level];

          const baseOpacity =
            level === "high" ? 0.8 : level === "medium" ? 0.7 : 0.6;

          const fLayer = L.geoJSON(f, {
            pane: "noahFloodPane",
            style: {
              color: level === "high" ? "#991b1b" : hazardColor,
              weight: isTargetBrgy ? 1.5 : 0.9,
              opacity: isTargetBrgy ? 0.96 : 0.65,
              fillColor: hazardColor,
              fillOpacity: Math.min(
                0.92,
                (isTargetBrgy ? baseOpacity : baseOpacity * 0.72) +
                  rainIntensityBoost,
              ),
            },
          });

          fLayer.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "floodzone",
              barangayName: f.properties.barangay,
              barangayCode: fCode,
              level,
              depth,
              floodStat: floodStatsFile?.scenarios[noahScenario]?.[fCode],
            });
          });

          fLayer.bindTooltip(
            `<strong>UP Project NOAH: ${level.toUpperCase()} Flood Hazard (${depth})</strong><br/>Brgy. ${f.properties.barangay} · ${noahScenario === "100yr" ? "100-Year Return" : "5-Year Return"}`,
            { sticky: true },
          );

          fLayer.addTo(layerGroup);
        });
      }

      // 3. Render Smooth Sawaga River & Malaybalay Waterways + Clear On-Map River Indicator Pills
      if (showRiversLayer) {
        MALAYBALAY_WATERWAYS.forEach((river) => {
          const smoothLatLngs = smoothRiverCoordinates(river.coordinates, 2);

          // Outer river stage casing halo
          L.polyline(smoothLatLngs, {
            pane: "riverPane",
            color:
              currentHydroSnapshot.alertLevel === "Red Critical"
                ? "#ef4444"
                : currentHydroSnapshot.alertLevel === "Orange Watch"
                  ? "#f97316"
                  : "#0f172a",
            weight: river.widthPx + 3.5,
            opacity: 0.55,
            lineCap: "round",
            lineJoin: "round",
            interactive: false,
          }).addTo(layerGroup);

          // Main waterway channel line
          const riverLine = L.polyline(smoothLatLngs, {
            pane: "riverPane",
            color: river.color,
            weight: river.widthPx + 0.8,
            opacity: 0.98,
            lineCap: "round",
            lineJoin: "round",
          });

          riverLine.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "waterway",
              waterway: river,
            });
          });

          riverLine.bindTooltip(
            `<strong>🌊 ${river.name}</strong> (${river.localName})<br/>Stage: ${currentHydroSnapshot.sawagaWaterLevelM}m · Discharge: ${currentHydroSnapshot.sawagaDischargeM3s} m³/s · Click for telemetry`,
            { sticky: true },
          );

          riverLine.addTo(layerGroup);

          // Inner flow-direction indicator line
          L.polyline(smoothLatLngs, {
            pane: "riverPane",
            color: "#e0f2fe",
            weight: 1.4,
            opacity: 0.85,
            dashArray: "5, 9",
            interactive: false,
          }).addTo(layerGroup);

          // Clear On-Map River Indicator Pill at the river's midpoint
          const midPt =
            river.coordinates[Math.floor(river.coordinates.length / 2)];
          if (midPt) {
            const shortName = river.name.split("(")[0].trim();
            const riverBadge = L.marker([midPt[1], midPt[0]], {
              pane: "indicatorLabelPane",
              icon: L.divIcon({
                className: "gis-river-indicator",
                html: `<button type="button">🌊 ${shortName}</button>`,
                iconSize: [132, 22],
                iconAnchor: [66, 11],
              }),
            });
            riverBadge.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              setSelectedEntity({
                kind: "waterway",
                waterway: river,
              });
            });
            riverBadge.addTo(layerGroup);
          }
        });
      }

      // 4. Render Establishments & Barangay Halls in 'establishmentPane'
      if (showEstablishmentsLayer) {
        MALAYBALAY_ESTABLISHMENTS.forEach((est) => {
          const [lng, lat] = est.coordinates;
          const isFocusedBrgyEst =
            activeBarangayCode !== "ALL" &&
            est.barangayCode === activeBarangayCode;
          const markerColor =
            est.category === "Hospital & Health"
              ? "#dc2626"
              : est.category === "Government & DRRMO"
                ? "#1d4ed8"
                : est.category === "School & University"
                  ? "#7c3aed"
                  : est.category === "Market & Transport"
                    ? "#d97706"
                    : est.category === "Landmark & Watershed"
                      ? "#0891b2"
                      : "#059669";

          const marker = L.circleMarker([lat, lng], {
            pane: "establishmentPane",
            radius: isFocusedBrgyEst
              ? 8.5
              : est.category === "Barangay Hall"
                ? 5.5
                : 7.5,
            color: "#ffffff",
            weight: isFocusedBrgyEst ? 2.5 : 2,
            fillColor: markerColor,
            fillOpacity: 0.96,
          });

          marker.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "establishment",
              establishment: est,
            });
          });

          marker.bindTooltip(
            `<strong>${est.name}</strong><br/>${est.category} · Brgy. ${est.barangayName} · ${est.noahFloodZone}`,
            { direction: "top" },
          );

          marker.addTo(layerGroup);
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    activeBarangayCode,
    setActiveBarangayCode,
    noahScenario,
    basemapStyle,
    is3DMode,
    showFloodLayer,
    showRiversLayer,
    showEstablishmentsLayer,
    currentHydroSnapshot.alertLevel,
    currentHydroSnapshot.sawagaWaterLevelM,
    currentHydroSnapshot.sawagaDischargeM3s,
    floodStatsFile,
    mapLoading,
  ]);

  // Interactive Zoom & Pan Navigation Helpers
  const handleZoomIn = () => {
    leafletMapRef.current?.zoomIn(1, { animate: true });
  };

  const handleZoomOut = () => {
    leafletMapRef.current?.zoomOut(1, { animate: true });
  };

  const handlePanBy = (dx: number, dy: number) => {
    leafletMapRef.current?.panBy([dx, dy], { animate: true });
  };

  const handleZoomToActiveBarangay = () => {
    const map = leafletMapRef.current;
    if (!map) return;
    if (activeBarangayCode === "ALL") {
      if (fullCityBoundsRef.current?.isValid()) {
        map.flyToBounds(fullCityBoundsRef.current, {
          padding: [28, 28],
          maxZoom: 12,
          duration: 0.55,
        });
      }
    } else {
      const bBounds = barangayBoundsMapRef.current.get(activeBarangayCode);
      if (bBounds?.isValid()) {
        map.flyToBounds(bBounds, {
          padding: [48, 48],
          maxZoom: 14,
          duration: 0.55,
        });
      }
    }
  };

  const handleDateChange = (nextDate: string) => {
    setSelectedDate(nextDate);
    if (leafletMapRef.current && activeBarangayCode !== "ALL") {
      const bBounds = barangayBoundsMapRef.current.get(activeBarangayCode);
      if (bBounds?.isValid()) {
        leafletMapRef.current.flyToBounds(bBounds, {
          padding: [48, 48],
          maxZoom: 14,
          duration: 0.5,
        });
      }
    }
  };

  return (
    <div className="noah-clean-gis">
      {/* Structured 2-Row GIS Control Bar */}
      <div
        className="noah-clean-toolbar"
        role="region"
        aria-label="Hydrological and flood timeline calendar from 2019 to forecast days ahead"
      >
        <div className="noah-toolbar-grid-top">
          <label className="noah-clean-control">
            <span>Barangay Focus (46 Barangays)</span>
            <select
              aria-label="Select active barangay in Malaybalay GIS"
              value={activeBarangayCode}
              onChange={(e) => {
                const code = e.target.value;
                setActiveBarangayCode(code);
                if (code === "ALL") setSelectedEntity(null);
              }}
            >
              <option value="ALL">All 46 Barangays (Malaybalay City)</option>
              {barangayMicrosites.map((b) => (
                <option key={b.code} value={b.code}>
                  Brgy. {b.name} ({b.classification})
                </option>
              ))}
            </select>
          </label>

          <label className="noah-clean-control">
            <span>Jump to River / Landmark</span>
            <select
              aria-label="Jump to Malaybalay river or establishment"
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (val.startsWith("river:")) {
                  const rId = val.replace("river:", "");
                  const r = MALAYBALAY_WATERWAYS.find((w) => w.id === rId);
                  if (r && leafletMapRef.current) {
                    const mid =
                      r.coordinates[Math.floor(r.coordinates.length / 2)];
                    leafletMapRef.current.flyTo([mid[1], mid[0]], 13, {
                      duration: 0.5,
                    });
                    setSelectedEntity({ kind: "waterway", waterway: r });
                  }
                } else if (val.startsWith("est:")) {
                  const eId = val.replace("est:", "");
                  const est = MALAYBALAY_ESTABLISHMENTS.find(
                    (item) => item.id === eId,
                  );
                  if (est && leafletMapRef.current) {
                    leafletMapRef.current.flyTo(
                      [est.coordinates[1], est.coordinates[0]],
                      15,
                      { duration: 0.5 },
                    );
                    setSelectedEntity({
                      kind: "establishment",
                      establishment: est,
                    });
                  }
                }
              }}
            >
              <option value="">Select river or establishment…</option>
              <optgroup label="Malaybalay Rivers & Waterways">
                {MALAYBALAY_WATERWAYS.map((w) => (
                  <option key={w.id} value={`river:${w.id}`}>
                    🌊 {w.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Key Malaybalay Establishments">
                {MALAYBALAY_ESTABLISHMENTS.slice(0, 14).map((est) => (
                  <option key={est.id} value={`est:${est.id}`}>
                    📍 {est.name} ({est.barangayName})
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <div className="noah-clean-timeline-group">
            <label className="noah-clean-control">
              <span>
                <Calendar aria-hidden="true" /> Date (2019–Forecast)
              </span>
              <input
                type="date"
                aria-label="Select GIS observation or forecast date"
                min="2019-01-01"
                max={maxForecastDateStr}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </label>
            <div className="noah-clean-date-pills">
              <button
                type="button"
                className={selectedDate === "2019-09-14" ? "is-active" : ""}
                onClick={() => handleDateChange("2019-09-14")}
                title="2019 Southwest Monsoon Peak"
              >
                2019
              </button>
              <button
                type="button"
                className={selectedDate === "2021-12-16" ? "is-active" : ""}
                onClick={() => handleDateChange("2021-12-16")}
                title="2021 Super Typhoon Odette Peak"
              >
                2021 Peak
              </button>
              <button
                type="button"
                className={selectedDate === "2023-11-21" ? "is-active" : ""}
                onClick={() => handleDateChange("2023-11-21")}
                title="2023 Shear Line Peak"
              >
                2023 Peak
              </button>
              <button
                type="button"
                className={selectedDate === todayStr ? "is-active" : ""}
                onClick={() => handleDateChange(todayStr)}
              >
                Today
              </button>
              <button
                type="button"
                className={
                  selectedDate === addDaysManila(todayStr, 3) ? "is-active" : ""
                }
                onClick={() => handleDateChange(addDaysManila(todayStr, 3))}
              >
                +3d
              </button>
              <button
                type="button"
                className={
                  selectedDate === addDaysManila(todayStr, 7) ? "is-active" : ""
                }
                onClick={() => handleDateChange(addDaysManila(todayStr, 7))}
              >
                +7d
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Layer Toggles, Basemap Switcher & 3D Tilt Controls */}
        <div className="noah-clean-toolbar-row is-secondary-row">
          <div className="noah-clean-layer-pills">
            <div className="noah-pill-cluster">
              <button
                type="button"
                className={showFloodLayer ? "is-active" : ""}
                aria-pressed={showFloodLayer}
                onClick={() => setShowFloodLayer((v) => !v)}
              >
                <AlertTriangle aria-hidden="true" /> NOAH Flood
              </button>
              <select
                aria-label="Select NOAH flood return period"
                value={noahScenario}
                onChange={(e) => {
                  setNoahScenario(e.target.value as NoahHazardScenario);
                  setShowFloodLayer(true);
                }}
                className="noah-clean-mini-select"
              >
                <option value="100yr">100-Yr Return</option>
                <option value="5yr">5-Yr Return</option>
              </select>
            </div>

            <button
              type="button"
              className={showRiversLayer ? "is-active" : ""}
              aria-pressed={showRiversLayer}
              onClick={() => setShowRiversLayer((v) => !v)}
            >
              <Waves aria-hidden="true" /> Sawaga & Rivers
            </button>
            <button
              type="button"
              className={showEstablishmentsLayer ? "is-active" : ""}
              aria-pressed={showEstablishmentsLayer}
              onClick={() => setShowEstablishmentsLayer((v) => !v)}
            >
              <Building2 aria-hidden="true" /> Establishments
            </button>

            <div
              className="noah-basemap-segmented"
              role="group"
              aria-label="Basemap style"
            >
              <button
                type="button"
                className={basemapStyle === "street" ? "is-active" : ""}
                onClick={() => setBasemapStyle("street")}
              >
                Street
              </button>
              <button
                type="button"
                className={basemapStyle === "satellite" ? "is-active" : ""}
                onClick={() => setBasemapStyle("satellite")}
              >
                Satellite
              </button>
              <button
                type="button"
                className={basemapStyle === "topo" ? "is-active" : ""}
                onClick={() => setBasemapStyle("topo")}
              >
                Terrain
              </button>
            </div>

            <button
              type="button"
              className={is3DMode ? "is-active" : ""}
              aria-pressed={is3DMode}
              onClick={() => setIs3DMode((v) => !v)}
            >
              <Compass aria-hidden="true" /> 3D Tilt
            </button>

            {activeBarangayCode !== "ALL" && (
              <button
                type="button"
                onClick={() => {
                  setActiveBarangayCode("ALL");
                  setSelectedEntity(null);
                }}
              >
                <LocateFixed aria-hidden="true" /> All 46 Barangays
              </button>
            )}
          </div>

          {is3DMode && (
            <div className="noah-3d-Sliders">
              <label>
                <span>Tilt ({pitchDeg}°)</span>
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={pitchDeg}
                  onChange={(e) => setPitchDeg(Number(e.target.value))}
                />
              </label>
              <label>
                <span>Rotate ({bearingDeg}°)</span>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={bearingDeg}
                  onChange={(e) => setBearingDeg(Number(e.target.value))}
                />
              </label>
              {(pitchDeg !== 22 || bearingDeg !== 0) && (
                <button
                  type="button"
                  className="noah-clean-reset-3d"
                  onClick={() => {
                    setPitchDeg(22);
                    setBearingDeg(0);
                  }}
                >
                  <RotateCcw aria-hidden="true" /> Reset
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Map Stage (Blurred Outside Malaybalay, Seamless 3D Tilt, Unified Controller Pod) */}
      <div
        className={`barangay-map-card noah-clean-map-stage ${
          is3DMode ? "is-3d-tilted" : ""
        }`}
        style={
          {
            "--gis-pitch": `${is3DMode ? pitchDeg : 0}deg`,
            "--gis-bearing": `${is3DMode ? bearingDeg : 0}deg`,
          } as React.CSSProperties
        }
      >
        {mapLoading && (
          <div
            className="map-loading-skeleton"
            role="status"
            aria-live="polite"
          >
            <span className="skeleton-block" />
            <span>Loading Malaybalay interactive GIS map…</span>
          </div>
        )}

        <div
          ref={mapElement}
          className="barangay-map-canvas noah-clean-map-canvas"
          aria-label={
            profile
              ? `Interactive map showing the indicative outline of ${profile.name}`
              : "Interactive GIS map of Malaybalay City and its 46 barangays"
          }
        />

        {/* Top-Left Jurisdiction Focus Indicator Pill */}
        <div className="noah-map-focus-badge">
          <span className="noah-focus-dot" />
          <span>
            <strong>Malaybalay City GIS Focus</strong> · Outside areas masked
          </span>
        </div>

        {/* Unified Top-Right Navigation & Zoom Controller Pod */}
        <div
          className="noah-map-nav-dock"
          aria-label="Map zoom and directional navigation controls"
        >
          <span className="noah-nav-pod-label">Navigate & Zoom</span>
          <div className="noah-nav-pan-grid">
            <button
              type="button"
              className="pan-n"
              onClick={() => handlePanBy(0, -140)}
              aria-label="Pan north"
              title="Pan north"
            >
              <ArrowUp aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pan-w"
              onClick={() => handlePanBy(-140, 0)}
              aria-label="Pan west"
              title="Pan west"
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pan-center"
              onClick={handleZoomToActiveBarangay}
              aria-label="Center on active area"
              title="Center on active barangay or city"
            >
              <LocateFixed aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pan-e"
              onClick={() => handlePanBy(140, 0)}
              aria-label="Pan east"
              title="Pan east"
            >
              <ArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pan-s"
              onClick={() => handlePanBy(0, 140)}
              aria-label="Pan south"
              title="Pan south"
            >
              <ArrowDown aria-hidden="true" />
            </button>
          </div>

          <div className="noah-nav-zoom-bar">
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <Minus aria-hidden="true" />
            </button>
            <span title="Current zoom level">{zoomLevel}x</span>
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <Plus aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Active Barangay or Citywide NOAH Floating Summary Pill */}
        <div className="noah-map-active-overlay">
          {activeBarangayProfile ? (
            <>
              <span
                className="noah-active-swatch"
                style={{
                  background:
                    BARANGAY_GIS_COLORS[activeBarangayProfile.code] ??
                    "#2563eb",
                }}
              />
              <div>
                <strong>
                  Brgy. {activeBarangayProfile.name} · PB{" "}
                  {activeBarangayProfile.punongBarangay}
                </strong>
                <small>
                  Pop.{" "}
                  {activeBarangayProfile.population.toLocaleString("en-PH")} ·{" "}
                  {activeBarangayFloodStat
                    ? `NOAH ${noahScenario.toUpperCase()} Flood-Prone: ${activeBarangayFloodStat.exposedKm2} km² (${activeBarangayFloodStat.exposedShare}%) — High: ${activeBarangayFloodStat.high} km², Med: ${activeBarangayFloodStat.medium} km², Low: ${activeBarangayFloodStat.low} km²`
                    : `PSGC ${activeBarangayProfile.code}`}
                </small>
              </div>
              <button
                type="button"
                className="noah-overlay-inspect-btn"
                onClick={() =>
                  setSelectedEntity({
                    kind: "barangay",
                    barangay: activeBarangayProfile,
                    floodStat: activeBarangayFloodStat,
                  })
                }
              >
                Barangay NOAH Table <ArrowRight aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <span
                className="noah-active-swatch"
                style={{ background: "#1d4ed8" }}
              />
              <div>
                <strong>
                  Malaybalay City (All 46 Barangays) · UP Project NOAH{" "}
                  {noahScenario.toUpperCase()}
                </strong>
                <small>
                  Total Mapped Flood Zone: {citywideFloodTotals.exposedKm2} km²
                  (High: {citywideFloodTotals.high} km² · Medium:{" "}
                  {citywideFloodTotals.medium} km² · Low:{" "}
                  {citywideFloodTotals.low} km²)
                </small>
              </div>
            </>
          )}
        </div>

        {mapError && (
          <p role="status" className="noah-map-error">
            The interactive map could not load. Check your connection or use the
            controls above.
          </p>
        )}
      </div>

      {/* Bottom Legend & Clear Line Indicators Bar */}
      <div className="noah-clean-footer">
        <div className="noah-clean-legend">
          <strong>
            <a
              href="https://noah.up.edu.ph/"
              target="_blank"
              rel="noreferrer"
            >
              UP Project NOAH
            </a>{" "}
            ({noahScenario === "100yr" ? "100-Yr" : "5-Yr"}):
          </strong>
          <span>
            <i style={{ background: FLOOD_COLORS.high }} /> High (&gt;1.5m)
          </span>
          <span>
            <i style={{ background: FLOOD_COLORS.medium }} /> Medium (0.5–1.5m)
          </span>
          <span>
            <i style={{ background: FLOOD_COLORS.low }} /> Low (0–0.5m)
          </span>
          <span>
            <i className="legend-line-river" /> Sawaga & Rivers
          </span>
          <span>
            <i className="legend-line-focus" /> Active Barangay Border
          </span>
          <span>
            <i className="legend-line-city" /> Malaybalay City Perimeter
          </span>
        </div>

        <div className="noah-clean-telemetry">
          <span>
            <strong>{currentHydroSnapshot.date}:</strong>{" "}
            {currentHydroSnapshot.rainfallMm} mm rain (
            {currentHydroSnapshot.rainProbabilityPct}%) · Sawaga River{" "}
            {currentHydroSnapshot.sawagaDischargeM3s} m³/s (
            {currentHydroSnapshot.sawagaWaterLevelM}m ·{" "}
            <b>{currentHydroSnapshot.alertLevel}</b>)
          </span>
          <button
            type="button"
            className="noah-clean-link-btn"
            onClick={() =>
              setSelectedEntity({
                kind: "waterway",
                waterway: MALAYBALAY_WATERWAYS[0],
              })
            }
          >
            Sawaga River Details <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Popup Modal when any Barangay, Flood Zone, River, or Establishment is clicked */}
      {selectedEntity && (
        <div
          className="barangay-popout-backdrop noah-gis-popout-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Malaybalay GIS feature inspection popout"
          onClick={() => setSelectedEntity(null)}
        >
          <div
            className="barangay-popout-modal noah-gis-popout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="barangay-popout-header">
              <div className="barangay-popout-brand">
                <span className="barangay-icon-tile">
                  {selectedEntity.kind === "waterway" ? (
                    <Waves aria-hidden="true" />
                  ) : selectedEntity.kind === "establishment" ? (
                    <Building2 aria-hidden="true" />
                  ) : selectedEntity.kind === "floodzone" ? (
                    <AlertTriangle aria-hidden="true" />
                  ) : (
                    <Navigation aria-hidden="true" />
                  )}
                </span>
                <div>
                  <span className="eyebrow">
                    {selectedEntity.kind === "waterway"
                      ? `Malaybalay River Telemetry · ${selectedDate}`
                      : selectedEntity.kind === "establishment"
                        ? `${selectedEntity.establishment.category} · Barangay ${selectedEntity.establishment.barangayName}`
                        : selectedEntity.kind === "floodzone"
                          ? `UP Project NOAH ${noahScenario.toUpperCase()} Flood Hazard Zone`
                          : `Barangay GIS Profile · PSGC ${selectedEntity.barangay.code}`}
                  </span>
                  <h3>
                    {selectedEntity.kind === "waterway"
                      ? `${selectedEntity.waterway.name} (${selectedEntity.waterway.localName})`
                      : selectedEntity.kind === "establishment"
                        ? selectedEntity.establishment.name
                        : selectedEntity.kind === "floodzone"
                          ? `Barangay ${selectedEntity.barangayName} — ${selectedEntity.level.toUpperCase()} Flood Hazard (${selectedEntity.depth})`
                          : `Barangay ${selectedEntity.barangay.name}`}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                className="barangay-popout-close"
                aria-label="Close GIS popout"
                onClick={() => setSelectedEntity(null)}
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="barangay-popout-body">
              {selectedEntity.kind === "waterway" && (
                <>
                  <p>{selectedEntity.waterway.description}</p>
                  <div className="popout-table-wrap">
                    <table className="popout-structured-table">
                      <tbody>
                        <tr>
                          <th scope="row">Watershed / Basin</th>
                          <td>{selectedEntity.waterway.basin}</td>
                        </tr>
                        <tr>
                          <th scope="row">Channel Length & Type</th>
                          <td>
                            {selectedEntity.waterway.lengthKm} km ·{" "}
                            {selectedEntity.waterway.type}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            Stage Thresholds (Normal / Alert / Critical)
                          </th>
                          <td>
                            Normal: {selectedEntity.waterway.normalStageM} m ·
                            Alert: {selectedEntity.waterway.alertStageM} m ·
                            Critical: {selectedEntity.waterway.criticalStageM} m
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            Selected Date ({currentHydroSnapshot.date})
                          </th>
                          <td>
                            Discharge:{" "}
                            <strong>
                              {currentHydroSnapshot.sawagaDischargeM3s} m³/s
                            </strong>{" "}
                            · Stage:{" "}
                            <strong>
                              {currentHydroSnapshot.sawagaWaterLevelM} m
                            </strong>{" "}
                            ({currentHydroSnapshot.alertLevel})
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Traversed Barangays</th>
                          <td>
                            {selectedEntity.waterway.traversedBarangays.join(
                              ", ",
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">UP Project NOAH Advisory</th>
                          <td>{selectedEntity.waterway.noahAdvisory}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {selectedEntity.kind === "establishment" && (
                <>
                  <p>{selectedEntity.establishment.description}</p>
                  <div className="popout-table-wrap">
                    <table className="popout-structured-table">
                      <tbody>
                        <tr>
                          <th scope="row">Facility Name</th>
                          <td>{selectedEntity.establishment.name}</td>
                        </tr>
                        <tr>
                          <th scope="row">Category</th>
                          <td>{selectedEntity.establishment.category}</td>
                        </tr>
                        <tr>
                          <th scope="row">Barangay</th>
                          <td>
                            Barangay {selectedEntity.establishment.barangayName}{" "}
                            (PSGC {selectedEntity.establishment.barangayCode})
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Coordinates & Elevation</th>
                          <td>
                            {selectedEntity.establishment.coordinates[1].toFixed(
                              4,
                            )}
                            °N,{" "}
                            {selectedEntity.establishment.coordinates[0].toFixed(
                              4,
                            )}
                            °E · ~{selectedEntity.establishment.elevationM} m
                            ASL
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">UP Project NOAH Flood Status</th>
                          <td>
                            <strong>
                              {selectedEntity.establishment.noahFloodZone}
                            </strong>
                          </td>
                        </tr>
                        {selectedEntity.establishment.contact && (
                          <tr>
                            <th scope="row">Published Contact</th>
                            <td>{selectedEntity.establishment.contact}</td>
                          </tr>
                        )}
                        <tr>
                          <th scope="row">Source Reference</th>
                          <td>
                            <a
                              href={selectedEntity.establishment.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {selectedEntity.establishment.sourceLabel}{" "}
                              <ExternalLink aria-hidden="true" />
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {(selectedEntity.kind === "barangay" ||
                selectedEntity.kind === "floodzone") && (() => {
                const bCode =
                  selectedEntity.kind === "barangay"
                    ? selectedEntity.barangay.code
                    : selectedEntity.barangayCode;
                const bProfile = barangayMicrosites.find(
                  (b) => b.code === bCode,
                );
                const stat100 = floodStatsFile?.scenarios["100yr"]?.[bCode];
                const stat5 = floodStatsFile?.scenarios["5yr"]?.[bCode];

                return (
                  <>
                    <div className="popout-table-wrap">
                      <table className="popout-structured-table">
                        <tbody>
                          <tr>
                            <th scope="row">Barangay & PSGC</th>
                            <td>
                              Barangay{" "}
                              {bProfile?.name ??
                                (selectedEntity.kind === "floodzone"
                                  ? selectedEntity.barangayName
                                  : "")}{" "}
                              (PSGC {bCode})
                            </td>
                          </tr>
                          {bProfile && (
                            <>
                              <tr>
                                <th scope="row">Punong Barangay (DILG)</th>
                                <td>{bProfile.punongBarangay}</td>
                              </tr>
                              <tr>
                                <th scope="row">2024 POPCEN Population</th>
                                <td>
                                  {bProfile.population.toLocaleString("en-PH")}{" "}
                                  residents ({bProfile.classification})
                                </td>
                              </tr>
                            </>
                          )}
                          {stat100 && (
                            <tr>
                              <th scope="row">
                                UP NOAH 100-Year Flood Hazard
                              </th>
                              <td>
                                <strong>
                                  {stat100.exposedKm2} km² (
                                  {stat100.exposedShare}% of {stat100.areaKm2}{" "}
                                  km²)
                                </strong>{" "}
                                — Low (0–0.5m): {stat100.low} km², Medium
                                (0.5–1.5m): {stat100.medium} km², High
                                (&gt;1.5m): {stat100.high} km²
                              </td>
                            </tr>
                          )}
                          {stat5 && (
                            <tr>
                              <th scope="row">UP NOAH 5-Year Flood Hazard</th>
                              <td>
                                <strong>
                                  {stat5.exposedKm2} km² ({stat5.exposedShare}
                                  %)
                                </strong>{" "}
                                — Low: {stat5.low} km², Medium: {stat5.medium}{" "}
                                km², High: {stat5.high} km²
                              </td>
                            </tr>
                          )}
                          <tr>
                            <th scope="row">
                              Selected Date ({currentHydroSnapshot.date})
                            </th>
                            <td>
                              {currentHydroSnapshot.alertLevel} · Rainfall:{" "}
                              {currentHydroSnapshot.rainfallMm} mm · Sawaga
                              Discharge:{" "}
                              {currentHydroSnapshot.sawagaDischargeM3s} m³/s
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Official Sources</th>
                            <td>
                              <a
                                href="https://noah.up.edu.ph/"
                                target="_blank"
                                rel="noreferrer"
                              >
                                UP Project NOAH (noah.up.edu.ph){" "}
                                <ExternalLink aria-hidden="true" />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {bProfile && (
                      <div className="noah-popout-actions">
                        <Link
                          className="button primary"
                          to={`/barangays/${bProfile.slug}`}
                          onClick={() => setSelectedEntity(null)}
                        >
                          Open Barangay {bProfile.name} Profile{" "}
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
