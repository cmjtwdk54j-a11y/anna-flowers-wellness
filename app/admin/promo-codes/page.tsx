'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { AdminPromoCode } from '@/lib/admin/types';

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fi-FI');
}

function isExpired(iso: string | null | undefined) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

export default function PromoCodesPage() {
  const [promos, setPromos] = useState<AdminPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== '') params.set('isActive', filter);
    const res = await fetch(`/api/admin/promo-codes?${params}`);
    if (res.ok) setPromos(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Poistetaanko promokoodi "${code}"?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/promo-codes/${id}`, { method: 'DELETE' });
    if (res.ok) setPromos((p) => p.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const handleToggle = async (promo: AdminPromoCode) => {
    setToggling(promo.id);
    const res = await fetch(`/api/admin/promo-codes/${promo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...promo, isActive: !promo.isActive }),
    });
    if (res.ok) {
      setPromos((ps) => ps.map((p) => p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
    }
    setToggling(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Promokoodit</h1>
          <p className="text-sm text-stone-400 mt-0.5">{promos.length} koodia</p>
        </div>
        <Link
          href="/admin/promo-codes/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Luo promokoodi
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="flex gap-2">
          {(['', 'true', 'false'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filter === v ? 'bg-indigo-600 text-white border-indigo-600' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {v === '' ? 'Kaikki' : v === 'true' ? 'Aktiiviset' : 'Pois käytöstä'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50 border-b border-stone-200">
                <th className="px-5 py-3 text-left font-medium">Koodi</th>
                <th className="px-5 py-3 text-left font-medium">Alennus</th>
                <th className="px-5 py-3 text-left font-medium">Min. tilaus</th>
                <th className="px-5 py-3 text-left font-medium">Käyttökerrat</th>
                <th className="px-5 py-3 text-left font-medium">Voimassa</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-stone-400">Ladataan...</td></tr>
              )}
              {!loading && promos.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-stone-400">Ei promokoodeja</td></tr>
              )}
              {!loading && promos.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded text-xs">{p.code}</span>
                  </td>
                  <td className="px-5 py-3 font-medium text-stone-700">
                    {p.discountType === 'PERCENT' ? `${p.discountValue}%` : `${p.discountValue} €`}
                  </td>
                  <td className="px-5 py-3 text-stone-500">{p.minOrderAmount ? `${p.minOrderAmount} €` : '—'}</td>
                  <td className="px-5 py-3 text-stone-700">
                    {p.usageCount}{p.maxUses ? ` / ${p.maxUses}` : ''}
                  </td>
                  <td className="px-5 py-3 text-stone-500">
                    <div>
                      {p.startsAt ? fmtDate(p.startsAt) : '∞'} – {p.expiresAt ? fmtDate(p.expiresAt) : '∞'}
                      {isExpired(p.expiresAt) && <span className="ml-2 text-xs text-red-500">Vanhentunut</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {p.isActive
                      ? <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-600/20">Aktiivinen</span>
                      : <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full ring-1 ring-stone-500/20">Pois</span>
                    }
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(p)}
                        disabled={toggling === p.id}
                        className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-40"
                        title={p.isActive ? 'Poista käytöstä' : 'Ota käyttöön'}
                      >
                        {p.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <Link href={`/admin/promo-codes/${p.id}`} className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.code)}
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
