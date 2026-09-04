import { ApiError } from '../utils/errors.js';
import { isValidLocationResult } from '../utils/validation.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(query, { signal } = {}) {
  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'en',
    format: 'json',
  });

  let response;
  try {
    response = await fetch(`${GEOCODING_URL}?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError('Network request failed while searching locations.', { type: 'network' });
  }

  if (!response.ok) {
    throw new ApiError(`Geocoding service responded with status ${response.status}.`, {
      type: 'http',
      status: response.status,
    });
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Geocoding response could not be parsed.', { type: 'parse' });
  }

  const results = Array.isArray(data?.results) ? data.results : [];

  return results.filter(isValidLocationResult);
}
