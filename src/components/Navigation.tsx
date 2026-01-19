'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AuthButtons from '@/app/components/header/AuthButtons';
import {
  Menu,
  X,
  Users,
  Stethoscope,
  FileText,
  UserCircle,
  Home,
  Calendar,
  CreditCard,
  Banknote,
  Activity,
  ChevronRight,
} from 'lucide-react';

interface NavItemProps {
  href: string;
  label: string;
  icon: any;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
}

const NavItem = ({ href, label, icon: Icon, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-300
        ${isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 translate-y-[-1px]'
          : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
        }
      `}
    >
      <Icon
        size={20}
        className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
          }`}
      />
      <span className={`font-semibold text-sm ${isActive ? '' : ''}`}>
        {label}
      </span>
      {isActive && (
        <span className='absolute bottom-0 left-1/2 w-1 h-1 -translate-x-1/2 bg-white/20 rounded-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity' />
      )}
    </Link>
  );
};

// Mobile Nav Item with slightly different styling
const MobileNavItem = ({ href, label, icon: Icon, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center justify-between p-4 rounded-xl transition-all duration-200 border
        ${isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-md'
          : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
        }
      `}
    >
      <div className='flex items-center gap-3'>
        <div
          className={`p-2 rounded-lg ${isActive ? 'bg-white/10' : 'bg-slate-50'
            }`}
        >
          <Icon
            size={20}
            className={isActive ? 'text-white' : 'text-slate-500'}
          />
        </div>
        <span className='font-semibold'>{label}</span>
      </div>
      <ChevronRight
        size={16}
        className={isActive ? 'text-white/70' : 'text-slate-300'}
      />
    </Link>
  );
};

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const role = session?.user?.role as string;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileOpen(false);

  // Define navigation items based on roles
  const getNavItems = () => {
    if (!isAuthenticated) return [];

    const items = [];

    if (role === 'DOCTOR') {
      items.push(
        { href: '/', label: 'الرئيسية', icon: Home },
        { href: '/appointments', label: 'المواعيد', icon: Calendar },
        { href: '/visits', label: 'الزيارات', icon: Activity },
        { href: '/prescriptions', label: 'الروشتات', icon: FileText },
        { href: '/patients', label: 'المرضى', icon: Users },
      );
    }

    if (role === 'RECEPTIONIST') {
      items.push(
        { href: '/', label: 'الرئيسية', icon: Home },
        { href: '/appointments', label: 'المواعيد', icon: Calendar },
        { href: '/payments', label: 'الدفعات', icon: Banknote },
        { href: '/billing', label: 'الفواتير', icon: CreditCard },
        { href: '/patients', label: 'المرضى', icon: Users },
        { href: '/prescriptions', label: 'الروشتات', icon: FileText }
      );
    }

    if (role === 'ADMIN') {
      items.push(
        { href: '/', label: 'الرئيسية', icon: Home },
        //{ href: '/appointments', label: 'المواعيد', icon: Calendar },
        { href: '/payments', label: 'الدفعات', icon: Banknote },
        { href: '/billing', label: 'الفواتير', icon: CreditCard },
        { href: '/financial', label: 'المالية', icon: Activity }, // Using Activity as placeholder for Financial if FileText duplicates
        // { href: '/prescriptions', label: 'الروشتات', icon: FileText },
        { href: '/patients', label: 'المرضى', icon: Users },
        { href: '/users', label: 'المستخدمين', icon: UserCircle },
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      <nav
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-300 
          ${scrolled
            ? 'bg-blue-100 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3'
            : 'bg-blue-100 border-b border-transparent py-3'
          }
        `}
      >
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center'>
            {/* Logo Section */}
            <Link href='/' className='group flex items-center gap-3'>
              <div className='bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform'>
                <Stethoscope size={24} />
              </div>
              <div className='flex flex-col'>
                <h1 className='text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
                  عيادة النساء والولادة
                </h1>
                <span className='text-[10px] text-slate-400 font-medium tracking-wide'>
                  OB-GYN CLINIC SYSTEM
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center bg-slate-50/50 p-1.5 rounded-full border border-slate-100'>
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>

            {/* Actions Section */}
            <div className='flex items-center gap-3'>
              <AuthButtons />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className='lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors active:scale-95'
              >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content down since nav is fixed */}
      <div className='h-[88px]' />

      {/* Mobile Menu Overlay & Content */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-all duration-300
          ${isMobileOpen ? 'visible opacity-100' : 'invisible opacity-0'}
        `}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={closeMobileMenu}
        />

        {/* Menu Panel */}
        <div
          className={`
            absolute top-[88px] left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-4
            flex flex-col gap-3 max-h-[calc(100vh-88px)] overflow-y-auto
            transition-all duration-300 origin-top
            ${isMobileOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0 scale-95'
            }
          `}
        >
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              {...item}
              onClick={closeMobileMenu}
            />
          ))}

          {navItems.length === 0 && (
            <div className='text-center py-8 text-slate-400'>
              <p>الرجاء تسجيل الدخول للوصول إلى القائمة</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
