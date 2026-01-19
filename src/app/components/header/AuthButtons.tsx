'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, User, Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: '/signin' });
  };

  // Loading State
  if (status === 'loading') {
    return (
      <div className='flex items-center gap-3 animate-pulse'>
        <div className='hidden md:block w-24 h-9 bg-slate-100 rounded-xl' />
        <div className='w-10 h-10 bg-slate-100 rounded-full' />
      </div>
    );
  }

  // Authenticated State
  if (session?.user) {
    const { role, firstName, lastName } = session.user;
    const fullName = `${firstName} ${lastName}`;
    // Get initials safely
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

    // Mapping roles to Arabic names
    const roleName = {
      ADMIN: 'مدير النظام',
      DOCTOR: 'طبيب',
      RECEPTIONIST: 'استقبال',
    }[role as string] || role;

    return (
      <div className='flex items-center gap-3'>
        {/* User Info Pill - Hidden on mobile, shown on desktop */}
        <div className='hidden md:flex items-center gap-3 pl-1.5 pr-4 py-1.5 bg-slate-50 border border-slate-200/60 rounded-full hover:border-blue-300/50 hover:bg-white hover:shadow-sm transition-all duration-300 group cursor-default'>
          {/* Avatar Circle */}
          <div className='h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300'>
              <User size={14} />
          </div>

          {/* Text Info */}
          <div className='flex flex-col items-start gap-[1px]'>
            <span className='text-xs font-bold text-slate-700 leading-none'>
              {fullName}
            </span>
            <span className='text-[10px] font-medium text-slate-400 tracking-wide uppercase'>
              {roleName}
            </span>
          </div>
        </div>

        {/* Mobile Avatar (Simple) */}
        <div className='md:hidden h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md'>
            <User size={16} />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className='
            relative group/btn flex items-center justify-center w-10 h-10 rounded-full
            bg-white border border-slate-200 text-slate-400
            hover:border-red-200 hover:bg-red-50 hover:text-red-600 
            focus:outline-none focus:ring-2 focus:ring-red-500/20
            transition-all duration-200 shadow-sm
          '
          title='تسجيل الخروج'
          aria-label='تسجيل الخروج'
        >
          {isSigningOut ? (
            <Loader2 size={18} className='animate-spin text-red-500' />
          ) : (
            <>
              <LogOut size={18} className='transition-transform duration-200 group-hover/btn:-translate-x-0.5' />
              {/* Tooltip-ish label for larger screens if needed, mostly icon is enough */}
            </>
          )}
        </button>
      </div>
    );
  }

  // // Unauthenticated State - Login Button
  // return (
  //   <Link
  //     href='/signin'
  //     className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 group'
  //   >
  //     <span className='text-sm font-semibold'>تسجيل الدخول</span>
  //     <LogIn size={18} className='group-hover:-translate-x-1 transition-transform' />
  //   </Link>
  // );
}
