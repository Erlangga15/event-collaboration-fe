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

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_COOKIE_KEY = 'user_data';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

let refreshTokenTimeout: NodeJS.Timeout | undefined;

const setTokens = (tokens: AuthTokens) => {
  document.cookie = `${AUTH_TOKEN_KEY}=${tokens.accessToken}; path=/; max-age=3600; secure; samesite=strict`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${tokens.refreshToken}; path=/; max-age=86400; secure; samesite=strict`;
};

const clearTokens = () => {
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`));
  return cookie ? cookie.split('=')[1] : null;
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${REFRESH_TOKEN_KEY}=`));
  return cookie ? cookie.split('=')[1] : null;
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

    setTokens(response.data.tokens);
    startRefreshTokenTimer(response.data.tokens.accessToken);
  } catch (error) {
    clearTokens();
    throw error;
  }
};

const setUserCookie = (user: UserDetails) => {
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), {
    expires: 7, // 7 days
    secure: true,
    sameSite: 'strict'
  });
};

const getUserFromCookie = (): UserDetails | null => {
  const userCookie = Cookies.get(USER_COOKIE_KEY);
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
};

const clearUserCookie = () => {
  Cookies.remove(USER_COOKIE_KEY);
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
      setTokens(transformedResponse.tokens);
      setUserCookie(transformedResponse.user);
      startRefreshTokenTimer(transformedResponse.tokens.accessToken);
      return transformedResponse;
    }

    throw new Error('No data in response');
  } catch (error: any) {
    console.log('error', error);
    clearTokens();
    clearUserCookie();

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
    const token = getAccessToken();
    if (token) {
      await axiosInstance.post(String(API_URL.auth.logout), {
        accessToken: token
      });
    }
  } finally {
    clearTokens();
    clearUserCookie();
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
