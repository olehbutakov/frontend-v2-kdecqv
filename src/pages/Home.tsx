import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoLoader } from '../components/common/LogoLoader/LogoLoader';
import { ProductsList } from '../components/common/ProductsList/ProductsList';
import { useCreateApplication } from '../hooks/useCreateApplication';
import { useGetProducts } from '../hooks/useGetProducts';
import type { Product } from '../types';
import { useI18n } from '../i18n/I18nContext';

export const Home = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const {
    data: productsData,
    loading: productLoading,
    error: productError,
  } = useGetProducts();
  const { createApplication, error: createApplicationError } =
    useCreateApplication();

  const groupedProducts = productsData?.reduce<
    Record<Product['type'], Product[]>
  >(
    (acc, curr) => {
      const key = curr.type;

      if (!acc[key]) {
        acc[key] = [] as Product[];
      }

      acc[key].push(curr);

      return acc;
    },
    {} as Record<Product['type'], Product[]>
  );

  const handleProductSelect = async (productId: number) => {
    try {
      setLoadingProductId(productId);
      const newApplication = await createApplication({ productId });
      navigate(`/applications/${newApplication.id}`);
    } catch {
      setLoadingProductId(null);
      console.error(t('application.create.error.log'));
    }
  };

  return (
    <div className="page">
      <div className="container">
        {productLoading && <LogoLoader />}

        {!productLoading && productError && (
          <div className="error-banner">{t('general.error.message')}</div>
        )}
        {createApplicationError && (
          <div className="error-banner">
            {t('application.create.error.message')}
          </div>
        )}

        {!productLoading && !productError && groupedProducts && (
          <div className="section">
            {groupedProducts['FIXED'].length > 0 && (
              <ProductsList
                products={groupedProducts?.['FIXED']}
                productSelectHandler={handleProductSelect}
                loadingProductId={loadingProductId}
              />
            )}
            {groupedProducts['VARIABLE'].length > 0 && (
              <ProductsList
                products={groupedProducts?.['VARIABLE']}
                productSelectHandler={handleProductSelect}
                loadingProductId={loadingProductId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
