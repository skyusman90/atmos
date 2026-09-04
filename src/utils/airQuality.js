const US_AQI_SCALE_MAX = 300;
const EU_AQI_SCALE_MAX = 100;

const US_AQI_CATEGORIES = [
  { upTo: 50, label: 'Good', shortLabel: 'Good', color: 'var(--secondary)' },
  { upTo: 100, label: 'Moderate', shortLabel: 'Moderate', color: 'var(--accent)' },
  { upTo: 150, label: 'Unhealthy for Sensitive Groups', shortLabel: 'USG', color: '#F2994A' },
  { upTo: 200, label: 'Unhealthy', shortLabel: 'Unhealthy', color: '#EB5757' },
  { upTo: 300, label: 'Very Unhealthy', shortLabel: 'Very Unhealthy', color: '#9B51E0' },
  { upTo: Infinity, label: 'Hazardous', shortLabel: 'Hazardous', color: '#7B241C' },
];

const EU_AQI_CATEGORIES = [
  { upTo: 20, label: 'Good', shortLabel: 'Good', color: 'var(--secondary)' },
  { upTo: 40, label: 'Fair', shortLabel: 'Fair', color: 'var(--accent)' },
  { upTo: 60, label: 'Moderate', shortLabel: 'Moderate', color: '#F2994A' },
  { upTo: 80, label: 'Poor', shortLabel: 'Poor', color: '#EB5757' },
  { upTo: 100, label: 'Very Poor', shortLabel: 'Very Poor', color: '#9B51E0' },
  { upTo: Infinity, label: 'Extremely Poor', shortLabel: 'Ext. Poor', color: '#7B241C' },
];

function getCategories(scale) {
  return scale === 'eu' ? EU_AQI_CATEGORIES : US_AQI_CATEGORIES;
}

function getScaleMax(scale) {
  return scale === 'eu' ? EU_AQI_SCALE_MAX : US_AQI_SCALE_MAX;
}

export function getAqiCategory(aqi, scale = 'us') {
  const categories = getCategories(scale);
  return categories.find((entry) => aqi <= entry.upTo) ?? categories[categories.length - 1];
}

export function getAqiMeterPercent(aqi, scale = 'us') {
  return Math.min(100, Math.max(0, (aqi / getScaleMax(scale)) * 100));
}

export function getAqiLegend(scale = 'us') {
  const max = getScaleMax(scale);
  return getCategories(scale).filter((entry) => entry.upTo <= max);
}

export function getAqiScaleMax(scale = 'us') {
  return getScaleMax(scale);
}

export function getAqiScaleLabel(scale = 'us') {
  return scale === 'eu' ? 'EU AQI' : 'US AQI';
}
