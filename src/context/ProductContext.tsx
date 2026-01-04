/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import { useGetProducts } from '../hooks/useGetProducts';
import { type Product } from '../types';
import type { AxiosError } from 'axios';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  error: AxiosError | null;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error } = useGetProducts();

  return (
    <ProductsContext.Provider value={{ products: data ?? [], loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }

  return context;
};
