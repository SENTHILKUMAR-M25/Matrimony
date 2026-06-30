import { useState, useEffect } from 'react';
import API from '../api/axios';

let cached = null;
let fetching = false;
const listeners = new Set();

const fetchLanding = async () => {
  if (cached) return cached;
  if (fetching) return new Promise((r) => listeners.add(r));
  fetching = true;
  try {
    const { data } = await API.get('/landing');
    cached = data;
  } catch {
    cached = null;
  } finally {
    fetching = false;
    listeners.forEach((r) => r(cached));
    listeners.clear();
  }
  return cached;
};

const useLandingData = () => {
  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) { setData(cached); setLoading(false); return; }
    (async () => {
      const result = await fetchLanding();
      setData(result);
      setLoading(false);
    })();
  }, []);

  return { data, loading };
};

export default useLandingData;
