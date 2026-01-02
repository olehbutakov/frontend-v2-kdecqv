import { useState } from 'react';
import { type AxiosError } from 'axios';
import type { Application } from '../types';
import { api } from '../services/api';

export const useUpdateApplication = () => {
  const [data, setData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateApplication = async (
    application_id: string,
    body: Partial<Application>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put<Application>(
        `/applications/${application_id}`,
        body
      );
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      throw axiosError;
    } finally {
      setLoading(false);
    }
  };

  return { updateApplication, data, loading, error };
};
