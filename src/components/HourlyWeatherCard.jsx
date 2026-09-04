import { useRef, useState } from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { WindIcon, DropletIcon, ChevronLeftIcon, ChevronRightIcon } from './icons.jsx';
import { getWeatherInfo } from '../utils/weatherCodes.js';
import { buildHourlyForecast, groupHourlyByDay, getDayLabel } from '../utils/hourlyForecast.js';
import { formatHourLabel } from '../utils/weatherFormat.js';
import { convertTemperature } from '../utils/temperature.js';
import { convertWindSpeed, getWindSpeedLabel } from '../utils/windSpeed.js';
import { convertPrecipitation, getPrecipitationLabel } from '../utils/precipitation.js';
import './HourlyWeatherCard.css';

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

function HourlyWeatherCard({
  weather,
  status,
  error,
  unit,
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timeFormat = '12h',
}) {
  const [selectedDay, setSelectedDay] = useState(0);
  const scrollerRef = useRef(null);

  function scrollByAmount(direction) {
    scrollerRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  }

  if (status === 'error') {
    return (
      <div className="hourly-card hourly-card--placeholder" role="alert">
        <p className="hourly-card__placeholder-text">{error || 'Unable to load hourly forecast.'}</p>
      </div>
    );
  }

  if (status !== 'success' || !weather) {
    return (
      <div className="hourly-card hourly-card--placeholder" role="status">
        <span className="hourly-card__spinner" aria-hidden="true" />
        <p className="hourly-card__placeholder-text">Loading…</p>
      </div>
    );
  }

  const hours = buildHourlyForecast(weather.hourly);
  const days = groupHourlyByDay(hours, 3);
  const activeIndex = Math.min(selectedDay, days.length - 1);
  const activeDay = days[activeIndex];

  return (
    <section className="hourly-card" aria-label="Hourly forecast">
      <div className="hourly-card__top">
        <h3 className="hourly-card__title">Hourly Forecast</h3>

        <div className="hourly-card__day-tabs" role="tablist" aria-label="Select forecast day">
          {days.map((day, index) => (
            <button
              key={day.date}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={`hourly-card__day-tab ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => setSelectedDay(index)}
            >
              {getDayLabel(day.date, index)}
            </button>
          ))}
        </div>
      </div>

      <div className="hourly-card__scroller-row">
        <button
          type="button"
          className="hourly-card__arrow"
          aria-label="Scroll hourly forecast left"
          onClick={() => scrollByAmount(-1)}
        >
          <ChevronLeftIcon />
        </button>

        <div className="hourly-card__scroller" ref={scrollerRef}>
          {activeDay?.hours.map((hour) => {
            const { label, category } = getWeatherInfo(hour.weatherCode);
            const temperature = convertTemperature(hour.temperature, unit);
            const feelsLike = convertTemperature(hour.feelsLike, unit);
            const precipitation = convertPrecipitation(hour.precipitation ?? 0, precipitationUnit);
            const windSpeed = convertWindSpeed(hour.windSpeed ?? 0, windSpeedUnit);

            return (
              <div className="hourly-card__hour" key={hour.time}>
                <span className="hourly-card__time">{formatHourLabel(hour.time, timeFormat)}</span>
                <span className="hourly-card__icon">{renderConditionIcon(category, hour.isDay === 1)}</span>
                <span className="hourly-card__temp">{Math.round(temperature)}°</span>
                <span className="hourly-card__feels">Feels {Math.round(feelsLike)}°</span>
                <span className="hourly-card__condition">{label}</span>
                <span className="hourly-card__meta">
                  <DropletIcon />
                  {precipitation.toFixed(precipitationUnit === 'in' ? 2 : 1)} {getPrecipitationLabel(precipitationUnit)}
                </span>
                <span className="hourly-card__meta">
                  <WindIcon />
                  {Math.round(windSpeed)} {getWindSpeedLabel(windSpeedUnit)}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="hourly-card__arrow"
          aria-label="Scroll hourly forecast right"
          onClick={() => scrollByAmount(1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}

export default HourlyWeatherCard;
