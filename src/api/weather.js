import { ApiError } from '../utils/errors.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchCurrentWeather(latitude, longitude, { signal } = {}) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
      'cloud_cover',
      'dew_point_2m',
    ].join(','),
    daily: [
      'sunrise',
      'sunset',
      'moonrise',
      'moonset',
      'temperature_2m_max',
      'temperature_2m_min',
      'moon_phase',
      'weather_code',
      'precipitation_sum',
      'wind_speed_10m_max',
      'relative_humidity_2m_mean',
      'uv_index_max',
      'sunshine_duration',
      'daylight_duration',
      'precipitation_probability_max',
      'snowfall_sum',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation',
      'wind_speed_10m',
      'relative_humidity_2m',
      'weather_code',
      'is_day',
      'visibility',
      'precipitation_probability',
      'uv_index',
      'cape',
      'shortwave_radiation',
      'freezing_level_height',
    ].join(','),
    forecast_days: '16',
    timezone: 'auto',
  });

  let response;
  try {
    response = await fetch(`${FORECAST_URL}?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError('Network request failed while fetching weather data.', { type: 'network' });
  }

  if (!response.ok) {
    throw new ApiError(`Weather service responded with status ${response.status}.`, {
      type: 'http',
      status: response.status,
    });
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Weather response could not be parsed.', { type: 'parse' });
  }

  if (!data || typeof data !== 'object' || !data.current) {
    throw new ApiError('Weather response is missing required data.', { type: 'validation' });
  }

  return data;
}
