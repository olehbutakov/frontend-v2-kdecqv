import { render, screen } from '@testing-library/react';
import { ProductsProvider, useProducts } from '../ProductContext';
import { useGetProducts } from '../../hooks/useGetProducts';
import type { Product } from '../../types';

jest.mock('../../hooks/useGetProducts');

const mockedUseGetProducts = useGetProducts as jest.Mock;

const TestComponent = () => {
  const { products, loading, error } = useProducts();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {products.map((p: Product) => (
        <p key={p.id}>{p.name}</p>
      ))}
    </div>
  );
};

describe('ProductContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockedUseGetProducts.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(
      <ProductsProvider>
        <TestComponent />
      </ProductsProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders products when data is available', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Value Flex Variable 1Y',
        family: 'VALUE_FLEX',
        type: 'VARIABLE',
        term: '1_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '0.25%',
        helocOption: 'HELOC_WITH',
        helocDelta: 10000,
        lenderName: 'Bank A',
        lenderType: 'Traditional',
        rateHold: '30_DAYS',
        rate: 4.5,
        ratePrimeVariance: 0.25,
        bestRate: 4.5,
        created: '2025-01-01T00:00:00Z',
        updated: '2025-01-05T00:00:00Z',
        isBest: true,
      },
      {
        id: 2,
        name: 'Standard Fixed 2Y',
        family: 'STANDARD',
        type: 'FIXED',
        term: '2_YEAR',
        insurable: false,
        insurance: 'CONVENTIONAL',
        prepaymentOption: 'ENHANCED',
        restrictionsOption: 'SOME_RESTRICTIONS',
        restrictions: 'Partial prepayment allowed',
        fixedPenaltySpread: '0.5%',
        helocOption: 'HELOC_WITHOUT',
        helocDelta: 0,
        lenderName: 'Bank B',
        lenderType: 'Credit Union',
        rateHold: '45_DAYS',
        rate: 5.0,
        ratePrimeVariance: 0.0,
        bestRate: 5.0,
        created: '2025-01-02T00:00:00Z',
        updated: '2025-01-05T00:00:00Z',
      },
      {
        id: 3,
        name: 'Value Flex Fixed 3Y',
        family: 'VALUE_FLEX',
        type: 'FIXED',
        term: '3_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'MORE_RESTRICTIONS',
        restrictions: 'No prepayment in first year',
        fixedPenaltySpread: '0.75%',
        helocOption: 'HELOC_WITH',
        helocDelta: 5000,
        lenderName: 'Bank C',
        lenderType: 'Traditional',
        rateHold: '60_DAYS',
        rate: 4.75,
        ratePrimeVariance: 0.1,
        bestRate: 4.75,
        created: '2025-01-03T00:00:00Z',
        updated: '2025-01-05T00:00:00Z',
      },
    ];
    mockedUseGetProducts.mockReturnValue({
      data: mockProducts,
      loading: false,
      error: null,
    });

    render(
      <ProductsProvider>
        <TestComponent />
      </ProductsProvider>
    );

    expect(screen.getByText('Value Flex Variable 1Y')).toBeInTheDocument();
    expect(screen.getByText('Standard Fixed 2Y')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockError = { message: 'Something went wrong' };

    mockedUseGetProducts.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
    });

    render(
      <ProductsProvider>
        <TestComponent />
      </ProductsProvider>
    );

    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  it('throws error if used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useProducts must be used within ProductsProvider'
    );

    spy.mockRestore();
  });
});
