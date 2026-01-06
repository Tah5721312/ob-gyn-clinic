'use client';

import { SessionProvider as NextAuthSessionProvider, useSession, signOut } from 'next-auth/react';
import { ReactNode, useEffect, useRef } from 'react';

// مكون للتعامل مع الخروج التلقائي عند عدم النشاط
function InactivityHandler({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 دقيقة

  useEffect(() => {
    if (!session?.user) return;

    // إعادة تعيين المؤقت عند أي نشاط
    const handleActivity = () => {
      // حذف المؤقت السابق
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      // تعيين مؤقت جديد
      inactivityTimer.current = setTimeout(async () => {
        // تسجيل الخروج التلقائي
        await signOut({
          callbackUrl: '/auth/signin',
          redirect: true,
        });
      }, INACTIVITY_TIMEOUT);
    };

    // الأحداث التي تشير إلى نشاط المستخدم
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // إضافة المستمعين
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // تعيين المؤقت الأولي
    handleActivity();

    // التنظيف
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [session?.user]);

  return <>{children}</>;
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <InactivityHandler>{children}</InactivityHandler>
    </NextAuthSessionProvider>
  );
}

