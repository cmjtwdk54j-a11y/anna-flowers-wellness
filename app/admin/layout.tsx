import Sidebar from '@/components/admin/Sidebar';
import { AdminLangProvider } from '@/components/admin/AdminLangContext';

export const metadata = {
  title: { template: '%s | Admin', default: 'Admin – Aavafloristi' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLangProvider>
      <div className="min-h-screen bg-stone-50 antialiased font-sans">
        <Sidebar />
        <div className="lg:pl-60">
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </AdminLangProvider>
  );
}
