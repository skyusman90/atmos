const STORAGE_KEY = 'atmos_favourites';

export function getFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavourites(favourites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
}

export function isFavourite(favourites, id) {
  return favourites.some((item) => item.id === id);
}

export function addFavourite(location) {
  const existing = getFavourites();
  if (isFavourite(existing, location.id)) {
    return existing;
  }
  const updated = [...existing, location];
  saveFavourites(updated);
  return updated;
}

export function removeFavourite(id) {
  const updated = getFavourites().filter((item) => item.id !== id);
  saveFavourites(updated);
  return updated;
}

export function clearFavourites() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
