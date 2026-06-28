'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangContext';

interface MassageService {
  id: string;
  name_fi: string;
  name_en: string;
  desc_fi: string;
  desc_en: string;
  duration: number;
  price: number;
  sortOrder: number;
  isActive: boolean;
}

interface MassageCategory {
  id: string;
  slug: string;
  name_fi: string;
  name_en: string;
  sortOrder: number;
  isActive: boolean;
  services: MassageService[];
}

const EMPTY_SERVICE = { name_fi: '', name_en: '', desc_fi: '', desc_en: '', duration: 60, price: 0 };

function Field({ label, value, onChange, type = 'text', rows }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; rows?: number;
}) {
  const cls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400';
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={cls + ' resize-none'} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

export default function MassageServicesPage() {
  const { t } = useAdminLang();
  const ms = t.massageServices;

  const [categories, setCategories] = useState<MassageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ name_fi: '', name_en: '', slug: '' });

  const [showNewCat, setShowNewCat] = useState(false);
  const [newCat, setNewCat] = useState({ name_fi: '', name_en: '', slug: '' });

  const [editingService, setEditingService] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({ ...EMPTY_SERVICE });

  const [addingServiceTo, setAddingServiceTo] = useState<string | null>(null);
  const [newService, setNewService] = useState({ ...EMPTY_SERVICE });

  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/massage/categories');
    if (res.ok) {
      const data: MassageCategory[] = await res.json();
      setCategories(data);
      // auto-expand all on first load
      setExpandedCats(new Set(data.map((c) => c.id)));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSeed = async () => {
    if (!confirm(ms.confirmSeed)) return;
    setSeeding(true);
    await fetch('/api/admin/massage/seed', { method: 'POST' });
    await fetchData();
    setSeeding(false);
  };

  const toggleCat = (catId: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // Category CRUD
  const startEditCat = (cat: MassageCategory) => {
    setEditingCat(cat.id);
    setCatForm({ name_fi: cat.name_fi, name_en: cat.name_en, slug: cat.slug });
  };

  const saveCat = async (catId: string) => {
    await fetch(`/api/admin/massage/categories/${catId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catForm),
    });
    setEditingCat(null);
    setCategories((prev) => prev.map((c) => c.id === catId ? { ...c, ...catForm } : c));
  };

  const deleteCat = async (catId: string) => {
    if (!confirm(ms.confirmDeleteCat)) return;
    await fetch(`/api/admin/massage/categories/${catId}`, { method: 'DELETE' });
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const createCat = async () => {
    if (!newCat.name_fi || !newCat.name_en) return;
    const slug = newCat.slug || newCat.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await fetch('/api/admin/massage/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCat, slug, sortOrder: categories.length }),
    });
    if (res.ok) {
      setShowNewCat(false);
      setNewCat({ name_fi: '', name_en: '', slug: '' });
      await fetchData();
    }
  };

  // Service CRUD
  const startEditService = (svc: MassageService) => {
    setEditingService(svc.id);
    setServiceForm({ name_fi: svc.name_fi, name_en: svc.name_en, desc_fi: svc.desc_fi, desc_en: svc.desc_en, duration: svc.duration, price: svc.price });
  };

  const saveService = async (svcId: string, catId: string) => {
    await fetch(`/api/admin/massage/services/${svcId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceForm),
    });
    setEditingService(null);
    setCategories((prev) => prev.map((c) =>
      c.id === catId
        ? { ...c, services: c.services.map((s) => s.id === svcId ? { ...s, ...serviceForm } : s) }
        : c
    ));
  };

  const deleteService = async (svcId: string, catId: string) => {
    if (!confirm(ms.confirmDeleteService)) return;
    await fetch(`/api/admin/massage/services/${svcId}`, { method: 'DELETE' });
    setCategories((prev) => prev.map((c) =>
      c.id === catId ? { ...c, services: c.services.filter((s) => s.id !== svcId) } : c
    ));
  };

  const createService = async (catId: string) => {
    if (!newService.name_fi || !newService.name_en || !newService.price) return;
    const cat = categories.find((c) => c.id === catId);
    const res = await fetch('/api/admin/massage/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newService, categoryId: catId, sortOrder: cat?.services.length ?? 0 }),
    });
    if (res.ok) {
      setAddingServiceTo(null);
      setNewService({ ...EMPTY_SERVICE });
      await fetchData();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{ms.title}</h1>
        <div className="flex gap-3">
          {categories.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium disabled:opacity-50">
              {seeding ? ms.seeding : ms.loadDefaults}
            </button>
          )}
          <button onClick={() => setShowNewCat(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1e3a8a' }}>
            <Plus className="w-4 h-4" /> {ms.addCategory}
          </button>
        </div>
      </div>

      {/* New category form */}
      {showNewCat && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
          <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-3">{ms.newCategory}</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field label={ms.nameFi + ' *'} value={newCat.name_fi} onChange={(v) => setNewCat({ ...newCat, name_fi: v })} />
            <Field label={ms.nameEn + ' *'} value={newCat.name_en} onChange={(v) => setNewCat({ ...newCat, name_en: v })} />
            <Field label={ms.slug} value={newCat.slug} onChange={(v) => setNewCat({ ...newCat, slug: v })} />
          </div>
          <div className="flex gap-2">
            <button onClick={createCat}
              className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: '#1e3a8a' }}>
              {ms.save}
            </button>
            <button onClick={() => setShowNewCat(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">
              {ms.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">{ms.loading}</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 mb-4">{ms.empty}</p>
          <button onClick={handleSeed} disabled={seeding}
            className="px-6 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: '#1e3a8a' }}>
            {seeding ? ms.seeding : ms.loadDefaults}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const isExpanded = expandedCats.has(cat.id);
            const isEditingThisCat = editingCat === cat.id;

            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50">
                  {isEditingThisCat ? (
                    <div className="flex gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input value={catForm.name_fi} onChange={(e) => setCatForm({ ...catForm, name_fi: e.target.value })}
                        placeholder="Nimi FI"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-blue-400" />
                      <input value={catForm.name_en} onChange={(e) => setCatForm({ ...catForm, name_en: e.target.value })}
                        placeholder="Name EN"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                      <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                        placeholder="slug"
                        className="w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:border-blue-400" />
                    </div>
                  ) : (
                    <button onClick={() => toggleCat(cat.id)} className="flex-1 text-left">
                      <span className="font-bold text-gray-800">{cat.name_fi}</span>
                      <span className="text-gray-400 text-sm ml-2">/ {cat.name_en}</span>
                      <span className="text-gray-300 text-xs ml-3">{cat.services.length} {ms.services}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isEditingThisCat ? (
                      <>
                        <button onClick={() => saveCat(cat.id)}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingCat(null)}
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditCat(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-gray-700 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCat(cat.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleCat(cat.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-white transition-colors ml-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Services */}
                {isExpanded && (
                  <div>
                    {cat.services.length === 0 && (
                      <p className="px-5 py-3 text-sm text-gray-300 italic">—</p>
                    )}

                    {cat.services.map((svc) => {
                      const isEditingThisSvc = editingService === svc.id;

                      return (
                        <div key={svc.id} className="border-t border-gray-50">
                          {isEditingThisSvc ? (
                            <div className="px-5 py-4 bg-blue-50">
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <Field label={ms.nameFi + ' *'} value={serviceForm.name_fi}
                                  onChange={(v) => setServiceForm({ ...serviceForm, name_fi: v })} />
                                <Field label={ms.nameEn + ' *'} value={serviceForm.name_en}
                                  onChange={(v) => setServiceForm({ ...serviceForm, name_en: v })} />
                                <Field label={ms.duration + ' *'} value={serviceForm.duration} type="number"
                                  onChange={(v) => setServiceForm({ ...serviceForm, duration: Number(v) })} />
                                <Field label={ms.price + ' *'} value={serviceForm.price} type="number"
                                  onChange={(v) => setServiceForm({ ...serviceForm, price: Number(v) })} />
                                <Field label={ms.descFi} value={serviceForm.desc_fi} rows={2}
                                  onChange={(v) => setServiceForm({ ...serviceForm, desc_fi: v })} />
                                <Field label={ms.descEn} value={serviceForm.desc_en} rows={2}
                                  onChange={(v) => setServiceForm({ ...serviceForm, desc_en: v })} />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => saveService(svc.id, cat.id)}
                                  className="px-4 py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: '#1e3a8a' }}>
                                  {ms.save}
                                </button>
                                <button onClick={() => setEditingService(null)}
                                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">
                                  {ms.cancel}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                              <span className="text-xs font-mono text-gray-400 w-14 flex-shrink-0">{svc.duration} min</span>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-700">{svc.name_fi}</span>
                                {svc.name_en !== svc.name_fi && (
                                  <span className="text-xs text-gray-400 ml-2">/ {svc.name_en}</span>
                                )}
                              </div>
                              <span className="font-bold text-sm flex-shrink-0" style={{ color: '#1e3a8a' }}>{svc.price} €</span>
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => startEditService(svc)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-gray-700 transition-colors">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteService(svc.id, cat.id)}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add service */}
                    {addingServiceTo === cat.id ? (
                      <div className="border-t border-gray-50 px-5 py-4 bg-green-50">
                        <p className="text-xs font-black uppercase tracking-wider text-green-700 mb-3">{ms.addService}</p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Field label={ms.nameFi + ' *'} value={newService.name_fi}
                            onChange={(v) => setNewService({ ...newService, name_fi: v })} />
                          <Field label={ms.nameEn + ' *'} value={newService.name_en}
                            onChange={(v) => setNewService({ ...newService, name_en: v })} />
                          <Field label={ms.duration + ' *'} value={newService.duration} type="number"
                            onChange={(v) => setNewService({ ...newService, duration: Number(v) })} />
                          <Field label={ms.price + ' *'} value={newService.price} type="number"
                            onChange={(v) => setNewService({ ...newService, price: Number(v) })} />
                          <Field label={ms.descFi} value={newService.desc_fi} rows={2}
                            onChange={(v) => setNewService({ ...newService, desc_fi: v })} />
                          <Field label={ms.descEn} value={newService.desc_en} rows={2}
                            onChange={(v) => setNewService({ ...newService, desc_en: v })} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => createService(cat.id)}
                            className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium">
                            {ms.save}
                          </button>
                          <button onClick={() => setAddingServiceTo(null)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">
                            {ms.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-gray-50 px-5 py-3">
                        <button
                          onClick={() => { setAddingServiceTo(cat.id); setNewService({ ...EMPTY_SERVICE }); }}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-blue-900 transition-colors">
                          <Plus className="w-3.5 h-3.5" /> {ms.addService}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
