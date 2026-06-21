'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
  const [lang, setLangState] = useState<AdminLang>('fi');

  useEffect(() => {
    const saved = localStorage.getItem('admin-lang') as AdminLang | null;
    if (saved === 'fi' || saved === 'en') setLangState(saved);
  }, []);

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
