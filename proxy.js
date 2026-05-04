import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || 'digilib-secret-key-change-in-production' 
  });

  const { pathname } = request.nextUrl;

  // Protect /dashboard routes — only for role: "user"
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      loginUrl.searchParams.set('message', 'Please login to access your dashboard');
      return NextResponse.redirect(loginUrl);
    }
    if (token.role !== 'user') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Protect /admin routes — only for role: "admin"
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      loginUrl.searchParams.set('message', 'Please login to access admin panel');
      return NextResponse.redirect(loginUrl);
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect authenticated users away from login/register
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register']
};
