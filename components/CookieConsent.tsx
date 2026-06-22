'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto bg-white border border-stone-200 rounded-2xl shadow-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-soft-pink rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-burgundy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800 mb-1">Käytämme evästeitä</p>
            <p className="text-sm text-stone-500">
              Käytämme evästeitä parantaaksemme käyttökokemustasi ja analysoidaksemme sivuston liikennettä.
              Lue lisää{' '}
              <Link href="/privacy" className="text-burgundy hover:underline">
                tietosuojaselosteestamme
              </Link>
              .
            </p>
          </div>
          <button
            onClick={decline}
            className="text-stone-400 hover:text-stone-600 flex-shrink-0 mt-0.5"
            aria-label="Sulje"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-end">
          <button
            onClick={decline}
            className="px-5 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
          >
            Vain välttämättömät
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-medium text-white bg-burgundy hover:bg-burgundy/90 rounded-full transition-colors"
          >
            Hyväksy kaikki
          </button>
        </div>
      </div>
    </div>
  );
}
