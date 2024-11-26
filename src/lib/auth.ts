import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { jwtDecode } from 'jwt-decode';

import { API_URL } from '@/constant/url';

import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  UserDetails
} from '@/types/auth';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout?: NodeJS.Timeout;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupAxiosInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupAxiosInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.post<LoginResponse>(
        String(API_URL.auth.login),
        credentials
      );

      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid response from server');
      }

      this.setTokens(accessToken, refreshToken);
      this.startRefreshTokenTimer(accessToken);

      return response.data;
    } catch (error: any) {
      // Clear any existing tokens on login failure
      this.clearTokens();

      if (error.response?.data?.message) {
        throw error;
      }

      throw new Error(
        'Login failed. Please check your credentials and try again.'
      );
    }
  }

  public async logout(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (token) {
        await this.axiosInstance.post(String(API_URL.auth.logout), {
          accessToken: token
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
      this.stopRefreshTokenTimer();
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await this.axiosInstance.post<RefreshTokenResponse>(
        String(API_URL.auth.refresh),
        {},
        {
          headers: {
            Authorization: `Bearer ${this.getRefreshToken()}`
          }
        }
      );

      const { accessToken, refreshToken } = response.data;
      this.setTokens(accessToken, refreshToken);
      this.startRefreshTokenTimer(accessToken);
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private startRefreshTokenTimer(token: string) {
    this.stopRefreshTokenTimer();

    const decoded = jwtDecode<{ exp: number }>(token);
    const expires = new Date(decoded.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000; // Refresh 1 minute before expiry

    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private setTokens(accessToken: string, refreshToken: string) {
    // Set cookies with HttpOnly flag for better security
    document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=3600; secure; samesite=strict`;
    document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=86400; secure; samesite=strict`;
  }

  private clearTokens() {
    // Clear cookies
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`));
    return cookie ? cookie.split('=')[1] : null;
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${REFRESH_TOKEN_KEY}=`));
    return cookie ? cookie.split('=')[1] : null;
  }

  public isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  public async getCurrentUser(): Promise<UserDetails | null> {
    try {
      const response = await this.axiosInstance.get<UserDetails>(
        String(API_URL.auth.me)
      );
      return response.data;
    } catch {
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
