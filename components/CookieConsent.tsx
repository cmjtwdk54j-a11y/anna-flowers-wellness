'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { useLocale } from 'next-intl';

const text = {
  fi: {
    title: 'Käytämme evästeitä',
    body: 'Käytämme evästeitä parantaaksemme käyttökokemustasi ja analysoidaksemme sivuston liikennettä. Lue lisää',
    link: 'tietosuojaselosteestamme',
    essential: 'Vain välttämättömät',
    acceptAll: 'Hyväksy kaikki',
    close: 'Sulje',
  },
  en: {
    title: 'We use cookies',
    body: 'We use cookies to improve your experience and analyse site traffic. Read more in our',
    link: 'privacy policy',
    essential: 'Essential only',
    acceptAll: 'Accept all',
    close: 'Close',
  },
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale() as 'fi' | 'en';
  const t = text[locale] ?? text.fi;

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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--soft-pink)' }}>
            <Cookie className="w-5 h-5" style={{ color: 'var(--burgundy)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800 mb-1">{t.title}</p>
            <p className="text-sm text-stone-500">
              {t.body}{' '}
              <Link href="/privacy" className="hover:underline" style={{ color: 'var(--burgundy)' }}>
                {t.link}
              </Link>
              .
            </p>
          </div>
          <button
            onClick={decline}
            className="text-stone-400 hover:text-stone-600 flex-shrink-0 mt-0.5"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-end">
          <button
            onClick={decline}
            className="px-5 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-full hover:bg-stone-50 transition-colors"
          >
            {t.essential}
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-medium text-white rounded-full transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--burgundy)' }}
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
