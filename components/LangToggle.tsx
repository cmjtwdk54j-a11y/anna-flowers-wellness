'use client';

import { useLocale } from 'next-intl';

export default function LangToggle() {
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="inline-flex items-center gap-1 border border-stone-200 rounded-full px-2.5 py-1 bg-white shadow-sm">
      <button
        onClick={() => switchLocale('fi')}
        className={`text-xs font-semibold px-1.5 py-0.5 rounded-full transition-colors ${
          locale === 'fi' ? 'bg-rose-500 text-white' : 'text-stone-400 hover:text-stone-700'
        }`}
      >
        FI
      </button>
      <span className="text-stone-200 text-xs">|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`text-xs font-semibold px-1.5 py-0.5 rounded-full transition-colors ${
          locale === 'en' ? 'bg-rose-500 text-white' : 'text-stone-400 hover:text-stone-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}
