export function convertWindSpeed(kmh, unit) {
  if (unit === 'mph') {
    return kmh * 0.621371;
  }
  if (unit === 'ms') {
    return kmh / 3.6;
  }
  return kmh;
}

export function getWindSpeedLabel(unit) {
  if (unit === 'mph') {
    return 'mph';
  }
  if (unit === 'ms') {
    return 'm/s';
  }
  return 'km/h';
}
