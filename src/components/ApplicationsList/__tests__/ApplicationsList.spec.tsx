import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ApplicationsList, type TableData } from '../ApplicationsList';
import type { TableProps } from '../../common/Table/Table';
import type { CustomButtonProps } from '../../common/CustomButton/CustomButton';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../common/Table/Table', () => ({
  Table: ({ data, columns }: TableProps<TableData>) => (
    <table data-testid="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock('../../common/CustomButton/CustomButton', () => ({
  CustomButton: ({ children, onClick }: CustomButtonProps) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const mockData: TableData[] = [
  {
    id: '123',
    firstName: 'John',
    email: 'john@test.com',
    phone: '123456789',
    productName: 'Loan',
  },
];

describe('ApplicationsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table', () => {
    render(<ApplicationsList data={mockData} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders application data', () => {
    render(<ApplicationsList data={mockData} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('Loan')).toBeInTheDocument();
  });

  it('navigates to application details when edit button is clicked', () => {
    render(<ApplicationsList data={mockData} />);

    const editButton = screen.getByText('applications.table.edit.button.text');

    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/applications/123');
  });
});
