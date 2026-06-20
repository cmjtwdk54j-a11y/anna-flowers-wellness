'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Filter, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { AdminProduct, AdminCategory } from '@/lib/admin/types';

function fmt(v: number) {
  return v.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [inStock, setInStock] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryId) params.set('categoryId', categoryId);
    if (inStock !== '') params.set('inStock', inStock);
    const [prRes, catRes] = await Promise.all([
      fetch(`/api/admin/products?${params}`),
      fetch('/api/admin/categories'),
    ]);
    if (prRes.ok) setProducts(await prRes.json());
    if (catRes.ok) setCategories(await catRes.json());
    setLoading(false);
  }, [search, categoryId, inStock]);

  useEffect(() => { fetch_(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetch_(); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Poistetaanko tuote "${name}"?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((ps) => ps.filter((p) => p.id !== id));
    setDeleting(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Tuotteet</h1>
          <p className="text-sm text-stone-400 mt-0.5">{products.length} tuotetta</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Lisää tuote
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hae nimellä..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); }}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Kaikki kategoriat</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_fi}</option>)}
          </select>
          <select
            value={inStock}
            onChange={(e) => { setInStock(e.target.value); }}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Kaikki</option>
            <option value="true">Varastossa</option>
            <option value="false">Loppu</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            <Filter className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50 border-b border-stone-200">
                <th className="px-5 py-3 text-left font-medium">Tuote</th>
                <th className="px-5 py-3 text-left font-medium">Kategoria</th>
                <th className="px-5 py-3 text-left font-medium">Hinta (S)</th>
                <th className="px-5 py-3 text-left font-medium">Hinta (L)</th>
                <th className="px-5 py-3 text-left font-medium">Myynti</th>
                <th className="px-5 py-3 text-left font-medium">Varasto</th>
                <th className="px-5 py-3 text-left font-medium">Suosittu</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-stone-400">Ladataan...</td></tr>
              )}
              {!loading && products.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-stone-400">Ei tuotteita</td></tr>
              )}
              {!loading && products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {p.imageUrl && (
                          <Image src={p.imageUrl} alt={p.name_fi} width={36} height={36} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-stone-800 max-w-[180px] truncate">{p.name_fi}</p>
                        <p className="text-xs text-stone-400 font-mono">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-stone-500">{p.categoryName}</td>
                  <td className="px-5 py-3 font-medium text-stone-700">{fmt(p.priceSmall)}</td>
                  <td className="px-5 py-3 text-stone-500">{p.priceLarge ? fmt(p.priceLarge) : '—'}</td>
                  <td className="px-5 py-3 text-stone-500">{p._count?.orderItems ?? 0} kpl</td>
                  <td className="px-5 py-3">
                    {p.inStock
                      ? <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" />Kyllä</span>
                      : <span className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3.5 h-3.5" />Loppu</span>
                    }
                  </td>
                  <td className="px-5 py-3">
                    {p.isFeatured
                      ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Suosittu</span>
                      : <span className="text-xs text-stone-300">—</span>
                    }
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}`} className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name_fi)}
                        disabled={deleting === p.id}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
