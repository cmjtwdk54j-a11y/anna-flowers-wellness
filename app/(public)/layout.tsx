import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <div className="min-h-full flex flex-col bg-stone-50 antialiased font-sans">
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer locale={locale} />
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
