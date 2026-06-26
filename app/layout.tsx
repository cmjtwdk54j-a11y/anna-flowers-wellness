import type { Metadata } from 'next';
import { Crimson_Pro, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const crimsonPro = Crimson_Pro({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Aavafloristi',
    default: 'Aavafloristi – Kukkakauppa ja Päänahkahieronta Helsinki',
  },
  description:
    'Tilaa tuoreita kukkia ja varaa päänahkahieronta Helsingissä. Toimitus Helsingissä, Espoossa, Vantaalla ja Keravalla.',
  keywords: ['kukkakauppa', 'helsinki', 'kukat', 'päänahkahieronta', 'toimitus', 'lahjakortti'],
  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    siteName: 'Aavafloristi',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={`${crimsonPro.variable} ${plusJakarta.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
