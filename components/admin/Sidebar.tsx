'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Tag, FolderTree,
  BarChart2, Settings, LogOut, Flower2, X, Menu,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdminLang } from '@/components/admin/AdminLangContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useAdminLang();

  const NAV_ITEMS = [
    { href: '/admin', label: t.nav.dashboard, icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: t.nav.products, icon: Package },
    { href: '/admin/orders', label: t.nav.orders, icon: ShoppingBag },
    { href: '/admin/promo-codes', label: t.nav.promoCodes, icon: Tag },
    { href: '/admin/categories', label: t.nav.categories, icon: FolderTree },
    { href: '/admin/analytics', label: t.nav.analytics, icon: BarChart2 },
    { href: '/admin/settings', label: t.nav.settings, icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const LangToggle = () => (
    <div className="flex items-center gap-1 bg-stone-800 rounded-lg p-0.5">
      <button
        onClick={() => setLang('fi')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all',
          lang === 'fi'
            ? 'bg-stone-600 text-white shadow-sm'
            : 'text-stone-400 hover:text-stone-200'
        )}
      >
        <span>🇫🇮</span> FI
      </button>
      <button
        onClick={() => setLang('en')}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all',
          lang === 'en'
            ? 'bg-stone-600 text-white shadow-sm'
            : 'text-stone-400 hover:text-stone-200'
        )}
      >
        <span>🇬🇧</span> EN
      </button>
    </div>
  );

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between px-4 h-16 border-b border-stone-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Flower2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Aavafloristi</p>
            <p className="text-stone-400 text-xs mt-0.5">Admin</p>
          </div>
        </div>
        <LangToggle />
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(href, exact)
                    ? 'bg-stone-700 text-white'
                    : 'text-stone-300 hover:bg-stone-700/60 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-2 pb-4 border-t border-stone-700/50 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 hover:bg-stone-700/60 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t.nav.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-stone-900 fixed inset-y-0 left-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between h-14 px-4 bg-stone-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-rose-500 rounded-md flex items-center justify-center">
            <Flower2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <button onClick={() => setMobileOpen(true)} className="text-stone-300 hover:text-white p-1.5">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-60 bg-stone-900 h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
