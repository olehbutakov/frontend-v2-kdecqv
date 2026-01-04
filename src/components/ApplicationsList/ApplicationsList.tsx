import { useMemo } from 'react';
import { Table, type Column } from '../common/Table/Table';
import { CustomButton } from '../common/CustomButton/CustomButton';
import { useI18n } from '../../i18n/I18nContext';
import { useNavigate } from 'react-router-dom';
import { useGetApplications } from '../../hooks/useGetApplications';
import { useProducts } from '../../context/ProductContext';

interface TableData {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  productName: string;
}

export const ApplicationsList = () => {
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
  const columns: Column<TableData>[] = [
    { key: 'firstName', header: 'First name', width: '230px' },
    { key: 'email', header: 'Email', width: '230px' },
    { key: 'phone', header: 'Phone', width: '230px' },
    { key: 'productName', header: 'Product', width: '230px' },
    {
      key: 'id',
      header: '',
      width: '230px',
      render: (value) => (
        <div style={{ textAlign: 'center' }}>
          <CustomButton onClick={() => handleEditClick(value)}>
            Edit
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    filteredTableData && <Table data={filteredTableData} columns={columns} />
  );
};
