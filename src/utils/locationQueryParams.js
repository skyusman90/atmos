import { isValidCoordinate } from './validation.js';

export function locationToParams(location) {
  if (!location) {
    return {};
  }

  const params = {
    lat: location.latitude.toFixed(4),
    lon: location.longitude.toFixed(4),
    name: location.name,
  };

  if (location.admin1) params.admin1 = location.admin1;
  if (location.country) params.country = location.country;
  if (location.id != null) params.id = String(location.id);

  return params;
}

export function paramsToLocation(searchParams) {
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));

  if (!isValidCoordinate(lat, lon)) {
    return null;
  }

  return {
    id: searchParams.get('id') || `${lat},${lon}`,
    name: searchParams.get('name') || 'Selected Location',
    admin1: searchParams.get('admin1') || '',
    country: searchParams.get('country') || '',
    latitude: lat,
    longitude: lon,
  };
}
