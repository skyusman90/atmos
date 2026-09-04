import { ApiError } from '../utils/errors.js';

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchAirQuality(latitude, longitude, { signal } = {}) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: ['pm10', 'pm2_5', 'carbon_monoxide', 'carbon_dioxide', 'dust', 'us_aqi', 'european_aqi'].join(','),
    timezone: 'auto',
  });

  let response;
  try {
    response = await fetch(`${AIR_QUALITY_URL}?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError('Network request failed while fetching air quality data.', { type: 'network' });
  }

  if (!response.ok) {
    throw new ApiError(`Air quality service responded with status ${response.status}.`, {
      type: 'http',
      status: response.status,
    });
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Air quality response could not be parsed.', { type: 'parse' });
  }

  if (!data || typeof data !== 'object' || !data.current) {
    throw new ApiError('Air quality response is missing required data.', { type: 'validation' });
  }

  return data;
}
