import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ডাইনামিক এপিআই ইউআরএল
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // ১. ইউজার প্রটেক্টেড পেজে যাওয়ার চেষ্টা করছে কিন্তু টোকেন নেই
  if (!token && (pathname.startsWith('/tasks') || pathname.startsWith('/annotate'))) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  // ২. ইউজারের কাছে টোকেন অলরেডি আছে এবং সে লগইন পেজে (/) ফিরতে চাচ্ছে
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  // ৩. রুট পাথ (/) ছাড়া অন্য কোথাও টোকেন ছাড়া ভিজিট ঠেকানো
  if (!token && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/tasks/:path*', '/annotate/:path*'],
};