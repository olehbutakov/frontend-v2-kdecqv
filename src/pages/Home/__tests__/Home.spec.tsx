import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Home } from '../Home';
import { useProducts } from '../../../context/ProductContext';
import { useCreateApplication } from '../../../hooks/useCreateApplication';
import { useI18n } from '../../../i18n/I18nContext';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types';

jest.mock('../../../context/ProductContext');
jest.mock('../../../hooks/useCreateApplication');
jest.mock('../../../i18n/I18nContext');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../../../components/common/ProductsList/ProductsList', () => ({
  ProductsList: jest.fn(
    ({ products, productSelectHandler, loadingProductId }) => (
      <div data-testid="products-list">
        {products.map((p: Product) => (
          <button
            key={p.id}
            data-testid={`product-${p.id}`}
            onClick={() => productSelectHandler(p.id)}
            data-loading={loadingProductId === p.id ? 'true' : 'false'}
          >
            {p.name}
          </button>
        ))}
      </div>
    )
  ),
}));
jest.mock('../../../components/common/LogoLoader/LogoLoader', () => ({
  LogoLoader: () => <div data-testid="logo-loader">Loading...</div>,
}));

describe('Home', () => {
  const navigateMock = jest.fn();
  const createApplicationMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    (useI18n as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    (useCreateApplication as jest.Mock).mockReturnValue({
      createApplication: jest.fn().mockResolvedValue({ id: 123 }),
      error: null,
    });
  });

  it('shows loading while fetching products', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: true,
      error: null,
    });

    render(<Home />);
    expect(screen.getByTestId('logo-loader')).toBeInTheDocument();
  });

  it('shows error if products failed to load', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: new Error('Failed'),
    });

    render(<Home />);
    expect(screen.getByText('general.error.message')).toBeInTheDocument();
  });

  it('shows create application error banner if error occured', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    });
    (useCreateApplication as jest.Mock).mockReturnValue({
      createApplication: createApplicationMock,
      error: new Error('Create failed'),
    });

    render(<Home />);
    expect(
      screen.getByText('application.create.error.message')
    ).toBeInTheDocument();
  });

  it('renders ProductsList for grouped products', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        type: 'FIXED',
        name: 'Fixed 1',
        family: 'VALUE_FLEX',
        term: '1_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '0.25%',
        helocOption: 'HELOC_WITH',
        helocDelta: 1000,
        lenderName: 'Bank A',
        lenderType: 'Traditional',
        rateHold: '30_DAYS',
        rate: 4,
        ratePrimeVariance: 0.2,
        bestRate: 4,
        created: '',
        updated: '',
      },
      {
        id: 2,
        type: 'VARIABLE',
        name: 'Variable 1',
        family: 'STANDARD',
        term: '1_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '0.25%',
        helocOption: 'HELOC_WITH',
        helocDelta: 1000,
        lenderName: 'Bank B',
        lenderType: 'Traditional',
        rateHold: '30_DAYS',
        rate: 5,
        ratePrimeVariance: 0.3,
        bestRate: 5,
        created: '',
        updated: '',
      },
    ];

    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });

    render(<Home />);

    const productsLists = screen.getAllByTestId('products-list');
    expect(productsLists).toHaveLength(2);

    expect(screen.getByTestId('product-1')).toHaveTextContent('Fixed 1');
    expect(screen.getByTestId('product-2')).toHaveTextContent('Variable 1');
  });

  it('calls createApplication and navigates when product selected', async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        type: 'FIXED',
        name: 'Fixed 1',
        family: 'VALUE_FLEX',
        term: '1_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '0.25%',
        helocOption: 'HELOC_WITH',
        helocDelta: 1000,
        lenderName: 'Bank A',
        lenderType: 'Traditional',
        rateHold: '30_DAYS',
        rate: 4,
        ratePrimeVariance: 0.2,
        bestRate: 4,
        created: '',
        updated: '',
      },
    ];

    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    (useCreateApplication as jest.Mock).mockReturnValue({
      createApplication: createApplicationMock.mockResolvedValue({ id: 42 }),
      error: null,
    });

    render(<Home />);

    const button = screen.getByTestId('product-1');
    fireEvent.click(button);

    await waitFor(() => {
      expect(createApplicationMock).toHaveBeenCalledWith({ productId: 1 });
      expect(navigateMock).toHaveBeenCalledWith('/applications/42');
    });
  });

  it('resets loadingProductId if createApplication fails', async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        type: 'FIXED',
        name: 'Fixed 1',
        family: 'VALUE_FLEX',
        term: '1_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '0.25%',
        helocOption: 'HELOC_WITH',
        helocDelta: 1000,
        lenderName: 'Bank A',
        lenderType: 'Traditional',
        rateHold: '30_DAYS',
        rate: 4,
        ratePrimeVariance: 0.2,
        bestRate: 4,
        created: '',
        updated: '',
      },
    ];

    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
    (useCreateApplication as jest.Mock).mockReturnValue({
      createApplication: jest.fn().mockRejectedValue(new Error('Fail')),
      error: null,
    });

    render(<Home />);

    const button = screen.getByTestId('product-1');
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
