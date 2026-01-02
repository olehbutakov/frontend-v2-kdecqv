import { useMemo } from 'react';
import type { Application } from '../types';
import { useAxios } from './useAxios';

export const useGetApplication = (application_id: string) => {
  const config = useMemo(
    () => ({
      method: 'GET',
      url: `/applications/${application_id}`,
    }),
    [application_id]
  );

  return useAxios<Application>(config);
};
