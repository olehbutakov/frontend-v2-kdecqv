import { renderHook, waitFor } from '@testing-library/react';
import { useAxios } from '../useAxios';
import { useGetProducts } from '../useGetProducts';
import type { Product } from '../../types';

// Mock the useAxios hook
jest.mock('../useAxios');

describe('useGetProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call useAxios with correct parameters', () => {
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    renderHook(() => useGetProducts());
    expect(mockUseAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/products',
    });
  });

  it('should return loading state initially', () => {
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    const { result } = renderHook(() => useGetProducts());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should return data when request is successful', async () => {
    const mockData: Product[] = [
      {
        id: 123,
        name: 'Prod-123',
        family: 'STANDARD',
        type: 'FIXED',
        term: '5_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '',
        helocOption: 'HELOC_WITH',
        helocDelta: 456,
        lenderName: 'John Doe',
        lenderType: '',
        rateHold: '60_DAYS',
        rate: 789,
        ratePrimeVariance: 12345,
        bestRate: 567,
        created: '2025-01-03T00:00:00Z',
        updated: '2025-01-03T00:00:00Z',
      },
      {
        id: 321,
        name: 'Prod-321',
        family: 'STANDARD',
        type: 'FIXED',
        term: '3_YEAR',
        insurable: true,
        insurance: 'INSURED',
        prepaymentOption: 'STANDARD',
        restrictionsOption: 'NO_RESTRICTIONS',
        restrictions: '',
        fixedPenaltySpread: '',
        helocOption: 'HELOC_WITH',
        helocDelta: 654,
        lenderName: 'Jane Smith',
        lenderType: '',
        rateHold: '90_DAYS',
        rate: 987,
        ratePrimeVariance: 54321,
        bestRate: 765,
        created: '2025-02-03T00:00:00Z',
        updated: '2025-02-03T00:00:00Z',
      },
    ];
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    const { result } = renderHook(() => useGetProducts());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should return error when request fails', async () => {
    const mockError = {
      message: 'Network error',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
    };
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
    });
    const { result } = renderHook(() => useGetProducts());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });
});
