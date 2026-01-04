import { useMemo } from 'react';
import { CustomButton } from '../../components/common/CustomButton/CustomButton';
import { LogoLoader } from '../../components/common/LogoLoader/LogoLoader';
import { useProducts } from '../../context/ProductContext';
import { useGetApplications } from '../../hooks/useGetApplications';
import { useI18n } from '../../i18n/I18nContext';
import { useNavigate } from 'react-router-dom';

interface TableData {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  productName: string;
}

export const Applications = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
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

  const handleEditClick = (id: string) => {
    navigate(`/applications/${id}`);
  };

  return (
    <div className="page">
      <div className="container">
        {isLoading && <LogoLoader />}

        {!isLoading && isError && (
          <div className="error-banner">{t('general.error.message')}</div>
        )}

        {!isLoading && !isError && filteredTableData && (
          <div style={{ display: 'grid', border: '1px solid #000' }}>
            {filteredTableData.map((item) => {
              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                    alignContent: 'center',
                    borderBottom: '1px solid #000',
                    verticalAlign: 'center',
                  }}
                >
                  <div>{item.firstName}</div>
                  <div>{item.email}</div>
                  <div>{item.phone}</div>
                  <div>{item.productName}</div>
                  <div>
                    <CustomButton onClick={() => handleEditClick(item.id)}>
                      Edit
                    </CustomButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
