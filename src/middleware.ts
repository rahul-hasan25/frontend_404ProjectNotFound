import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  let isTokenValid = false;

  if (token) {
    try {
      const verifyRes = await fetch(`${BACKEND_API_URL}/auth/token/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (verifyRes.ok) {
        isTokenValid = true;
      }
    } catch (err) {
      isTokenValid = false;
    }
  }


  if (!isTokenValid && (pathname.startsWith('/tasks') || pathname.startsWith('/annotate'))) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  if (isTokenValid && pathname === '/') {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  if (!token && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/tasks/:path*', '/annotate/:path*'],
};