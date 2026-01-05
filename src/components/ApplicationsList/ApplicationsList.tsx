import { Table, type Column } from '../common/Table/Table';
import { CustomButton } from '../common/CustomButton/CustomButton';
import { useI18n } from '../../i18n/I18nContext';
import { useNavigate } from 'react-router-dom';

export interface TableData {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  productName: string;
}

interface ApplicationTableProps {
  data: TableData[];
}

export const ApplicationsList = ({ data }: ApplicationTableProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleEditClick = (id: string) => {
    navigate(`/applications/${id}`);
  };
  const columns: Column<TableData>[] = [
    { key: 'firstName', header: t('applications.table.column.name.header') },
    { key: 'email', header: t('applications.table.column.email.header') },
    { key: 'phone', header: t('applications.table.column.phone.header') },
    {
      key: 'productName',
      header: t('applications.table.column.product.header'),
    },
    {
      key: 'id',
      header: '',
      render: (value) => (
        // One-liner style, don't think this deserves a whole CSS file
        <div style={{ textAlign: 'right' }}>
          <CustomButton onClick={() => handleEditClick(value)}>
            {t('applications.table.edit.button.text')}
          </CustomButton>
        </div>
      ),
    },
  ];

  return <Table data={data} columns={columns} />;
};
