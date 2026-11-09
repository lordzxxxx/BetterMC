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
  LocateFixed,
  Navigation,
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
  low: "#eab308", // NOAH Low (0 - 0.5m)
  medium: "#f97316", // NOAH Medium (>0.5 - 1.5m)
  high: "#dc2626", // NOAH High (>1.5m)
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
  const [basemapStyle, setBasemapStyle] = useState<"street" | "satellite">(
    "street",
  );
  const [is3DPitch, setIs3DPitch] = useState<boolean>(false);
  const [blurInactiveBarangays, setBlurInactiveBarangays] =
    useState<boolean>(true);

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

  // Fetch live Open-Meteo Weather & GloFAS River Discharge telemetry
  useEffect(() => {
    if (navigator.userAgent.includes("jsdom")) return;
    const controller = new AbortController();
    fetchLiveHydroTimeline(controller.signal)
      .then((data) => setLiveHydroMap(data))
      .catch(() => {});
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

  const visibleEstablishments = useMemo(() => {
    return MALAYBALAY_ESTABLISHMENTS.filter((est) => {
      if (
        activeBarangayCode !== "ALL" &&
        est.barangayCode !== activeBarangayCode &&
        est.category === "Barangay Hall"
      ) {
        return false;
      }
      return true;
    });
  }, [activeBarangayCode]);

  // Initialize Leaflet Map with explicit center & zoom so tiles and vector layers render immediately
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
          center: [8.1575, 125.1278],
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: false,
        });
        leafletMapRef.current = map;

        const initialTile = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · UP Project NOAH',
          },
        ).addTo(map);
        tileLayerRef.current = initialTile;

        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;

        window.setTimeout(() => {
          if (!disposed && leafletMapRef.current) {
            leafletMapRef.current.invalidateSize();
          }
        }, 120);

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

  // Switch between Street and Satellite basemap tiles
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
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      const attribution =
        basemapStyle === "satellite"
          ? "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics · UP Project NOAH"
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · UP Project NOAH';

      const tl = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution,
      }).addTo(leafletMapRef.current);
      tl.bringToBack();
      tileLayerRef.current = tl;
    });

    return () => {
      cancelled = true;
    };
  }, [basemapStyle, mapLoading]);

  // Render GIS vector layers & zoom to active barangay
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

      // 1. Render all 46 barangay polygons with distinct colors
      boundaries.features.forEach((feature) => {
        const code = feature.properties.code;
        const name = feature.properties.name;
        const bProfile = barangayMicrosites.find((b) => b.code === code);
        const color = BARANGAY_GIS_COLORS[code] ?? "#2563eb";
        const isFocused =
          activeBarangayCode !== "ALL" && code === activeBarangayCode;
        const isDimmed =
          activeBarangayCode !== "ALL" && code !== activeBarangayCode;

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
              ? color
              : isDimmed
                ? "#94a3b8"
                : color,
            weight: isFocused ? 4 : isDimmed ? 1 : 2,
            opacity: isFocused ? 1 : isDimmed ? 0.35 : 0.85,
            fillColor: isDimmed && blurInactiveBarangays ? "#cbd5e1" : color,
            fillOpacity: isFocused
              ? 0.14
              : isDimmed
                ? blurInactiveBarangays
                  ? 0.45
                  : 0.08
                : 0.24,
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
          `<strong>Brgy. ${name}</strong> · Click to focus & inspect`,
          {
            sticky: true,
            direction: "top",
          },
        );

        brgyLayer.addTo(layerGroup);

        const bBounds = brgyLayer.getBounds();
        if (bBounds.isValid()) {
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
        }
      });

      // 2. Render UP Project NOAH Flood Hazard Polygons
      const activeFloodCollection =
        noahScenario === "5yr" && flood5Ref.current
          ? flood5Ref.current
          : flood100Ref.current;

      if (showFloodLayer && activeFloodCollection) {
        activeFloodCollection.features.forEach((f) => {
          const fCode = f.properties.code;
          const isTargetBrgy =
            activeBarangayCode === "ALL" || fCode === activeBarangayCode;
          if (!isTargetBrgy && blurInactiveBarangays) return;

          const level = f.properties.level;
          const hazardColor = FLOOD_COLORS[level] ?? "#f97316";

          const fLayer = L.geoJSON(f, {
            style: {
              color: hazardColor,
              weight: isTargetBrgy ? 1.2 : 0.5,
              opacity: isTargetBrgy ? 0.9 : 0.25,
              fillColor: hazardColor,
              fillOpacity: isTargetBrgy ? 0.58 : 0.15,
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
            `<strong>UP NOAH ${level.toUpperCase()} Flood Zone (${f.properties.depth})</strong><br/>Brgy. ${f.properties.barangay}`,
            { sticky: true },
          );

          fLayer.addTo(layerGroup);
        });
      }

      // 3. Render Sawaga River & Malaybalay Waterways
      if (showRiversLayer) {
        MALAYBALAY_WATERWAYS.forEach((river) => {
          const latLngs = river.coordinates.map(
            ([lng, lat]) => [lat, lng] as [number, number],
          );

          const riverLine = L.polyline(latLngs, {
            color: river.color,
            weight: river.widthPx,
            opacity: 0.95,
          });

          riverLine.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSelectedEntity({
              kind: "waterway",
              waterway: river,
            });
          });

          riverLine.bindTooltip(
            `<strong>${river.name}</strong> · Stage ${currentHydroSnapshot.sawagaWaterLevelM}m`,
            { sticky: true },
          );

          riverLine.addTo(layerGroup);
        });
      }

      // 4. Render Establishments & Barangay Halls
      if (showEstablishmentsLayer) {
        visibleEstablishments.forEach((est) => {
          const [lng, lat] = est.coordinates;
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
            radius: est.category === "Barangay Hall" ? 5.5 : 7.5,
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
            { direction: "top" },
          );

          marker.addTo(layerGroup);
        });
      }

      // 5. Zoom cleanly to active barangay or full Malaybalay City
      map.invalidateSize();
      if (targetBounds && (targetBounds as import("leaflet").LatLngBounds).isValid()) {
        map.fitBounds(targetBounds, {
          padding: [36, 36],
          maxZoom: 14,
          animate: true,
        });
      } else if (fullCityBounds && (fullCityBounds as import("leaflet").LatLngBounds).isValid()) {
        map.fitBounds(fullCityBounds, {
          padding: [20, 20],
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
    currentHydroSnapshot.sawagaWaterLevelM,
    floodStatsFile,
    mapLoading,
  ]);

  const handleDateChange = (nextDate: string) => {
    setSelectedDate(nextDate);
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
    <div className="noah-clean-gis">
      {/* Compact, Clean GIS Toolbar */}
      <div
        className="noah-clean-toolbar"
        role="region"
        aria-label="Hydrological and flood timeline calendar from 2019 to forecast days ahead"
      >
        <div className="noah-clean-toolbar-row">
          <label className="noah-clean-control">
            <span>Barangay Focus</span>
            <select
              aria-label="Select active barangay in Malaybalay GIS"
              value={activeBarangayCode}
              onChange={(e) => {
                const code = e.target.value;
                setActiveBarangayCode(code);
                if (code === "ALL") setSelectedEntity(null);
              }}
            >
              <option value="ALL">All 46 Barangays (Citywide)</option>
              {barangayMicrosites.map((b) => (
                <option key={b.code} value={b.code}>
                  Brgy. {b.name}
                </option>
              ))}
            </select>
          </label>

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
              +3d Forecast
            </button>
          </div>

          <div className="noah-clean-layer-pills">
            <button
              type="button"
              className={showFloodLayer ? "is-active" : ""}
              onClick={() => setShowFloodLayer((v) => !v)}
            >
              <AlertTriangle aria-hidden="true" /> NOAH Flood
            </button>
            {showFloodLayer && (
              <select
                aria-label="Select NOAH flood return period"
                value={noahScenario}
                onChange={(e) =>
                  setNoahScenario(e.target.value as NoahHazardScenario)
                }
                className="noah-clean-mini-select"
              >
                <option value="100yr">100-Yr</option>
                <option value="5yr">5-Yr</option>
              </select>
            )}
            <button
              type="button"
              className={showRiversLayer ? "is-active" : ""}
              onClick={() => setShowRiversLayer((v) => !v)}
            >
              <Waves aria-hidden="true" /> Sawaga & Rivers
            </button>
            <button
              type="button"
              className={showEstablishmentsLayer ? "is-active" : ""}
              onClick={() => setShowEstablishmentsLayer((v) => !v)}
            >
              <Building2 aria-hidden="true" /> Establishments
            </button>
            <button
              type="button"
              className={basemapStyle === "satellite" ? "is-active" : ""}
              onClick={() =>
                setBasemapStyle((s) =>
                  s === "street" ? "satellite" : "street",
                )
              }
            >
              {basemapStyle === "satellite" ? "Satellite" : "Street Map"}
            </button>
            <button
              type="button"
              className={is3DPitch ? "is-active" : ""}
              onClick={() => setIs3DPitch((v) => !v)}
            >
              <Compass aria-hidden="true" /> 3D Tilt
            </button>
            {activeBarangayCode !== "ALL" && (
              <>
                <button
                  type="button"
                  className={blurInactiveBarangays ? "is-active" : ""}
                  onClick={() => setBlurInactiveBarangays((v) => !v)}
                >
                  <Eye aria-hidden="true" /> Blur others
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBarangayCode("ALL");
                    setSelectedEntity(null);
                  }}
                >
                  <LocateFixed aria-hidden="true" /> All 46
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width High-Visibility Interactive Map Canvas */}
      <div
        className={`barangay-map-card noah-clean-map-stage ${
          is3DPitch ? "is-3d-tilted" : ""
        }`}
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

        {mapError && (
          <p role="status" className="noah-map-error">
            The interactive map could not load. Check your connection or use the
            controls above.
          </p>
        )}
      </div>

      {/* Simple, Clean Status & Legend Bar Below Map */}
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
            Flood Depth:
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
            <i
              style={{
                background: "#0284c7",
                height: "4px",
                borderRadius: "2px",
              }}
            />{" "}
            Sawaga & Rivers
          </span>
        </div>

        <div className="noah-clean-telemetry">
          <span>
            <strong>{currentHydroSnapshot.date}:</strong>{" "}
            {currentHydroSnapshot.rainfallMm} mm rain · Sawaga River{" "}
            {currentHydroSnapshot.sawagaDischargeM3s} m³/s (
            {currentHydroSnapshot.sawagaWaterLevelM}m ·{" "}
            <b>{currentHydroSnapshot.alertLevel}</b>)
          </span>
          {activeBarangayProfile && activeBarangayFloodStat && (
            <span>
              · <strong>Brgy. {activeBarangayProfile.name}:</strong>{" "}
              {activeBarangayFloodStat.exposedKm2} km² flood-prone (
              {activeBarangayFloodStat.exposedShare}%)
            </span>
          )}
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
            Inspect Sawaga River <ArrowRight aria-hidden="true" />
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
