'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm'
          : 'bg-white border-b border-stone-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">AF</span>
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-semibold text-stone-800 text-sm leading-tight block group-hover:text-rose-500 transition-colors">
                Aavafloristi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors hover:text-rose-500 py-1',
                    active ? 'text-rose-500' : 'text-stone-600'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-rose-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
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
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleCart}
              className="relative p-2 text-stone-600 hover:text-rose-500 transition-colors"
              aria-label={t('cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-rose-500 transition-colors"
              aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-stone-100"
          >
            <nav className="flex flex-col gap-1 px-4 pt-2 pb-4">
              {navLinks.map((link, i) => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        active ? 'bg-rose-50 text-rose-500' : 'text-stone-600 hover:bg-stone-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
