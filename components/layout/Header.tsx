'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/flowers', label: t('flowers') },
    { href: '/massage', label: t('massage') },
    { href: '/gift-cards', label: t('giftCards') },
    { href: '/delivery', label: t('delivery') },
    { href: '/contact', label: t('contact') },
  ];

  const switchLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AF</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-stone-800 text-sm leading-tight block">
                Anna Flowers
              </span>
              <span className="text-stone-400 text-xs leading-tight block">& Wellness</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-rose-500',
                  pathname === link.href ? 'text-rose-500' : 'text-stone-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-stone-200 rounded-full px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <button
                onClick={() => switchLocale('fi')}
                className={cn(
                  'text-xs font-medium transition-colors',
                  locale === 'fi' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-700'
                )}
              >
                FI
              </button>
              <span className="text-stone-300 text-xs">|</span>
              <button
                onClick={() => switchLocale('en')}
                className={cn(
                  'text-xs font-medium transition-colors',
                  locale === 'en' ? 'text-rose-500' : 'text-stone-400 hover:text-stone-700'
                )}
              >
                EN
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-stone-600 hover:text-rose-500 transition-colors"
              aria-label={t('cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-rose-500 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-rose-50 text-rose-500'
                    : 'text-stone-600 hover:bg-stone-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
