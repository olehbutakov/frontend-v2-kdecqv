import { useMemo } from 'react';
import { LogoLoader } from '../../components/common/LogoLoader/LogoLoader';
import { useProducts } from '../../context/ProductContext';
import { useGetApplications } from '../../hooks/useGetApplications';
import { useI18n } from '../../i18n/I18nContext';
import { ApplicationsList } from '../../components/ApplicationsList/ApplicationsList';

interface TableData {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  productName: string;
}

export const Applications = () => {
  const { t } = useI18n();
  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
  } = useGetApplications();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  const isLoading = applicationsLoading || productsLoading;
  const isError = applicationsError || productsError;

  // Had to do this because there's no endpoint to get individual product
  // and applications don't have product name
  const tableData = useMemo(() => {
    return applicationsData?.map((application) => {
      const applicationProduct = products.find(
        (prod) => prod.id === application.productId
      );
      const productName = applicationProduct?.name;
      const applicant = application.applicants[0];

      return {
        id: application.id,
        firstName: applicant.firstName,
        email: applicant.email,
        phone: applicant.phone,
        productName: productName || '',
      } as TableData;
    });
  }, [applicationsData, products]);

  const filteredTableData = tableData?.filter(
    (item) => !Object.values(item).includes('')
  );

  return (
    <div className="page">
      <div className="container">
        {isLoading && <LogoLoader />}

        {!isLoading && isError && (
          <div className="error-banner">{t('general.error.message')}</div>
        )}

        {!isLoading && !isError && filteredTableData && (
          <ApplicationsList data={filteredTableData} />
        )}
      </div>
    </div>
  );
};
