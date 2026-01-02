import { renderHook, act, waitFor } from '@testing-library/react';
import { api } from '../../services/api';
import { useUpdateApplication } from '../useUpdateApplication';
import type { Application } from '../../types';

jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('useUpdateApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUpdateApplication());

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.updateApplication).toBe('function');
  });

  it('should update applicants', async () => {
    const applicationId = 'app-789';
    const updateBody: Partial<Application> = {
      applicants: [
        {
          phone: '111-222-3333',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      ],
    };

    const mockResponse: Application = {
      id: 'app-789',
      token: 'token-def',
      type: 'REFINANCE',
      applicants: [
        {
          phone: '111-222-3333',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      ],
      createdAt: '2025-01-03T00:00:00Z',
    };

    mockedApi.put.mockResolvedValueOnce({
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    const { result } = renderHook(() => useUpdateApplication());

    await act(async () => {
      await result.current.updateApplication(applicationId, updateBody);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data?.applicants).toHaveLength(1);
    expect(result.current.data?.applicants[0].email).toBe('jane@example.com');
  });

  it('should handle error when update fails', async () => {
    const applicationId = 'app-123';
    const updateBody: Partial<Application> = {
      productId: 12312,
    };

    const mockError = {
      response: {
        status: 404,
        data: { message: 'Application not found' },
        statusText: 'Not Found',
        headers: {},
        config: {},
      },
      message: 'Request failed with status code 404',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      config: {},
    };

    mockedApi.put.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateApplication());

    await act(async () => {
      try {
        await result.current.updateApplication(applicationId, updateBody);
      } catch {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.response?.status).toBe(404);
  });

  it('should throw error when update fails', async () => {
    const applicationId = 'app-123';
    const updateBody: Partial<Application> = {
      productId: 12312,
    };

    const mockError = {
      response: {
        status: 400,
        data: { message: 'Invalid data' },
        statusText: 'Bad Request',
        headers: {},
        config: {},
      },
      message: 'Request failed',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      config: {},
    };

    mockedApi.put.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateApplication());

    await expect(
      act(async () => {
        await result.current.updateApplication(applicationId, updateBody);
      })
    ).rejects.toEqual(mockError);
  });

  it('should set loading to false even when request fails', async () => {
    const applicationId = 'app-123';
    const updateBody: Partial<Application> = {
      productId: 12312,
    };

    const mockError = {
      message: 'Network error',
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      config: {},
    };

    mockedApi.put.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateApplication());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      try {
        await result.current.updateApplication(applicationId, updateBody);
      } catch {
        // Expected
      }
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle multiple consecutive updates', async () => {
    const applicationId = 'app-123';
    const updateBody1: Partial<Application> = { productId: 100 };
    const updateBody2: Partial<Application> = { productId: 200 };

    const mockResponse1: Application = {
      id: 'app-123',
      token: 'token-1',
      type: 'NEW',
      applicants: [],
      productId: 100,
      createdAt: '2025-01-03T00:00:00Z',
    };

    const mockResponse2: Application = {
      id: 'app-123',
      token: 'token-2',
      type: 'NEW',
      applicants: [],
      productId: 200,
      createdAt: '2025-01-03T00:00:00Z',
    };

    mockedApi.put
      .mockResolvedValueOnce({
        data: mockResponse1,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })
      .mockResolvedValueOnce({
        data: mockResponse2,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

    const { result } = renderHook(() => useUpdateApplication());

    await act(async () => {
      await result.current.updateApplication(applicationId, updateBody1);
    });

    expect(result.current.data?.productId).toBe(100);

    await act(async () => {
      await result.current.updateApplication(applicationId, updateBody2);
    });

    expect(result.current.data?.productId).toBe(200);
    expect(mockedApi.put).toHaveBeenCalledTimes(2);
  });
});
