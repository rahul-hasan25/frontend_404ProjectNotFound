import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  if (!token && (pathname.startsWith('/tasks') || pathname.startsWith('/annotate'))) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  if (!token && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/tasks/:path*', '/annotate/:path*'],
};