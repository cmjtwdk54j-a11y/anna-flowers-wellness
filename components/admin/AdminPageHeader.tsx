'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangContext';
import type { AdminTranslations } from '@/lib/admin/i18n';

type HeaderKey = keyof AdminTranslations['headers'];

interface AdminPageHeaderProps {
  backHref: string;
  titleKey: HeaderKey;
  /** Translatable subtitle key (e.g. for "new" pages). */
  subtitleKey?: HeaderKey;
  /** Raw subtitle text (e.g. a product name or promo code) — takes priority. */
  subtitle?: string;
  mono?: boolean;
}

export default function AdminPageHeader({ backHref, titleKey, subtitleKey, subtitle, mono }: AdminPageHeaderProps) {
  const { t } = useAdminLang();
  const sub = subtitle ?? (subtitleKey ? t.headers[subtitleKey] : null);

  return (
    <div className="flex items-center gap-3">
      <Link href={backHref} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div>
        <h1 className="text-xl font-bold text-stone-800">{t.headers[titleKey]}</h1>
        {sub && <p className={`text-sm text-stone-400${mono ? ' font-mono' : ''}`}>{sub}</p>}
      </div>
    </div>
  );
}
