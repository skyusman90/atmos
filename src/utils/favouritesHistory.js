const STORAGE_KEY = 'atmos_favourites_history';
const MAX_HISTORY = 10;

export function getFavouritesHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavouritesHistoryEntry(location, action) {
  const existing = getFavouritesHistory();
  const entry = {
    id: location.id,
    name: location.name,
    country: location.country,
    admin1: location.admin1,
    action,
    timestamp: new Date().toISOString(),
  };
  const updated = [entry, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearFavouritesHistory() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

export function formatRelativeTime(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
