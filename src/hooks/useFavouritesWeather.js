import { useEffect, useState } from 'react';
import { fetchFavouritesWeather } from '../api/favouritesWeather.js';
import { getErrorMessage } from '../utils/errors.js';

export function useFavouritesWeather(favourites) {
  const [data, setData] = useState({});
  const [status, setStatus] = useState('idle');

  const key = favourites.map((favourite) => favourite.id).join(',');

  useEffect(() => {
    if (favourites.length === 0) {
      Promise.resolve().then(() => {
        setData({});
        setStatus('idle');
      });
      return;
    }

    const controller = new AbortController();

    Promise.resolve().then(() => setStatus('loading'));

    fetchFavouritesWeather(favourites, { signal: controller.signal })
      .then((results) => {
        const map = {};
        results.forEach((result, index) => {
          const favourite = favourites[index];
          if (favourite) {
            map[favourite.id] = result;
          }
        });
        setData(map);
        setStatus('success');
      })
      .catch((err) => {
        const message = getErrorMessage(err);
        if (message === null) return;
        setStatus('error');
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, status };
}
