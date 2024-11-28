import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { authService } from '@/lib/auth';
import { RegisterFormType } from '@/lib/validations/auth-schema';

import { AuthState, LoginRequest, UserDetails } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true
};

export const useAuth = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true
  });

  const initialize = useCallback(async () => {
    try {
      const isAuth = authService.isAuthenticated();
      if (!isAuth) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const user = authService.getUserFromCookie();
      if (!user) {
        authService.logout();
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      setState({
        user,
        isAuthenticated: true,
        tokens: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setState({
        user: response.user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        tokens: null,
        isAuthenticated: false
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false
      });
      router.push('/login');
    }
  };

  const register = async (data: RegisterFormType) => {
    try {
      const response = await authService.register(data);
      setState({
        user: response.user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      return response;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        tokens: null,
        isAuthenticated: false
      }));
      throw error;
    }
  };

  const updateUser = (user: UserDetails) => {
    setState((prev) => ({
      ...prev,
      user
    }));
  };

  return {
    ...state,
    login,
    logout,
    register,
    updateUser
  };
};
