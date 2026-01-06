// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // حماية صفحات الزيارات - للأطباء فقط
    if (pathname.startsWith("/visits") && token?.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الحجوزات - للاستقبال والأدمن
    if (
      pathname.startsWith("/appointments") &&
      token?.role !== "ADMIN" &&
      token?.role !== "RECEPTIONIST"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الفواتير - للمحاسبين والأدمن
    if (
      pathname.startsWith("/billing") &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // السماح بالوصول للصفحات العامة (بدون تسجيل دخول)
        const publicPaths = ["/signin", "/auth/error"];
        if (publicPaths.includes(pathname) || pathname.startsWith("/api")) {
          return true;
        }
        
        // إذا لم يكن هناك token، سيتم توجيهه تلقائياً إلى /auth/signin
        // هذا يشمل الصفحة الرئيسية "/"
        return !!token;
      },
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};