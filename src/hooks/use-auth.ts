import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { authService } from '@/lib/auth';
import { RegisterFormType } from '@/lib/validations/auth-schema';

import { AuthState, LoginRequest, UserDetails } from '@/types/auth';

const INITIAL_AUTH_STATE: Readonly<AuthState> = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true
} as const;

const PUBLIC_PATHS = ['/', '/events'] as const;
type PublicPath = (typeof PUBLIC_PATHS)[number];

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>(INITIAL_AUTH_STATE);
  const isInitialized = useRef(false);

  const setStateAsync = useCallback(
    (newState: AuthState): Promise<void> =>
      new Promise((resolve) => {
        setState((prevState) => ({
          ...prevState,
          ...newState,
          isLoading: newState.isLoading ?? prevState.isLoading
        }));
        queueMicrotask(resolve);
      }),
    []
  );

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      isLoading: updates.isLoading ?? prev.isLoading
    }));
  }, []);

  const resetAuthState = useCallback(
    (isLoading = false) => {
      updateAuthState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading
      });
    },
    [updateAuthState]
  );

  const handleAuthError = useCallback(
    (error: unknown, defaultMessage: string) => {
      resetAuthState(false);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(defaultMessage);
    },
    [resetAuthState]
  );

  const initialize = useCallback(async () => {
    if (isInitialized.current) return;

    try {
      const isAuth = authService.isAuthenticated();
      const user = authService.getUserFromCookie();

      if (!isAuth || !user) {
        await authService.logout();
        resetAuthState(false);
        return;
      }

      updateAuthState({
        user,
        isAuthenticated: true,
        tokens: null,
        isLoading: false
      });
    } catch {
      resetAuthState(false);
    } finally {
      isInitialized.current = true;
    }
  }, [resetAuthState, updateAuthState]);

  const handlePathChange = useCallback(async () => {
    if (state.isLoading) return;

    const isAuth = authService.isAuthenticated();
    const user = authService.getUserFromCookie();
    const isPublicPath = PUBLIC_PATHS.includes(pathname as PublicPath);

    if (isAuth && user && !state.isAuthenticated) {
      updateAuthState({
        user,
        isAuthenticated: true,
        tokens: null,
        isLoading: false
      });
      return;
    }

    if (state.isAuthenticated && !isPublicPath) {
      if (pathname !== '/dashboard') {
        router.push('/dashboard');
      }
    } else if (!state.isAuthenticated && pathname === '/dashboard') {
      router.push('/login');
    }
  }, [
    pathname,
    state.isAuthenticated,
    state.isLoading,
    router,
    updateAuthState
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    handlePathChange();
  }, [handlePathChange]);

  const login = async (credentials: LoginRequest) => {
    try {
      updateAuthState({ isLoading: true });
      const response = await authService.login(credentials);
      const user = authService.getUserFromCookie();

      if (!user) {
        throw new Error('User data not found after login');
      }

      await setStateAsync({
        user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false
      });

      return response;
    } catch (error) {
      handleAuthError(error, 'Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      updateAuthState({ isLoading: true });
      await authService.logout();
      resetAuthState(false);
    } catch {
      resetAuthState(false);
    } finally {
      router.push('/login');
    }
  };

  const register = async (data: RegisterFormType) => {
    try {
      updateAuthState({ isLoading: true });
      const response = await authService.register(data);
      const user = authService.getUserFromCookie();

      if (!user) {
        throw new Error('User data not found after registration');
      }

      await setStateAsync({
        user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false
      });

      if (pathname !== '/dashboard') {
        router.replace('/dashboard');
      }

      return response;
    } catch (error) {
      handleAuthError(error, 'Registration failed. Please try again.');
    }
  };

  const updateUser = useCallback(
    (user: UserDetails) => {
      updateAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    },
    [updateAuthState]
  );

  return {
    ...state,
    login,
    logout,
    register,
    updateUser
  };
};
