import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import {
  RegisterFormType,
  userRegisterSchema
} from '@/lib/validations/auth-schema';

import { API_URL } from '@/constant/url';

import {
  ApiResponse,
  ApiResponseData,
  AuthTokens,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  UserDetails
} from '@/types/auth';

export const COOKIE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
} as const;

export const COOKIE_OPTIONS = {
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
  expires: 7
} as const;

const createAuthError = (message: string, cause?: unknown): Error => {
  const error = new Error(message);
  error.name = 'AuthError';
  error.cause = cause;
  return error;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

let refreshTokenTimeout: NodeJS.Timeout | undefined;

const cookieManager = {
  setAuthTokens: (tokens: AuthTokens): void => {
    Cookies.set(COOKIE_KEYS.AUTH_TOKEN, tokens.accessToken, COOKIE_OPTIONS);
    Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS);
  },

  clearAuth: (): void => {
    Cookies.remove(COOKIE_KEYS.AUTH_TOKEN, { path: '/' });
    Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN, { path: '/' });
    Cookies.remove(COOKIE_KEYS.USER_DATA, { path: '/' });
  },

  getAccessToken: (): string | null =>
    Cookies.get(COOKIE_KEYS.AUTH_TOKEN) ?? null,

  getRefreshToken: (): string | null =>
    Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? null,

  setUser: (user: UserDetails): void => {
    Cookies.set(COOKIE_KEYS.USER_DATA, JSON.stringify(user), COOKIE_OPTIONS);
  },

  getUser: (): UserDetails | null => {
    const userCookie = Cookies.get(COOKIE_KEYS.USER_DATA);
    if (!userCookie) return null;
    try {
      return JSON.parse(userCookie);
    } catch {
      return null;
    }
  }
};

const tokenManager = {
  stopRefreshTimer: (): void => {
    if (refreshTokenTimeout) {
      clearTimeout(refreshTokenTimeout);
    }
  },

  startRefreshTimer: (token: string): void => {
    tokenManager.stopRefreshTimer();

    const decoded = jwtDecode<{ exp: number }>(token);
    const expires = new Date(decoded.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;

    refreshTokenTimeout = setTimeout(() => tokenManager.refresh(), timeout);
  },

  refresh: async (): Promise<void> => {
    try {
      const refreshToken = cookieManager.getRefreshToken();
      if (!refreshToken) {
        throw createAuthError('No refresh token available');
      }

      const { data: response } = await axiosInstance.post<
        ApiResponse<RefreshTokenResponse>
      >(
        String(API_URL.auth.refresh),
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw createAuthError('Invalid response from refresh token endpoint');
      }

      cookieManager.setAuthTokens(response.data.tokens);
      tokenManager.startRefreshTimer(response.data.tokens.accessToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        cookieManager.clearAuth();
      }
      throw error;
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
};

const transformLoginResponse = (data: ApiResponseData): LoginResponse => {
  const { accessToken, refreshToken, tokenType, ...userDetails } = data;
  return {
    tokens: { accessToken, refreshToken, tokenType },
    user: userDetails as UserDetails
  };
};

const setupInterceptors = (): void => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = cookieManager.getAccessToken();
      if (token && config.headers) {
        if (!tokenManager.isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    }
  );

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        !error.response?.status ||
        error.response.status !== 401 ||
        !originalRequest ||
        originalRequest._retry
      ) {
        throw error;
      }

      if (isRefreshing) {
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          const token = cookieManager.getAccessToken();
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await tokenManager.refresh();
        const token = cookieManager.getAccessToken();

        if (!token) {
          throw new Error('No token after refresh');
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          processQueue(null, token);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);

        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401
        ) {
          await authService.logout();
          throw createAuthError('Session expired. Please login again.');
        }

        throw refreshError;
      } finally {
        isRefreshing = false;
      }

      throw error;
    }
  );
};

setupInterceptors();

const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const { data: response } = await axiosInstance.post<ApiResponse>(
        String(API_URL.auth.login),
        credentials
      );

      if (!response.data) {
        throw createAuthError('Invalid login response');
      }

      const transformedResponse = transformLoginResponse(response.data);

      cookieManager.setAuthTokens(transformedResponse.tokens);
      cookieManager.setUser(transformedResponse.user);
      tokenManager.startRefreshTimer(transformedResponse.tokens.accessToken);

      return transformedResponse;
    } catch (error) {
      cookieManager.clearAuth();
      throw createAuthError(
        'Login failed. Please check your credentials.',
        error
      );
    }
  },

  async register(data: RegisterFormType): Promise<LoginResponse> {
    try {
      const requestData = {
        fullName: data.step1.fullName,
        email: data.step1.email,
        password: data.step1.password,
        phone: data.step2.phone,
        role: data.step2.role
      };

      const validatedData = userRegisterSchema.parse(requestData);
      const referralParam = data.step3.referralCode
        ? `?referralCode=${data.step3.referralCode}`
        : '';

      const { data: response } = await axiosInstance.post<ApiResponse>(
        `${String(API_URL.user.register)}${referralParam}`,
        validatedData
      );

      if (!response.data) {
        throw createAuthError('Invalid registration response');
      }

      const transformedResponse = transformLoginResponse(response.data);

      cookieManager.setAuthTokens(transformedResponse.tokens);
      cookieManager.setUser(transformedResponse.user);
      tokenManager.startRefreshTimer(transformedResponse.tokens.accessToken);

      return transformedResponse;
    } catch (error) {
      cookieManager.clearAuth();
      throw createAuthError('Registration failed. Please try again.', error);
    }
  },

  async logout(): Promise<void> {
    try {
      const accessToken = cookieManager.getAccessToken();
      const refreshToken = cookieManager.getRefreshToken();

      if (accessToken && refreshToken) {
        await axiosInstance.post(String(API_URL.auth.logout), {
          accessToken,
          refreshToken
        });
      }
    } catch (error) {
      throw createAuthError('Logout failed', error);
    } finally {
      cookieManager.clearAuth();
      tokenManager.stopRefreshTimer();
    }
  },

  isAuthenticated(): boolean {
    const token = cookieManager.getAccessToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getAccessToken: cookieManager.getAccessToken,
  getUserFromCookie: cookieManager.getUser
};

export { authService, createAuthError };
