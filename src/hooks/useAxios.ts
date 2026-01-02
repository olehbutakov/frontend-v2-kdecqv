import { useState, useEffect } from 'react';
import { isCancel, type AxiosRequestConfig, AxiosError } from 'axios';
import { api } from '../services/api';

export const useAxios = <T>(config: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api({
          ...config,
          signal: controller.signal,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        if (!isCancel(err)) {
          setError(err as AxiosError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.method, config.url, config.params, config.data]);

  return { data, loading, error };
};
