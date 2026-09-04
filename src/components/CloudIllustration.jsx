import './CloudIllustration.css';

function CloudIllustration({ className = '' }) {
  return (
    <svg
      className={`cloud-illustration ${className}`}
      width="96"
      height="96"
      viewBox="0 0 120 120"
      fill="none"
    >
      <defs>
        <linearGradient id="cloudBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--surface)" />
          <stop offset="100%" stopColor="var(--bg)" />
        </linearGradient>
        <radialGradient id="cloudHighlight" cx="35%" cy="22%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      <ellipse className="cloud-illustration__shadow" cx="60" cy="99" rx="34" ry="6" fill="var(--shadow)" />

      <circle className="cloud-illustration__sun" cx="78" cy="34" r="14" fill="url(#sunGlow)" />

      <g className="cloud-illustration__float">
        <path
          d="M35 78c-12 0-21-9-21-20s9-20 21-20c2-14 14-25 29-25 14 0 26 10 29 23 11 1 19 10 19 21 0 12-10 21-22 21H35z"
          fill="url(#cloudBody)"
          stroke="var(--primary)"
          strokeWidth="2"
        />
        <path
          d="M35 78c-12 0-21-9-21-20s9-20 21-20c2-14 14-25 29-25 14 0 26 10 29 23 11 1 19 10 19 21 0 12-10 21-22 21H35z"
          fill="url(#cloudHighlight)"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

export default CloudIllustration;
