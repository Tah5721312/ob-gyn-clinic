// middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 1. استثناء الصفحات العامة والـ API (تتطابق مع منطق authorized السابق)
    const publicPaths = ['/signin', '/auth/error'];
    if (publicPaths.includes(pathname) || pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    // 2. التحقق من المصادقة (Auth Check)
    // إذا لم يكن هناك token، توجيه لصفحة الدخول بدون callbackUrl
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // 3. التحقق من الصلاحيات (Role Based Access Control)
    const roleAccess: Record<string, string[]> = {
      '/users': ['ADMIN'],
      '/financial': ['ADMIN'],
      '/payments': ['ADMIN'],
      '/billing': ['ADMIN', 'RECEPTIONIST'],
      '/billing/[id]': ['ADMIN', 'RECEPTIONIST'],
      '/visits': ['DOCTOR', 'ADMIN', 'RECEPTIONIST'],
      '/visits/new': ['DOCTOR'],
      '/patients': ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
      '/prescriptions': ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
      '/appointments': ['ADMIN', 'RECEPTIONIST', 'DOCTOR'],
      '/schedules': ['DOCTOR', 'RECEPTIONIST'],
      '/templates': ['DOCTOR'],
    };

    // التحقق من صلاحيات المسار
    for (const path in roleAccess) {
      if (pathname.startsWith(path)) {
        if (!roleAccess[path].includes(token.role)) {
          return NextResponse.redirect(new URL('/', req.url));
        }
        break; // الخروج من الحلقة عند العثور على تطابق
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
