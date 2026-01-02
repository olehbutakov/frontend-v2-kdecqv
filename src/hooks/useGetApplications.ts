import type { Application } from '../types';
import { useAxios } from './useAxios';

export const useGetApplications = () => {
  return useAxios<Application[]>({
    method: 'GET',
    url: '/applications',
  });
};
