import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, RefreshCw } from 'lucide-react';
import { WindIcon, DropletIcon, ArrowUpIcon, ArrowDownIcon, CloudRainIcon } from './icons.jsx';
import { getWeatherInfo } from '../utils/weatherCodes.js';
import { getWeatherBackground } from '../utils/weatherBackground.js';
import { degreesToCompass, formatUpdatedTime, formatLocationDateTime } from '../utils/weatherFormat.js';
import { convertTemperature } from '../utils/temperature.js';
import { convertWindSpeed, getWindSpeedLabel } from '../utils/windSpeed.js';
import { convertPrecipitation, getPrecipitationLabel } from '../utils/precipitation.js';
import './CurrentWeatherCard.css';

function renderConditionIcon(category, isDay) {
  const iconProps = { size: '1em', strokeWidth: 1.6 };
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

function CurrentWeatherCard({
  location,
  weather,
  status,
  error,
  unit,
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timeFormat = '12h',
  dateFormat = 'short',
  lastUpdated,
  onRefresh,
  onViewDetails,
}) {
  if (!location) {
    return null;
  }

  if (status === 'error') {
    return (
      <div className="weather-card weather-card--placeholder" role="alert">
        <p className="weather-card__placeholder-text">{error || 'Unable to load weather data.'}</p>
      </div>
    );
  }

  if (status !== 'success' || !weather) {
    return (
      <div className="weather-card weather-card--placeholder" role="status">
        <span className="weather-card__spinner" aria-hidden="true" />
        <p className="weather-card__placeholder-text">Loading weather…</p>
      </div>
    );
  }

  const { current, daily } = weather;
  const { label, category } = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;

  const background = getWeatherBackground({
    category,
    isDay,
    currentTime: current.time,
    sunrise: daily?.sunrise?.[0],
    sunset: daily?.sunset?.[0],
  });

  const meta = [location.admin1, location.country].filter(Boolean).join(', ');
  const compass = degreesToCompass(current.wind_direction_10m);

  const temperature = convertTemperature(current.temperature_2m, unit);
  const feelsLike = convertTemperature(current.apparent_temperature, unit);
  const high = convertTemperature(daily?.temperature_2m_max?.[0], unit);
  const low = convertTemperature(daily?.temperature_2m_min?.[0], unit);
  const windSpeed = convertWindSpeed(current.wind_speed_10m, windSpeedUnit);
  const precipitation = convertPrecipitation(current.precipitation, precipitationUnit);
  const isRefreshing = status === 'loading';

  return (
    <article className="weather-card" style={{ backgroundImage: `url(${background})` }} aria-label={`Current weather for ${location.name}`}>
      <div className="weather-card__content">
        <div className="weather-card__top">
          <div className="weather-card__location">
            <h2 className="weather-card__name">{location.name}</h2>
            {meta && <p className="weather-card__region">{meta}</p>}
            <p className="weather-card__local-time">
              <time dateTime={current.time}>
                {formatLocationDateTime(current.time, timeFormat, dateFormat)}
              </time>
            </p>
          </div>

          <div className="weather-card__updated">
            <button
              type="button"
              className="weather-card__refresh"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh weather"
            >
              <RefreshCw size="1em" className={isRefreshing ? 'weather-card__refresh-icon--spin' : ''} />
            </button>
            <span>
              {lastUpdated ? (
                <>
                  Updated{' '}
                  <time dateTime={lastUpdated.toISOString()}>
                    {formatUpdatedTime(lastUpdated, timeFormat)}
                  </time>
                </>
              ) : (
                ''
              )}
            </span>
          </div>
        </div>

        <div className="weather-card__main">
          <div className="weather-card__left">
            <div className="weather-card__condition-row">
              <span className="weather-card__icon">{renderConditionIcon(category, isDay)}</span>
              <span className="weather-card__condition">{label}</span>
            </div>

            <div className="weather-card__temp">
              {Math.round(temperature)}
              <span className="weather-card__temp-unit">°</span>
            </div>

            <span className="weather-card__feels">Feels like {Math.round(feelsLike)}°</span>
          </div>

          <div className="weather-card__details">
            <div className="weather-card__details-top">
              <button type="button" className="weather-card__more-details" onClick={onViewDetails}>
                More details
              </button>
            </div>

            <dl className="weather-card__stats">
            <div className="weather-card__stat">
              <dt className="weather-card__stat-label">
                <ArrowUpIcon />
                High
              </dt>
              <dd className="weather-card__stat-value">{Math.round(high)}°</dd>
            </div>

            <div className="weather-card__stat">
              <dt className="weather-card__stat-label">
                <WindIcon />
                Wind
              </dt>
              <dd className="weather-card__stat-value">
                {Math.round(windSpeed)} {getWindSpeedLabel(windSpeedUnit)}
              </dd>
            </div>

            <div className="weather-card__stat">
              <dt className="weather-card__stat-label">
                <span
                  className="weather-card__stat-arrow"
                  style={{ transform: `rotate(${current.wind_direction_10m + 180}deg)` }}
                >
                  <ArrowUpIcon />
                </span>
                Direction
              </dt>
              <dd className="weather-card__stat-value">{compass}</dd>
            </div>

            <div className="weather-card__stat">
              <dt className="weather-card__stat-label">
                <ArrowDownIcon />
                Low
              </dt>
              <dd className="weather-card__stat-value">{Math.round(low)}°</dd>
            </div>

            <div className="weather-card__stat">
              <dt className="weather-card__stat-label">
                <DropletIcon />
                Humidity
              </dt>
              <dd className="weather-card__stat-value">{Math.round(current.relative_humidity_2m)}%</dd>
            </div>

            <div className="weather-card__stat">
              <dt className="weather-card__stat-label">
                <CloudRainIcon />
                Precip.
              </dt>
              <dd className="weather-card__stat-value">
                {precipitation.toFixed(precipitationUnit === 'in' ? 2 : 1)} {getPrecipitationLabel(precipitationUnit)}
              </dd>
            </div>
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CurrentWeatherCard;
