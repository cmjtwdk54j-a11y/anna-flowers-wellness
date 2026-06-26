import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="fi" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
