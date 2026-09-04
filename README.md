# Atmos

Atmos is a weather dashboard web app. Search any city (or use your current
location), and Atmos shows live current conditions in a large, photographic
weather card whose background changes with the weather condition and time of
day — inspired by the iOS Weather app. Beyond the dashboard, Atmos includes a
persisted Settings page, a Favourites system, and a Statistics page with
advanced metrics, interactive trend charts, and a two-location comparison
tool.

## Features

### Dashboard

- **City search** with debounce (400ms), loading/empty/error states, full
  keyboard navigation (Arrow Up/Down, Enter, Escape), and an inline star
  button on every result/history row to favourite a location without
  navigating away.
- **Recent searches** — the last 5 selected locations are persisted to
  `localStorage` and shown when the search box is focused and empty.
- **"Use my location"** via the browser Geolocation API.
- **Current weather card**: current temperature, feels-like, condition,
  high/low, wind speed + direction (rotating arrow), humidity, precipitation,
  an accurate client-side "last updated" timestamp with a manual refresh
  button, and a "More details" button that opens the Statistics page for that
  location.
- **Condition- and time-of-day-aware background** — the card's background
  photo is chosen from the weather category (clear/cloudy/rain/snow/
  thunderstorm/fog), day/night, and golden-hour proximity to sunrise/sunset.
- **Sun & Moon card** — sunrise/sunset arc with a live position marker,
  moonrise/moonset, and moon phase with illumination %.
- **Hourly forecast** (3-day tabbed, horizontally scrollable) and **multi-day
  forecast** (7/10/15-day) cards.
- **Multi-day forecast filtering & sorting** — quick filters (All / Rain /
  High Temp / Precipitation / Strong Wind) plus custom min/max range filters
  for temperature, precipitation, and wind, all combined with `Array.filter`;
  a styled dropdown sorts by temperature, wind speed, or precipitation
  (high↔low) via `Array.sort`, entirely client-side.
- **Air quality card** — US or EU AQI (per Settings), PM2.5/PM10/CO/CO₂/dust,
  with a colour-coded meter and legend.
- **Compare Locations** — pick any two locations (from Favourites or search)
  and see a side-by-side table of current temperature (high/low, current,
  feels-like), wind speed, humidity, precipitation, air quality, and cloud
  cover, with the higher value in each pair highlighted.
- **Liquid-glass UI** — the header nav, unit toggle, search bar, and every
  card use a translucent `backdrop-filter: blur()` surface over a subtle,
  theme-tinted background photo, so light/dark mode remains clearly
  distinguishable while the chrome feels frosted rather than flat.

### Settings (persisted)

A dedicated Settings page lets the user choose:

- **Theme** — Light, Dark, or Auto (follows day/night at the *selected
  location*, using the forecast API's `is_day` flag).
- **Units** — temperature (°C/°F), wind speed (km/h / mph / m/s),
  precipitation (mm/in).
- **Air quality scale** — US AQI or EU AQI.
- **Time format** (12h/24h) and **date format** (short / DD-MM-YYYY /
  MM-DD-YYYY).

All settings are stored in `localStorage` (`src/utils/settingsStorage.js`)
via a `SettingsContext` (`src/context/`) and survive a full page reload. A
"Reset to Defaults" button restores the initial values. The Settings page
also shows a live weather preview reflecting the current settings, and a
"Favourites Activity" log (see below).

### Favourites

- Add/remove any location as a favourite (from the Dashboard search, the
  Favourites page's own search, or the header's favourites panel); duplicates
  are prevented by id.
- Favourites persist to `localStorage` (`src/utils/favourites.js`) and store
  enough data (id, name, admin1, country, latitude, longitude) to redisplay
  weather without a new geocoding search.
- The Favourites page shows each favourite as a mini weather card (condition
  background, live temperature, batch-fetched in a single Open-Meteo request
  for all favourites) that's clickable to make it the active Dashboard
  location.
- A **favourites history** log records every add/remove with a relative
  timestamp ("2m ago"), shown on the Settings page with a "Clear" action.

### Statistics page ("Advanced Details")

Reached via the header nav or a weather card's "More details" button:

- **Sectioned metrics** for the active location — Temperature (current,
  feels-like, min/max, average, heat index computed via the NOAA regression
  formula, dew point), Atmosphere & Wind (pressure, cloud cover, visibility,
  humidity, wind speed, and a hand-drawn SVG compass for wind direction), Sun
  & Moon (a sunrise→sunset daylight timeline with a live position marker, UV
  index, max UV, solar "brightness" index, moon phase/rise/set),
  Air Quality (AQI, CO, PM2.5, PM10, dust — each with a meter and category),
  and Precipitation & Storms (precipitation probability, thunderstorm risk
  derived from CAPE, rainfall amount, snow chance, freezing level).
- **Two interactive trend charts** (Temperature; Wind/Precipitation/Humidity
  via a dropdown), each a hand-rolled responsive SVG line chart supporting
  7/10/15-day or hourly (today) views, with a hover tooltip, a "now" guide
  line, and — for temperature — gradient bars showing each day's high/low
  range behind the average-temperature line.
- **Compare Locations** section (see above), also accessible from here in
  earlier iterations; it now lives on the Dashboard.

## Tech stack

- **React 19** + **Vite** (dev server / build tool)
- Plain **CSS** with CSS custom properties for theming (no CSS framework, no
  charting library — the trend charts are hand-drawn inline SVG)
- **lucide-react** for most icons, plus a small hand-drawn inline SVG icon
  set (`src/components/icons.jsx`) for icons lucide doesn't cover
- **Open-Meteo** Geocoding, Forecast, and Air Quality APIs for all data (no
  API key required)
- **ESLint** (flat config, `eslint-plugin-react-hooks`,
  `eslint-plugin-react-refresh`) for linting

No global state library (beyond a small `SettingsContext`) and no router are
used — see [Known limitations](#known-limitations).

## Installation

```bash
git clone <this-repo-url>
cd atmos-weather
npm install
```

## How to run

| Command             | What it does                                            |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`         | Starts the Vite dev server with HMR                       |
| `npm run build`       | Builds the production bundle to `dist/`                    |
| `npm run preview`     | Serves the production build locally                         |
| `npm run lint`        | Runs ESLint over the project                                 |

## API info

Atmos calls three free, key-less Open-Meteo endpoints directly from the
browser:

1. **Geocoding** — `https://geocoding-api.open-meteo.com/v1/search`
   Turns a typed city name into candidate locations (`name`, `country`,
   `admin1`, `latitude`, `longitude`, `id`, …). See `src/api/geocoding.js`.

2. **Forecast** — `https://api.open-meteo.com/v1/forecast`
   A single request per active location fetches `current`, `hourly`, and
   `daily` blocks covering temperature, apparent temperature, humidity, dew
   point, pressure, cloud cover, visibility, precipitation (+ probability),
   wind speed/direction, UV index, shortwave radiation, CAPE, freezing
   level, sunrise/sunset, moonrise/moonset/phase, sunshine/daylight
   duration, and more — always in Celsius/km/h/mm (unit toggles convert the
   already-fetched data client-side; see [State management](#state-management)).
   `timezone=auto` returns times in the location's own local timezone. See
   `src/api/weather.js`.

3. **Air Quality** — `https://air-quality-api.open-meteo.com/v1/air-quality`
   Fetches PM2.5, PM10, CO, CO₂, dust, US AQI, and European AQI for a given
   location. A **batched** variant (`src/api/favouritesWeather.js`) fetches
   condensed weather for *all* favourites in one request using Open-Meteo's
   comma-separated multi-location support, rather than one request per card.

Every service function lives under `src/api/` and is the **only** place in
the codebase that calls `fetch`. Components never call `fetch` directly —
they go through a hook.

## Folder structure

```
src/
├── api/                     # Service layer — the only place `fetch` is called
│   ├── geocoding.js           #   Open-Meteo geocoding search
│   ├── weather.js             #   Open-Meteo forecast (current + hourly + daily)
│   ├── airQuality.js          #   Open-Meteo air quality (single location)
│   └── favouritesWeather.js   #   Batched air/weather fetch for all favourites
├── assets/                   # Background photographs + the ambient page background
├── context/                  # SettingsContext (theme/units/formats, localStorage-backed)
├── components/                # One .jsx + one .css per component
│   ├── icons.jsx                #  Hand-drawn inline SVG icon set
│   ├── Header.jsx                #  Logo, nav, unit/theme toggles, favourites panel
│   ├── SearchBar.jsx             #  Search input, dropdown, keyboard nav, favourite toggle
│   ├── EmptyState.jsx / CloudIllustration.jsx
│   ├── CurrentWeatherCard.jsx    #  The main weather card
│   ├── SunMoonCard.jsx           #  Sunrise/sunset arc + moon phase
│   ├── HourlyWeatherCard.jsx / DailyForecastCard.jsx  # incl. filter/sort controls
│   ├── AirQualityCard.jsx
│   ├── SettingsPage.jsx          #  Persisted preferences + live preview + favourites log
│   ├── FavouritesPage.jsx        #  Favourite location grid + add/remove/search
│   ├── StatisticsPage.jsx        #  "Advanced Details" sectioned metrics
│   ├── TrendChartCard.jsx        #  Hand-rolled interactive SVG line/bar chart
│   ├── CompareLocationsSection.jsx # Two-location comparison table
│   └── ErrorBoundary.jsx         #  Class component catching render-time errors
├── hooks/                    # Custom hooks (see below)
├── utils/                    # Pure utility functions (no React/DOM dependency)
│   ├── errors.js / validation.js
│   ├── weatherCodes.js / weatherBackground.js / weatherFormat.js
│   ├── temperature.js / windSpeed.js / precipitation.js
│   ├── airQuality.js / statistics.js / forecastChart.js
│   ├── sunPosition.js / moonPhase.js
│   ├── dailyForecast.js / hourlyForecast.js
│   ├── searchHistory.js / favourites.js / favouritesHistory.js
│   └── settingsStorage.js
├── App.jsx                  # Top-level state owner / composition root
├── App.css
├── index.css                 # Design tokens (colors, fonts), resets, `.sr-only`
└── main.jsx                   # Entry point; wraps <App> in <SettingsProvider> + <ErrorBoundary>
```

## Architecture

```
main.jsx
  └─ SettingsProvider (localStorage-backed theme/units/formats)
      └─ ErrorBoundary
          └─ App.jsx (owns location/search/favourites state; switches views)
               ├─ Header
               ├─ Dashboard view: SearchBar, CurrentWeatherCard, SunMoonCard,
               │    HourlyWeatherCard, AirQualityCard, DailyForecastCard,
               │    CompareLocationsSection
               ├─ FavouritesPage
               ├─ SettingsPage
               └─ StatisticsPage (StatisticsCard sections, TrendChartCard × 2)

                  any of the above ──uses──> hooks/*  ──calls──> api/*  ──calls──> fetch()
                                                 │
                                       derives display values via utils/*
```

- **`api/`** is the *service layer*: it owns every `fetch` call and turns
  transport/HTTP failures into a typed `ApiError` (`utils/errors.js`) with a
  `type` (`network` | `http` | `parse` | `validation`).
- **`hooks/`** own async lifecycle + component-facing state (`status`,
  `data`, `error`, …) and translate an `ApiError` into a human-readable
  message via `getErrorMessage()`.
- **`utils/`** are plain, framework-free functions — unit-testable in
  isolation because they don't touch React or the DOM.
- **`components/`** are presentation + local UI state only. They receive
  data and callbacks via props from `App.jsx` and never fetch directly
  (each page-level component may own its own hook calls for data it alone
  needs, e.g. `CompareLocationsSection` fetching its two comparison
  locations).
- **`context/SettingsContext`** is the one piece of state that isn't plain
  prop-drilling from `App.jsx`, since it needs to be read from multiple
  independent subtrees (`Header`, every page) and written from `Settings`.

## State management

Beyond `SettingsContext`, there is no external state library — everything
else is plain React `useState`, lifted to `App.jsx` as the composition root:

- `currentView` — which top-level page is shown (Dashboard / Favourites /
  Statistics / Settings); a lightweight state switch rather than a router.
- `activeLocation` — the currently selected location; drives the Dashboard
  cards and (when navigated to) the Statistics page.
- `searchHistory`, `favourites`, `favouritesHistory` — each initialized
  lazily from `localStorage` and updated immutably (utilities always return
  a **new** array, never mutate the stored one).
- `geoLoading` / `geoError` — local UI state for the "use my location" flow.
- Weather/air-quality fetch state (`data`, `status`, `error`, …) lives inside
  the relevant hook, not in `App.jsx`.

`useMemo`/`useCallback` are used sparingly (e.g. `SettingsContext`'s
updaters) — most derived values (formatting, chart point-building, unit
conversion) are cheap enough to recompute on every render.

## Custom hooks

- **`useCurrentWeather(latitude, longitude)`** — validates coordinates,
  fetches current + hourly + daily weather, exposes
  `{ data, status, error, lastUpdated, refresh }`. Unit toggles never
  trigger a refetch — the already-fetched Celsius/km-h/mm values are
  converted client-side.
- **`useAirQuality(latitude, longitude)`** — same lifecycle shape, for the
  air-quality endpoint.
- **`useFavouritesWeather(favourites)`** — one batched request for
  condensed weather across every favourite (see API info above).
- **`useDebouncedValue(value, delay)`** — generic debounce hook used by
  `SearchBar`.
- **`useSettings()`** — reads/writes the `SettingsContext`.

## Known limitations

- **No routing / URL query parameters.** Views are switched via component
  state, not real routes — reloading always lands on the Dashboard, and a
  location/view can't be shared via URL. This was intentionally deferred
  (see `Requirements.md`) rather than built speculatively.
- **No automated tests** (unit or e2e) exist yet; verification during
  development was `npm run lint` + `npm run build` after every change, plus
  manual/visual review from screenshots (see `AI_USAGE.md`).
- **No offline support / response caching** beyond the browser's own HTTP
  cache; a flaky connection shows the error state rather than stale data.
- **Large background images** (1.5–3.9 MB JPGs) are not compressed or
  responsively served, affecting initial load time for condition
  backgrounds.
- Geolocation requires a secure context (HTTPS or `localhost`); it fails
  silently into the existing error state on plain HTTP.
- **Snow chance and thunderstorm risk are heuristics**, not native
  Open-Meteo fields — derived from `snowfall_sum`/`precipitation_probability_max`
  and CAPE respectively, since Open-Meteo doesn't expose those as direct
  percentages.

## AI tools used

Claude (Claude Code) was used throughout this project's development. See
[`AI_USAGE.md`](./AI_USAGE.md) for the detailed breakdown of prompts, what
was AI-generated vs. modified, bugs introduced and fixed, and how the
AI-written code was verified.
