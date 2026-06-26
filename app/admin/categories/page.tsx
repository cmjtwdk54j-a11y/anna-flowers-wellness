'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Database, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import type { AdminCategory } from '@/lib/admin/types';
import { useAdminLang } from '@/components/admin/AdminLangContext';

interface SubcategoryItem { id: string; name_fi: string; name_en: string; sortOrder: number; isVisible: boolean; }

interface EditState {
  id: string | null;
  slug: string;
  name_fi: string;
  name_en: string;
  icon: string;
  isVisible: boolean;
  sortOrder: number;
}

const EMPTY_EDIT: EditState = { id: null, slug: '', name_fi: '', name_en: '', icon: '', isVisible: true, sortOrder: 0 };

export default function CategoriesPage() {
  const { lang, t } = useAdminLang();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  // Subcategories state per category
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [subcats, setSubcats] = useState<Record<string, SubcategoryItem[]>>({});
  const [newSub, setNewSub] = useState<Record<string, { name_fi: string; name_en: string }>>({});
  const [savingSub, setSavingSub] = useState<Record<string, boolean>>({});

  const fetchCats = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCats(); }, []);

  const toggleExpand = async (catId: string) => {
    const nowOpen = !expanded[catId];
    setExpanded((prev) => ({ ...prev, [catId]: nowOpen }));
    if (nowOpen && !subcats[catId]) {
      const res = await fetch(`/api/admin/categories/${catId}/subcategories`);
      if (res.ok) {
        const data = await res.json();
        setSubcats((prev) => ({ ...prev, [catId]: data }));
      }
    }
  };

  const handleAddSub = async (catId: string) => {
    const s = newSub[catId];
    if (!s?.name_fi?.trim() || !s?.name_en?.trim()) return;
    setSavingSub((prev) => ({ ...prev, [catId]: true }));
    const res = await fetch(`/api/admin/categories/${catId}/subcategories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name_fi: s.name_fi, name_en: s.name_en, sortOrder: (subcats[catId]?.length ?? 0) }),
    });
    if (res.ok) {
      const created = await res.json();
      setSubcats((prev) => ({ ...prev, [catId]: [...(prev[catId] ?? []), created] }));
      setNewSub((prev) => ({ ...prev, [catId]: { name_fi: '', name_en: '' } }));
    }
    setSavingSub((prev) => ({ ...prev, [catId]: false }));
  };

  const handleDeleteSub = async (catId: string, subId: string) => {
    if (!confirm(lang === 'fi' ? 'Poista alakategoria?' : 'Delete subcategory?')) return;
    const res = await fetch(`/api/admin/subcategories/${subId}`, { method: 'DELETE' });
    if (res.ok) setSubcats((prev) => ({ ...prev, [catId]: prev[catId].filter((s) => s.id !== subId) }));
  };

  const handleToggleSubVisible = async (catId: string, sub: SubcategoryItem) => {
    const res = await fetch(`/api/admin/subcategories/${sub.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name_fi: sub.name_fi, name_en: sub.name_en, sortOrder: sub.sortOrder, isVisible: !sub.isVisible }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSubcats((prev) => ({ ...prev, [catId]: prev[catId].map((s) => s.id === sub.id ? { ...s, isVisible: updated.isVisible } : s) }));
    }
  };

  const handleSeed = async () => {
    if (!confirm(t.categories.confirmSeed)) return;
    setSeeding(true);
    setSeedMsg('');
    const res = await fetch('/api/admin/seed', { method: 'POST' });
    const d = await res.json();
    setSeedMsg(res.ok ? d.message : 'Virhe: ' + (d.error || 'tuntematon'));
    if (res.ok) await fetchCats();
    setSeeding(false);
  };

  const handleSave = async () => {
    if (!edit) return;
    if (!edit.slug.trim() || !edit.name_fi.trim() || !edit.name_en.trim()) {
      setError(t.categoriesExtra.requiredFields);
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
      setError(d.error || t.categoriesExtra.errorGeneric);
    }
    setSaving(false);
  };

  const handleToggleVisible = async (cat: AdminCategory) => {
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: cat.slug, name_fi: cat.name_fi, name_en: cat.name_en,
        sortOrder: cat.sortOrder, isVisible: !(cat as any).isVisible,
        icon: (cat as any).icon || null,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories((cs) => cs.map((c) => c.id === cat.id ? { ...c, isVisible: updated.isVisible } as any : c));
    }
  };

  const handleDelete = async (id: string, name: string, count = 0) => {
    if (count > 0) {
      alert(`${t.categoriesExtra.hasProductsPre} ${count} ${t.categoriesExtra.hasProductsPost}`);
      return;
    }
    if (!confirm(`${t.categoriesExtra.confirmDelete} "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) setCategories((cs) => cs.filter((c) => c.id !== id));
    else {
      const d = await res.json();
      alert(d.error || t.categoriesExtra.errorGeneric);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">{t.categories.title}</h1>
          <p className="text-sm text-stone-400 mt-0.5">{categories.length} {lang === 'fi' ? 'kategoriaa' : 'categories'}</p>
        </div>
        <div className="flex items-center gap-2">
          {categories.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Database className="w-4 h-4" />
              {seeding ? t.categories.seeding : t.categories.seedBtn}
            </button>
          )}
          <button
            onClick={() => { setEdit(EMPTY_EDIT); setError(''); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.categories.new}
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${seedMsg.startsWith('Virhe') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          {seedMsg}
        </div>
      )}

      {/* New/Edit form */}
      {edit !== null && (
        <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">{edit.id ? t.categoriesExtra.editTitle : t.categoriesExtra.newTitle}</h2>
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-3 border border-red-200">{error}</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">{t.categoriesExtra.slug}</label>
              <input
                value={edit.slug}
                onChange={(e) => setEdit({ ...edit, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="ruusukimput"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">{t.categoriesExtra.nameFi}</label>
              <input
                value={edit.name_fi}
                onChange={(e) => setEdit({ ...edit, name_fi: e.target.value })}
                placeholder="Ruusukimput"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">{t.categoriesExtra.nameEn}</label>
              <input
                value={edit.name_en}
                onChange={(e) => setEdit({ ...edit, name_en: e.target.value })}
                placeholder="Rose bouquets"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Ikoni (emoji)</label>
              <input
                value={edit.icon}
                onChange={(e) => setEdit({ ...edit, icon: e.target.value })}
                placeholder="🌹"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">{t.categoriesExtra.order}</label>
              <input
                type="number"
                value={edit.sortOrder}
                onChange={(e) => setEdit({ ...edit, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={edit.isVisible}
                  onChange={(e) => setEdit({ ...edit, isVisible: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm text-stone-600">{lang === 'fi' ? 'Näkyvissä' : 'Visible'}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-2 rounded-lg"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? t.categoriesExtra.saving : t.categoriesExtra.save}
            </button>
            <button
              onClick={() => { setEdit(null); setError(''); }}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 px-3 py-2 rounded-lg border border-stone-200 hover:bg-stone-50"
            >
              <X className="w-3.5 h-3.5" />
              {t.categoriesExtra.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50 border-b border-stone-200">
              <th className="px-5 py-3 text-left font-medium w-6" />
              <th className="px-5 py-3 text-left font-medium">{t.categories.slug}</th>
              <th className="px-5 py-3 text-left font-medium">{t.categories.nameFi}</th>
              <th className="px-5 py-3 text-left font-medium">{t.categories.nameEn}</th>
              <th className="px-5 py-3 text-left font-medium">{t.categories.products}</th>
              <th className="px-5 py-3 text-left font-medium">{t.categories.order}</th>
              <th className="px-5 py-3 text-left font-medium">{lang === 'fi' ? 'Näkyvyys' : 'Visible'}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading && <tr><td colSpan={8} className="px-5 py-8 text-center text-stone-400">{t.common.loading}</td></tr>}
            {!loading && categories.length === 0 && <tr><td colSpan={8} className="px-5 py-8 text-center text-stone-400">{lang === 'fi' ? 'Ei kategorioita' : 'No categories'}</td></tr>}
            {!loading && categories.map((c) => {
              const isExp = !!expanded[c.id];
              const catVisible = (c as any).isVisible !== false;
              return (
                <>
                  <tr key={c.id} className="hover:bg-stone-50">
                    <td className="px-3 py-3">
                      <button
                        onClick={() => toggleExpand(c.id)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                        title={lang === 'fi' ? 'Näytä alakategoriat' : 'Show subcategories'}
                      >
                        {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-stone-500">{c.slug}</td>
                    <td className="px-5 py-3 font-medium text-stone-800">
                      {(c as any).icon && <span className="mr-1.5">{(c as any).icon}</span>}
                      {c.name_fi}
                    </td>
                    <td className="px-5 py-3 text-stone-500">{c.name_en}</td>
                    <td className="px-5 py-3 text-stone-500">{c.productCount ?? 0}</td>
                    <td className="px-5 py-3 text-stone-500">{c.sortOrder}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleVisible(c)}
                        title={catVisible ? 'Piilota' : 'Näytä'}
                        className={`p-1.5 rounded-lg transition-colors ${catVisible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-stone-300 hover:bg-stone-100'}`}
                      >
                        {catVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEdit({ id: c.id, slug: c.slug, name_fi: c.name_fi, name_en: c.name_en, icon: (c as any).icon || '', isVisible: (c as any).isVisible !== false, sortOrder: c.sortOrder });
                            setError('');
                          }}
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

                  {/* Subcategories expanded row */}
                  {isExp && (
                    <tr key={`${c.id}-subs`}>
                      <td colSpan={8} className="bg-stone-50 px-10 py-4 border-b border-stone-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                          {lang === 'fi' ? 'Alakategoriat' : 'Subcategories'}
                        </p>
                        <div className="space-y-1.5 mb-4">
                          {(subcats[c.id] ?? []).length === 0 && (
                            <p className="text-xs text-stone-400">{lang === 'fi' ? 'Ei alakategorioita' : 'No subcategories'}</p>
                          )}
                          {(subcats[c.id] ?? []).map((sub) => (
                            <div key={sub.id} className="flex items-center gap-3 bg-white border border-stone-100 rounded-lg px-3 py-2">
                              <span className="text-sm text-stone-700 font-medium flex-1">{sub.name_fi}</span>
                              <span className="text-xs text-stone-400">{sub.name_en}</span>
                              <button
                                onClick={() => handleToggleSubVisible(c.id, sub)}
                                className={`p-1 rounded transition-colors ${sub.isVisible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-stone-300 hover:bg-stone-100'}`}
                                title={sub.isVisible ? 'Piilota' : 'Näytä'}
                              >
                                {sub.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteSub(c.id, sub.id)}
                                className="p-1 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add subcategory */}
                        <div className="flex items-center gap-2">
                          <input
                            value={newSub[c.id]?.name_fi ?? ''}
                            onChange={(e) => setNewSub((prev) => ({ ...prev, [c.id]: { ...prev[c.id], name_fi: e.target.value } }))}
                            placeholder={lang === 'fi' ? 'Nimi FI' : 'Name FI'}
                            className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 w-36"
                          />
                          <input
                            value={newSub[c.id]?.name_en ?? ''}
                            onChange={(e) => setNewSub((prev) => ({ ...prev, [c.id]: { ...prev[c.id], name_en: e.target.value } }))}
                            placeholder={lang === 'fi' ? 'Nimi EN' : 'Name EN'}
                            className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 w-36"
                          />
                          <button
                            onClick={() => handleAddSub(c.id)}
                            disabled={savingSub[c.id]}
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            {lang === 'fi' ? 'Lisää' : 'Add'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
