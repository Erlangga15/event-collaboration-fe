import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { COOKIE_KEYS } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/register', '/', '/events'];
const PROTECTED_PATHS = ['/dashboard', '/events/create'];
const ROLE_PATHS = {
  ORGANIZER: ['/dashboard', '/events/create'],
  ADMIN: ['*']
};

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function hasRequiredRole(userRoles: string[], pathname: string) {
  if (userRoles.includes('ADMIN')) {
    return true;
  }
  for (const [role, paths] of Object.entries(ROLE_PATHS)) {
    if (
      paths.some((path) => pathname.startsWith(path)) &&
      userRoles.includes(role)
    ) {
      return true;
    }
  }
  return false;
}

function getRedirectUrl(request: NextRequest, path: string) {
  return new URL(path, request.url).toString();
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value;

  if (isPublicPath(pathname)) {
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(getRedirectUrl(request, '/dashboard'));
    }
    return NextResponse.next();
  }

  if (!token) {
    const searchParams = new URLSearchParams({
      callbackUrl: pathname
    });
    return NextResponse.redirect(
      getRedirectUrl(request, `/login?${searchParams}`)
    );
  }

  try {
    const decoded = jwtDecode<{ roles: string[] }>(token);
    const userRoles = decoded.roles;

    if (isProtectedPath(pathname) && !hasRequiredRole(userRoles, pathname)) {
      return NextResponse.redirect(getRedirectUrl(request, '/'));
    }

    return NextResponse.next();
  } catch {
    const searchParams = new URLSearchParams({
      error: 'Invalid token. Please login again.',
      callbackUrl: pathname
    });
    return NextResponse.redirect(
      getRedirectUrl(request, `/login?${searchParams}`)
    );
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
