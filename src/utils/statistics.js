export function findClosestHourIndex(times, currentTime) {
  if (!Array.isArray(times) || times.length === 0) {
    return -1;
  }

  const target = new Date(currentTime).getTime();
  let closestIndex = 0;
  let closestDiff = Infinity;

  times.forEach((time, index) => {
    const diff = Math.abs(new Date(time).getTime() - target);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex;
}

export function getPressureCategory(pressure) {
  if (pressure == null) return null;
  if (pressure < 1000) return 'Low';
  if (pressure > 1020) return 'High';
  return 'Normal';
}

export function getVisibilityCategory(meters) {
  if (meters == null) return null;
  if (meters < 1000) return 'Poor';
  if (meters < 4000) return 'Moderate';
  if (meters < 10000) return 'Good';
  return 'Excellent';
}

export function getUvCategory(uv) {
  if (uv == null) return null;
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

export function getBrightnessCategory(radiation) {
  if (radiation == null) return null;
  if (radiation < 200) return 'Low';
  if (radiation < 400) return 'Moderate';
  if (radiation < 600) return 'High';
  return 'Very High';
}

export function getThunderstormRisk(cape) {
  if (cape == null) return null;
  if (cape < 1000) return 'Low';
  if (cape < 2500) return 'Moderate';
  return 'High';
}

export function getDustCategory(dust) {
  if (dust == null) return null;
  if (dust < 50) return 'Low';
  if (dust < 150) return 'Moderate';
  return 'High';
}

export function formatDurationHours(seconds) {
  if (seconds == null) return null;
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function computeHeatIndex(tempC, humidity) {
  if (tempC == null || humidity == null) return null;

  const tempF = (tempC * 9) / 5 + 32;

  if (tempF < 80) {
    return tempC;
  }

  const t = tempF;
  const r = humidity;
  let hiF =
    -42.379 +
    2.04901523 * t +
    10.14333127 * r -
    0.22475541 * t * r -
    0.00683783 * t * t -
    0.05481717 * r * r +
    0.00122874 * t * t * r +
    0.00085282 * t * r * r -
    0.00000199 * t * t * r * r;

  return ((hiF - 32) * 5) / 9;
}

export function getWindCategory(kmh) {
  if (kmh == null) return null;
  if (kmh < 2) return 'Calm';
  if (kmh < 12) return 'Light Breeze';
  if (kmh < 20) return 'Gentle Breeze';
  if (kmh < 29) return 'Moderate Breeze';
  if (kmh < 39) return 'Fresh Breeze';
  if (kmh < 50) return 'Strong Breeze';
  if (kmh < 62) return 'Near Gale';
  return 'Gale';
}

export function getPm25Category(value) {
  if (value == null) return null;
  if (value <= 12) return 'Good';
  if (value <= 35.4) return 'Moderate';
  if (value <= 55.4) return 'Unhealthy for Sensitive Groups';
  if (value <= 150.4) return 'Unhealthy';
  if (value <= 250.4) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getPm10Category(value) {
  if (value == null) return null;
  if (value <= 54) return 'Good';
  if (value <= 154) return 'Moderate';
  if (value <= 254) return 'Unhealthy for Sensitive Groups';
  if (value <= 354) return 'Unhealthy';
  if (value <= 424) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getFreezingLevelCategory(meters) {
  if (meters == null) return null;
  if (meters < 1500) return 'Low altitude';
  if (meters < 3000) return 'Moderate altitude';
  return 'High altitude';
}

export function getCoCategory(value) {
  if (value == null) return null;
  if (value <= 4400) return 'Good';
  if (value <= 9400) return 'Moderate';
  if (value <= 12400) return 'Unhealthy for Sensitive Groups';
  if (value <= 15400) return 'Unhealthy';
  return 'Very Unhealthy';
}
