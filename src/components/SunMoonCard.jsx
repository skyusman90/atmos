import { getSunProgress } from '../utils/sunPosition.js';
import { getMoonPhase } from '../utils/moonPhase.js';
import { formatUpdatedTime } from '../utils/weatherFormat.js';
import './SunMoonCard.css';

function MoonPhaseIcon({ phase, illumination }) {
  const radius = 16;
  const waxing = phase < 0.5;
  const litFraction = illumination / 100;
  const offset = (1 - litFraction) * radius * 2 * (waxing ? 1 : -1);

  return (
    <svg className="sun-moon-card__moon-icon" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <defs>
        <clipPath id="moon-disc-clip">
          <circle cx="18" cy="18" r={radius} />
        </clipPath>
      </defs>
      <circle cx="18" cy="18" r={radius} className="sun-moon-card__moon-dark" />
      <g clipPath="url(#moon-disc-clip)">
        <circle cx={18 + offset} cy="18" r={radius} className="sun-moon-card__moon-lit" />
      </g>
      <circle cx="18" cy="18" r={radius} className="sun-moon-card__moon-outline" fill="none" />
    </svg>
  );
}

function SunMoonCard({ weather, status, error, timeFormat = '12h' }) {
  if (status === 'error') {
    return (
      <div className="sun-moon-card sun-moon-card--placeholder" role="alert">
        <p className="sun-moon-card__placeholder-text">{error || 'Unable to load sun & moon data.'}</p>
      </div>
    );
  }

  if (status !== 'success' || !weather) {
    return (
      <div className="sun-moon-card sun-moon-card--placeholder" role="status">
        <span className="sun-moon-card__spinner" aria-hidden="true" />
        <p className="sun-moon-card__placeholder-text">Loading…</p>
      </div>
    );
  }

  const { current, daily } = weather;
  const sunrise = daily?.sunrise?.[0];
  const sunset = daily?.sunset?.[0];
  const moonrise = daily?.moonrise?.[0];
  const moonset = daily?.moonset?.[0];

  const progress = getSunProgress(current.time, sunrise, sunset);
  const theta = Math.PI * (1 - progress);
  const dotX = 100 + 90 * Math.cos(theta);
  const dotY = 95 - 90 * Math.sin(theta);
  const labelX = Math.min(Math.max(dotX, 28), 172);

  const moon = getMoonPhase(daily?.moon_phase?.[0] ?? 0);
  const currentTimeLabel = formatUpdatedTime(current.time, timeFormat);

  return (
    <article className="sun-moon-card" aria-label="Sunrise, sunset, and moon phase">
      <h3 className="sun-moon-card__title">Sun &amp; Moon</h3>

      <svg className="sun-moon-card__arc" viewBox="0 0 200 100" aria-hidden="true">
        <defs>
          <linearGradient id="sunMoonArcGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--secondary)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

        <path d="M10,95 A90,90 0 0 1 190,95" className="sun-moon-card__arc-track" pathLength="100" />
        <path
          d="M10,95 A90,90 0 0 1 190,95"
          className="sun-moon-card__arc-progress"
          pathLength="100"
          strokeDasharray={`${progress * 100} ${100 - progress * 100}`}
        />

        <circle cx={dotX} cy={dotY} r="5" className="sun-moon-card__arc-dot" />

        <g transform={`translate(${labelX}, ${Math.max(dotY - 16, 4)})`}>
          <rect x="-23" y="-9.5" width="46" height="19" rx="9.5" className="sun-moon-card__arc-label-bg" />
          <text textAnchor="middle" dy="3.5" className="sun-moon-card__arc-label-text">
            {currentTimeLabel}
          </text>
        </g>
      </svg>

      <div className="sun-moon-card__row">
        <div className="sun-moon-card__col">
          <span className="sun-moon-card__label">Sunrise</span>
          <span className="sun-moon-card__value">{sunrise ? formatUpdatedTime(sunrise, timeFormat) : '—'}</span>
        </div>
        <div className="sun-moon-card__col sun-moon-card__col--right">
          <span className="sun-moon-card__label">Sunset</span>
          <span className="sun-moon-card__value">{sunset ? formatUpdatedTime(sunset, timeFormat) : '—'}</span>
        </div>
      </div>

      <div className="sun-moon-card__row">
        <div className="sun-moon-card__col">
          <span className="sun-moon-card__label">Moonrise</span>
          <span className="sun-moon-card__value">{moonrise ? formatUpdatedTime(moonrise, timeFormat) : '—'}</span>
        </div>
        <div className="sun-moon-card__col sun-moon-card__col--right">
          <span className="sun-moon-card__label">Moonset</span>
          <span className="sun-moon-card__value">{moonset ? formatUpdatedTime(moonset, timeFormat) : '—'}</span>
        </div>
      </div>

      <div className="sun-moon-card__divider" />

      <div className="sun-moon-card__moon">
        <MoonPhaseIcon phase={moon.phase} illumination={moon.illumination} />
        <div className="sun-moon-card__moon-info">
          <span className="sun-moon-card__label">Moon Phase</span>
          <span className="sun-moon-card__value">{moon.name}</span>
        </div>
        <span className="sun-moon-card__illumination">{moon.illumination}% Illumination</span>
      </div>
    </article>
  );
}

export default SunMoonCard;
