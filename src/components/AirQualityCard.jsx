import { ParticlesIcon, MoleculeIcon, WindIcon } from './icons.jsx';
import { getAqiCategory, getAqiMeterPercent, getAqiLegend, getAqiScaleMax, getAqiScaleLabel } from '../utils/airQuality.js';
import './AirQualityCard.css';

function AirQualityCard({ airQuality, status, error, aqiScale = 'us' }) {
  if (status === 'error') {
    return (
      <div className="air-quality-card air-quality-card--placeholder" role="alert">
        <p className="air-quality-card__placeholder-text">{error || 'Unable to load air quality data.'}</p>
      </div>
    );
  }

  if (status !== 'success' || !airQuality) {
    return (
      <div className="air-quality-card air-quality-card--placeholder" role="status">
        <span className="air-quality-card__spinner" aria-hidden="true" />
        <p className="air-quality-card__placeholder-text">Loading…</p>
      </div>
    );
  }

  const { current } = airQuality;
  const aqi = aqiScale === 'eu' ? current.european_aqi : current.us_aqi;
  const category = getAqiCategory(aqi, aqiScale);
  const meterPercent = getAqiMeterPercent(aqi, aqiScale);
  const legend = getAqiLegend(aqiScale);

  return (
    <article className="air-quality-card" aria-label="Air quality">
      <div className="air-quality-card__top">
        <h3 className="air-quality-card__title">Air Quality</h3>
        <span className="air-quality-card__badge" style={{ color: category.color }}>
          {category.label}
        </span>
      </div>

      <div className="air-quality-card__score-row">
        <span className="air-quality-card__score">{aqi}</span>
        <span className="air-quality-card__scale">{getAqiScaleLabel(aqiScale)}</span>
      </div>

      <div className="air-quality-card__meter">
        <span className="air-quality-card__meter-marker" style={{ left: `${meterPercent}%` }} />
      </div>
      <div className="air-quality-card__meter-labels">
        <span>0</span>
        <span>{getAqiScaleMax(aqiScale)}+</span>
      </div>

      <ul className="air-quality-card__legend">
        {legend.map((entry) => (
          <li key={entry.label} className="air-quality-card__legend-item">
            <span className="air-quality-card__legend-swatch" style={{ backgroundColor: entry.color }} />
            {entry.shortLabel}
          </li>
        ))}
      </ul>

      <dl className="air-quality-card__stats">
        <div className="air-quality-card__stat">
          <dt className="air-quality-card__stat-label">
            <ParticlesIcon />
            PM2.5
          </dt>
          <dd className="air-quality-card__stat-value">{current.pm2_5} µg/m³</dd>
        </div>

        <div className="air-quality-card__stat">
          <dt className="air-quality-card__stat-label">
            <ParticlesIcon />
            PM10
          </dt>
          <dd className="air-quality-card__stat-value">{current.pm10} µg/m³</dd>
        </div>

        <div className="air-quality-card__stat">
          <dt className="air-quality-card__stat-label">
            <MoleculeIcon />
            Carbon Monoxide
          </dt>
          <dd className="air-quality-card__stat-value">{current.carbon_monoxide} µg/m³</dd>
        </div>

        <div className="air-quality-card__stat">
          <dt className="air-quality-card__stat-label">
            <MoleculeIcon />
            Carbon Dioxide
          </dt>
          <dd className="air-quality-card__stat-value">{current.carbon_dioxide} ppm</dd>
        </div>

        <div className="air-quality-card__stat">
          <dt className="air-quality-card__stat-label">
            <WindIcon />
            Dust
          </dt>
          <dd className="air-quality-card__stat-value">{current.dust} µg/m³</dd>
        </div>
      </dl>
    </article>
  );
}

export default AirQualityCard;
