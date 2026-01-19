import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { redirect } from 'next/navigation';
import InvoiceDetailClient from './InvoiceDetailClient';

export default async function InvoiceDetailPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  // التحقق من الصلاحيات - للإدارة والاستقبال
  const allowedRoles = ["ADMIN", "RECEPTIONIST"];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div className='min-h-screen bg-gray-50' dir='rtl'>
      <div className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6'>
        <InvoiceDetailClient />
      </div>
    </div>
  );
}
