import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from './icons.jsx';
import { TIME_RANGE_OPTIONS, buildChartPoints, getLineValue } from '../utils/forecastChart.js';
import './TrendChartCard.css';

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 340;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 16;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 36;
const PLOT_WIDTH = VIEW_WIDTH - PADDING_LEFT - PADDING_RIGHT;
const PLOT_HEIGHT = VIEW_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

function TrendChartCard({ icon, title, metrics, weather, settings }) {
  const [timeRange, setTimeRange] = useState('7');
  const [metric, setMetric] = useState(metrics[0].value);
  const [metricMenuOpen, setMetricMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const menuRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMetricMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!weather) {
    return null;
  }

  const points = buildChartPoints(weather, timeRange, settings);
  const metricConfig = metrics.find((option) => option.value === metric) ?? metrics[0];
  const showBars = metricConfig.value === 'temperature' && timeRange !== 'hourly';

  const lineValues = points.map((point) => getLineValue(point, metricConfig.value));
  const allValues = showBars ? [...points.map((p) => p.low), ...points.map((p) => p.high), ...lineValues] : lineValues;
  const rawMin = allValues.length ? Math.min(...allValues) : 0;
  const rawMax = allValues.length ? Math.max(...allValues) : 1;
  const pad = (rawMax - rawMin) * 0.2 || 1;
  const min = rawMin - pad;
  const max = rawMax + pad;

  const barWidth = Math.max(8, Math.min(26, (PLOT_WIDTH / (points.length || 1)) * 0.24));
  const edgeInset = showBars ? barWidth / 2 + 4 : 0;
  const usablePlotWidth = PLOT_WIDTH - edgeInset * 2;

  function xAt(index) {
    if (points.length <= 1) return PADDING_LEFT + PLOT_WIDTH / 2;
    return PADDING_LEFT + edgeInset + (index / (points.length - 1)) * usablePlotWidth;
  }
  function yAt(value) {
    return PADDING_TOP + (1 - (value - min) / (max - min)) * PLOT_HEIGHT;
  }

  const linePath = points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(getLineValue(point, metricConfig.value)).toFixed(1)}`).join(' ');
  const areaPath = points.length
    ? `${linePath} L ${xAt(points.length - 1).toFixed(1)} ${(PADDING_TOP + PLOT_HEIGHT).toFixed(1)} L ${xAt(0).toFixed(1)} ${(PADDING_TOP + PLOT_HEIGHT).toFixed(1)} Z`
    : '';

  const gridCount = 4;
  const gridValues = Array.from({ length: gridCount + 1 }, (_, i) => min + ((max - min) / gridCount) * i);
  const labelStep = points.length > 10 ? Math.ceil(points.length / 8) : 1;
  const gradientId = `trendArea-${title.replace(/\s+/g, '')}-${metricConfig.value}`;

  function handlePointerMove(event) {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH;
    const ratio = (relativeX - PADDING_LEFT) / PLOT_WIDTH;
    const index = Math.round(ratio * (points.length - 1));
    setHoverIndex(Math.min(points.length - 1, Math.max(0, index)));
  }

  const hoverPoint = hoverIndex != null ? points[hoverIndex] : null;
  const hoverX = hoverIndex != null ? xAt(hoverIndex) : 0;
  const hoverY = hoverIndex != null ? yAt(getLineValue(hoverPoint, metricConfig.value)) : 0;
  const tooltipLeft = (hoverX / VIEW_WIDTH) * 100;
  const tooltipTop = (hoverY / VIEW_HEIGHT) * 100;
  const tooltipAlign = tooltipLeft > 75 ? 'right' : tooltipLeft < 12 ? 'left' : 'center';

  return (
    <article className="trend-card" aria-label={title}>
      <div className="trend-card__header">
        <div className="trend-card__heading">
          <span className="trend-card__heading-icon">{icon}</span>
          <div className="trend-card__heading-info">
            <h2 className="trend-card__title">{title}</h2>
            <span className="trend-card__subtitle">
              {metricConfig.label} over {timeRange === 'hourly' ? 'the next 24 hours' : `${timeRange} days`}
            </span>
          </div>
        </div>

        <div className="trend-card__controls">
          <div className="trend-card__range-tabs" role="tablist" aria-label="Select time range">
            {TIME_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={timeRange === option.value}
                className={`trend-card__range-tab ${timeRange === option.value ? 'is-active' : ''}`}
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {metrics.length > 1 && (
            <div className="trend-card__metric" ref={menuRef}>
              <button
                type="button"
                className="trend-card__metric-trigger"
                aria-haspopup="listbox"
                aria-expanded={metricMenuOpen}
                onClick={() => setMetricMenuOpen((open) => !open)}
              >
                <span className="trend-card__metric-dot" style={{ backgroundColor: metricConfig.color }} />
                {metricConfig.label}
                <ChevronDown className={`trend-card__metric-chevron ${metricMenuOpen ? 'is-open' : ''}`} />
              </button>

              {metricMenuOpen && (
                <ul className="trend-card__metric-list" role="listbox">
                  {metrics.map((option) => (
                    <li key={option.value} role="option" aria-selected={option.value === metric}>
                      <button
                        type="button"
                        className={`trend-card__metric-option ${option.value === metric ? 'is-active' : ''}`}
                        onClick={() => {
                          setMetric(option.value);
                          setMetricMenuOpen(false);
                        }}
                      >
                        <span className="trend-card__metric-dot" style={{ backgroundColor: option.color }} />
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="trend-card__legend">
        {showBars ? (
          <>
            <span className="trend-card__legend-item">
              <span className="trend-card__legend-swatch trend-card__legend-swatch--line" style={{ backgroundColor: metricConfig.color }} />
              Average Temperature
            </span>
            <span className="trend-card__legend-item">
              <span className="trend-card__legend-swatch trend-card__legend-swatch--bar" />
              High / Low Range
            </span>
          </>
        ) : (
          <span className="trend-card__legend-item">
            <span className="trend-card__legend-swatch trend-card__legend-swatch--line" style={{ backgroundColor: metricConfig.color }} />
            {metricConfig.label} ({metricConfig.unit(settings)})
          </span>
        )}
      </div>

      {points.length === 0 ? (
        <div className="trend-card__empty">
          <p>No forecast data available for this range.</p>
        </div>
      ) : (
        <div className="trend-card__canvas">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="trend-card__svg"
            role="img"
            aria-label={`${metricConfig.label} chart`}
            onMouseMove={handlePointerMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metricConfig.color} stopOpacity="0.32" />
                <stop offset="100%" stopColor={metricConfig.color} stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${gradientId}-bar`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--secondary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>

            {gridValues.map((value, i) => (
              <g key={i}>
                <line x1={PADDING_LEFT} x2={VIEW_WIDTH - PADDING_RIGHT} y1={yAt(value)} y2={yAt(value)} className="trend-card__grid-line" />
                <text x={PADDING_LEFT - 10} y={yAt(value)} className="trend-card__axis-label" textAnchor="end" dominantBaseline="middle">
                  {Math.round(value)}
                </text>
              </g>
            ))}

            <path d={areaPath} fill={`url(#${gradientId})`} className="trend-card__area" />

            {showBars &&
              points.map((point, i) => (
                <rect
                  key={`bar-${i}`}
                  x={xAt(i) - barWidth / 2}
                  y={yAt(point.high)}
                  width={barWidth}
                  height={Math.max(3, yAt(point.low) - yAt(point.high))}
                  rx={6}
                  fill={`url(#${gradientId}-bar)`}
                  className={`trend-card__bar ${hoverIndex === i ? 'is-hovered' : ''}`}
                />
              ))}

            <path d={linePath} fill="none" stroke={metricConfig.color} className="trend-card__line" />

            {points.map((point, i) => (
              <circle
                key={`dot-${i}`}
                cx={xAt(i)}
                cy={yAt(getLineValue(point, metricConfig.value))}
                r={hoverIndex === i ? 6 : 4.5}
                className="trend-card__dot"
                style={{ fill: metricConfig.color }}
              />
            ))}

            {hoverIndex != null && (
              <line x1={hoverX} x2={hoverX} y1={PADDING_TOP} y2={PADDING_TOP + PLOT_HEIGHT} className="trend-card__hover-line" />
            )}

            {points.map(
              (point, i) =>
                i % labelStep === 0 && (
                  <text key={`label-${i}`} x={xAt(i)} y={VIEW_HEIGHT - 10} className="trend-card__x-label" textAnchor="middle">
                    {point.label}
                  </text>
                )
            )}
          </svg>

          {hoverPoint && (
            <div
              className={`trend-card__tooltip trend-card__tooltip--${tooltipAlign}`}
              style={{ left: `${tooltipLeft}%`, top: `${tooltipTop}%` }}
            >
              <span className="trend-card__tooltip-label">{hoverPoint.label}</span>
              <span className="trend-card__tooltip-value">
                {showBars ? (
                  <>
                    {Math.round(hoverPoint.high)}° / {Math.round(hoverPoint.low)}°
                  </>
                ) : (
                  <>
                    {Math.round(getLineValue(hoverPoint, metricConfig.value))}
                    {metricConfig.unit(settings)}
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default TrendChartCard;
