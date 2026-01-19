import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { redirect } from 'next/navigation';
import ReportsClient from './ReportsClient';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  // التحقق من الصلاحيات - للإدارة فقط
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <main className='container mx-auto p-6 min-h-screen bg-gray-50' dir='rtl'>
      <ReportsClient />
    </main>
  );
}

