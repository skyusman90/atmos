import { buildDailyForecast, getDailyLabelForDate } from './dailyForecast.js';
import { buildHourlyForecast } from './hourlyForecast.js';
import { formatHourLabel } from './weatherFormat.js';
import { convertTemperature } from './temperature.js';
import { convertWindSpeed } from './windSpeed.js';
import { convertPrecipitation } from './precipitation.js';

export const TIME_RANGE_OPTIONS = [
  { value: '7', label: '7 Day' },
  { value: '10', label: '10 Day' },
  { value: '15', label: '15 Day' },
  { value: 'hourly', label: 'Hourly' },
];

export function getLineValue(point, metric) {
  switch (metric) {
    case 'temperature':
      return point.temp;
    case 'wind':
      return point.wind;
    case 'precipitation':
      return point.precip;
    case 'humidity':
      return point.humidity;
    default:
      return 0;
  }
}

export function buildChartPoints(weather, timeRange, settings) {
  const { unit, windSpeedUnit, precipitationUnit, timeFormat } = settings;
  const todayStr = weather.daily?.time?.[0];

  if (timeRange === 'hourly') {
    const hours = buildHourlyForecast(weather.hourly);
    const todayHours = hours.filter((hour) => hour.time.slice(0, 10) === todayStr).slice(0, 24);

    return todayHours.map((hour) => {
      const temp = convertTemperature(hour.temperature, unit);
      return {
        label: formatHourLabel(hour.time, timeFormat),
        low: temp,
        high: temp,
        temp,
        wind: convertWindSpeed(hour.windSpeed ?? 0, windSpeedUnit),
        precip: convertPrecipitation(hour.precipitation ?? 0, precipitationUnit),
        humidity: hour.humidity ?? 0,
      };
    });
  }

  const days = buildDailyForecast(weather.daily).slice(0, Number(timeRange));

  return days.map((day) => ({
    label: getDailyLabelForDate(day.date, todayStr) === 'Today' ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    low: convertTemperature(day.tempMin, unit),
    high: convertTemperature(day.tempMax, unit),
    temp: convertTemperature(((day.tempMax ?? 0) + (day.tempMin ?? 0)) / 2, unit),
    wind: convertWindSpeed(day.windSpeed ?? 0, windSpeedUnit),
    precip: convertPrecipitation(day.precipitation ?? 0, precipitationUnit),
    humidity: day.humidity ?? 0,
  }));
}
