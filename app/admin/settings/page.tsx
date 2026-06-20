'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import type { StoreSettingsData } from '@/lib/admin/types';

const DEFAULT: StoreSettingsData = {
  storeName: 'Aavafloristi',
  phone: '+358 40 123 4567',
  email: 'info@aavafloristi.fi',
  address: 'Puistolantori 1, 00760 Helsinki',
  instagram: '',
  telegram: '',
  deliveryFee: 9.9,
  minOrderAmount: 0,
  weekdays: 'Ma–Pe: 9:00–18:00',
  saturday: 'La: 10:00–16:00',
  sunday: 'Su: Suljettu',
  confirmationText: 'Kiitos tilauksestasi! Otamme sinuun yhteyttä pian.',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettingsData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setSettings(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setMsg(res.ok ? 'Tallennettu!' : 'Tallennus epäonnistui');
    setSaving(false);
    if (res.ok) setTimeout(() => setMsg(''), 3000);
  };

  const F = ({ label, field, type = 'text', placeholder }: {
    label: string;
    field: keyof StoreSettingsData;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      <input
        type={type}
        value={String(settings[field] ?? '')}
        onChange={(e) => setSettings({ ...settings, [field]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
        placeholder={placeholder}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );

  if (loading) return <div className="p-6 lg:p-8 text-sm text-stone-400">Ladataan asetuksia...</div>;

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Asetukset</h1>
          <p className="text-sm text-stone-400 mt-0.5">Myymälän perustiedot ja konfiguraatio</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className={`text-xs font-medium ${msg.includes('epäonnistui') ? 'text-red-500' : 'text-emerald-600'}`}>{msg}</span>}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Tallennetaan...' : 'Tallenna'}
          </button>
        </div>
      </div>

      {/* Store info */}
      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Myymälän tiedot</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label="Myymälän nimi" field="storeName" placeholder="Aavafloristi" />
          <F label="Sähköposti" field="email" type="email" placeholder="info@aavafloristi.fi" />
          <F label="Puhelin" field="phone" placeholder="+358 40 123 4567" />
          <F label="Osoite" field="address" placeholder="Puistolantori 1, 00760 Helsinki" />
          <F label="Instagram" field="instagram" placeholder="@aavafloristi" />
          <F label="Telegram" field="telegram" placeholder="@aavafloristi" />
        </div>
      </section>

      {/* Delivery */}
      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Toimitus</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label="Toimitusmaksu (€)" field="deliveryFee" type="number" placeholder="9.90" />
          <F label="Minimitilaus (€)" field="minOrderAmount" type="number" placeholder="0" />
        </div>
      </section>

      {/* Hours */}
      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Aukioloajat</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Arkisin" field="weekdays" placeholder="Ma–Pe: 9:00–18:00" />
          <F label="Lauantai" field="saturday" placeholder="La: 10:00–16:00" />
          <F label="Sunnuntai" field="sunday" placeholder="Su: Suljettu" />
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Ilmoitukset</h2>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Tilausvahvistusteksti</label>
          <textarea
            value={settings.confirmationText}
            onChange={(e) => setSettings({ ...settings, confirmationText: e.target.value })}
            rows={3}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            placeholder="Kiitos tilauksestasi!"
          />
        </div>
      </section>
    </form>
  );
}
