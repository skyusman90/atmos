import { formatNumericDate } from './weatherFormat.js';

export function buildDailyForecast(daily) {
  if (!daily || !Array.isArray(daily.time)) {
    return [];
  }

  return daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code?.[index],
    tempMax: daily.temperature_2m_max?.[index],
    tempMin: daily.temperature_2m_min?.[index],
    precipitation: daily.precipitation_sum?.[index],
    windSpeed: daily.wind_speed_10m_max?.[index],
    humidity: daily.relative_humidity_2m_mean?.[index],
    sunrise: daily.sunrise?.[index],
    sunset: daily.sunset?.[index],
  }));
}

export function getDailyLabel(dateStr, index) {
  if (index === 0) {
    return 'Today';
  }
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

export function getDailyLabelForDate(dateStr, todayDateStr) {
  if (dateStr === todayDateStr) {
    return 'Today';
  }
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDailyDate(dateStr, dateFormat = 'short') {
  if (dateFormat === 'dmy' || dateFormat === 'mdy') {
    return formatNumericDate(dateStr, dateFormat);
  }
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
