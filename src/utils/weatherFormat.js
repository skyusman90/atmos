const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

const COMPASS_POINTS_LONG = [
  'North', 'North-Northeast', 'Northeast', 'East-Northeast',
  'East', 'East-Southeast', 'Southeast', 'South-Southeast',
  'South', 'South-Southwest', 'Southwest', 'West-Southwest',
  'West', 'West-Northwest', 'Northwest', 'North-Northwest',
];

export function degreesToCompass(degrees) {
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_POINTS[index];
}

export function degreesToCompassLong(degrees) {
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_POINTS_LONG[index];
}

export function formatUpdatedTime(isoString, timeFormat = '12h') {
  const date = new Date(isoString);
  const minutes = date.getMinutes();

  if (timeFormat === '24h') {
    return `${date.getHours().toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  let hours = date.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatNumericDate(isoString, dateFormat) {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return dateFormat === 'dmy' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
}

export function formatShortDate(isoString, dateFormat = 'short') {
  if (dateFormat === 'dmy' || dateFormat === 'mdy') {
    return formatNumericDate(isoString, dateFormat);
  }

  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${day} ${month}`;
}

export function formatLocationDateTime(isoString, timeFormat = '12h', dateFormat = 'short') {
  const date = new Date(isoString);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const datePart = formatShortDate(isoString, dateFormat);
  return `${weekday}, ${datePart} · ${formatUpdatedTime(isoString, timeFormat)}`;
}

export function formatHourLabel(isoString, timeFormat = '12h') {
  const date = new Date(isoString);

  if (timeFormat === '24h') {
    return `${date.getHours().toString().padStart(2, '0')}:00`;
  }

  let hours = date.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours} ${period}`;
}
