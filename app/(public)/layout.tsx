import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: {
    default: 'Aavafloristi – Kukkakauppa Helsinki',
    template: '%s | Aavafloristi',
  },
  description: 'Tuoreita kukkia ja kauniita kimpuja Helsingissä. Nouto myymälästä tai kotiinkuljetus koko Helsinkiin.',
  keywords: ['kukkakauppa', 'Helsinki', 'kukat', 'kimput', 'florist', 'kukkakimppu', 'kukkien toimitus'],
  authors: [{ name: 'Aavafloristi' }],
  creator: 'Aavafloristi',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aavafloristi.fi'),
  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    siteName: 'Aavafloristi',
    title: 'Aavafloristi – Kukkakauppa Helsinki',
    description: 'Tuoreita kukkia ja kauniita kimpuja Helsingissä. Nouto myymälästä tai kotiinkuljetus.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aavafloristi – Kukkakauppa Helsinki',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aavafloristi – Kukkakauppa Helsinki',
    description: 'Tuoreita kukkia ja kauniita kimpuja Helsingissä.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <div className="min-h-full flex flex-col bg-white antialiased font-sans">
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer locale={locale} />
          <CookieConsent />
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
