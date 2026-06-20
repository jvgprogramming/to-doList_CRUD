import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/tasks'];
const authPaths = ['/auth/login', '/auth/register'];

// Old paths that have been moved — redirect to new locations
const oldPathRedirects: Record<string, string> = {
  '/login': '/auth/login',
  '/register': '/auth/register',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Redirect old paths to new locations
  if (oldPathRedirects[pathname]) {
    return NextResponse.redirect(new URL(oldPathRedirects[pathname], request.url));
  }

  // Redirect authenticated users away from auth pages
  if (token && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - images (public images)
     * - public files (e.g. robots.txt)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|images/|robots.txt).*)',
  ],
};
