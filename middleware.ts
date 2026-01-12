// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 1. استثناء الصفحات العامة والـ API (تتطابق مع منطق authorized السابق)
    const publicPaths = ["/signin", "/auth/error"];
    if (publicPaths.includes(pathname) || pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    // 2. التحقق من المصادقة (Auth Check)
    // إذا لم يكن هناك token، توجيه لصفحة الدخول بدون callbackUrl
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // 3. التحقق من الصلاحيات (Role Based Access Control)

    // حماية صفحات الزيارات - للأطباء فقط
    if (pathname.startsWith("/visits") && token?.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الحجوزات - للاستقبال والأدمن والطبيب
    if (
      pathname.startsWith("/appointments") &&
      token?.role !== "ADMIN" &&
      token?.role !== "RECEPTIONIST" &&
      token?.role !== "DOCTOR"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الفواتير والدفعات والمالية - للأدمن فقط
    if (
      (pathname.startsWith("/billing") ||
        pathname.startsWith("/payments") ||
        pathname.startsWith("/financial")) &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الجداول الزمنية - للطبيب والأدمن فقط
    if (
      pathname.startsWith("/schedules") &&
      token?.role !== "DOCTOR" &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات المستخدمين - للأدمن فقط
    if (
      pathname.startsWith("/users") &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // نترك التحكم الكامل للدالة middleware أعلاه
    },
  },

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