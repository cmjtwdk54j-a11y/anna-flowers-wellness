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

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(() => {
    if (typeof window === 'undefined') return 'fi';
    const saved = localStorage.getItem('admin-lang');
    return saved === 'fi' || saved === 'en' ? saved : 'fi';
  });

  const setLang = (l: AdminLang) => {
    setLangState(l);
    localStorage.setItem('admin-lang', l);
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
