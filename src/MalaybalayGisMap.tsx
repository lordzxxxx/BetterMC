import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { FeatureCollection, Geometry } from "geojson";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  Compass,
  ExternalLink,
  Eye,
  Layers,
  LocateFixed,
  MapPin,
  Navigation,
  ShieldAlert,
  Sparkles,
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
  HISTORICAL_HYDRO_YEARS,
  MALAYBALAY_CENTROIDS,
  MALAYBALAY_ESTABLISHMENTS,
  MALAYBALAY_WATERWAYS,
  type BarangayFloodStat,
  type DateHydroSnapshot,
  type MalaybalayEstablishment,
  type MalaybalayEstablishmentCategory,
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
    var: number;
    level: "low" | "medium" | "high";
    depth: string;
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
  low: "#facc15", // NOAH Yellow (0 - 0.5m)
  medium: "#f97316", // NOAH Orange (>0.5 - 1.5m)
  high: "#dc2626", // NOAH Red (>1.5m)
};

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
  compactHeader = false,
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
    "noah-dark" | "satellite" | "terrain"
  >("noah-dark");
  const [is3DPitch, setIs3DPitch] = useState<boolean>(true);
  const [pitchAngle, setPitchAngle] = useState<number>(28);
  const [blurInactiveBarangays, setBlurInactiveBarangays] =
    useState<boolean>(true);

  const [showFloodLayer, setShowFloodLayer] = useState<boolean>(true);
  const [showRiversLayer, setShowRiversLayer] = useState<boolean>(true);
  const [showEstablishmentsLayer, setShowEstablishmentsLayer] =
    useState<boolean>(true);
  const [establishmentCategoryFilter, setEstablishmentCategoryFilter] =
    useState<"ALL" | MalaybalayEstablishmentCategory>("ALL");

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

  // Fetch live Open-Meteo Weather & GloFAS River Discharge telemetry
  useEffect(() => {
    if (navigator.userAgent.includes("jsdom")) return;
    const controller = new AbortController();
    fetchLiveHydroTimeline(controller.signal)
      .then((data) => setLiveHydroMap(data))
      .catch(() => {
        // Fallback deterministic data is used automatically
      });
    return () => controller.abort();
  }, []);

  // Load UP Project NOAH flood stats JSON
  useEffect(() => {
    if (navigator.userAgent.includes("jsdom")) return;
    let cancelled = false;
    fetch("/data/malaybalay-flood-stats.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: MalaybalayFloodStatsFile | null) => {
        if (!cancelled && json) setFloodStatsFile(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
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
      return { low: 76.4, medium: 52.8, high: 38.2, exposedKm2: 167.4 };
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

  const visibleEstablishments = useMemo(() => {
    return MALAYBALAY_ESTABLISHMENTS.filter((est) => {
      if (
        establishmentCategoryFilter !== "ALL" &&
        est.category !== establishmentCategoryFilter
      ) {
        return false;
      }
      if (
        activeBarangayCode !== "ALL" &&
        est.barangayCode !== activeBarangayCode &&
        est.category === "Barangay Hall"
      ) {
        // When zoomed into an active barangay, show all core city landmarks + the active barangay's hall
        return false;
      }
      return true;
    });
  }, [establishmentCategoryFilter, activeBarangayCode]);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapElement.current || navigator.userAgent.includes("jsdom")) return;
    let disposed = false;

    const initMap = async () => {
      setMapLoading(true);
      setMapError(false);
      try {
        const [leafletModule, boundaryRes, flood100Res] = await Promise.all([
          import("leaflet"),
          fetch("/data/malaybalay-barangays.geojson"),
          fetch("/data/malaybalay-flood-100yr.geojson"),
        ]);
        if (!boundaryRes.ok) throw new Error("Boundary data unavailable");
        const boundaries = (await boundaryRes.json()) as BoundaryCollection;
        boundariesRef.current = boundaries;

        if (flood100Res.ok) {
          flood100Ref.current =
            (await flood100Res.json()) as FloodHazardCollection;
        }

        if (disposed || !mapElement.current) return;

        const L = leafletModule.default;
        const map = L.map(mapElement.current, {
          zoomControl: true,
          scrollWheelZoom: false,
          preferCanvas: false,
        });
        leafletMapRef.current = map;

        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;

        // Preload 5yr flood in background
        fetch("/data/malaybalay-flood-5yr.geojson")
          .then((r) => (r.ok ? r.json() : null))
          .then((gj: FloodHazardCollection | null) => {
            if (!disposed && gj) flood5Ref.current = gj;
          })
          .catch(() => {});

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

  // Update basemap tiles when basemapStyle changes
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
          : basemapStyle === "terrain"
            ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

      const attribution =
        basemapStyle === "satellite"
          ? "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics"
          : basemapStyle === "terrain"
            ? "Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap"
            : "&copy; OpenStreetMap contributors &copy; CARTO · UP Project NOAH GIS Reference";

      const tl = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution,
      });
      tl.addTo(leafletMapRef.current);
      tl.bringToBack();
      tileLayerRef.current = tl;
    });

    return () => {
      cancelled = true;
    };
  }, [basemapStyle, mapLoading]);

  // Render GIS vector layers & handle zoom/focus whenever state changes
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

      let targetBounds: import("leaflet").LatLngBounds | null = null;
      let fullCityBounds: import("leaflet").LatLngBounds | null = null;

      // 1. Render all 46 barangay polygons with unique colors & active spotlight/blur
      boundaries.features.forEach((feature) => {
        const code = feature.properties.code;
        const name = feature.properties.name;
        const bProfile = barangayMicrosites.find((b) => b.code === code);
        const color = BARANGAY_GIS_COLORS[code] ?? "#3b82f6";
        const isFocused =
          activeBarangayCode !== "ALL" && code === activeBarangayCode;
        const isDimmed =
          activeBarangayCode !== "ALL" && code !== activeBarangayCode;

        // If 3D mode is active and a barangay is focused, draw a subtle 3D extruded base offset polygon
        if (is3DPitch && isFocused) {
          const shadowFeature = JSON.parse(
            JSON.stringify(feature),
          ) as typeof feature;
          const shiftCoords = (coords: unknown): unknown => {
            if (
              Array.isArray(coords) &&
              typeof coords[0] === "number" &&
              typeof coords[1] === "number"
            ) {
              return [coords[0] + 0.0014, coords[1] - 0.0018];
            }
            if (Array.isArray(coords)) return coords.map(shiftCoords);
            return coords;
          };
          if ("coordinates" in shadowFeature.geometry) {
            shadowFeature.geometry.coordinates = shiftCoords(
              shadowFeature.geometry.coordinates,
            ) as never;
          }
          L.geoJSON(shadowFeature, {
            style: {
              color: "#0f172a",
              weight: 3,
              opacity: 0.75,
              fillColor: color,
              fillOpacity: 0.35,
            },
            interactive: false,
          }).addTo(layerGroup);
        }

        const brgyLayer = L.geoJSON(feature, {
          style: {
            className: isDimmed
              ? blurInactiveBarangays
                ? "gis-brgy-polygon is-dimmed-blurred"
                : "gis-brgy-polygon is-dimmed"
              : isFocused
                ? "gis-brgy-polygon is-focused-active"
                : "gis-brgy-polygon",
            color: isFocused
              ? "#ffffff"
              : isDimmed
                ? "rgba(148, 163, 184, 0.28)"
                : "#f8fafc",
            weight: isFocused ? 3.8 : isDimmed ? 1 : 1.8,
            opacity: isFocused ? 1 : isDimmed ? 0.35 : 0.88,
            fillColor: isDimmed && blurInactiveBarangays ? "#0f172a" : color,
            fillOpacity: isFocused
              ? 0.36
              : isDimmed
                ? blurInactiveBarangays
                  ? 0.62
                  : 0.14
                : 0.42,
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

        brgyLayer.bindTooltip(
          `<strong>Brgy. ${name}</strong> · PSGC ${code}`,
          {
            sticky: true,
            direction: "top",
            className: "gis-map-tooltip",
          },
        );

        brgyLayer.addTo(layerGroup);

        const bBounds = brgyLayer.getBounds();
        if (!fullCityBounds) {
          fullCityBounds = L.latLngBounds(
            bBounds.getSouthWest(),
            bBounds.getNorthEast(),
          );
        } else {
          fullCityBounds.extend(bBounds);
        }
        if (isFocused) {
          targetBounds = bBounds;
        }
      });

      // 2. Render UP Project NOAH Flood Hazard Polygons
      const activeFloodCollection =
        noahScenario === "5yr" && flood5Ref.current
          ? flood5Ref.current
          : flood100Ref.current;

      if (showFloodLayer && activeFloodCollection) {
        const rainfallFactor =
          currentHydroSnapshot.alertLevel === "Red Critical"
            ? 0.85
            : currentHydroSnapshot.alertLevel === "Orange Watch"
              ? 0.76
              : 0.68;

        activeFloodCollection.features.forEach((f) => {
          const fCode = f.properties.code;
          const isTargetBrgy =
            activeBarangayCode === "ALL" || fCode === activeBarangayCode;
          // Dim flood polygons outside the active barangay so the active barangay's flood zones stand out sharply
          if (!isTargetBrgy && blurInactiveBarangays) return;

          const level = f.properties.level;
          const hazardColor = FLOOD_COLORS[level] ?? "#f97316";

          const fLayer = L.geoJSON(f, {
            style: {
              color: hazardColor,
              weight: isTargetBrgy ? 1.2 : 0.4,
              opacity: isTargetBrgy ? 0.92 : 0.22,
              fillColor: hazardColor,
              fillOpacity: isTargetBrgy ? rainfallFactor : 0.15,
            },
          });

          fLayer.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "floodzone",
              barangayName: f.properties.barangay,
              barangayCode: fCode,
              level,
              depth: f.properties.depth,
              floodStat: floodStatsFile?.scenarios[noahScenario]?.[fCode],
            });
          });

          fLayer.bindTooltip(
            `<strong>UP NOAH ${level.toUpperCase()} Flood Hazard (${f.properties.depth})</strong><br/>Brgy. ${f.properties.barangay} · ${noahScenario === "100yr" ? "100-Yr Return" : "5-Yr Return"}`,
            {
              sticky: true,
              className: "gis-map-tooltip is-hazard",
            },
          );

          fLayer.addTo(layerGroup);
        });
      }

      // 3. Render Rivers & Waterways (Sawaga River + major Malaybalay tributaries)
      if (showRiversLayer) {
        MALAYBALAY_WATERWAYS.forEach((river) => {
          const latLngs = river.coordinates.map(
            ([lng, lat]) => [lat, lng] as [number, number],
          );

          // Outer glow line for Sawaga River and major waterways
          L.polyline(latLngs, {
            color:
              currentHydroSnapshot.alertLevel === "Red Critical"
                ? "#ef4444"
                : currentHydroSnapshot.alertLevel === "Orange Watch"
                  ? "#f59e0b"
                  : "#38bdf8",
            weight: river.widthPx + 5,
            opacity: 0.35,
            interactive: false,
          }).addTo(layerGroup);

          const riverLine = L.polyline(latLngs, {
            color: river.color,
            weight: river.widthPx,
            opacity: 0.96,
            dashArray:
              river.type === "Urban Creek / Floodway" ? "6, 4" : undefined,
          });

          riverLine.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "waterway",
              waterway: river,
            });
          });

          riverLine.bindTooltip(
            `<strong>${river.name}</strong> (${river.localName})<br/>Stage: ${currentHydroSnapshot.sawagaWaterLevelM}m · Click for river telemetry`,
            {
              sticky: true,
              className: "gis-map-tooltip is-river",
            },
          );

          riverLine.addTo(layerGroup);
        });
      }

      // 4. Render Interactive Malaybalay Establishments & Barangay Halls
      if (showEstablishmentsLayer) {
        visibleEstablishments.forEach((est) => {
          const [lng, lat] = est.coordinates;
          const markerColor =
            est.category === "Hospital & Health"
              ? "#ef4444"
              : est.category === "Government & DRRMO"
                ? "#2563eb"
                : est.category === "School & University"
                  ? "#8b5cf6"
                  : est.category === "Market & Transport"
                    ? "#f59e0b"
                    : est.category === "Landmark & Watershed"
                      ? "#06b6d4"
                      : "#10b981";

          const marker = L.circleMarker([lat, lng], {
            radius: est.category === "Barangay Hall" ? 6 : 8,
            color: "#ffffff",
            weight: 2,
            fillColor: markerColor,
            fillOpacity: 0.95,
          });

          marker.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "establishment",
              establishment: est,
            });
          });

          marker.bindTooltip(
            `<strong>${est.name}</strong><br/>${est.category} · Brgy. ${est.barangayName}`,
            {
              direction: "top",
              className: "gis-map-tooltip",
            },
          );

          marker.addTo(layerGroup);
        });
      }

      // 5. Fly / Zoom to active barangay or full Malaybalay City bounds
      if (targetBounds) {
        map.fitBounds(targetBounds, {
          padding: [42, 42],
          maxZoom: 14,
          animate: true,
        });
      } else if (fullCityBounds) {
        map.fitBounds(fullCityBounds, {
          padding: [24, 24],
          maxZoom: 12,
          animate: true,
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
    showFloodLayer,
    showRiversLayer,
    showEstablishmentsLayer,
    visibleEstablishments,
    blurInactiveBarangays,
    is3DPitch,
    currentHydroSnapshot.alertLevel,
    currentHydroSnapshot.sawagaWaterLevelM,
    floodStatsFile,
    mapLoading,
  ]);

  const handleDateChange = (nextDate: string) => {
    setSelectedDate(nextDate);
    // When changing the calendar date, re-focus/zoom on the active barangay so the user immediately sees the flood/river impact
    if (leafletMapRef.current && activeBarangayCode !== "ALL") {
      const centroid = MALAYBALAY_CENTROIDS[activeBarangayCode];
      if (centroid) {
        leafletMapRef.current.setView([centroid[1], centroid[0]], 13, {
          animate: true,
        });
      }
    }
  };

  return (
    <div className="noah-gis-shell">
      {/* Top GIS Command & UP Project NOAH Header Bar */}
      <div className="noah-gis-header">
        <div className="noah-gis-brand">
          <span className="noah-gis-badge">
            <Waves aria-hidden="true" />
            UP Project NOAH · Malaybalay 3D GIS
          </span>
          <h3>
            {activeBarangayProfile
              ? `Barangay ${activeBarangayProfile.name} Flood Hazard, Sawaga River & Establishment GIS`
              : "Malaybalay City Interactive 3D Flood Hazard & Barangay GIS (46 Barangays)"}
          </h3>
          {!compactHeader && (
            <p>
              Referenced from{" "}
              <a
                href="https://noah.up.edu.ph/"
                target="_blank"
                rel="noreferrer"
              >
                UP Resilience Institute — Project NOAH (noah.up.edu.ph)
              </a>{" "}
              LiDAR flood hazard models, PAGASA / Open-Meteo real-time weather,
              and GloFAS Sawaga River discharge records (2019–present & forecast
              days ahead).
            </p>
          )}
        </div>

        <div className="noah-gis-quick-controls">
          <label className="noah-gis-select-wrap">
            <span>Active Barangay Spotlight</span>
            <select
              aria-label="Select active barangay in Malaybalay GIS"
              value={activeBarangayCode}
              onChange={(e) => {
                const code = e.target.value;
                setActiveBarangayCode(code);
                if (code === "ALL") {
                  setSelectedEntity(null);
                } else {
                  const found = barangayMicrosites.find((b) => b.code === code);
                  if (found) {
                    setSelectedEntity({
                      kind: "barangay",
                      barangay: found,
                      floodStat: floodStatsFile?.scenarios[noahScenario]?.[code],
                    });
                  }
                }
              }}
            >
              <option value="ALL">
                All 46 Barangays (Malaybalay Citywide View)
              </option>
              {barangayMicrosites.map((b) => (
                <option key={b.code} value={b.code}>
                  Brgy. {b.name} ({b.classification})
                </option>
              ))}
            </select>
          </label>

          {activeBarangayCode !== "ALL" && (
            <button
              type="button"
              className="noah-gis-chip-btn is-spotlight-toggle"
              aria-pressed={blurInactiveBarangays}
              onClick={() => setBlurInactiveBarangays((v) => !v)}
              title="Blur and dim surrounding barangays to focus on the active barangay"
            >
              <Eye aria-hidden="true" />
              {blurInactiveBarangays
                ? "Blur other barangays: ON"
                : "Blur other barangays: OFF"}
            </button>
          )}

          {activeBarangayCode !== "ALL" && (
            <button
              type="button"
              className="noah-gis-chip-btn"
              onClick={() => {
                setActiveBarangayCode("ALL");
                setSelectedEntity(null);
              }}
            >
              <LocateFixed aria-hidden="true" /> Reset to all 46 barangays
            </button>
          )}
        </div>
      </div>

      {/* Calendar & Hydrological Timeline Bar (2019 – Present – Future Forecast Days Ahead) */}
      <div
        className="noah-gis-calendar-bar"
        role="region"
        aria-label="Hydrological and flood timeline calendar from 2019 to forecast days ahead"
      >
        <div className="noah-calendar-picker-group">
          <label className="noah-date-input-label">
            <Calendar aria-hidden="true" />
            <div>
              <span>Historical (2019+) · Real-Time · Forecast Calendar</span>
              <input
                type="date"
                aria-label="Select GIS observation or forecast date"
                min="2019-01-01"
                max={maxForecastDateStr}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          </label>

          <div className="noah-calendar-presets" aria-label="Quick timeline dates">
            {HISTORICAL_HYDRO_YEARS.slice(0, 7).map((yr) => (
              <button
                key={yr.year}
                type="button"
                className={
                  selectedDate.startsWith(String(yr.year)) &&
                  selectedDate !== todayStr
                    ? "is-active"
                    : ""
                }
                onClick={() => handleDateChange(yr.peakEventDate)}
                title={`${yr.year} Peak Event: ${yr.notableWeatherSystem}`}
              >
                {yr.year} Peak
              </button>
            ))}
            <button
              type="button"
              className={selectedDate === todayStr ? "is-active is-live" : "is-live"}
              onClick={() => handleDateChange(todayStr)}
            >
              Today (Real-Time)
            </button>
            <button
              type="button"
              className={
                selectedDate === addDaysManila(todayStr, 1) ? "is-active" : ""
              }
              onClick={() => handleDateChange(addDaysManila(todayStr, 1))}
            >
              +1 Day Ahead
            </button>
            <button
              type="button"
              className={
                selectedDate === addDaysManila(todayStr, 3) ? "is-active" : ""
              }
              onClick={() => handleDateChange(addDaysManila(todayStr, 3))}
            >
              +3 Days Ahead
            </button>
            <button
              type="button"
              className={
                selectedDate === addDaysManila(todayStr, 7) ? "is-active" : ""
              }
              onClick={() => handleDateChange(addDaysManila(todayStr, 7))}
            >
              +7 Days Forecast
            </button>
          </div>
        </div>

        <div className="noah-hydro-telemetry-strip">
          <div className="noah-telemetry-item">
            <span>Selected Date</span>
            <strong>{currentHydroSnapshot.date}</strong>
            <small>
              {currentHydroSnapshot.isForecast
                ? "Forecast Ahead"
                : currentHydroSnapshot.date === todayStr
                  ? "Live Telemetry"
                  : "Historical Record"}
            </small>
          </div>
          <div className="noah-telemetry-item">
            <span>24h Rainfall / Chance</span>
            <strong>
              {currentHydroSnapshot.rainfallMm} mm ({currentHydroSnapshot.rainProbabilityPct}%)
            </strong>
            <small>
              Temp {currentHydroSnapshot.temperatureMinC}–
              {currentHydroSnapshot.temperatureMaxC}°C · Wind{" "}
              {currentHydroSnapshot.windMaxKmh} km/h
            </small>
          </div>
          <div className="noah-telemetry-item">
            <span>Sawaga River Discharge</span>
            <strong>{currentHydroSnapshot.sawagaDischargeM3s} m³/s</strong>
            <small>
              Est. Stage: {currentHydroSnapshot.sawagaWaterLevelM} m (Normal:
              1.4m)
            </small>
          </div>
          <div
            className={`noah-telemetry-item is-alert-${currentHydroSnapshot.alertLevel
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <span>Basin Flood Advisory</span>
            <strong>{currentHydroSnapshot.alertLevel}</strong>
            <small>{currentHydroSnapshot.dataSource.split("+")[0]}</small>
          </div>
        </div>
      </div>

      {/* Layer Controls Toolbar */}
      <div className="noah-gis-layer-toolbar">
        <div className="noah-layer-group">
          <span className="noah-toolbar-label">
            <Layers aria-hidden="true" /> NOAH Return Period:
          </span>
          <button
            type="button"
            className={`noah-toggle-pill ${noahScenario === "100yr" ? "is-active" : ""}`}
            onClick={() => setNoahScenario("100yr")}
          >
            100-Year Extreme Rain
          </button>
          <button
            type="button"
            className={`noah-toggle-pill ${noahScenario === "5yr" ? "is-active" : ""}`}
            onClick={() => setNoahScenario("5yr")}
          >
            5-Year Rain Return
          </button>
        </div>

        <div className="noah-layer-group">
          <span className="noah-toolbar-label">Map Layers:</span>
          <button
            type="button"
            className={`noah-toggle-pill ${showFloodLayer ? "is-active" : ""}`}
            aria-pressed={showFloodLayer}
            onClick={() => setShowFloodLayer((v) => !v)}
          >
            <AlertTriangle aria-hidden="true" /> Flood Hazard Zones
          </button>
          <button
            type="button"
            className={`noah-toggle-pill ${showRiversLayer ? "is-active" : ""}`}
            aria-pressed={showRiversLayer}
            onClick={() => setShowRiversLayer((v) => !v)}
          >
            <Waves aria-hidden="true" /> Sawaga & Rivers (6)
          </button>
          <button
            type="button"
            className={`noah-toggle-pill ${showEstablishmentsLayer ? "is-active" : ""}`}
            aria-pressed={showEstablishmentsLayer}
            onClick={() => setShowEstablishmentsLayer((v) => !v)}
          >
            <Building2 aria-hidden="true" /> Establishments (
            {visibleEstablishments.length})
          </button>
        </div>

        <div className="noah-layer-group">
          <span className="noah-toolbar-label">
            <Compass aria-hidden="true" /> View & Basemap:
          </span>
          <button
            type="button"
            className={`noah-toggle-pill ${is3DPitch ? "is-active" : ""}`}
            aria-pressed={is3DPitch}
            onClick={() => setIs3DPitch((v) => !v)}
          >
            {is3DPitch ? `3D GIS Tilt (${pitchAngle}°)` : "2D Flat View"}
          </button>
          {is3DPitch && (
            <input
              type="range"
              aria-label="Adjust 3D GIS pitch angle"
              min={12}
              max={42}
              value={pitchAngle}
              onChange={(e) => setPitchAngle(Number(e.target.value))}
              className="noah-pitch-slider"
            />
          )}
          <select
            aria-label="Select GIS basemap style"
            value={basemapStyle}
            onChange={(e) =>
              setBasemapStyle(
                e.target.value as "noah-dark" | "satellite" | "terrain",
              )
            }
            className="noah-basemap-select"
          >
            <option value="noah-dark">NOAH Dark GIS Basemap</option>
            <option value="satellite">Esri World Satellite Imagery</option>
            <option value="terrain">Topographic Elevation Map</option>
          </select>
        </div>
      </div>

      {/* Main 3D GIS Map Stage + Side Interactive Inspector */}
      <div className="noah-gis-stage-grid">
        <div
          className={`barangay-map-card noah-gis-map-viewport ${
            is3DPitch ? "is-3d-pitched" : ""
          } ${
            activeBarangayCode !== "ALL" && blurInactiveBarangays
              ? "has-active-spotlight"
              : ""
          }`}
          style={
            {
              "--gis-pitch-deg": `${is3DPitch ? pitchAngle : 0}deg`,
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
              <span>
                Loading Malaybalay 3D GIS, UP Project NOAH flood layers, and
                Sawaga River network…
              </span>
            </div>
          )}

          <div
            ref={mapElement}
            className="barangay-map-canvas noah-gis-canvas"
            aria-label={
              profile
                ? `Interactive map showing the indicative outline of ${profile.name}`
                : "Interactive 3D GIS map of Malaybalay City and its 46 barangays"
            }
          />

          {/* Floating Legend & Active Barangay Badge inside Map */}
          <div className="noah-map-floating-legend">
            <div className="noah-legend-title">
              <strong>UP Project NOAH Flood Depth</strong>
              <span>
                {noahScenario === "100yr"
                  ? "100-Yr Return"
                  : "5-Yr Return"}
              </span>
            </div>
            <div className="noah-legend-items">
              <span>
                <i style={{ background: FLOOD_COLORS.high }} /> High (&gt;1.5m)
              </span>
              <span>
                <i style={{ background: FLOOD_COLORS.medium }} /> Medium
                (0.5–1.5m)
              </span>
              <span>
                <i style={{ background: FLOOD_COLORS.low }} /> Low (0–0.5m)
              </span>
              <span>
                <i
                  style={{
                    background: "#0284c7",
                    borderRadius: "2px",
                    height: "4px",
                  }}
                />{" "}
                Sawaga & Rivers
              </span>
            </div>
          </div>

          {activeBarangayProfile && (
            <div className="noah-active-barangay-floating-pill">
              <span
                className="noah-color-dot"
                style={{
                  background:
                    BARANGAY_GIS_COLORS[activeBarangayProfile.code] ??
                    "#3b82f6",
                }}
              />
              <div>
                <strong>
                  Active Focus: Barangay {activeBarangayProfile.name}
                </strong>
                <small>
                  {activeBarangayFloodStat
                    ? `${activeBarangayFloodStat.exposedKm2} km² flood-prone (${activeBarangayFloodStat.exposedShare}% of ${activeBarangayFloodStat.areaKm2} km²)`
                    : `PSGC ${activeBarangayProfile.code}`}
                </small>
              </div>
            </div>
          )}

          {mapError && (
            <p role="status" className="noah-map-error">
              The interactive GIS canvas could not initialize in this browser
              environment. Use the barangay, river, and establishment directory
              controls alongside this panel to inspect UP Project NOAH flood
              data.
            </p>
          )}
        </div>

        {/* Right-Hand Interactive GIS Inspector & Layer Directory */}
        <aside
          className="noah-gis-sidebar"
          aria-label="Malaybalay GIS layer inspector and flood statistics"
        >
          {/* Active Barangay or Citywide NOAH Flood Summary Card */}
          <div className="noah-inspector-card">
            <div className="noah-inspector-head">
              <span className="eyebrow">
                {activeBarangayProfile
                  ? `Barangay ${activeBarangayProfile.name} · NOAH Hazard`
                  : "Malaybalay Citywide · NOAH Hazard"}
              </span>
              <h4>
                {activeBarangayProfile
                  ? `${activeBarangayProfile.name} Flood Exposure (${noahScenario.toUpperCase()})`
                  : `All 46 Barangays Flood Exposure (${noahScenario.toUpperCase()})`}
              </h4>
            </div>

            {activeBarangayFloodStat ? (
              <div className="noah-hazard-stat-grid">
                <div className="is-high">
                  <span>High (&gt;1.5m)</span>
                  <strong>{activeBarangayFloodStat.high} km²</strong>
                </div>
                <div className="is-medium">
                  <span>Medium (0.5–1.5m)</span>
                  <strong>{activeBarangayFloodStat.medium} km²</strong>
                </div>
                <div className="is-low">
                  <span>Low (0–0.5m)</span>
                  <strong>{activeBarangayFloodStat.low} km²</strong>
                </div>
                <div className="is-total">
                  <span>Flood-Prone Share</span>
                  <strong>
                    {activeBarangayFloodStat.exposedShare}% (
                    {activeBarangayFloodStat.exposedKm2} km²)
                  </strong>
                </div>
              </div>
            ) : (
              <div className="noah-hazard-stat-grid">
                <div className="is-high">
                  <span>City High (&gt;1.5m)</span>
                  <strong>{citywideFloodTotals.high} km²</strong>
                </div>
                <div className="is-medium">
                  <span>City Medium</span>
                  <strong>{citywideFloodTotals.medium} km²</strong>
                </div>
                <div className="is-low">
                  <span>City Low (0–0.5m)</span>
                  <strong>{citywideFloodTotals.low} km²</strong>
                </div>
                <div className="is-total">
                  <span>Total Mapped Zone</span>
                  <strong>{citywideFloodTotals.exposedKm2} km²</strong>
                </div>
              </div>
            )}

            <p className="noah-advisory-note">
              <ShieldAlert aria-hidden="true" />
              <span>{currentHydroSnapshot.advisorySummary}</span>
            </p>
          </div>

          {/* Clickable Rivers & Waterways List (Sawaga River + Tributaries) */}
          <div className="noah-inspector-card">
            <div className="noah-inspector-head">
              <span className="eyebrow">Interactive Hydrological Network</span>
              <h4>Rivers & Sawaga Basin (Click to Inspect)</h4>
            </div>
            <div className="noah-entity-list">
              {MALAYBALAY_WATERWAYS.map((river) => (
                <button
                  key={river.id}
                  type="button"
                  className={`noah-entity-btn ${
                    selectedEntity?.kind === "waterway" &&
                    selectedEntity.waterway.id === river.id
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedEntity({ kind: "waterway", waterway: river })
                  }
                >
                  <span
                    className="noah-entity-dot"
                    style={{ background: river.color }}
                  />
                  <div>
                    <strong>{river.name}</strong>
                    <small>
                      {river.lengthKm} km · {river.traversedBarangays.length}{" "}
                      barangays traversed
                    </small>
                  </div>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* Clickable Establishments & Critical Facilities */}
          <div className="noah-inspector-card">
            <div className="noah-inspector-head">
              <span className="eyebrow">Critical Facilities & Landmarks</span>
              <h4>Malaybalay Establishments</h4>
            </div>
            <select
              aria-label="Filter Malaybalay establishments by category"
              value={establishmentCategoryFilter}
              onChange={(e) =>
                setEstablishmentCategoryFilter(
                  e.target.value as "ALL" | MalaybalayEstablishmentCategory,
                )
              }
              className="noah-est-filter-select"
            >
              <option value="ALL">All Establishment Categories</option>
              <option value="Government & DRRMO">Government & DRRMO</option>
              <option value="Hospital & Health">Hospitals & Health</option>
              <option value="School & University">Schools & Universities</option>
              <option value="Market & Transport">Markets & Transport</option>
              <option value="Landmark & Watershed">
                Landmarks & River Gauges
              </option>
              <option value="Barangay Hall">46 Barangay Halls</option>
            </select>

            <div className="noah-entity-list is-scrollable">
              {visibleEstablishments.slice(0, 12).map((est) => (
                <button
                  key={est.id}
                  type="button"
                  className={`noah-entity-btn ${
                    selectedEntity?.kind === "establishment" &&
                    selectedEntity.establishment.id === est.id
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedEntity({
                      kind: "establishment",
                      establishment: est,
                    });
                    if (leafletMapRef.current) {
                      leafletMapRef.current.setView(
                        [est.coordinates[1], est.coordinates[0]],
                        15,
                        { animate: true },
                      );
                    }
                  }}
                >
                  <MapPin aria-hidden="true" />
                  <div>
                    <strong>{est.name}</strong>
                    <small>
                      Brgy. {est.barangayName} · {est.noahFloodZone}
                    </small>
                  </div>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 46 Barangay Color Swatch & Quick Zoom Strip */}
      <div
        className="noah-barangay-palette-strip"
        aria-label="46 barangay color key and quick zoom selector"
      >
        <div className="noah-palette-header">
          <span>
            <strong>46 Barangay Color Key & Instant GIS Zoom</strong> — Click
            any barangay to zoom in, inspect its UP Project NOAH flood zones,
            and blur surrounding barangays:
          </span>
        </div>
        <div className="noah-palette-scroll">
          <button
            type="button"
            className={`noah-brgy-swatch-chip ${
              activeBarangayCode === "ALL" ? "is-active" : ""
            }`}
            onClick={() => {
              setActiveBarangayCode("ALL");
              setSelectedEntity(null);
            }}
          >
            <Sparkles aria-hidden="true" /> All 46 Barangays
          </button>
          {barangayMicrosites.map((b) => {
            const c = BARANGAY_GIS_COLORS[b.code] ?? "#3b82f6";
            const isSelected = activeBarangayCode === b.code;
            return (
              <button
                key={b.code}
                type="button"
                className={`noah-brgy-swatch-chip ${
                  isSelected ? "is-active" : ""
                }`}
                onClick={() => {
                  setActiveBarangayCode(b.code);
                  setSelectedEntity({
                    kind: "barangay",
                    barangay: b,
                    floodStat: floodStatsFile?.scenarios[noahScenario]?.[b.code],
                  });
                }}
              >
                <i style={{ background: c }} />
                <span>{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Popout Card Modal for Clicked GIS Feature (Barangay, Waterway, Establishment, or Flood Zone) */}
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
                      ? `Malaybalay River & Waterway Telemetry · ${selectedDate}`
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
                            Active Date ({currentHydroSnapshot.date}) Telemetry
                          </th>
                          <td>
                            Sawaga Basin Discharge:{" "}
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
                          <th scope="row">Traversed Barangays in Malaybalay</th>
                          <td>
                            {selectedEntity.waterway.traversedBarangays.join(
                              ", ",
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">UP Project NOAH Flood Advisory</th>
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
                          <th scope="row">Facility / Establishment</th>
                          <td>{selectedEntity.establishment.name}</td>
                        </tr>
                        <tr>
                          <th scope="row">Category</th>
                          <td>{selectedEntity.establishment.category}</td>
                        </tr>
                        <tr>
                          <th scope="row">Barangay & PSGC</th>
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
                          <th scope="row">UP Project NOAH Flood Zone Status</th>
                          <td>
                            <strong>
                              {selectedEntity.establishment.noahFloodZone}
                            </strong>{" "}
                            ·{" "}
                            {selectedEntity.establishment.evacuationCapable
                              ? "Designated High-Ground / Emergency Assembly Point"
                              : "Monitor riverside access roads during heavy rain"}
                          </td>
                        </tr>
                        {selectedEntity.establishment.contact && (
                          <tr>
                            <th scope="row">Published Contact</th>
                            <td>{selectedEntity.establishment.contact}</td>
                          </tr>
                        )}
                        <tr>
                          <th scope="row">Source Citation</th>
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
                                UP NOAH 100-Year Flood Hazard Breakdown
                              </th>
                              <td>
                                Total Land Area: {stat100.areaKm2} km² ·{" "}
                                <strong>
                                  Exposed: {stat100.exposedKm2} km² (
                                  {stat100.exposedShare}%)
                                </strong>{" "}
                                — Low (0–0.5m): {stat100.low} km², Medium
                                (0.5–1.5m): {stat100.medium} km², High
                                (&gt;1.5m): {stat100.high} km²
                              </td>
                            </tr>
                          )}
                          {stat5 && (
                            <tr>
                              <th scope="row">
                                UP NOAH 5-Year Flood Hazard Breakdown
                              </th>
                              <td>
                                <strong>
                                  Exposed: {stat5.exposedKm2} km² (
                                  {stat5.exposedShare}%)
                                </strong>{" "}
                                — Low: {stat5.low} km², Medium: {stat5.medium}{" "}
                                km², High: {stat5.high} km²
                              </td>
                            </tr>
                          )}
                          <tr>
                            <th scope="row">
                              Selected Date ({currentHydroSnapshot.date}) Status
                            </th>
                            <td>
                              {currentHydroSnapshot.alertLevel} · Rainfall:{" "}
                              {currentHydroSnapshot.rainfallMm} mm · Sawaga
                              Discharge:{" "}
                              {currentHydroSnapshot.sawagaDischargeM3s} m³/s
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Primary & Backup GIS References</th>
                            <td>
                              <a
                                href="https://noah.up.edu.ph/"
                                target="_blank"
                                rel="noreferrer"
                              >
                                UP Resilience Institute — Project NOAH{" "}
                                <ExternalLink aria-hidden="true" />
                              </a>{" "}
                              ·{" "}
                              <a
                                href="https://huggingface.co/datasets/bettergovph/project-noah-hazard-maps"
                                target="_blank"
                                rel="noreferrer"
                              >
                                NOAH Bukidnon LiDAR Shapefile Archive{" "}
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
                          Open Barangay {bProfile.name} Full Profile{" "}
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
