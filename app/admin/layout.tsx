import { cookies } from 'next/headers';
import Sidebar from '@/components/admin/Sidebar';
import { AdminLangProvider } from '@/components/admin/AdminLangContext';
import type { AdminLang } from '@/lib/admin/i18n';

export const metadata = {
  title: { template: '%s | Admin', default: 'Admin – Aavafloristi' },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const saved = cookieStore.get('admin-lang')?.value;
  const initialLang: AdminLang = saved === 'en' || saved === 'fi' ? saved : 'fi';

  return (
    <AdminLangProvider initialLang={initialLang}>
      <div className="min-h-screen bg-stone-50 antialiased font-sans">
        <Sidebar />
        <div className="lg:pl-60">
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </AdminLangProvider>
  );
}
