const STORAGE_KEY = 'atmos_search_history';
const MAX_HISTORY = 5;

export function getSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(location) {
  const existing = getSearchHistory().filter((item) => item.id !== location.id);
  const updated = [location, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
