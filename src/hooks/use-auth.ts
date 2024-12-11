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

const PROTECTED_PATHS = ['/dashboard', '/events/create'] as const;

const isProtectedPath = (pathname: string): boolean => {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
};

const hasAccess = (role: string, pathname: string): boolean => {
  if (!isProtectedPath(pathname)) return true;

  const roleWithoutPrefix = role.replace('ROLE_', '');

  if (pathname.startsWith('/dashboard')) return true;
  if (pathname.startsWith('/events/create'))
    return roleWithoutPrefix === 'ORGANIZER';

  return false;
};

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>(INITIAL_AUTH_STATE);
  const isAuthenticating = useRef(false);

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

  const initialize = useCallback(async () => {
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
    }
  }, [resetAuthState, updateAuthState]);

  const handlePathChange = useCallback(async () => {
    if (state.isLoading) return;

    const isAuth = authService.isAuthenticated();
    const user = authService.getUserFromCookie();

    if (isAuth && user && !state.isAuthenticated) {
      updateAuthState({
        user,
        isAuthenticated: true,
        tokens: null,
        isLoading: false
      });
      return;
    }

    const isAuthPath = pathname === '/login' || pathname === '/register';
    if (isAuthPath && state.isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    if (isProtectedPath(pathname) && !state.isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (state.isAuthenticated && state.user) {
      const hasPermission = hasAccess(state.user.role, pathname);
      if (!hasPermission && pathname !== '/dashboard') {
        router.replace('/dashboard');
      }
    }
  }, [
    pathname,
    state.isAuthenticated,
    state.isLoading,
    state.user,
    router,
    updateAuthState
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    handlePathChange();
  }, [handlePathChange, pathname]);

  const login = async (credentials: LoginRequest) => {
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;

    try {
      const response = await authService.login(credentials);
      const user = authService.getUserFromCookie();

      if (!user) {
        throw new Error('User data not found after login');
      }

      updateAuthState({
        user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false
      });

      router.push('/dashboard');
      return response;
    } catch (error) {
      updateAuthState({ isLoading: false });
      throw error;
    } finally {
      isAuthenticating.current = false;
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      resetAuthState(false);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      resetAuthState(false);
      router.replace('/login');
    }
  }, [resetAuthState, router]);

  const register = async (data: RegisterFormType) => {
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;

    try {
      const response = await authService.register(data);
      const user = authService.getUserFromCookie();

      if (!user) {
        throw new Error('User data not found after registration');
      }

      updateAuthState({
        user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false
      });

      router.push('/dashboard');
      return response;
    } catch (error) {
      updateAuthState({ isLoading: false });
      throw error;
    } finally {
      isAuthenticating.current = false;
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
