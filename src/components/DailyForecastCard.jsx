import { useEffect, useRef, useState } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, SlidersHorizontal } from 'lucide-react';
import { WindIcon, DropletIcon, CloudRainIcon, ChevronDown } from './icons.jsx';
import { getWeatherInfo } from '../utils/weatherCodes.js';
import { buildDailyForecast, getDailyLabelForDate, formatDailyDate } from '../utils/dailyForecast.js';
import { formatUpdatedTime } from '../utils/weatherFormat.js';
import { convertTemperature } from '../utils/temperature.js';
import { convertWindSpeed, getWindSpeedLabel } from '../utils/windSpeed.js';
import { convertPrecipitation, getPrecipitationLabel } from '../utils/precipitation.js';
import './DailyForecastCard.css';

const RANGE_OPTIONS = [7, 10, 15];

const QUICK_FILTERS = [
  { value: 'all', label: 'All Days' },
  { value: 'rain', label: 'Rain' },
  { value: 'highTemp', label: 'High Temp' },
  { value: 'precip', label: 'Precipitation' },
  { value: 'strongWind', label: 'Strong Wind' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Chronological' },
  { value: 'tempHighToLow', label: 'Temperature: High to Low' },
  { value: 'tempLowToHigh', label: 'Temperature: Low to High' },
  { value: 'windHighToLow', label: 'Wind Speed: High to Low' },
  { value: 'windLowToHigh', label: 'Wind Speed: Low to High' },
  { value: 'precipHighToLow', label: 'Precipitation: High to Low' },
  { value: 'precipLowToHigh', label: 'Precipitation: Low to High' },
];

const EMPTY_RANGE = { min: '', max: '' };

function renderConditionIcon(category) {
  const iconProps = { size: '1em', strokeWidth: 1.7 };
  switch (category) {
    case 'clear':
      return <Sun {...iconProps} />;
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

function RangeInput({ label, unit, value, onChange }) {
  return (
    <div className="daily-card__range-field">
      <span className="daily-card__range-field-label">{label}</span>
      <div className="daily-card__range-field-inputs">
        <input
          type="number"
          className="daily-card__range-input"
          placeholder="Min"
          value={value.min}
          onChange={(event) => onChange({ ...value, min: event.target.value })}
        />
        <span className="daily-card__range-field-sep">–</span>
        <input
          type="number"
          className="daily-card__range-input"
          placeholder="Max"
          value={value.max}
          onChange={(event) => onChange({ ...value, max: event.target.value })}
        />
        <span className="daily-card__range-field-unit">{unit}</span>
      </div>
    </div>
  );
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="daily-card__sort" ref={wrapRef}>
      <span className="daily-card__sort-label">Sort</span>
      <button
        type="button"
        className="daily-card__sort-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {selected.label}
        <ChevronDown className={`daily-card__sort-chevron ${open ? 'is-open' : ''}`} />
      </button>

      {open && (
        <ul className="daily-card__sort-list" role="listbox">
          {SORT_OPTIONS.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={`daily-card__sort-option ${option.value === value ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DailyForecastCard({
  weather,
  status,
  error,
  unit,
  windSpeedUnit = 'kmh',
  precipitationUnit = 'mm',
  timeFormat = '12h',
  dateFormat = 'short',
}) {
  const [range, setRange] = useState(7);
  const [quickFilter, setQuickFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showRangeFilters, setShowRangeFilters] = useState(false);
  const [tempRange, setTempRange] = useState(EMPTY_RANGE);
  const [precipRange, setPrecipRange] = useState(EMPTY_RANGE);
  const [windRange, setWindRange] = useState(EMPTY_RANGE);

  if (status === 'error') {
    return (
      <div className="daily-card daily-card--placeholder" role="alert">
        <p className="daily-card__placeholder-text">{error || 'Unable to load daily forecast.'}</p>
      </div>
    );
  }

  if (status !== 'success' || !weather) {
    return (
      <div className="daily-card daily-card--placeholder" role="status">
        <span className="daily-card__spinner" aria-hidden="true" />
        <p className="daily-card__placeholder-text">Loading…</p>
      </div>
    );
  }

  const allDays = buildDailyForecast(weather.daily);
  const todayDateStr = allDays[0]?.date;
  const rangedDays = allDays.slice(0, range);

  const avgTempMax = rangedDays.reduce((sum, day) => sum + (day.tempMax ?? 0), 0) / (rangedDays.length || 1);
  const avgWindSpeed = rangedDays.reduce((sum, day) => sum + (day.windSpeed ?? 0), 0) / (rangedDays.length || 1);

  const quickFiltered = rangedDays.filter((day) => {
    if (quickFilter === 'rain') {
      const { category } = getWeatherInfo(day.weatherCode);
      return category === 'rain' || category === 'thunderstorm';
    }
    if (quickFilter === 'highTemp') {
      return (day.tempMax ?? -Infinity) > avgTempMax;
    }
    if (quickFilter === 'precip') {
      return (day.precipitation ?? 0) > 0;
    }
    if (quickFilter === 'strongWind') {
      return (day.windSpeed ?? 0) > avgWindSpeed;
    }
    return true;
  });

  const rangeFiltered = quickFiltered.filter((day) => {
    const displayTemp = convertTemperature(day.tempMax, unit);
    if (tempRange.min !== '' && displayTemp < Number(tempRange.min)) return false;
    if (tempRange.max !== '' && displayTemp > Number(tempRange.max)) return false;

    const displayPrecip = convertPrecipitation(day.precipitation ?? 0, precipitationUnit);
    if (precipRange.min !== '' && displayPrecip < Number(precipRange.min)) return false;
    if (precipRange.max !== '' && displayPrecip > Number(precipRange.max)) return false;

    const displayWind = convertWindSpeed(day.windSpeed ?? 0, windSpeedUnit);
    if (windRange.min !== '' && displayWind < Number(windRange.min)) return false;
    if (windRange.max !== '' && displayWind > Number(windRange.max)) return false;

    return true;
  });

  const days = [...rangeFiltered].sort((a, b) => {
    switch (sortBy) {
      case 'tempHighToLow':
        return (b.tempMax ?? 0) - (a.tempMax ?? 0);
      case 'tempLowToHigh':
        return (a.tempMax ?? 0) - (b.tempMax ?? 0);
      case 'windHighToLow':
        return (b.windSpeed ?? 0) - (a.windSpeed ?? 0);
      case 'windLowToHigh':
        return (a.windSpeed ?? 0) - (b.windSpeed ?? 0);
      case 'precipHighToLow':
        return (b.precipitation ?? 0) - (a.precipitation ?? 0);
      case 'precipLowToHigh':
        return (a.precipitation ?? 0) - (b.precipitation ?? 0);
      default:
        return new Date(a.date) - new Date(b.date);
    }
  });

  const hasActiveRangeFilters =
    tempRange.min !== '' || tempRange.max !== '' || precipRange.min !== '' || precipRange.max !== '' || windRange.min !== '' || windRange.max !== '';

  return (
    <article className="daily-card" aria-label="Multi-day forecast">
      <div className="daily-card__top">
        <h3 className="daily-card__title">Multi-Day Forecast</h3>

        <div className="daily-card__range-tabs" role="tablist" aria-label="Select forecast range">
          {RANGE_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={value === range}
              className={`daily-card__range-tab ${value === range ? 'is-active' : ''}`}
              onClick={() => setRange(value)}
            >
              {value} Day
            </button>
          ))}
        </div>
      </div>

      <div className="daily-card__controls">
        <div className="daily-card__filter-pills" role="group" aria-label="Filter days">
          {QUICK_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`daily-card__filter-pill ${quickFilter === option.value ? 'is-active' : ''}`}
              onClick={() => setQuickFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="daily-card__controls-right">
          <SortDropdown value={sortBy} onChange={setSortBy} />

          <button
            type="button"
            className={`daily-card__filters-toggle ${hasActiveRangeFilters ? 'is-active' : ''}`}
            aria-expanded={showRangeFilters}
            onClick={() => setShowRangeFilters((open) => !open)}
          >
            <SlidersHorizontal size="1em" />
            Ranges
          </button>
        </div>
      </div>

      {showRangeFilters && (
        <div className="daily-card__range-filters">
          <RangeInput label="Temperature" unit={`°${unit}`} value={tempRange} onChange={setTempRange} />
          <RangeInput label="Precipitation" unit={getPrecipitationLabel(precipitationUnit)} value={precipRange} onChange={setPrecipRange} />
          <RangeInput label="Wind Speed" unit={getWindSpeedLabel(windSpeedUnit)} value={windRange} onChange={setWindRange} />
        </div>
      )}

      {days.length === 0 ? (
        <div className="daily-card__no-results">
          <p className="daily-card__placeholder-text">No days match the selected filters.</p>
        </div>
      ) : (
        <ul className="daily-card__list">
          {days.map((day) => {
            const { label, category } = getWeatherInfo(day.weatherCode);
            const tempMax = convertTemperature(day.tempMax, unit);
            const tempMin = convertTemperature(day.tempMin, unit);
            const windSpeed = convertWindSpeed(day.windSpeed ?? 0, windSpeedUnit);
            const precipitation = convertPrecipitation(day.precipitation ?? 0, precipitationUnit);

            return (
              <li className="daily-card__row" key={day.date}>
                <div className="daily-card__day">
                  <span className="daily-card__day-name">{getDailyLabelForDate(day.date, todayDateStr)}</span>
                  <span className="daily-card__day-date">{formatDailyDate(day.date, dateFormat)}</span>
                </div>

                <span className="daily-card__icon">{renderConditionIcon(category)}</span>

                <span className="daily-card__condition">{label}</span>

                <span className="daily-card__temps">
                  <span className="daily-card__temp-max">{Math.round(tempMax)}°</span>
                  <span className="daily-card__temp-min">{Math.round(tempMin)}°</span>
                </span>

                <span className="daily-card__stat">
                  <span className="daily-card__stat-label">
                    <WindIcon />
                    Wind
                  </span>
                  <span className="daily-card__stat-value">{Math.round(windSpeed)} {getWindSpeedLabel(windSpeedUnit)}</span>
                </span>

                <span className="daily-card__stat">
                  <span className="daily-card__stat-label">
                    <DropletIcon />
                    Humidity
                  </span>
                  <span className="daily-card__stat-value">{Math.round(day.humidity ?? 0)}%</span>
                </span>

                <span className="daily-card__stat">
                  <span className="daily-card__stat-label">
                    <CloudRainIcon />
                    Precip.
                  </span>
                  <span className="daily-card__stat-value">{precipitation.toFixed(precipitationUnit === 'in' ? 2 : 1)} {getPrecipitationLabel(precipitationUnit)}</span>
                </span>

                <span className="daily-card__stat">
                  <span className="daily-card__stat-label">Sunrise</span>
                  <span className="daily-card__stat-value">
                    {day.sunrise ? formatUpdatedTime(day.sunrise, timeFormat) : '—'}
                  </span>
                </span>

                <span className="daily-card__stat">
                  <span className="daily-card__stat-label">Sunset</span>
                  <span className="daily-card__stat-value">
                    {day.sunset ? formatUpdatedTime(day.sunset, timeFormat) : '—'}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

export default DailyForecastCard;
