import { cleanup, render, screen } from '@testing-library/react';
import { Applications } from '../Applications';
import { useProducts } from '../../../context/ProductContext';
import { useGetApplications } from '../../../hooks/useGetApplications';
import { useI18n } from '../../../i18n/I18nContext';
import type { Product } from '../../../types';
import type { ApplicationTableProps } from '../../../components/ApplicationsList/ApplicationsList';

jest.mock('../../../context/ProductContext');
jest.mock('../../../hooks/useGetApplications');
jest.mock('../../../i18n/I18nContext');
jest.mock('../../../components/common/LogoLoader/LogoLoader', () => ({
  LogoLoader: () => <div data-testid="logo-loader">Loading...</div>,
}));
jest.mock('../../../components/ApplicationsList/ApplicationsList', () => ({
  ApplicationsList: ({ data }: ApplicationTableProps) => (
    <div data-testid="applications-list">
      {data.map((app) => (
        <div key={app.id} data-testid={`application-${app.id}`}>
          {app.firstName} - {app.email} - {app.phone} - {app.productName}
        </div>
      ))}
    </div>
  ),
}));

describe('Applications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();

    (useI18n as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('shows loading while fetching applications', () => {
    (useGetApplications as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: true,
      error: null,
    });

    render(<Applications />);
    expect(screen.getByTestId('logo-loader')).toBeInTheDocument();
  });

  it('shows loading while fetching products', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: true,
      error: null,
    });

    render(<Applications />);
    expect(screen.getByTestId('logo-loader')).toBeInTheDocument();
  });

  it('shows error if applications failed to load', () => {
    (useGetApplications as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: new Error('Applications failed'),
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    });

    render(<Applications />);
    expect(screen.getByText('general.error.message')).toBeInTheDocument();
  });

  it('shows error if products failed to load', () => {
    (useGetApplications as jest.Mock).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: new Error('Products failed'),
    });

    render(<Applications />);
    expect(screen.getByText('general.error.message')).toBeInTheDocument();
  });

  it('renders ApplicationsList when data is loaded', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Fixed 1', type: 'FIXED' } as Product,
      { id: 2, name: 'Variable 1', type: 'VARIABLE' } as Product,
    ];

    const mockApplications = [
      {
        id: 'app1',
        productId: 1,
        applicants: [
          { firstName: 'John', email: 'john@example.com', phone: '123' },
        ],
      },
      {
        id: 'app2',
        productId: 2,
        applicants: [
          { firstName: 'Jane', email: 'jane@example.com', phone: '456' },
        ],
      },
    ];

    (useGetApplications as jest.Mock).mockReturnValue({
      data: mockApplications,
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });

    render(<Applications />);

    expect(screen.getByTestId('applications-list')).toBeInTheDocument();

    expect(screen.getByTestId('application-app1')).toHaveTextContent(
      'John - john@example.com - 123 - Fixed 1'
    );
    expect(screen.getByTestId('application-app2')).toHaveTextContent(
      'Jane - jane@example.com - 456 - Variable 1'
    );
  });

  it('filters out applications if product is missing', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Fixed 1', type: 'FIXED' } as Product,
    ];

    const mockApplications = [
      {
        id: 'app1',
        productId: 1,
        applicants: [
          { firstName: 'John', email: 'john@example.com', phone: '123' },
        ],
      },
      {
        id: 'app2',
        productId: 99,
        applicants: [
          { firstName: 'Jane', email: 'jane@example.com', phone: '456' },
        ],
      },
    ];

    (useGetApplications as jest.Mock).mockReturnValue({
      data: mockApplications,
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });

    render(<Applications />);

    expect(screen.queryByTestId('application-app2')).not.toBeInTheDocument();
    expect(screen.getByTestId('application-app1')).toBeInTheDocument();
  });

  it('filters out applications with empty applicant fields', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Fixed 1', type: 'FIXED' } as Product,
      { id: 2, name: 'Fixed 2', type: 'FIXED' } as Product,
    ];

    const mockApplications = [
      {
        id: 'app1',
        productId: 1,
        applicants: [
          { firstName: 'John', email: 'john@example.com', phone: '123' },
        ],
      },
      {
        id: 'app2',
        productId: 2,
        applicants: [{ firstName: '', email: '', phone: '' }],
      },
    ];

    (useGetApplications as jest.Mock).mockReturnValue({
      data: mockApplications,
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });

    render(<Applications />);

    expect(screen.queryByTestId('application-app2')).not.toBeInTheDocument();
    expect(screen.getByTestId('application-app1')).toBeInTheDocument();
  });
});
