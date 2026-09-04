export function getSunProgress(currentTime, sunrise, sunset) {
  const now = new Date(currentTime).getTime();
  const start = new Date(sunrise).getTime();
  const end = new Date(sunset).getTime();

  if (!Number.isFinite(now) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 0;
  }

  const ratio = (now - start) / (end - start);
  return Math.min(1, Math.max(0, ratio));
}
