import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import { API_URL } from '@/constant/url';

import {
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
  expires: 7 // 7 days
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

let refreshTokenTimeout: NodeJS.Timeout | undefined;

const setAuthTokens = (tokens: AuthTokens) => {
  Cookies.set(COOKIE_KEYS.AUTH_TOKEN, tokens.accessToken, COOKIE_OPTIONS);
  Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS);
};

const clearAuthCookies = () => {
  Cookies.remove(COOKIE_KEYS.AUTH_TOKEN, { path: '/' });
  Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN, { path: '/' });
  Cookies.remove(COOKIE_KEYS.USER_DATA, { path: '/' });
};

const getAccessToken = (): string | null => {
  return Cookies.get(COOKIE_KEYS.AUTH_TOKEN) || null;
};

const getRefreshToken = (): string | null => {
  return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) || null;
};

const stopRefreshTokenTimer = () => {
  if (refreshTokenTimeout) {
    clearTimeout(refreshTokenTimeout);
  }
};

const startRefreshTokenTimer = (token: string) => {
  stopRefreshTokenTimer();

  const decoded = jwtDecode<{ exp: number }>(token);
  const expires = new Date(decoded.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;

  refreshTokenTimeout = setTimeout(() => refreshToken(), timeout);
};

const refreshToken = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post<RefreshTokenResponse>(
      String(API_URL.auth.refresh),
      {},
      {
        headers: {
          Authorization: `Bearer ${getRefreshToken()}`
        }
      }
    );

    setAuthTokens(response.data.tokens);
    startRefreshTokenTimer(response.data.tokens.accessToken);
  } catch (error) {
    clearAuthCookies();
    throw error;
  }
};

const setUserCookie = (user: UserDetails) => {
  Cookies.set(COOKIE_KEYS.USER_DATA, JSON.stringify(user), COOKIE_OPTIONS);
};

const getUserFromCookie = (): UserDetails | null => {
  const userCookie = Cookies.get(COOKIE_KEYS.USER_DATA);
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
};

const setupAxiosInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          const token = getAccessToken();
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          await logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

setupAxiosInterceptors();

const transformLoginResponse = (data: any): LoginResponse => {
  const { accessToken, refreshToken, tokenType, ...userDetails } = data;

  return {
    tokens: {
      accessToken,
      refreshToken,
      tokenType
    },
    user: userDetails as UserDetails
  };
};

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<any>(
      String(API_URL.auth.login),
      credentials
    );

    if (response.data?.data) {
      console.log('response.data.data', response.data.data);
      const transformedResponse = transformLoginResponse(response.data.data);
      setAuthTokens(transformedResponse.tokens);
      setUserCookie(transformedResponse.user);
      startRefreshTokenTimer(transformedResponse.tokens.accessToken);
      return transformedResponse;
    }

    throw new Error('No data in response');
  } catch (error: any) {
    console.log('error', error);
    clearAuthCookies();

    if (error.response?.data?.message) {
      throw new Error(
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : error.response.data.message[0]
      );
    }

    throw new Error(
      'Login failed. Please check your credentials and try again.'
    );
  }
};

export const logout = async (): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken && refreshToken) {
      await axiosInstance.post(String(API_URL.auth.logout), {
        accessToken,
        refreshToken
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthCookies();
    stopRefreshTokenTimer();
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const authService = {
  login,
  logout,
  isAuthenticated,
  getAccessToken,
  getUserFromCookie
};
