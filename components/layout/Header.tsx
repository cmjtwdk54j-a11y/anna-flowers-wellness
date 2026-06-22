'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Menu, X, Globe, Flower2 } from 'lucide-react';
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
        'fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between transition-all duration-300',
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-pink-50 shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-pink-50'
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--soft-pink)' }}
        >
          <Flower2 className="w-5 h-5" style={{ color: 'var(--burgundy)' }} />
        </motion.div>
        <span
          className="font-serif text-2xl font-bold tracking-tight uppercase hidden sm:block"
          style={{ color: 'var(--burgundy)' }}
        >
          Aavafloristi
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        {navLinks.map((link) => {
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn('nav-link transition-colors', active ? 'text-[--burgundy]' : 'hover:text-[--burgundy]')}
              style={active ? { color: 'var(--burgundy)' } : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Language */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <Globe className="w-3.5 h-3.5" />
          <button
            onClick={() => switchLocale('fi')}
            className="transition-colors hover:text-[--burgundy]"
            style={locale === 'fi' ? { color: 'var(--burgundy)' } : undefined}
          >FI</button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => switchLocale('en')}
            className="transition-colors hover:text-[--burgundy]"
            style={locale === 'en' ? { color: 'var(--burgundy)' } : undefined}
          >EN</button>
        </div>

        {/* Cart */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleCart}
          className="relative p-2 text-gray-500 hover:text-[--burgundy] transition-colors"
          style={{ '--burgundy': 'var(--burgundy)' } as React.CSSProperties}
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
                className="absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] flex items-center justify-center rounded-full font-bold"
                style={{ backgroundColor: 'var(--burgundy)' }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-gray-500 hover:text-[--burgundy] transition-colors"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 right-0 overflow-hidden bg-white border-b border-pink-50 shadow-sm"
          >
            <nav className="flex flex-col px-6 pt-3 pb-5">
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
                      className="block py-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-pink-50 last:border-0 transition-colors"
                      style={{ color: active ? 'var(--burgundy)' : '#6b7280' }}
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
