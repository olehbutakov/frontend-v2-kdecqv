import { renderHook, waitFor } from '@testing-library/react';
import { useAxios } from '../useAxios';
import type { Application } from '../../types';
import { useGetApplication } from '../useGetApplication';

// Mock the useAxios hook
jest.mock('../useAxios');

describe('useGetApplication', () => {
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
    renderHook(() => useGetApplication(123));
    expect(mockUseAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/applications/123',
    });
  });

  it('should return loading state initially', () => {
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    const { result } = renderHook(() => useGetApplication(123));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should return data when request is successful', async () => {
    const mockApplication: Application = {
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
    };
    const mockUseAxios = useAxios as jest.MockedFunction<typeof useAxios>;
    mockUseAxios.mockReturnValue({
      data: mockApplication,
      loading: false,
      error: null,
    });
    const { result } = renderHook(() => useGetApplication(123));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockApplication);
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
    const { result } = renderHook(() => useGetApplication(1));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeNull();
  });
});
