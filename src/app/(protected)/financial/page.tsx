import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { redirect } from 'next/navigation';
import FinancialDashboardClient from './FinancialDashboardClient';

export default async function FinancialPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  // التحقق من الصلاحيات - للادمن فقط
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <main className='container mx-auto p-6 min-h-screen bg-gray-50' dir='rtl'>
      <FinancialDashboardClient />
    </main>
  );
}
