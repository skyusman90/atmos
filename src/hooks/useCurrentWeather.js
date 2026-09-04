import { useEffect, useState } from 'react';
import { fetchCurrentWeather } from '../api/weather.js';
import { getErrorMessage } from '../utils/errors.js';
import { isValidCoordinate } from '../utils/validation.js';

const POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

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
    let cancelled = false;

    function load() {
      Promise.resolve().then(() => setStatus('loading'));

      fetchCurrentWeather(latitude, longitude, { signal: controller.signal })
        .then((result) => {
          if (cancelled) return;
          setData(result);
          setStatus('success');
          setError(null);
          setLastUpdated(new Date());
        })
        .catch((err) => {
          if (cancelled) return;
          const message = getErrorMessage(err);
          if (message === null) return;
          setStatus('error');
          setError(message);
        });
    }

    load();
    const intervalId = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [latitude, longitude, refreshToken]);

  function refresh() {
    setRefreshToken((token) => token + 1);
  }

  return { data, status, error, lastUpdated, refresh };
}
