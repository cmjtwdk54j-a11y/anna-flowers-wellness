'use client';

import { createContext, useContext, useState } from 'react';
import { adminT, type AdminLang, type AdminTranslations } from '@/lib/admin/i18n';

interface AdminLangContextValue {
  lang: AdminLang;
  setLang: (l: AdminLang) => void;
  t: AdminTranslations;
}

const AdminLangContext = createContext<AdminLangContextValue>({
  lang: 'fi',
  setLang: () => {},
  t: adminT.fi,
});

export function AdminLangProvider({
  children,
  initialLang = 'fi',
}: {
  children: React.ReactNode;
  initialLang?: AdminLang;
}) {
  // Initialise from the server-provided cookie value so the first client
  // render matches the SSR output (no hydration mismatch, no flash).
  const [lang, setLangState] = useState<AdminLang>(initialLang);

  const setLang = (l: AdminLang) => {
    setLangState(l);
    // Persist in a cookie so the server can read it on the next request.
    document.cookie = `admin-lang=${l}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t: adminT[lang] }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  return useContext(AdminLangContext);
}
