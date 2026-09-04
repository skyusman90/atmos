import { useEffect, useState } from 'react';
import { fetchCurrentWeather } from '../api/weather.js';
import { getErrorMessage } from '../utils/errors.js';
import { isValidCoordinate } from '../utils/validation.js';

export function useCurrentWeather(latitude, longitude) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!isValidCoordinate(latitude, longitude)) {
      return;
    }

    const controller = new AbortController();

    Promise.resolve().then(() => setStatus('loading'));

    fetchCurrentWeather(latitude, longitude, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus('success');
        setError(null);
        setLastUpdated(new Date());
      })
      .catch((err) => {
        const message = getErrorMessage(err);
        if (message === null) return;
        setStatus('error');
        setError(message);
      });

    return () => controller.abort();
  }, [latitude, longitude, refreshToken]);

  function refresh() {
    setRefreshToken((token) => token + 1);
  }

  return { data, status, error, lastUpdated, refresh };
}
