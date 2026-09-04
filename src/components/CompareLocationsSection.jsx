import { useEffect, useRef, useState } from 'react';
import { Scale, Thermometer, ArrowUp, Cloud } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import { PlusIcon, MapPinIcon, CloseIcon, WindIcon, DropletIcon, CloudRainIcon, ParticlesIcon } from './icons.jsx';
import { useCurrentWeather } from '../hooks/useCurrentWeather.js';
import { useAirQuality } from '../hooks/useAirQuality.js';
import { convertTemperature } from '../utils/temperature.js';
import { convertWindSpeed, getWindSpeedLabel } from '../utils/windSpeed.js';
import { convertPrecipitation, getPrecipitationLabel } from '../utils/precipitation.js';
import { getAqiCategory, getAqiScaleLabel } from '../utils/airQuality.js';
import './CompareLocationsSection.css';

function LocationSlot({ label, location, weatherStatus, onSelect, onRemove, favourites, searchHistory }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!location) {
    return (
      <div className="compare-section__slot compare-section__slot--empty" ref={wrapRef}>
        <button type="button" className="compare-section__add-btn" onClick={() => setOpen((o) => !o)}>
          <PlusIcon />
          Add {label}
        </button>

        {open && (
          <div className="compare-section__picker">
            {favourites.length > 0 && (
              <>
                <div className="compare-section__picker-label">Favourites</div>
                <ul className="compare-section__picker-list">
                  {favourites.map((favourite) => (
                    <li key={favourite.id}>
                      <button
                        type="button"
                        className="compare-section__picker-item"
                        onClick={() => {
                          onSelect(favourite);
                          setOpen(false);
                        }}
                      >
                        <MapPinIcon />
                        <span className="compare-section__picker-item-info">
                          <span className="compare-section__picker-item-name">{favourite.name}</span>
                          <span className="compare-section__picker-item-meta">
                            {[favourite.admin1, favourite.country].filter(Boolean).join(', ')}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="compare-section__picker-label">Search</div>
            <SearchBar
              history={searchHistory}
              onSelectLocation={(selected) => {
                onSelect(selected);
                setOpen(false);
              }}
              placeholder="Search for a city..."
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="compare-section__slot compare-section__slot--filled">
      <div className="compare-section__slot-info">
        <span className="compare-section__slot-name">{location.name}</span>
        <span className="compare-section__slot-meta">
          {[location.admin1, location.country].filter(Boolean).join(', ')}
          {weatherStatus === 'loading' && ' · Loading…'}
          {weatherStatus === 'error' && ' · Unable to load'}
        </span>
      </div>
      <button type="button" className="compare-section__remove-btn" aria-label={`Remove ${location.name}`} onClick={onRemove}>
        <CloseIcon />
      </button>
    </div>
  );
}

function buildMetrics(settings) {
  return [
    {
      key: 'tempCurrentFeelsLike',
      label: 'Current / Feels Like',
      icon: <Thermometer size="1em" />,
      getPair: ({ weather }) => [weather?.current?.temperature_2m, weather?.current?.apparent_temperature],
      formatSingle: (value) => `${Math.round(convertTemperature(value, settings.unit))}°`,
    },
    {
      key: 'tempHighLow',
      label: 'High / Low Temperature',
      icon: <ArrowUp size="1em" />,
      getPair: ({ weather }) => [weather?.daily?.temperature_2m_max?.[0], weather?.daily?.temperature_2m_min?.[0]],
      formatSingle: (value) => `${Math.round(convertTemperature(value, settings.unit))}°`,
    },
    {
      key: 'windSpeed',
      label: 'Wind Speed',
      icon: <WindIcon />,
      get: ({ weather }) => weather?.current?.wind_speed_10m,
      format: (value) => `${Math.round(convertWindSpeed(value, settings.windSpeedUnit))} ${getWindSpeedLabel(settings.windSpeedUnit)}`,
    },
    {
      key: 'humidity',
      label: 'Humidity',
      icon: <DropletIcon />,
      get: ({ weather }) => weather?.current?.relative_humidity_2m,
      format: (value) => `${Math.round(value)}%`,
    },
    {
      key: 'precipitation',
      label: 'Precipitation',
      icon: <CloudRainIcon />,
      get: ({ weather }) => weather?.current?.precipitation,
      format: (value) =>
        `${convertPrecipitation(value, settings.precipitationUnit).toFixed(settings.precipitationUnit === 'in' ? 2 : 1)} ${getPrecipitationLabel(settings.precipitationUnit)}`,
    },
    {
      key: 'airQuality',
      label: 'Air Quality',
      icon: <ParticlesIcon />,
      get: ({ airQuality }) =>
        settings.aqiScale === 'eu' ? airQuality?.current?.european_aqi : airQuality?.current?.us_aqi,
      format: (value) => `${Math.round(value)} ${getAqiScaleLabel(settings.aqiScale)}`,
      hint: (value) => getAqiCategory(value, settings.aqiScale).label,
    },
    {
      key: 'cloudCover',
      label: 'Cloud Cover',
      icon: <Cloud size="1em" />,
      get: ({ weather }) => weather?.current?.cloud_cover,
      format: (value) => `${Math.round(value)}%`,
    },
  ];
}

function CompareLocationsSection({ favourites, searchHistory, settings }) {
  const [locationA, setLocationA] = useState(null);
  const [locationB, setLocationB] = useState(null);

  const { data: weatherA, status: weatherStatusA } = useCurrentWeather(locationA?.latitude, locationA?.longitude);
  const { data: airQualityA } = useAirQuality(locationA?.latitude, locationA?.longitude);
  const { data: weatherB, status: weatherStatusB } = useCurrentWeather(locationB?.latitude, locationB?.longitude);
  const { data: airQualityB } = useAirQuality(locationB?.latitude, locationB?.longitude);

  const ready = locationA && locationB && weatherA && weatherB;
  const metrics = buildMetrics(settings);

  return (
    <article className="compare-section" aria-label="Compare locations">
      <div className="compare-section__header">
        <span className="compare-section__header-icon">
          <Scale size="1em" />
        </span>
        <div className="compare-section__header-info">
          <h2 className="compare-section__title">Compare Locations</h2>
          <span className="compare-section__subtitle">Pick two locations to see them side by side</span>
        </div>
      </div>

      <div className="compare-section__slots">
        <LocationSlot
          label="Location A"
          location={locationA}
          weatherStatus={weatherStatusA}
          onSelect={setLocationA}
          onRemove={() => setLocationA(null)}
          favourites={favourites}
          searchHistory={searchHistory}
        />
        <span className="compare-section__vs">VS</span>
        <LocationSlot
          label="Location B"
          location={locationB}
          weatherStatus={weatherStatusB}
          onSelect={setLocationB}
          onRemove={() => setLocationB(null)}
          favourites={favourites}
          searchHistory={searchHistory}
        />
      </div>

      {!ready ? (
        <div className="compare-section__empty">
          <p>Select two locations above to compare their current conditions.</p>
        </div>
      ) : (
        <div className="compare-section__table">
          <div className="compare-section__table-head">
            <span className="compare-section__table-metric-label" />
            <span className="compare-section__table-col-label">{locationA.name}</span>
            <span className="compare-section__table-col-label">{locationB.name}</span>
          </div>

          {metrics.map((metric) => {
            if (metric.getPair) {
              const [aFirst, aSecond] = metric.getPair({ weather: weatherA, airQuality: airQualityA });
              const [bFirst, bSecond] = metric.getPair({ weather: weatherB, airQuality: airQualityB });
              const hasA = aFirst != null && aSecond != null;
              const hasB = bFirst != null && bSecond != null;

              return (
                <div className="compare-section__row" key={metric.key}>
                  <span className="compare-section__row-label">
                    <span className="compare-section__row-icon">{metric.icon}</span>
                    {metric.label}
                  </span>
                  <span className="compare-section__row-value">
                    {hasA ? (
                      <span className="compare-section__row-pair">
                        <span className={aFirst > aSecond ? 'is-higher' : ''}>{metric.formatSingle(aFirst)}</span>
                        <span className="compare-section__row-pair-sep">/</span>
                        <span className={aSecond > aFirst ? 'is-higher' : ''}>{metric.formatSingle(aSecond)}{settings.unit}</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </span>
                  <span className="compare-section__row-value">
                    {hasB ? (
                      <span className="compare-section__row-pair">
                        <span className={bFirst > bSecond ? 'is-higher' : ''}>{metric.formatSingle(bFirst)}</span>
                        <span className="compare-section__row-pair-sep">/</span>
                        <span className={bSecond > bFirst ? 'is-higher' : ''}>{metric.formatSingle(bSecond)}{settings.unit}</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
              );
            }

            const rawA = metric.get({ weather: weatherA, airQuality: airQualityA });
            const rawB = metric.get({ weather: weatherB, airQuality: airQualityB });
            const hasA = rawA != null;
            const hasB = rawB != null;
            const higherIsA = hasA && hasB && rawA > rawB;
            const higherIsB = hasA && hasB && rawB > rawA;

            return (
              <div className="compare-section__row" key={metric.key}>
                <span className="compare-section__row-label">
                  <span className="compare-section__row-icon">{metric.icon}</span>
                  {metric.label}
                </span>
                <span className={`compare-section__row-value ${higherIsA ? 'is-higher' : ''}`}>
                  {hasA ? metric.format(rawA) : '—'}
                  {hasA && metric.hint && <span className="compare-section__row-hint">{metric.hint(rawA)}</span>}
                </span>
                <span className={`compare-section__row-value ${higherIsB ? 'is-higher' : ''}`}>
                  {hasB ? metric.format(rawB) : '—'}
                  {hasB && metric.hint && <span className="compare-section__row-hint">{metric.hint(rawB)}</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default CompareLocationsSection;
