'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import type { AdminCategory } from '@/lib/admin/types';

interface EditState {
  id: string | null;
  slug: string;
  name_fi: string;
  name_en: string;
  sortOrder: number;
}

const EMPTY_EDIT: EditState = { id: null, slug: '', name_fi: '', name_en: '', sortOrder: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCats = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCats(); }, []);

  const handleSave = async () => {
    if (!edit) return;
    if (!edit.slug.trim() || !edit.name_fi.trim() || !edit.name_en.trim()) {
      setError('Slug, nimi FI ja EN ovat pakollisia');
      return;
    }
    setSaving(true);
    setError('');
    const url = edit.id ? `/api/admin/categories/${edit.id}` : '/api/admin/categories';
    const method = edit.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit),
    });
    if (res.ok) {
      await fetchCats();
      setEdit(null);
    } else {
      const d = await res.json();
      setError(d.error || 'Virhe');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string, count = 0) => {
    if (count > 0) {
      alert(`Kategoriaan kuuluu ${count} tuotetta. Siirrä tuotteet ensin.`);
      return;
    }
    if (!confirm(`Poistetaanko kategoria "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCategories((cs) => cs.filter((c) => c.id !== id));
    else {
      const d = await res.json();
      alert(d.error || 'Virhe');
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Kategoriat</h1>
          <p className="text-sm text-stone-400 mt-0.5">{categories.length} kategoriaa</p>
        </div>
        <button
          onClick={() => { setEdit(EMPTY_EDIT); setError(''); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Lisää kategoria
        </button>
      </div>

      {/* New/Edit form */}
      {edit !== null && (
        <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">{edit.id ? 'Muokkaa kategoriaa' : 'Uusi kategoria'}</h2>
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-3 border border-red-200">{error}</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Slug *</label>
              <input
                value={edit.slug}
                onChange={(e) => setEdit({ ...edit, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="ruusukimput"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Nimi FI *</label>
              <input
                value={edit.name_fi}
                onChange={(e) => setEdit({ ...edit, name_fi: e.target.value })}
                placeholder="Ruusukimput"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Nimi EN *</label>
              <input
                value={edit.name_en}
                onChange={(e) => setEdit({ ...edit, name_en: e.target.value })}
                placeholder="Rose bouquets"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Järjestys</label>
              <input
                type="number"
                value={edit.sortOrder}
                onChange={(e) => setEdit({ ...edit, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-2 rounded-lg"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Tallennetaan...' : 'Tallenna'}
            </button>
            <button
              onClick={() => { setEdit(null); setError(''); }}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 px-3 py-2 rounded-lg border border-stone-200 hover:bg-stone-50"
            >
              <X className="w-3.5 h-3.5" />
              Peruuta
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50 border-b border-stone-200">
              <th className="px-5 py-3 text-left font-medium">Slug</th>
              <th className="px-5 py-3 text-left font-medium">Nimi FI</th>
              <th className="px-5 py-3 text-left font-medium">Nimi EN</th>
              <th className="px-5 py-3 text-left font-medium">Tuotteita</th>
              <th className="px-5 py-3 text-left font-medium">Järjestys</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading && <tr><td colSpan={6} className="px-5 py-8 text-center text-stone-400">Ladataan...</td></tr>}
            {!loading && categories.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-stone-400">Ei kategorioita</td></tr>}
            {!loading && categories.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="px-5 py-3 font-mono text-xs text-stone-500">{c.slug}</td>
                <td className="px-5 py-3 font-medium text-stone-800">{c.name_fi}</td>
                <td className="px-5 py-3 text-stone-500">{c.name_en}</td>
                <td className="px-5 py-3 text-stone-500">{c.productCount ?? 0}</td>
                <td className="px-5 py-3 text-stone-500">{c.sortOrder}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEdit({ id: c.id, slug: c.slug, name_fi: c.name_fi, name_en: c.name_en, sortOrder: c.sortOrder }); setError(''); }}
                      className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name_fi, c.productCount)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  );
}
