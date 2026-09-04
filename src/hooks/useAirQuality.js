import { useEffect, useState } from 'react';
import { fetchAirQuality } from '../api/airQuality.js';
import { getErrorMessage } from '../utils/errors.js';
import { isValidCoordinate } from '../utils/validation.js';

export function useAirQuality(latitude, longitude) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isValidCoordinate(latitude, longitude)) {
      return;
    }

    const controller = new AbortController();

    Promise.resolve().then(() => setStatus('loading'));

    fetchAirQuality(latitude, longitude, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus('success');
        setError(null);
      })
      .catch((err) => {
        const message = getErrorMessage(err);
        if (message === null) return;
        setStatus('error');
        setError(message);
      });

    return () => controller.abort();
  }, [latitude, longitude]);

  return { data, status, error };
}
