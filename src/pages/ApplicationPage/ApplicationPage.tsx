import { useParams } from 'react-router-dom';
import { ProductCard } from '../../components/common/ProductCard/ProductCard';
import { useProducts } from '../../context/ProductContext';
import { useGetApplication } from '../../hooks/useGetApplication';
import { useI18n } from '../../i18n/I18nContext';
import { ApplicationForm } from '../../components/ApplicationForm/ApplicationForm';
import type { TranslationKey } from '../../i18n/types';
import { LogoLoader } from '../../components/common/LogoLoader/LogoLoader';

export const ApplicationPage = () => {
  const { id } = useParams();
  const { t, formatNumber } = useI18n();
  const {
    data: applicationData,
    loading: applicationLoading,
    error: applicationError,
  } = useGetApplication(id || '');
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const applicationProduct = products.find(
    (prod) => prod.id === applicationData?.productId
  );

  const isLoading = applicationLoading || productsLoading;
  const isError = applicationError || productsError;

  return (
    <div className="page">
      <div className="container">
        {isLoading && <LogoLoader />}

        {!isLoading && isError && (
          <div className="error-banner">{t('general.error.message')}</div>
        )}

        {!isLoading && !isError && applicationProduct && applicationData && (
          <div className="grid">
            <ProductCard
              id={applicationProduct.id}
              type={t(
                `product.card.type.${applicationProduct.type.toLowerCase()}` as TranslationKey
              )}
              name={applicationProduct.name}
              rate={formatNumber(applicationProduct.bestRate / 100, {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
              disabled
            />
            <ApplicationForm application={applicationData} />
          </div>
        )}
      </div>
    </div>
  );
};
