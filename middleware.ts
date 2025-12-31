// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // إذا المستخدم محتاج يغير كلمة المرور
    if (
      token?.mustChangePassword &&
      pathname !== "/auth/change-password" &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL("/auth/change-password", req.url));
    }

    // حماية صفحة الـ Dashboard - للأدمن فقط
    if (pathname.startsWith("/dashboard") && token?.userType !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الزيارات - للأطباء فقط
    if (pathname.startsWith("/visits") && token?.userType !== "DOCTOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الحجوزات - للاستقبال والأدمن
    if (
      pathname.startsWith("/appointments") &&
      token?.userType !== "ADMIN" &&
      token?.roleName !== "Reception"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // حماية صفحات الفواتير - للمحاسبين والأدمن
    if (
      pathname.startsWith("/billing") &&
      token?.userType !== "ADMIN" &&
      token?.roleName !== "Accountant"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/visits/:path*",
    "/appointments/:path*",
    "/billing/:path*",
    "/patients/:path*",
  ],
};