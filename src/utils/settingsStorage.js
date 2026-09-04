const STORAGE_KEY = 'atmos_settings';

export const DEFAULT_SETTINGS = {
  theme: 'light',
  temperatureUnit: 'C',
  windSpeedUnit: 'kmh',
  precipitationUnit: 'mm',
  aqiScale: 'us',
  timeFormat: '12h',
  dateFormat: 'short',
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
