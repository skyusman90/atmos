import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { useSettings } from '../hooks/useSettings.js';
import { getWeatherInfo } from '../utils/weatherCodes.js';
import { convertTemperature } from '../utils/temperature.js';
import { convertWindSpeed, getWindSpeedLabel } from '../utils/windSpeed.js';
import { convertPrecipitation, getPrecipitationLabel } from '../utils/precipitation.js';
import { formatLocationDateTime } from '../utils/weatherFormat.js';
import { getAqiCategory, getAqiScaleLabel } from '../utils/airQuality.js';
import { formatRelativeTime } from '../utils/favouritesHistory.js';
import { SunIcon, WindIcon, ParticlesIcon, ClockIcon, DropletIcon, CloudIcon, SettingsIcon, StarIcon } from './icons.jsx';
import './SettingsPage.css';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

const TEMPERATURE_OPTIONS = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
];

const WIND_SPEED_OPTIONS = [
  { value: 'kmh', label: 'km/h' },
  { value: 'mph', label: 'mph' },
  { value: 'ms', label: 'm/s' },
];

const PRECIPITATION_OPTIONS = [
  { value: 'mm', label: 'mm' },
  { value: 'in', label: 'in' },
];

const AQI_SCALE_OPTIONS = [
  { value: 'us', label: 'US AQI' },
  { value: 'eu', label: 'EU AQI' },
];

const TIME_FORMAT_OPTIONS = [
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'short', label: 'Sep 4' },
  { value: 'dmy', label: 'DD/MM/YYYY' },
  { value: 'mdy', label: 'MM/DD/YYYY' },
];

function renderConditionIcon(category, isDay) {
  const iconProps = { size: '1em', strokeWidth: 1.7 };
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

function SettingsPillGroup({ options, value, onChange, label }) {
  return (
    <div className="settings-page__pill-group" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={`settings-page__pill ${option.value === value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SettingsRow({ label, hint, children }) {
  return (
    <div className="settings-page__row">
      <div className="settings-page__row-info">
        <span className="settings-page__row-label">{label}</span>
        {hint && <span className="settings-page__row-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SettingsSection({ icon, title, children, className = '' }) {
  return (
    <div className={`settings-page__section ${className}`.trim()}>
      <h2 className="settings-page__section-title">
        <span className="settings-page__section-icon">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function LiveWeatherPreview({ location, weather, status, airQuality, settings }) {
  const ready = status === 'success' && weather && location;

  return (
    <div className="settings-page__preview">
      <h2 className="settings-page__section-title">
        <span className="settings-page__section-icon">
          <CloudIcon />
        </span>
        Live Weather Preview
      </h2>

      {!ready ? (
        <p className="settings-page__preview-empty">
          Select a location on the Dashboard to preview your settings with live weather data.
        </p>
      ) : (
        <PreviewContent location={location} weather={weather} airQuality={airQuality} settings={settings} />
      )}
    </div>
  );
}

function PreviewContent({ location, weather, airQuality, settings }) {
  const { current } = weather;
  const { label, category } = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;

  const temperature = convertTemperature(current.temperature_2m, settings.temperatureUnit);
  const windSpeed = convertWindSpeed(current.wind_speed_10m, settings.windSpeedUnit);
  const precipitation = convertPrecipitation(current.precipitation, settings.precipitationUnit);

  const aqiValue = settings.aqiScale === 'eu'
    ? airQuality?.current?.european_aqi
    : airQuality?.current?.us_aqi;
  const aqi = aqiValue != null ? getAqiCategory(aqiValue, settings.aqiScale) : null;

  return (
    <div className="settings-page__preview-body">
      <div className="settings-page__preview-top">
        <span className="settings-page__preview-icon">{renderConditionIcon(category, isDay)}</span>
        <div>
          <p className="settings-page__preview-temp">{Math.round(temperature)}°{settings.temperatureUnit}</p>
          <p className="settings-page__preview-condition">
            {label} &middot; {location.name}
          </p>
        </div>
      </div>

      <div className="settings-page__preview-stats">
        <div className="settings-page__preview-stat">
          <WindIcon />
          {Math.round(windSpeed)} {getWindSpeedLabel(settings.windSpeedUnit)}
        </div>
        <div className="settings-page__preview-stat">
          <DropletIcon />
          {precipitation.toFixed(settings.precipitationUnit === 'in' ? 2 : 1)} {getPrecipitationLabel(settings.precipitationUnit)}
        </div>
        <div className="settings-page__preview-stat">
          <ParticlesIcon />
          {getAqiScaleLabel(settings.aqiScale)} &middot; {aqi ? aqi.label : '—'}
        </div>
        <div className="settings-page__preview-stat">
          <ClockIcon />
          {formatLocationDateTime(current.time, settings.timeFormat, settings.dateFormat)}
        </div>
      </div>
    </div>
  );
}

function FavouritesHistory({ entries, onClear }) {
  return (
    <div className="settings-page__favourites-history">
      <div className="settings-page__favourites-history-top">
        <h2 className="settings-page__section-title">
          <span className="settings-page__section-icon">
            <StarIcon />
          </span>
          Favourites Activity
        </h2>

        {entries.length > 0 && (
          <button type="button" className="settings-page__favourites-history-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="settings-page__preview-empty">Add or remove a favourite location to see activity here.</p>
      ) : (
        <ul className="settings-page__favourites-history-list">
          {entries.map((entry, index) => (
            <li key={`${entry.id}-${entry.timestamp}-${index}`} className="settings-page__favourites-history-item">
              <span
                className={`settings-page__favourites-history-badge settings-page__favourites-history-badge--${entry.action}`}
              >
                {entry.action === 'added' ? 'Added' : 'Removed'}
              </span>
              <span className="settings-page__favourites-history-name">{entry.name}</span>
              <span className="settings-page__favourites-history-time">{formatRelativeTime(entry.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SettingsPage({
  location,
  weather,
  weatherStatus,
  airQuality,
  favouritesHistory = [],
  onClearFavouritesHistory,
}) {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <section className="settings-page" aria-label="Settings">
      <div className="settings-page__heading">
        <span className="settings-page__heading-icon">
          <SettingsIcon />
        </span>
        <h1 className="settings-page__title">Settings</h1>

        <button type="button" className="settings-page__reset-btn" onClick={resetSettings}>
          Reset to Defaults
        </button>
      </div>

      <div className="settings-page__top-row">
        <div className="settings-page__grid">
        <div className="settings-page__column">
          <SettingsSection icon={<SunIcon />} title="Appearance">
            <SettingsRow label="Theme" hint="&ldquo;Auto&rdquo; follows day/night at your selected location.">
              <SettingsPillGroup
                label="Theme"
                options={THEME_OPTIONS}
                value={settings.theme}
                onChange={(value) => updateSetting('theme', value)}
              />
            </SettingsRow>
          </SettingsSection>

          <SettingsSection icon={<WindIcon />} title="Units">
            <SettingsRow label="Temperature">
              <SettingsPillGroup
                label="Temperature unit"
                options={TEMPERATURE_OPTIONS}
                value={settings.temperatureUnit}
                onChange={(value) => updateSetting('temperatureUnit', value)}
              />
            </SettingsRow>

            <SettingsRow label="Wind Speed">
              <SettingsPillGroup
                label="Wind speed unit"
                options={WIND_SPEED_OPTIONS}
                value={settings.windSpeedUnit}
                onChange={(value) => updateSetting('windSpeedUnit', value)}
              />
            </SettingsRow>

            <SettingsRow label="Precipitation">
              <SettingsPillGroup
                label="Precipitation unit"
                options={PRECIPITATION_OPTIONS}
                value={settings.precipitationUnit}
                onChange={(value) => updateSetting('precipitationUnit', value)}
              />
            </SettingsRow>
          </SettingsSection>
        </div>

        <div className="settings-page__column">
          <SettingsSection icon={<ParticlesIcon />} title="Air Quality">
            <SettingsRow label="Scale" hint="Choose between the US and European air quality indexes.">
              <SettingsPillGroup
                label="Air quality scale"
                options={AQI_SCALE_OPTIONS}
                value={settings.aqiScale}
                onChange={(value) => updateSetting('aqiScale', value)}
              />
            </SettingsRow>
          </SettingsSection>

          <SettingsSection icon={<ClockIcon />} title="Time & Date" className="settings-page__section--time-date">
            <SettingsRow label="Time Format">
              <SettingsPillGroup
                label="Time format"
                options={TIME_FORMAT_OPTIONS}
                value={settings.timeFormat}
                onChange={(value) => updateSetting('timeFormat', value)}
              />
            </SettingsRow>

            <SettingsRow label="Date Format">
              <SettingsPillGroup
                label="Date format"
                options={DATE_FORMAT_OPTIONS}
                value={settings.dateFormat}
                onChange={(value) => updateSetting('dateFormat', value)}
              />
            </SettingsRow>
          </SettingsSection>
        </div>
        </div>

        <FavouritesHistory entries={favouritesHistory} onClear={onClearFavouritesHistory} />
      </div>

      <LiveWeatherPreview
        location={location}
        weather={weather}
        status={weatherStatus}
        airQuality={airQuality}
        settings={settings}
      />
    </section>
  );
}

export default SettingsPage;
