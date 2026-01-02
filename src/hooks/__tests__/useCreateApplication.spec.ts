import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateApplication } from '../useCreateApplication';
import type { Application, CreateApplication } from '../../types';
import { api } from '../../services/api';

jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('useCreateApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCreateApplication());

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.createApplication).toBe('function');
  });

  it('should create application successfully', async () => {
    const requestBody: CreateApplication = {
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

    mockedApi.post.mockResolvedValueOnce({
      data: mockResponse,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    const { result } = renderHook(() => useCreateApplication());

    expect(result.current.loading).toBe(false);

    let returnedData: Application | undefined;

    await act(async () => {
      returnedData = await result.current.createApplication(requestBody);
    });

    // Check loading state was set during request
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
    expect(returnedData).toEqual(mockResponse);
    expect(mockedApi.post).toHaveBeenCalledTimes(1);
  });

  it('should handle error when creation fails', async () => {
    const requestBody: CreateApplication = {
      productId: 12345,
    };

    const mockError = {
      response: {
        status: 400,
        data: { message: 'Invalid product ID' },
        statusText: 'Bad Request',
        headers: {},
        config: {},
      },
      message: 'Request failed with status code 400',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      config: {},
    };

    mockedApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateApplication());

    await act(async () => {
      try {
        await result.current.createApplication(requestBody);
      } catch {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.response?.status).toBe(400);
    expect(result.current.error?.message).toBe(
      'Request failed with status code 400'
    );
  });

  it('should throw error when creation fails', async () => {
    const requestBody: CreateApplication = {
      productId: 12345,
    };

    const mockError = {
      response: {
        status: 500,
        data: { message: 'Server error' },
        statusText: 'Internal Server Error',
        headers: {},
        config: {},
      },
      message: 'Request failed',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      config: {},
    };

    mockedApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateApplication());

    await expect(
      act(async () => {
        await result.current.createApplication(requestBody);
      })
    ).rejects.toEqual(mockError);
  });

  it('should set loading to false even when request fails', async () => {
    const requestBody: CreateApplication = {
      productId: 12345,
    };

    const mockError = {
      message: 'Network error',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      config: {},
    };

    mockedApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateApplication());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      try {
        await result.current.createApplication(requestBody);
      } catch {
        // Expected
      }
    });

    // Loading should be false after error
    expect(result.current.loading).toBe(false);
  });
});
