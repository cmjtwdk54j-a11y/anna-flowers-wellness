import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Anna Flowers & Wellness',
    default: 'Anna Flowers & Wellness – Kukkakauppa ja Päänahkahieronta Helsinki',
  },
  description:
    'Tilaa tuoreita kukkia ja varaa päänahkahieronta Helsingissä. Toimitus Helsingissä, Espoossa, Vantaalla ja Keravalla.',
  keywords: ['kukkakauppa', 'helsinki', 'kukat', 'päänahkahieronta', 'toimitus', 'lahjakortti'],
  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    siteName: 'Anna Flowers & Wellness',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 font-sans">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer locale={locale} />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
