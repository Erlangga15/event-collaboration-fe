import { RegisterFormType } from '@/lib/validations/auth-schema';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserDetails {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: UserDetails;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface AuthState {
  user: UserDetails | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface ApiResponse<T = ApiResponseData> {
  status: number;
  message: string;
  data: T;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<LoginResponse | undefined>;
  logout: () => Promise<void>;
  register: (data: RegisterFormType) => Promise<LoginResponse | undefined>;
  updateUser: (user: UserDetails) => void;
}
