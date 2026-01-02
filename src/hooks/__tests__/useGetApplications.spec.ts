import { renderHook, waitFor } from '@testing-library/react';
import { useAxios } from '../useAxios';
import { useGetApplications } from '../useGetApplications';
import type { Application } from '../../types';

// Mock the useAxios hook
jest.mock('../useAxios');

describe('useGetApplications', () => {
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
    renderHook(() => useGetApplications());
    expect(mockUseAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/applications',
    });
  });

  it('should return loading state initially', () => {
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    const { result } = renderHook(() => useGetApplications());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should return data when request is successful', async () => {
    const mockApplications: Application[] = [
      {
        id: 'app-123',
        token: 'token-xyz',
        type: 'NEW',
        applicants: [
          {
            phone: '+1234567890',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        ],
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'app-456',
        token: 'token-abc',
        type: 'RENEWAL',
        applicants: [
          {
            phone: '+0987654321',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        ],
        productId: 99,
        createdAt: '2025-01-02T00:00:00Z',
      },
    ];

    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: mockApplications,
      loading: false,
      error: null,
    });
    const { result } = renderHook(() => useGetApplications());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockApplications);
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
    const { result } = renderHook(() => useGetApplications());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });
});
