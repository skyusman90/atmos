const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }) {
  return (
    <svg
      {...base}
      fill={filled ? 'currentColor' : 'none'}
      {...props}
    >
      <polygon points="12 2.5 15.09 8.9 22 9.9 17 14.85 18.18 21.8 12 18.5 5.82 21.8 7 14.85 2 9.9 8.91 8.9 12 2.5" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="4.2" y1="4.2" x2="6" y2="6" />
      <line x1="18" y1="18" x2="19.8" y2="19.8" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.2" y1="19.8" x2="6" y2="18" />
      <line x1="18" y1="6" x2="19.8" y2="4.2" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />
    </svg>
  );
}

export function DashboardIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.5" />
      <rect x="3" y="15" width="7.5" height="6" rx="1.5" />
    </svg>
  );
}

export function SettingsIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.6A1.7 1.7 0 0 0 11.64 3H12a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.55 1.1c-.15.4-.4.86-.34 1.87" />
    </svg>
  );
}

export function HistoryIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 3 3 8 8 8" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export function CompareIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3v18" />
      <path d="M16 3v18" />
      <polyline points="4 7 8 3 12 7" />
      <polyline points="12 17 16 21 20 17" />
    </svg>
  );
}

export function StatisticsIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="21" x2="20" y2="21" />
      <rect x="6" y="12" width="3.5" height="9" rx="1" />
      <rect x="13" y="7" width="3.5" height="14" rx="1" />
      <path d="M4 9.5 9 5l3.5 3L20 3.5" />
    </svg>
  );
}

export function ChevronDown(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
    </svg>
  );
}

export function CloudIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 18a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.2-2A4.5 4.5 0 0 1 17.5 18H7Z" />
    </svg>
  );
}

export function CloudRainIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 15.5a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.2-2A4.5 4.5 0 0 1 17.5 15.5H7Z" />
      <line x1="8" y1="18.5" x2="7.3" y2="21" />
      <line x1="12" y1="18.5" x2="11.3" y2="21" />
      <line x1="16" y1="18.5" x2="15.3" y2="21" />
    </svg>
  );
}

export function CloudSnowIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 15.5a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.2-2A4.5 4.5 0 0 1 17.5 15.5H7Z" />
      <line x1="8" y1="19" x2="8" y2="19.01" />
      <line x1="12" y1="20" x2="12" y2="20.01" />
      <line x1="16" y1="19" x2="16" y2="19.01" />
    </svg>
  );
}

export function CloudLightningIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 14.5a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.2-2A4.5 4.5 0 0 1 17.5 14.5H7Z" />
      <polyline points="13 14 10.5 18 13 18 10.5 22" />
    </svg>
  );
}

export function FogIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h13" />
      <path d="M3 12h18" />
      <path d="M3 16h13" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function WindIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h15a3 3 0 1 1-3 3" />
      <path d="M3 16h8a2 2 0 1 1-2 2" />
    </svg>
  );
}

export function DropletIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z" />
    </svg>
  );
}

export function ArrowUpIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="12" y1="21" x2="12" y2="3" />
      <polyline points="6 9 12 3 18 9" />
    </svg>
  );
}

export function ArrowDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="12" y1="3" x2="12" y2="21" />
      <polyline points="6 15 12 21 18 15" />
    </svg>
  );
}

export function ParticlesIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="7" r="1.6" />
      <circle cx="15" cy="5" r="1.1" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="11" r="1.1" />
      <circle cx="6" cy="17" r="1.3" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

export function MoleculeIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="17" cy="6" r="2.2" />
      <circle cx="12" cy="17" r="2.5" />
      <line x1="7.8" y1="8.4" x2="10.2" y2="15" />
      <line x1="15.2" y1="7.4" x2="13" y2="15" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

export function MapPinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}
