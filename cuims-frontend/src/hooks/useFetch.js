import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export function useFetch(url, dependencies = []) {
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(url);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(url);
        if(!active) return;
        setData(res.data);
        setError(null);
      } catch (err) {
        if(!active) return;
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        if(active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}
