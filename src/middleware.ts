import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { COOKIE_KEYS } from '@/lib/auth';

const ROUTES = {
  PUBLIC: ['/', '/login', '/register', '/events'] as const,
  PROTECTED: ['/dashboard', '/events/create'] as const,
  ROLES: {
    ORGANIZER: ['/dashboard', '/events/create'] as const,
    ADMIN: ['*'] as const
  }
} as const;

const matchesPath = (pathname: string, paths: readonly string[]): boolean =>
  paths.some((path) => pathname.startsWith(path));

const isPublicPath = (pathname: string): boolean =>
  matchesPath(pathname, ROUTES.PUBLIC);

const isProtectedPath = (pathname: string): boolean =>
  matchesPath(pathname, ROUTES.PROTECTED);

const hasRequiredRole = (userRoles: string[], pathname: string): boolean => {
  if (userRoles.includes('ADMIN')) return true;

  return Object.entries(ROUTES.ROLES).some(
    ([role, paths]) =>
      paths.some((path) => pathname.startsWith(path)) &&
      userRoles.includes(role)
  );
};

const createRedirectUrl = (request: NextRequest, path: string): string =>
  new URL(path, request.url).toString();

const createRedirect = (
  request: NextRequest,
  path: string,
  params?: Record<string, string>
): NextResponse => {
  const searchParams = params ? new URLSearchParams(params) : null;
  const redirectUrl = searchParams ? `${path}?${searchParams}` : path;
  return NextResponse.redirect(createRedirectUrl(request, redirectUrl));
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value;

  if (isPublicPath(pathname)) {
    const isAuthPath = pathname === '/login' || pathname === '/register';
    if (token && isAuthPath) {
      return createRedirect(request, '/dashboard');
    }
    return NextResponse.next();
  }

  if (!token) {
    return createRedirect(request, '/login', { callbackUrl: pathname });
  }

  try {
    const decoded = jwtDecode<{ roles: string[] }>(token);
    const userRoles = decoded.roles;

    if (isProtectedPath(pathname) && !hasRequiredRole(userRoles, pathname)) {
      return createRedirect(request, '/');
    }

    return NextResponse.next();
  } catch {
    return createRedirect(request, '/login', {
      error: 'Invalid token. Please login again.',
      callbackUrl: pathname
    });
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
} as const;
