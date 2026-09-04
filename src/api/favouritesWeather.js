import { ApiError } from '../utils/errors.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchFavouritesWeather(locations, { signal } = {}) {
  if (!locations.length) {
    return [];
  }

  const params = new URLSearchParams({
    latitude: locations.map((location) => location.latitude).join(','),
    longitude: locations.map((location) => location.longitude).join(','),
    current: ['temperature_2m', 'weather_code', 'is_day'].join(','),
    daily: ['sunrise', 'sunset'].join(','),
    forecast_days: '1',
    timezone: 'auto',
  });

  let response;
  try {
    response = await fetch(`${FORECAST_URL}?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError('Network request failed while fetching favourites weather.', { type: 'network' });
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
    throw new ApiError('Favourites weather response could not be parsed.', { type: 'parse' });
  }

  return Array.isArray(data) ? data : [data];
}
