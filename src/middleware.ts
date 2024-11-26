import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
  // Skip API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Handle public paths
  if (isPublicPath(pathname)) {
    // Redirect authenticated users from auth pages to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      const redirectUrl =
        request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected paths
  if (isProtectedPath(pathname)) {
    // Handle unauthenticated users
    if (!token) {
      const searchParams = new URLSearchParams({
        callbackUrl: pathname,
        error: 'Please log in to access this page'
      });
      return NextResponse.redirect(
        getRedirectUrl(request, `/login?${searchParams}`)
      );
    }

    try {
      // Decode and verify token
      const decoded = jwtDecode<{ roles: string[] }>(token);
      const userRoles = decoded.roles || [];

      // Handle unauthorized access
      if (!hasRequiredRole(userRoles, pathname)) {
        const searchParams = new URLSearchParams({
          error: 'You do not have permission to access this page'
        });
        return NextResponse.redirect(
          getRedirectUrl(request, `/unauthorized?${searchParams}`)
        );
      }
    } catch (error) {
      // Invalid token
      const searchParams = new URLSearchParams({
        callbackUrl: pathname,
        error: 'Your session has expired. Please log in again.'
      });
      return NextResponse.redirect(
        getRedirectUrl(request, `/login?${searchParams}`)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
