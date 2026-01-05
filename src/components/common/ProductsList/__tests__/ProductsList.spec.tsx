import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductsList } from '../ProductsList';
import type { ProductCardProps } from '../../ProductCard/ProductCard';
import type { Product } from '../../../../types';

const formatNumberMock = jest.fn((value) => `${value * 100}%`);

jest.mock('../../../../i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (key === 'product.card.type.best') return `best ${params?.type}`;
      if (key === 'product.card.type.variable') return 'variable';
      if (key === 'product.card.type.fixed') return 'fixed';
      return key;
    },
    formatNumber: formatNumberMock,
  }),
}));

const selectHandlerMock = jest.fn();

jest.mock('../../ProductCard/ProductCard', () => ({
  ProductCard: (props: ProductCardProps) => {
    const {
      id,
      selectHandler,
      disabled = false,
      isLoading = false,
      type,
      name,
      rate,
    } = props;

    return (
      <div data-testid={`product-${id}`}>
        <span>{type}</span>
        <span>{name}</span>
        <span>{rate}</span>
        <button
          onClick={() => selectHandler && selectHandler(id)}
          disabled={disabled}
          data-loading={isLoading ? 'true' : 'false'}
        >
          Select
        </button>
      </div>
    );
  },
}));

const products: Product[] = [
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

describe('ProductsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all products', () => {
    render(<ProductsList products={products} />);

    products.forEach((prod) => {
      expect(screen.getByText(prod.name)).toBeInTheDocument();
    });
  });

  it('highlights the product with the best rate', () => {
    render(<ProductsList products={products} />);

    const bestProduct = products.reduce(
      (prev, curr) => (curr.bestRate < prev.bestRate ? curr : prev),
      products[0]
    );

    const bestTypeText = `best ${bestProduct.type.toLowerCase()}`;
    expect(
      screen.getByText((content) => content.includes(bestTypeText))
    ).toBeInTheDocument();
  });

  it('calls productSelectHandler when product select button is clicked', () => {
    render(
      <ProductsList
        products={products}
        productSelectHandler={selectHandlerMock}
        loadingProductId={null}
      />
    );

    const button = screen.getByTestId('product-1').querySelector('button')!;
    fireEvent.click(button);

    expect(selectHandlerMock).toHaveBeenCalledTimes(1);
    expect(selectHandlerMock).toHaveBeenCalledWith(1);
  });

  it('disables all products when one is loading', () => {
    const loadingProductId = 2;

    render(
      <ProductsList
        products={products}
        productSelectHandler={selectHandlerMock}
        loadingProductId={loadingProductId}
      />
    );

    products.forEach((prod) => {
      const button = screen
        .getByTestId(`product-${prod.id}`)
        .querySelector('button')!;

      expect(button).toBeDisabled();

      expect(button).toHaveAttribute(
        'data-loading',
        prod.id === loadingProductId ? 'true' : 'false'
      );
    });
  });

  it('formats rate using formatNumber', () => {
    render(<ProductsList products={products} />);

    products.forEach((prod) => {
      expect(screen.getByText(`${prod.bestRate}%`)).toBeInTheDocument();
    });
  });
});
