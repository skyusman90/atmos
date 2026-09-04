import {
  Gauge,
  Cloud,
  CloudSnow,
  CloudFog,
  Eye,
  Droplets,
  Thermometer,
  Sparkles,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudLightning,
  Activity,
  ArrowUp,
  ArrowDown,
  Wind,
} from 'lucide-react';
import { ParticlesIcon, MoleculeIcon, WindIcon, MapPinIcon, ClockIcon } from './icons.jsx';
import TrendChartCard from './TrendChartCard.jsx';
import { useSettings } from '../hooks/useSettings.js';
import { convertTemperature } from '../utils/temperature.js';
import { convertWindSpeed, getWindSpeedLabel } from '../utils/windSpeed.js';
import { convertPrecipitation, getPrecipitationLabel } from '../utils/precipitation.js';
import { formatUpdatedTime, formatLocationDateTime, degreesToCompassLong } from '../utils/weatherFormat.js';
import { getWeatherInfo } from '../utils/weatherCodes.js';
import { getMoonPhase } from '../utils/moonPhase.js';
import { getSunProgress } from '../utils/sunPosition.js';
import { getAqiCategory, getAqiMeterPercent, getAqiScaleLabel } from '../utils/airQuality.js';
import {
  findClosestHourIndex,
  getPressureCategory,
  getVisibilityCategory,
  getUvCategory,
  getBrightnessCategory,
  getThunderstormRisk,
  getDustCategory,
  formatDurationHours,
  computeHeatIndex,
  getWindCategory,
  getPm25Category,
  getPm10Category,
  getCoCategory,
  getFreezingLevelCategory,
} from '../utils/statistics.js';
import './StatisticsPage.css';

const TEMPERATURE_TREND_METRICS = [
  { value: 'temperature', label: 'Temperature', color: 'var(--primary)', unit: (s) => `°${s.unit}` },
];

const CONDITIONS_TREND_METRICS = [
  { value: 'wind', label: 'Wind Speed', color: 'var(--secondary)', unit: (s) => getWindSpeedLabel(s.windSpeedUnit) },
  { value: 'precipitation', label: 'Precipitation', color: 'var(--accent)', unit: (s) => getPrecipitationLabel(s.precipitationUnit) },
  { value: 'humidity', label: 'Humidity', color: '#6EC6FF', unit: () => '%' },
];

function renderConditionIcon(category, isDay) {
  const iconProps = { size: '1em', strokeWidth: 1.8 };
  switch (category) {
    case 'clear':
      return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
    case 'cloudy':
      return <Cloud {...iconProps} />;
    case 'rain':
      return <CloudRain {...iconProps} />;
    case 'snow':
      return <CloudSnow {...iconProps} />;
    case 'thunderstorm':
      return <CloudLightning {...iconProps} />;
    case 'fog':
      return <CloudFog {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
}

function StatSection({ icon, title, children }) {
  return (
    <div className="stat-section">
      <h3 className="stat-section__header">
        <span className="stat-section__header-icon">{icon}</span>
        {title}
      </h3>
      <div className="stat-section__grid">{children}</div>
    </div>
  );
}

function StatTile({ icon, label, value, unit, category, meterPercent, meterColor, wide, children }) {
  return (
    <div className={`stat-tile ${wide ? 'stat-tile--wide' : ''}`}>
      <div className="stat-tile__top">
        <span className="stat-tile__icon">{icon}</span>
        <span className="stat-tile__label">{label}</span>
      </div>

      {children ? (
        children
      ) : (
        <>
          <div className="stat-tile__value-row">
            <span className="stat-tile__value">{value}</span>
            {unit && <span className="stat-tile__unit">{unit}</span>}
          </div>
          {category && <span className="stat-tile__category">{category}</span>}
        </>
      )}

      {meterPercent != null && (
        <div className="stat-tile__meter">
          <span
            className="stat-tile__meter-fill"
            style={{ width: `${Math.min(100, Math.max(0, meterPercent))}%`, backgroundColor: meterColor }}
          />
        </div>
      )}
    </div>
  );
}

function WindCompass({ degrees, compass }) {
  return (
    <div className="wind-compass">
      <svg viewBox="0 0 100 100" className="wind-compass__svg" aria-hidden="true">
        <circle cx="50" cy="50" r="46" className="wind-compass__ring-outer" />
        <circle cx="50" cy="50" r="38" className="wind-compass__ring" />

        <line x1="50" y1="8" x2="50" y2="16" className="wind-compass__tick-mark wind-compass__tick-mark--major" />
        <line x1="92" y1="50" x2="84" y2="50" className="wind-compass__tick-mark wind-compass__tick-mark--major" />
        <line x1="50" y1="92" x2="50" y2="84" className="wind-compass__tick-mark wind-compass__tick-mark--major" />
        <line x1="8" y1="50" x2="16" y2="50" className="wind-compass__tick-mark wind-compass__tick-mark--major" />

        <line x1="73.6" y1="18.6" x2="69.1" y2="24.6" className="wind-compass__tick-mark" />
        <line x1="81.4" y1="26.4" x2="75.4" y2="30.9" className="wind-compass__tick-mark" />
        <line x1="81.4" y1="73.6" x2="75.4" y2="69.1" className="wind-compass__tick-mark" />
        <line x1="73.6" y1="81.4" x2="69.1" y2="75.4" className="wind-compass__tick-mark" />
        <line x1="26.4" y1="81.4" x2="30.9" y2="75.4" className="wind-compass__tick-mark" />
        <line x1="18.6" y1="73.6" x2="24.6" y2="69.1" className="wind-compass__tick-mark" />
        <line x1="18.6" y1="26.4" x2="24.6" y2="30.9" className="wind-compass__tick-mark" />
        <line x1="26.4" y1="18.6" x2="30.9" y2="24.6" className="wind-compass__tick-mark" />

        <text x="50" y="26" className="wind-compass__label" textAnchor="middle">N</text>
        <text x="74" y="54" className="wind-compass__label" textAnchor="middle">E</text>
        <text x="50" y="79" className="wind-compass__label" textAnchor="middle">S</text>
        <text x="26" y="54" className="wind-compass__label" textAnchor="middle">W</text>

        <g style={{ transform: `rotate(${degrees}deg)`, transformOrigin: '50px 50px' }} className="wind-compass__needle-group">
          <path d="M50,22 L57,52 L50,46 L43,52 Z" className="wind-compass__needle-head" />
          <path d="M50,78 L54,58 L50,63 L46,58 Z" className="wind-compass__needle-tail" />
        </g>
        <circle cx="50" cy="50" r="5" className="wind-compass__hub" />
      </svg>

      <div className="wind-compass__readout">
        <span className="stat-tile__value">{compass}</span>
        <span className="stat-tile__unit">{Math.round(degrees)}°</span>
      </div>
    </div>
  );
}

function SunMoonTimeline({ sunrise, sunset, currentTime, daylightDuration, sunshineDuration, timeFormat }) {
  const progress = getSunProgress(currentTime, sunrise, sunset) * 100;
  const markerPosition = Math.min(97, Math.max(3, progress));

  return (
    <div className="sun-timeline">
      <div className="sun-timeline__row">
        <span className="sun-timeline__end">
          <Sunrise size="1.1em" />
          <span>{sunrise ? formatUpdatedTime(sunrise, timeFormat) : '—'}</span>
        </span>
        <span className="sun-timeline__end sun-timeline__end--right">
          <span>{sunset ? formatUpdatedTime(sunset, timeFormat) : '—'}</span>
          <Sunset size="1.1em" />
        </span>
      </div>

      <div className="sun-timeline__track">
        <span className="sun-timeline__fill" />
        <span className="sun-timeline__marker" style={{ left: `${markerPosition}%` }}>
          <Sun size="0.9em" />
        </span>
      </div>

      <div className="sun-timeline__stats">
        <span>
          <strong>{daylightDuration ?? '—'}</strong> daylight
        </span>
        <span>
          <strong>{sunshineDuration ?? '—'}</strong> sunshine
        </span>
      </div>
    </div>
  );
}

function StatisticsCard({ location, weather, airQuality, settings }) {
  const { current, hourly, daily } = weather;
  const unit = settings.temperatureUnit;
  const isImperial = settings.precipitationUnit === 'in';

  const hourIndex = findClosestHourIndex(hourly?.time, current.time);
  const visibility = hourly?.visibility?.[hourIndex];
  const precipProbability = hourly?.precipitation_probability?.[hourIndex];
  const uvIndex = hourly?.uv_index?.[hourIndex];
  const cape = hourly?.cape?.[hourIndex];
  const radiation = hourly?.shortwave_radiation?.[hourIndex];

  const pressure = current.pressure_msl;
  const cloudCover = current.cloud_cover;
  const humidity = current.relative_humidity_2m;
  const freezingLevel = hourly?.freezing_level_height?.[hourIndex];

  const currentTemp = convertTemperature(current.temperature_2m, unit);
  const feelsLike = convertTemperature(current.apparent_temperature, unit);
  const dewPoint = convertTemperature(current.dew_point_2m, unit);
  const heatIndexC = computeHeatIndex(current.temperature_2m, current.relative_humidity_2m);
  const heatIndex = heatIndexC != null ? convertTemperature(heatIndexC, unit) : null;
  const maxUv = daily?.uv_index_max?.[0];
  const maxTemp = daily?.temperature_2m_max?.[0] != null ? convertTemperature(daily.temperature_2m_max[0], unit) : null;
  const minTemp = daily?.temperature_2m_min?.[0] != null ? convertTemperature(daily.temperature_2m_min[0], unit) : null;
  const avgTemp = maxTemp != null && minTemp != null ? (maxTemp + minTemp) / 2 : null;

  const windSpeedKmh = current.wind_speed_10m;
  const windSpeed = convertWindSpeed(windSpeedKmh, settings.windSpeedUnit);
  const windCompass = degreesToCompassLong(current.wind_direction_10m);

  const sunshineDuration = formatDurationHours(daily?.sunshine_duration?.[0]);
  const daylightDuration = formatDurationHours(daily?.daylight_duration?.[0]);

  const moonrise = daily?.moonrise?.[0];
  const moonset = daily?.moonset?.[0];
  const moon = getMoonPhase(daily?.moon_phase?.[0] ?? 0);

  const aqiValue = settings.aqiScale === 'eu' ? airQuality?.current?.european_aqi : airQuality?.current?.us_aqi;
  const aqiCategory = aqiValue != null ? getAqiCategory(aqiValue, settings.aqiScale) : null;
  const dust = airQuality?.current?.dust;
  const pm25 = airQuality?.current?.pm2_5;
  const pm10 = airQuality?.current?.pm10;
  const co = airQuality?.current?.carbon_monoxide;

  const visibilityDisplay =
    visibility != null ? (isImperial ? (visibility / 1609.34).toFixed(1) : (visibility / 1000).toFixed(1)) : '—';

  const rainfallAmount =
    daily?.precipitation_sum?.[0] != null ? convertPrecipitation(daily.precipitation_sum[0], settings.precipitationUnit) : null;

  const snowfallToday = daily?.snowfall_sum?.[0];
  const precipProbabilityMax = daily?.precipitation_probability_max?.[0];
  const snowChance = snowfallToday != null && snowfallToday > 0.1 ? precipProbabilityMax ?? 0 : 0;

  const freezingLevelDisplay =
    freezingLevel != null ? (isImperial ? (freezingLevel / 1609.34).toFixed(1) : (freezingLevel / 1000).toFixed(1)) : '—';

  const { category: conditionCategory } = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;

  return (
    <article className="statistics-card" aria-label={`Advanced statistics for ${location.name}`}>
      <div className="statistics-card__header">
        <div className="statistics-card__header-left">
          <span className="statistics-card__header-icon">{renderConditionIcon(conditionCategory, isDay)}</span>
          <div className="statistics-card__header-info">
            <h2 className="statistics-card__title">{location.name}</h2>
            <span className="statistics-card__subtitle">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div className="statistics-card__header-right">
          <span className="statistics-card__header-detail">
            <MapPinIcon />
            {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </span>
          <span className="statistics-card__header-detail">
            <ClockIcon />
            {formatLocationDateTime(current.time, settings.timeFormat, settings.dateFormat)}
          </span>
        </div>
      </div>

      <StatSection icon={<Thermometer />} title="Temperature">
        <StatTile icon={<Thermometer />} label="Current" value={currentTemp != null ? Math.round(currentTemp) : '—'} unit={`°${unit}`} />
        <StatTile icon={<Activity />} label="Feels Like" value={feelsLike != null ? Math.round(feelsLike) : '—'} unit={`°${unit}`} />
        <StatTile icon={<ArrowDown />} label="Min (2m)" value={minTemp != null ? Math.round(minTemp) : '—'} unit={`°${unit}`} />
        <StatTile icon={<ArrowUp />} label="Max (2m)" value={maxTemp != null ? Math.round(maxTemp) : '—'} unit={`°${unit}`} />
        <StatTile
          icon={<Activity />}
          label="Average"
          value={avgTemp != null ? Math.round(avgTemp) : '—'}
          unit={`°${unit}`}
          category="Today's max & min midpoint"
        />
        <StatTile icon={<Sun />} label="Heat Index" value={heatIndex != null ? Math.round(heatIndex) : '—'} unit={`°${unit}`} />
        <StatTile icon={<Droplets />} label="Dew Point" value={dewPoint != null ? Math.round(dewPoint) : '—'} unit={`°${unit}`} />
      </StatSection>

      <StatSection icon={<Gauge />} title="Atmosphere and Wind">
        <StatTile
          icon={<Gauge />}
          label="Pressure"
          value={pressure != null ? Math.round(pressure) : '—'}
          unit="hPa"
          category={getPressureCategory(pressure)}
          meterPercent={pressure != null ? ((pressure - 970) / (1050 - 970)) * 100 : null}
          meterColor="var(--secondary)"
        />
        <StatTile
          icon={<Cloud />}
          label="Cloud Cover"
          value={cloudCover != null ? Math.round(cloudCover) : '—'}
          unit="%"
          meterPercent={cloudCover}
          meterColor="var(--secondary)"
        />
        <StatTile
          icon={<Eye />}
          label="Visibility"
          value={visibilityDisplay}
          unit={isImperial ? 'mi' : 'km'}
          category={getVisibilityCategory(visibility)}
          meterPercent={visibility != null ? (visibility / 15000) * 100 : null}
          meterColor="var(--secondary)"
        />
        <StatTile
          icon={<Droplets />}
          label="Humidity"
          value={humidity != null ? Math.round(humidity) : '—'}
          unit="%"
          meterPercent={humidity}
          meterColor="var(--secondary)"
        />
        <StatTile
          icon={<WindIcon />}
          label="Wind Speed"
          value={windSpeed != null ? Math.round(windSpeed) : '—'}
          unit={getWindSpeedLabel(settings.windSpeedUnit)}
          category={getWindCategory(windSpeedKmh)}
        />
        <div className="stat-tile stat-tile--wide">
          <div className="stat-tile__top">
            <span className="stat-tile__icon">
              <Wind size="1em" />
            </span>
            <span className="stat-tile__label">Wind Direction</span>
          </div>
          <WindCompass degrees={current.wind_direction_10m} compass={windCompass} />
        </div>
      </StatSection>

      <div className="statistics-page__trend-row">
        <TrendChartCard
          icon={<Thermometer />}
          title="Temperature Trends"
          metrics={TEMPERATURE_TREND_METRICS}
          weather={weather}
          settings={{
            unit: settings.temperatureUnit,
            windSpeedUnit: settings.windSpeedUnit,
            precipitationUnit: settings.precipitationUnit,
            timeFormat: settings.timeFormat,
          }}
        />
        <TrendChartCard
          icon={<WindIcon />}
          title="Conditions Trends"
          metrics={CONDITIONS_TREND_METRICS}
          weather={weather}
          settings={{
            unit: settings.temperatureUnit,
            windSpeedUnit: settings.windSpeedUnit,
            precipitationUnit: settings.precipitationUnit,
            timeFormat: settings.timeFormat,
          }}
        />
      </div>

      <StatSection icon={<Sun />} title="Sun and Moon">
        <div className="stat-tile stat-tile--wide stat-tile--centered">
          <div className="stat-tile__top">
            <span className="stat-tile__icon">
              <Sun size="1em" />
            </span>
            <span className="stat-tile__label">Daylight Timeline</span>
          </div>
          <SunMoonTimeline
            sunrise={daily?.sunrise?.[0]}
            sunset={daily?.sunset?.[0]}
            currentTime={current.time}
            daylightDuration={daylightDuration}
            sunshineDuration={sunshineDuration}
            timeFormat={settings.timeFormat}
          />
        </div>

        <StatTile
          icon={<Sparkles />}
          label="UV Index"
          value={uvIndex != null ? uvIndex.toFixed(1) : '—'}
          category={getUvCategory(uvIndex)}
          meterPercent={uvIndex != null ? (uvIndex / 11) * 100 : null}
          meterColor="var(--accent)"
        />
        <StatTile
          icon={<Sparkles />}
          label="Max UV Index"
          value={maxUv != null ? maxUv.toFixed(1) : '—'}
          category={getUvCategory(maxUv)}
          meterPercent={maxUv != null ? (maxUv / 11) * 100 : null}
          meterColor="var(--accent)"
        />
        <StatTile
          icon={<Sun />}
          label="Brightness Index"
          value={radiation != null ? Math.round(radiation) : '—'}
          unit="W/m²"
          category={getBrightnessCategory(radiation)}
          meterPercent={radiation != null ? (radiation / 800) * 100 : null}
          meterColor="var(--accent)"
        />

        <div className="stat-tile stat-tile--wide">
          <div className="stat-tile__top">
            <span className="stat-tile__icon">
              <Moon size="1em" />
            </span>
            <span className="stat-tile__label">Moon</span>
          </div>
          <div className="stat-tile__value-row">
            <span className="stat-tile__value">{moon.name}</span>
          </div>
          <span className="stat-tile__category">{moon.illumination}% illuminated</span>
          <div className="stat-tile__split">
            <div className="stat-tile__split-col">
              <span className="stat-tile__split-label">Rise</span>
              <span className="stat-tile__split-value">{moonrise ? formatUpdatedTime(moonrise, settings.timeFormat) : '—'}</span>
            </div>
            <div className="stat-tile__split-col">
              <span className="stat-tile__split-label">Set</span>
              <span className="stat-tile__split-value">{moonset ? formatUpdatedTime(moonset, settings.timeFormat) : '—'}</span>
            </div>
          </div>
        </div>
      </StatSection>

      <StatSection icon={<ParticlesIcon />} title="Air Quality">
        <StatTile
          icon={<ParticlesIcon />}
          label="AQI"
          value={aqiValue ?? '—'}
          unit={getAqiScaleLabel(settings.aqiScale)}
          category={aqiCategory?.label}
          meterPercent={aqiValue != null ? getAqiMeterPercent(aqiValue, settings.aqiScale) : null}
          meterColor={aqiCategory?.color}
        />
        <StatTile
          icon={<MoleculeIcon />}
          label="Carbon Monoxide"
          value={co != null ? Math.round(co) : '—'}
          unit="µg/m³"
          category={getCoCategory(co)}
          meterPercent={co != null ? (co / 15400) * 100 : null}
          meterColor="var(--primary)"
        />
        <StatTile
          icon={<ParticlesIcon />}
          label="PM2.5"
          value={pm25 != null ? Math.round(pm25) : '—'}
          unit="µg/m³"
          category={getPm25Category(pm25)}
          meterPercent={pm25 != null ? (pm25 / 150) * 100 : null}
          meterColor="var(--primary)"
        />
        <StatTile
          icon={<ParticlesIcon />}
          label="PM10"
          value={pm10 != null ? Math.round(pm10) : '—'}
          unit="µg/m³"
          category={getPm10Category(pm10)}
          meterPercent={pm10 != null ? (pm10 / 300) * 100 : null}
          meterColor="var(--primary)"
        />
        <StatTile
          icon={<WindIcon />}
          label="Dust Index"
          value={dust != null ? Math.round(dust) : '—'}
          unit="µg/m³"
          category={getDustCategory(dust)}
          meterPercent={dust != null ? (dust / 300) * 100 : null}
          meterColor="var(--primary)"
        />
      </StatSection>

      <StatSection icon={<CloudLightning />} title="Precipitation and Storms">
        <StatTile
          icon={<CloudRain />}
          label="Precip. Probability"
          value={precipProbability != null ? Math.round(precipProbability) : '—'}
          unit="%"
          meterPercent={precipProbability}
          meterColor="var(--secondary)"
        />
        <StatTile
          icon={<CloudLightning />}
          label="Thunderstorm Risk"
          value={getThunderstormRisk(cape) ?? '—'}
          category={cape != null ? `CAPE ${Math.round(cape)} J/kg` : null}
          meterPercent={cape != null ? (cape / 3000) * 100 : null}
          meterColor="var(--primary)"
        />
        <StatTile
          icon={<CloudRain />}
          label="Rainfall Amount"
          value={rainfallAmount != null ? rainfallAmount.toFixed(1) : '—'}
          unit={getPrecipitationLabel(settings.precipitationUnit)}
          category="Expected today"
        />
        <StatTile
          icon={<Cloud />}
          label="Snow Chance"
          value={Math.round(snowChance)}
          unit="%"
          category={snowChance > 0 ? 'Snowfall expected' : 'None expected'}
          meterPercent={snowChance}
          meterColor="var(--secondary)"
        />
        <StatTile
          icon={<Thermometer />}
          label="Freezing Level"
          value={freezingLevelDisplay}
          unit={isImperial ? 'mi' : 'km'}
          category={getFreezingLevelCategory(freezingLevel)}
        />
      </StatSection>
    </article>
  );
}

function StatisticsPage({ location, weather, weatherStatus, airQuality }) {
  const { settings } = useSettings();

  return (
    <section className="statistics-page" aria-label="Statistics">
      {!location ? (
        <div className="statistics-page__empty">
          <p className="statistics-page__empty-text">Select a location on the Dashboard to see advanced statistics.</p>
        </div>
      ) : weatherStatus !== 'success' || !weather ? (
        <div className="statistics-page__empty">
          <p className="statistics-page__empty-text">
            {weatherStatus === 'error' ? 'Unable to load statistics.' : 'Loading statistics…'}
          </p>
        </div>
      ) : (
        <StatisticsCard location={location} weather={weather} airQuality={airQuality} settings={settings} />
      )}
    </section>
  );
}

export default StatisticsPage;
