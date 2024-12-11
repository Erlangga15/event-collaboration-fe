import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { COOKIE_KEYS } from '@/lib/auth';

const PROTECTED_PATHS = ['/dashboard', '/events/create'] as const;

const IGNORED_PATHS = [
  '/_next',
  '/favicon',
  '/static',
  '/images',
  '.png',
  '.webp',
  '.ico',
  '.css',
  '.js',
  'manifest'
] as const;

const shouldLog = (pathname: string): boolean => {
  return !IGNORED_PATHS.some((path) => pathname.includes(path));
};

const isProtectedPath = (pathname: string): boolean => {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
};

interface DecodedToken {
  sub: string;
  exp: number;
  type: string;
  iat: number;
  userId: string;
  scope: string;
}

const extractRoleFromScope = (scope: string): string => {
  return scope.replace('ROLE_', '');
};

const hasRequiredRole = (scope: string, pathname: string): boolean => {
  if (!scope) return false;

  const role = extractRoleFromScope(scope);

  if (!isProtectedPath(pathname)) return true;

  if (pathname.startsWith('/dashboard')) return true;
  if (pathname.startsWith('/events/create')) return role === 'ORGANIZER';

  return false;
};

const createRedirect = (
  request: NextRequest,
  path: string,
  params?: Record<string, string>
): NextResponse => {
  const url = new URL(path, request.url);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return NextResponse.redirect(url);
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (!shouldLog(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

  if (!token) {
    return createRedirect(request, '/login', { callbackUrl: pathname });
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    if (decoded.exp * 1000 < Date.now() && refreshToken) {
      return NextResponse.next();
    }

    if (decoded.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }

    if (!decoded.scope || typeof decoded.scope !== 'string') {
      throw new Error('Invalid scope in token');
    }

    if (hasRequiredRole(decoded.scope, pathname)) {
      return NextResponse.next();
    }

    return createRedirect(request, '/dashboard');
  } catch (error) {
    if (refreshToken) {
      return NextResponse.next();
    }

    return createRedirect(request, '/login', {
      error: 'Invalid token. Please login again.',
      callbackUrl: pathname
    });
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/events/create']
} as const;
