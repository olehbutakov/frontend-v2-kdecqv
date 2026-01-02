import type { Product } from '../types';
import { useAxios } from './useAxios';

export const useGetProducts = () => {
  return useAxios<Product[]>({
    method: 'GET',
    url: '/products',
  });
};
