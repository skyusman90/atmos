export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidCoordinate(latitude, longitude) {
  return (
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function isValidLocationResult(location) {
  return (
    Boolean(location) &&
    typeof location === 'object' &&
    typeof location.id !== 'undefined' &&
    typeof location.name === 'string' &&
    isValidCoordinate(location.latitude, location.longitude)
  );
}
