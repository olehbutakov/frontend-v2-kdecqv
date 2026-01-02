import { useState } from 'react';
import { type AxiosError } from 'axios';
import type { Application, CreateApplication } from '../types';
import { api } from '../services/api';

export const useCreateApplication = () => {
  const [data, setData] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const createApplication = async (body: CreateApplication) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<Application>('/applications', body);
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

  return { createApplication, data, loading, error };
};
