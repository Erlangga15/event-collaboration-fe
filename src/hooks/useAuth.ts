import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { authService } from '@/lib/auth';

import { AuthState, LoginRequest, UserDetails } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true
};

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const initialize = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        if (user) {
          setAuthState({
            user,
            accessToken: authService.getAccessToken(),
            refreshToken: null, // We don't expose refresh token to the state
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }

    setAuthState({
      ...initialState,
      isLoading: false
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      if (response && response.accessToken) {
        setAuthState({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false
        });

        // Ensure state is updated before navigation
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);

        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setAuthState({
        ...initialState,
        isLoading: false
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        ...initialState,
        isLoading: false
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (user: UserDetails) => {
    setAuthState((prev) => ({
      ...prev,
      user
    }));
  };

  return {
    ...authState,
    login,
    logout,
    updateUser
  };
};
