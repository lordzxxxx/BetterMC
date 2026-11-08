import { useEffect, useMemo, useRef, useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Clock3,
  Droplets,
  ExternalLink,
  RefreshCw,
  Sun,
  ThermometerSun,
  Wind,
  X,
} from "lucide-react";
import {
  fetchMalaybalayWeather,
  type MalaybalayWeather,
  weatherCondition,
} from "./weather";

type WeatherState =
  | { status: "loading" }
  | { status: "ready"; data: MalaybalayWeather }
  | { status: "error" };

const localDate = (value: string) => new Date(`${value}:00+08:00`);

const formatHour = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    timeZone: "Asia/Manila",
  }).format(localDate(value));

const formatUpdated = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    weekday: "short",
    timeZone: "Asia/Manila",
  }).format(localDate(value));

const formatForecastDay = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    weekday: "short",
    timeZone: "Asia/Manila",
  }).format(localDate(value));

const formatForecastDate = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  }).format(localDate(value));

const formatForecastMoment = (value: string) =>
  new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    timeZone: "Asia/Manila",
  }).format(localDate(value));

function WeatherIcon({ code }: { code: number }) {
  if (code === 0) return <Sun className="weather-icon-sun" aria-hidden="true" />;
  if (code <= 2) return <CloudSun className="weather-icon-sun" aria-hidden="true" />;
  if (code <= 3) return <Cloud className="weather-icon-cloud" aria-hidden="true" />;
  if (code === 45 || code === 48) return <CloudFog className="weather-icon-cloud" aria-hidden="true" />;
  if (code >= 95) return <CloudLightning className="weather-icon-storm" aria-hidden="true" />;
  return <CloudRain className="weather-icon-rain" aria-hidden="true" />;
}

function WeatherSkeleton() {
  return (
    <section className="section container weather-section" aria-label="Loading Malaybalay weather">
      <div className="weather-skeleton" role="status">
        <span className="sr-only">Loading Malaybalay weather forecast</span>
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}

export default function WeatherPanel() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [selectedHourTime, setSelectedHourTime] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const controller = new AbortController();
    fetchMalaybalayWeather(controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (detailsOpen && !dialog.open) dialog.showModal();
    if (!detailsOpen && dialog.open) dialog.close();
  }, [detailsOpen]);

  const summary = useMemo(() => {
    if (state.status !== "ready") return null;
    const temperatures = state.data.hourly.temperature_2m;
    const rain = state.data.hourly.precipitation_probability;
    const peakRain = Math.max(...rain);
    const peakRainIndex = rain.indexOf(peakRain);
    const outlook =
      peakRain >= 70
        ? "Rain is likely during part of the next 24 hours."
        : peakRain >= 40
          ? "Scattered showers are possible during the next 24 hours."
          : "Rain chances remain relatively low during the next 24 hours.";
    return {
      low: Math.round(Math.min(...temperatures)),
      high: Math.round(Math.max(...temperatures)),
      peakRain,
      peakRainTime: formatHour(state.data.hourly.time[peakRainIndex]),
      outlook,
    };
  }, [state]);

  if (state.status === "loading") return <WeatherSkeleton />;

  if (state.status === "error") {
    return (
      <section className="section container weather-section">
        <div className="weather-error" role="alert">
          <CloudSun aria-hidden="true" />
          <div>
            <strong>Weather is temporarily unavailable</strong>
            <p>The rest of BetterMC remains available. Try the forecast again.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
          >
            <RefreshCw aria-hidden="true" /> Retry
          </button>
        </div>
      </section>
    );
  }

  const { current, current_units: units, hourly, hourly_units: hourlyUnits } =
    state.data;
  const hourlySamples = hourly.time
    .map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      humidity: hourly.relative_humidity_2m[index],
      rain: hourly.precipitation_probability[index],
      code: hourly.weather_code[index],
      wind: hourly.wind_speed_10m[index],
    }))
    .filter((_, index) => index % 3 === 0);
  const currentTimestamp = localDate(current.time).getTime();
  const activeHourIndex = hourlySamples.reduce(
    (activeIndex, hour, index) =>
      localDate(hour.time).getTime() <= currentTimestamp ? index : activeIndex,
    0,
  );
  const selectedHour =
    hourlySamples.find((hour) => hour.time === selectedHourTime) ??
    hourlySamples[activeHourIndex];
  const closeDetails = () => {
    setDetailsOpen(false);
    window.requestAnimationFrame(() => {
      triggerRefs.current.get(selectedHour.time)?.focus();
    });
  };

  return (
    <section className="section container weather-section" aria-labelledby="weather-title">
      <div className="weather-card">
        <header className="weather-heading">
          <div>
            <span className="eyebrow">Malaybalay weather</span>
            <h2 id="weather-title">Current conditions and the next 24 hours</h2>
          </div>
          <span className="weather-updated"><Clock3 aria-hidden="true" /> Updated {formatUpdated(current.time)}</span>
        </header>

        <div className="weather-summary">
          <article className="weather-current">
            <span className="weather-current-icon"><WeatherIcon code={current.weather_code} /></span>
            <div className="weather-temperature">
              <strong>{Math.round(current.temperature_2m)}°</strong>
              <span>{units.temperature_2m.replace("°", "")}</span>
            </div>
            <div className="weather-condition">
              <h3>{weatherCondition(current.weather_code)}</h3>
              <p>Feels like {Math.round(current.apparent_temperature)}{units.apparent_temperature}</p>
            </div>
            <dl>
              <div><dt><Droplets aria-hidden="true" /> Humidity</dt><dd>{current.relative_humidity_2m}{units.relative_humidity_2m}</dd></div>
              <div><dt><CloudRain aria-hidden="true" /> Rain</dt><dd>{current.precipitation}{units.precipitation}</dd></div>
              <div><dt><Wind aria-hidden="true" /> Wind</dt><dd>{Math.round(current.wind_speed_10m)} {units.wind_speed_10m}</dd></div>
            </dl>
          </article>

          <aside className="weather-outlook" aria-label="24-hour weather outlook">
            <span>Next 24 hours</span>
            <h3>{summary?.outlook}</h3>
            <p><strong>{summary?.low}–{summary?.high}°C</strong> · Peak rain chance <strong>{summary?.peakRain}%</strong> near <strong>{summary?.peakRainTime}</strong></p>
          </aside>
        </div>

        <div className="weather-forecast-heading">
          <strong>24-hour forecast</strong>
          <span>Open any interval for complete conditions</span>
        </div>

        <div className="weather-hourly" aria-label="Three-hour weather forecast intervals">
          {hourlySamples.map((hour, index) => {
            const isCurrent = index === activeHourIndex;
            const isSelected = hour.time === selectedHour.time;
            return (
              <button
                type="button"
                key={hour.time}
                ref={(element) => {
                  if (element) triggerRefs.current.set(hour.time, element);
                  else triggerRefs.current.delete(hour.time);
                }}
                className={`${isCurrent ? "is-current " : ""}${isSelected && detailsOpen ? "is-selected" : ""}`.trim()}
                aria-current={isCurrent ? "time" : undefined}
                aria-haspopup="dialog"
                aria-label={`${formatHour(hour.time)} forecast: ${weatherCondition(hour.code)}, ${Math.round(hour.temperature)}${hourlyUnits.temperature_2m}, ${hour.rain}${hourlyUnits.precipitation_probability} chance of rain, wind ${Math.round(hour.wind)} ${hourlyUnits.wind_speed_10m}${isCurrent ? ", current hour" : ""}`}
                onClick={() => {
                  setSelectedHourTime(hour.time);
                  setDetailsOpen(true);
                }}
              >
                <span className="weather-hour-day">
                  <strong>{formatForecastDay(hour.time)}</strong>
                  <small>{formatForecastDate(hour.time)}</small>
                </span>
                <span className="weather-hour-time">
                  <time dateTime={hour.time}>{formatHour(hour.time)}</time>
                  {isCurrent && <em className="weather-hour-badge">Now</em>}
                </span>
                <WeatherIcon code={hour.code} />
                <strong>{Math.round(hour.temperature)}{hourlyUnits.temperature_2m}</strong>
                <span className="weather-hour-condition">{weatherCondition(hour.code)}</span>
                <span className="weather-hour-rain"><Droplets aria-hidden="true" /> {hour.rain}{hourlyUnits.precipitation_probability}</span>
                <span className="weather-hour-wind"><Wind aria-hidden="true" /> {Math.round(hour.wind)} {hourlyUnits.wind_speed_10m}</span>
              </button>
            );
          })}
        </div>

        <footer className="weather-source">
          <span>Model-based forecast for Malaybalay City; values may change · Not an official severe-weather warning</span>
          <a href="https://open-meteo.com/en/docs" target="_blank" rel="noreferrer">
            Open-Meteo methodology <ExternalLink aria-hidden="true" />
          </a>
        </footer>
      </div>
      <dialog
        ref={dialogRef}
        className="weather-detail-dialog"
        aria-labelledby="weather-detail-title"
        onCancel={(event) => {
          event.preventDefault();
          closeDetails();
        }}
        onClose={() => setDetailsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetails();
        }}
      >
        <article className="weather-detail-card">
          <header>
            <div>
              <span>Malaybalay forecast</span>
              <h3 id="weather-detail-title">{formatForecastMoment(selectedHour.time)}</h3>
            </div>
            <button type="button" aria-label="Close forecast details" onClick={closeDetails}>
              <X aria-hidden="true" />
            </button>
          </header>
          <div className="weather-detail-condition">
            <span><WeatherIcon code={selectedHour.code} /></span>
            <div>
              <strong>{Math.round(selectedHour.temperature)}{hourlyUnits.temperature_2m}</strong>
              <p>{weatherCondition(selectedHour.code)}</p>
            </div>
          </div>
          <dl>
            <div><dt><ThermometerSun aria-hidden="true" /> Feels like</dt><dd>{Math.round(selectedHour.feelsLike)}{hourlyUnits.apparent_temperature}</dd></div>
            <div><dt><Droplets aria-hidden="true" /> Humidity</dt><dd>{selectedHour.humidity}{hourlyUnits.relative_humidity_2m}</dd></div>
            <div><dt><CloudRain aria-hidden="true" /> Rain chance</dt><dd>{selectedHour.rain}{hourlyUnits.precipitation_probability}</dd></div>
            <div><dt><Wind aria-hidden="true" /> Wind</dt><dd>{Math.round(selectedHour.wind)} {hourlyUnits.wind_speed_10m}</dd></div>
          </dl>
          <p className="weather-detail-note">
            This is a model-based forecast for Malaybalay City and may change as new observations become available.
          </p>
          <button className="weather-detail-done" type="button" onClick={closeDetails}>Done</button>
        </article>
      </dialog>
    </section>
  );
}
