import { type ReactNode, createContext, useContext } from 'react';

import { useAuth } from '@/hooks/use-auth';

import {
  type AuthState,
  type LoginRequest,
  type LoginResponse,
  type UserDetails
} from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<LoginResponse | undefined>;
  logout: () => Promise<void>;
  updateUser: (user: UserDetails) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

const LoadingSpinner = () => (
  <div className='flex min-h-screen items-center justify-center'>
    <div className='border-primary size-12 animate-spin rounded-full border-y-2' />
  </div>
);

export const AuthProvider = ({ children }: Readonly<AuthProviderProps>) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {auth.isLoading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
