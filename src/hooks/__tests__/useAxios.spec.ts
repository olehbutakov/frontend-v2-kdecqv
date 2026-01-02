import { renderHook, waitFor } from '@testing-library/react';
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { api } from '../../services/api';
import { useAxios } from '../useAxios';
import { type Application } from '../../types';

jest.mock('../../services/api');
const mockedApi = api as jest.MockedFunction<typeof api>;

describe('useAxios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch application data successfully', async () => {
    const mockApplication: Application = {
      id: '123',
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
      productId: 42,
      createdAt: '2025-01-01T00:00:00Z',
    };

    mockedApi.mockResolvedValueOnce({
      data: mockApplication,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse);

    const { result } = renderHook(() =>
      useAxios<Application>({ method: 'GET', url: '/api/applications/123' })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockApplication);
    expect(result.current.error).toBe(null);
  });

  it('should fetch multiple applications successfully', async () => {
    const mockApplications: Application[] = [
      {
        id: '123',
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

    mockedApi.mockResolvedValueOnce({
      data: mockApplications,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse);

    const { result } = renderHook(() =>
      useAxios<Application[]>({ method: 'GET', url: '/api/applications' })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockApplications);
    expect(result.current.data).toHaveLength(2);
  });

  it('should handle errors when fetching application', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: 'Application not found' },
        statusText: 'Not Found',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      message: 'Request failed with status code 404',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
    };

    mockedApi.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useAxios<Application>({ method: 'GET', url: '/api/applications/invalid' })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.response?.status).toBe(404);
  });

  it('should not set error for cancelled requests', async () => {
    const cancelError = new Error('Request cancelled');

    // Mock axios.isCancel
    jest.spyOn(axios, 'isCancel').mockReturnValue(true);

    mockedApi.mockRejectedValueOnce(cancelError);

    const { result } = renderHook(() =>
      useAxios<Application>({ method: 'GET', url: '/api/applications/123' })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);

    jest.restoreAllMocks();
  });

  it('should clear previous error on successful request', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Server Error' },
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      message: 'Request failed',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
    };

    const mockApplication: Application = {
      id: '123',
      token: 'token-xyz',
      type: 'NEW',
      applicants: [],
      createdAt: '2025-01-01T00:00:00Z',
    };

    mockedApi.mockRejectedValueOnce(mockError);

    const { result, rerender } = renderHook(
      ({ url }) => useAxios<Application>({ method: 'GET', url }),
      { initialProps: { url: '/api/applications/123' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBe(null);

    mockedApi.mockResolvedValueOnce({
      data: mockApplication,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse);

    rerender({ url: '/api/applications/123?retry=1' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockApplication);
  });

  it('should handle POST request to create application', async () => {
    const newApplicationRequest = {
      productId: 12345,
    };

    const mockResponse: Application = {
      id: 'app-789',
      token: 'token-generated-xyz',
      type: 'NEW',
      applicants: [],
      productId: 12345,
      createdAt: '2025-01-03T00:00:00Z',
    };

    mockedApi.mockResolvedValueOnce({
      data: mockResponse,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    } as AxiosResponse);

    const { result } = renderHook(() =>
      useAxios<Application>({
        method: 'POST',
        url: '/api/applications',
        data: newApplicationRequest,
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data?.id).toBe('app-789');
    expect(result.current.data?.productId).toBe(12345);
  });
});
