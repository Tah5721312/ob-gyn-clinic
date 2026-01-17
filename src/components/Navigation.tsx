'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import AuthButtons from '@/app/components/header/AuthButtons';
import {
  Menu,
  X,
  Users,
  Stethoscope,
  FileText,
  UserCircle,
  LogOut,
} from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const role = session?.user?.role as string;

  return (
    <nav className='sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-800'>
      <div className='container mx-auto px-4 relative'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <h1 className='text-lg md:text-2xl font-bold'>
            <Link href={'/'} className='hover:opacity-80 transition-opacity'>
              عيادة النساء والولادة
            </Link>
          </h1>

          {/* Desktop menu - بسيط حسب الدور */}
          <div className='hidden md:flex items-center gap-3'>
            {isAuthenticated && (
              <>
                {/* الدكتور - فقط: الرئيسية | اليوم | الزيارات | الروشتات | خروج */}
                {role === 'DOCTOR' && (
                  <>
                    <Link
                      href='/'
                      className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      <span>الرئيسية</span>
                    </Link>
                    <Link
                      href='/patients'
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>المرضى</span>
                    </Link>
                    <Link
                      href='/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                    >
                      <Users size={18} />
                      <span>اليوم</span>
                    </Link>
                    <Link
                      href='/visits'
                      className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                    >
                      <Stethoscope size={18} />
                      <span>الزيارات</span>
                    </Link>
                    <Link
                      href='/prescriptions'
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الروشتات</span>
                    </Link>
                  </>
                )}

                {/* الاستقبال - المرضى | المواعيد | الفواتير | الدفعات | الروشتات | خروج */}
                {role === 'RECEPTIONIST' && (
                  <>
                    <Link
                      href='/patients'
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                      <Users size={18} />
                      <span>المرضى</span>
                    </Link>
                    <Link
                      href='/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                    >
                      <Users size={18} />
                      <span>المواعيد</span>
                    </Link>
                    <Link
                      href='/billing'
                      className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الفواتير</span>
                    </Link>
                    <Link
                      href='/payments'
                      className='flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الدفعات</span>
                    </Link>
                    <Link
                      href='/prescriptions'
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الروشتات</span>
                    </Link>
                  </>
                )}

                {/* المدير - كل شيء */}
                {role === 'ADMIN' && (
                  <>
                    <Link
                      href='/patients'
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                    >
                      <Users size={18} />
                      <span>المرضى</span>
                    </Link>
                    <Link
                      href='/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                    >
                      <Users size={18} />
                      <span>المواعيد</span>
                    </Link>
                    <Link
                      href='/billing'
                      className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الفواتير</span>
                    </Link>
                    <Link
                      href='/payments'
                      className='flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الدفعات</span>
                    </Link>
                    <Link
                      href='/prescriptions'
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>الروشتات</span>
                    </Link>
                    <Link
                      href='/users'
                      className='flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                    >
                      <UserCircle size={18} />
                      <span>المستخدمين</span>
                    </Link>
                    <Link
                      href='/financial'
                      className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
                    >
                      <FileText size={18} />
                      <span>المالية</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className='flex items-center gap-4'>
            {/* Auth Buttons Component */}
            <AuthButtons />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className='md:hidden p-2 rounded-md text-blue-100 hover:bg-blue-500 transition-colors'
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu - حسب الدور */}
        {isMobileOpen && (
          <div className='md:hidden pb-4 space-y-2 border-t border-blue-500 pt-4'>
            {isAuthenticated ? (
              <>
                {/* الدكتور - فقط: الرئيسية | اليوم | الزيارات | الروشتات */}
                {role === 'DOCTOR' && (
                  <>
                    <Link
                      href='/'
                      className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span>الرئيسية</span>
                    </Link>
                    <Link
                      href='/patients'
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>المرضى</span>
                    </Link>
                    <Link
                      href='/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>اليوم</span>
                    </Link>
                    <Link
                      href='/visits'
                      className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Stethoscope size={18} />
                      <span>الزيارات</span>
                    </Link>
                    <Link
                      href='/prescriptions'
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الروشتات</span>
                    </Link>
                  </>
                )}

                {/* الاستقبال - المرضى | المواعيد | الفواتير | الدفعات | الروشتات */}
                {role === 'RECEPTIONIST' && (
                  <>
                    <Link
                      href='/patients'
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>المرضى</span>
                    </Link>
                    <Link
                      href='/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>المواعيد</span>
                    </Link>
                    <Link
                      href='/billing'
                      className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الفواتير</span>
                    </Link>
                    <Link
                      href='/payments'
                      className='flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الدفعات</span>
                    </Link>
                    <Link
                      href='/prescriptions'
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الروشتات</span>
                    </Link>
                  </>
                )}

                {/* المدير - كل شيء */}
                {role === 'ADMIN' && (
                  <>
                    <Link
                      href='/patients'
                      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>المرضى</span>
                    </Link>
                    <Link
                      href='/appointments'
                      className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Users size={18} />
                      <span>المواعيد</span>
                    </Link>
                    <Link
                      href='/billing'
                      className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الفواتير</span>
                    </Link>
                    <Link
                      href='/payments'
                      className='flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الدفعات</span>
                    </Link>
                    <Link
                      href='/prescriptions'
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>الروشتات</span>
                    </Link>
                    <Link
                      href='/users'
                      className='flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <UserCircle size={18} />
                      <span>المستخدمين</span>
                    </Link>
                    <Link
                      href='/financial'
                      className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FileText size={18} />
                      <span>المالية</span>
                    </Link>
                  </>
                )}
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
