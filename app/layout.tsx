import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
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
    <html lang="fi" className={`${inter.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
