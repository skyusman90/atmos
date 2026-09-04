export function buildHourlyForecast(hourly) {
  if (!hourly || !Array.isArray(hourly.time)) {
    return [];
  }

  return hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m?.[index],
    feelsLike: hourly.apparent_temperature?.[index],
    precipitation: hourly.precipitation?.[index],
    windSpeed: hourly.wind_speed_10m?.[index],
    humidity: hourly.relative_humidity_2m?.[index],
    weatherCode: hourly.weather_code?.[index],
    isDay: hourly.is_day?.[index],
  }));
}

export function groupHourlyByDay(hours, dayCount = 3) {
  const uniqueDates = [...new Set(hours.map((hour) => hour.time.slice(0, 10)))].sort().slice(0, dayCount);

  return uniqueDates.map((date) => ({
    date,
    hours: hours.filter((hour) => hour.time.slice(0, 10) === date),
  }));
}

const DAY_LABELS = ['Today', 'Tomorrow', 'Day After Tomorrow'];

export function getDayLabel(dateStr, index) {
  return DAY_LABELS[index] ?? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
}
