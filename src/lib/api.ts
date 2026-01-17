import { DOMAIN } from './constants';

/**
 * دالة مساعدة لاستخدام DOMAIN تلقائياً في جميع طلبات fetch
 * @param url - الرابط (يمكن أن يكون نسبي مثل /api/vehicles أو كامل)
 * @param options - خيارات fetch العادية
 * @returns Promise<Response>
 */
export async function apiFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  // إذا كان الرابط يبدأ بـ http أو https، استخدمه كما هو
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return fetch(url, {
      ...options,
      credentials: 'include', // إرسال ملفات تعريف الارتباط (cookies)
    });
  }

  // في المتصفح (client-side): استخدم الروابط النسبية مباشرة
  // هذا يعمل بشكل أفضل مع Next.js و Vercel
  if (typeof window !== 'undefined') {
    // تأكد من أن الرابط يبدأ بـ /
    const relativeUrl = url.startsWith('/') ? url : `/${url}`;
    return fetch(relativeUrl, {
      ...options,
      credentials: 'include', // إرسال ملفات تعريف الارتباط (cookies) للجلسة
    });
  }

  // في الخادم (server-side): استخدم DOMAIN للروابط المطلقة
  const fullUrl = url.startsWith('/') 
    ? `${DOMAIN}${url}` 
    : `${DOMAIN}/${url}`;

  return fetch(fullUrl, {
    ...options,
    credentials: 'include',
  });
}

