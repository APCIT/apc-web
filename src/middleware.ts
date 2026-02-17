import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that require a logged-in user (dashboard: My Account, Log Time, Work Schedule, To-Do List, Applicants, Interns, etc.) */
const PROTECTED_PREFIXES = [
  '/Applicants',
  '/Charts',
  '/Classes',
  '/Companies',
  '/Interns',
  '/Manage',
  '/PastInterns',
  '/Presentations',
  '/Services',
  '/Time',
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has('apc_session');
  if (hasSession) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const loginUrl = new URL('/Account/Login', request.url);
  loginUrl.searchParams.set('returnUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/Applicants/:path*',
    '/Charts/:path*',
    '/Classes/:path*',
    '/Companies/:path*',
    '/Interns/:path*',
    '/Manage/:path*',
    '/PastInterns/:path*',
    '/Presentations/:path*',
    '/Services/:path*',
    '/Time/:path*',
  ],
};
