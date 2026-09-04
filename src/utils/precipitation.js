export function convertPrecipitation(mm, unit) {
  return unit === 'in' ? mm / 25.4 : mm;
}

export function getPrecipitationLabel(unit) {
  return unit === 'in' ? 'in' : 'mm';
}
