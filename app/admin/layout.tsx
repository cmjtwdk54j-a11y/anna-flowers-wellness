import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: { template: '%s | Admin', default: 'Admin – Aavafloristi' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 antialiased font-sans">
      <Sidebar />
      <div className="lg:pl-60">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
