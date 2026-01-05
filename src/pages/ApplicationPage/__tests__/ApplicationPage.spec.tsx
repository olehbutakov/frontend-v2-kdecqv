import { render, screen } from '@testing-library/react';
import { ApplicationPage } from '../ApplicationPage';
import { useProducts } from '../../../context/ProductContext';
import { useGetApplication } from '../../../hooks/useGetApplication';
import { useI18n } from '../../../i18n/I18nContext';
import { useParams } from 'react-router-dom';
import type { ProductCardProps } from '../../../components/common/ProductCard/ProductCard';
import type { ApplicationFormProps } from '../../../components/ApplicationForm/ApplicationForm';

jest.mock('../../../context/ProductContext');
jest.mock('../../../hooks/useGetApplication');
jest.mock('../../../i18n/I18nContext');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));
jest.mock('../../../components/common/ProductCard/ProductCard', () => ({
  ProductCard: ({ id, name, type, rate, disabled }: ProductCardProps) => (
    <div data-testid={`product-card-${id}`}>
      {name} - {type} - {rate} - {disabled ? 'disabled' : 'enabled'}
    </div>
  ),
}));
jest.mock('../../../components/ApplicationForm/ApplicationForm', () => ({
  ApplicationForm: ({ application }: ApplicationFormProps) => (
    <div data-testid="application-form">{application.id}</div>
  ),
}));
jest.mock('../../../components/common/LogoLoader/LogoLoader', () => ({
  LogoLoader: () => <div data-testid="logo-loader">Loading...</div>,
}));

describe('ApplicationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useI18n as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      formatNumber: (value: number) => `${(value * 100).toFixed(0)}%`,
    });

    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  });

  it('shows loading when fetching application and products', () => {
    (useGetApplication as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    });

    render(<ApplicationPage />);
    expect(screen.getByTestId('logo-loader')).toBeInTheDocument();
  });

  it('shows error if application or products failed to load', () => {
    (useGetApplication as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Error'),
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    });

    render(<ApplicationPage />);
    expect(screen.getByText('general.error.message')).toBeInTheDocument();
  });

  it('renders ProductCard and ApplicationForm when data is loaded', () => {
    const mockProduct = {
      id: 1,
      type: 'FIXED',
      name: 'Fixed Product',
      bestRate: 5,
    };
    const mockApplication = { id: 'abc123', productId: 1 };

    (useGetApplication as jest.Mock).mockReturnValue({
      data: mockApplication,
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [mockProduct],
      loading: false,
      error: null,
    });

    render(<ApplicationPage />);

    expect(screen.getByTestId('product-card-1')).toHaveTextContent(
      'Fixed Product - product.card.type.fixed - 5% - disabled'
    );

    expect(screen.getByTestId('application-form')).toHaveTextContent('abc123');
  });

  it('does not render ProductCard if product not found', () => {
    const mockApplication = { id: 'abc123', productId: 99 };
    (useGetApplication as jest.Mock).mockReturnValue({
      data: mockApplication,
      loading: false,
      error: null,
    });
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    });

    render(<ApplicationPage />);
    expect(screen.queryByTestId('product-card-99')).not.toBeInTheDocument();
    expect(screen.queryByTestId('application-form')).not.toBeInTheDocument();
  });
});
