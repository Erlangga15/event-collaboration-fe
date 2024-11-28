import { createContext, ReactNode, useContext } from 'react';

import { useAuth } from '@/hooks/use-auth';

import { AuthState, LoginRequest, UserDetails } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (user: UserDetails) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {auth.isLoading ? (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='border-primary size-12 animate-spin rounded-full border-y-2'></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
