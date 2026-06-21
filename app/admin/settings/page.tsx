'use client';

import { useEffect, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import type { StoreSettingsData } from '@/lib/admin/types';
import { useAdminLang } from '@/components/admin/AdminLangContext';

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
  const { lang, t } = useAdminLang();
  const [settings, setSettings] = useState<StoreSettingsData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [resetting, setResetting] = useState(false);

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
    setMsg(res.ok
      ? (lang === 'fi' ? 'Tallennettu!' : 'Saved!')
      : (lang === 'fi' ? 'Tallennus epäonnistui' : 'Save failed'));
    setSaving(false);
    if (res.ok) setTimeout(() => setMsg(''), 3000);
  };

  const F = ({ label, field, type = 'text', placeholder }: {
    label: string; field: keyof StoreSettingsData; type?: string; placeholder?: string;
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

  if (loading) return (
    <div className="p-6 lg:p-8 text-sm text-stone-400">{t.common.loading}</div>
  );

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">{t.settings.title}</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {lang === 'fi' ? 'Myymälän perustiedot ja konfiguraatio' : 'Store information and configuration'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className={`text-xs font-medium ${msg.includes('epäonnistui') || msg.includes('failed') ? 'text-red-500' : 'text-emerald-600'}`}>{msg}</span>}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? t.common.saving : t.common.save}
          </button>
        </div>
      </div>

      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">
          {lang === 'fi' ? 'Myymälän tiedot' : 'Store details'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label={lang === 'fi' ? 'Myymälän nimi' : 'Store name'} field="storeName" placeholder="Aavafloristi" />
          <F label={lang === 'fi' ? 'Sähköposti' : 'Email'} field="email" type="email" placeholder="info@aavafloristi.fi" />
          <F label={lang === 'fi' ? 'Puhelin' : 'Phone'} field="phone" placeholder="+358 40 123 4567" />
          <F label={lang === 'fi' ? 'Osoite' : 'Address'} field="address" placeholder="Puistolantori 1, 00760 Helsinki" />
          <F label="Instagram" field="instagram" placeholder="@aavafloristi" />
          <F label="Telegram" field="telegram" placeholder="@aavafloristi" />
        </div>
      </section>

      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">
          {lang === 'fi' ? 'Toimitus' : 'Delivery'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label={lang === 'fi' ? 'Toimitusmaksu (€)' : 'Delivery fee (€)'} field="deliveryFee" type="number" placeholder="9.90" />
          <F label={lang === 'fi' ? 'Minimitilaus (€)' : 'Min. order (€)'} field="minOrderAmount" type="number" placeholder="0" />
        </div>
      </section>

      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">
          {lang === 'fi' ? 'Aukioloajat' : 'Opening hours'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label={lang === 'fi' ? 'Arkisin' : 'Weekdays'} field="weekdays" placeholder="Ma–Pe: 9:00–18:00" />
          <F label={lang === 'fi' ? 'Lauantai' : 'Saturday'} field="saturday" placeholder="La: 10:00–16:00" />
          <F label={lang === 'fi' ? 'Sunnuntai' : 'Sunday'} field="sunday" placeholder="Su: Suljettu" />
        </div>
      </section>

      <section className="bg-white border border-red-100 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-red-700">
          {lang === 'fi' ? 'Vaaravyöhyke' : 'Danger zone'}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700">
              {lang === 'fi' ? 'Poista kaikki testitilaukset' : 'Delete all test orders'}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              {lang === 'fi'
                ? 'Poistaa kaikki tilaukset pysyvästi. Käytä ennen asiakkaalle luovuttamista.'
                : 'Permanently deletes all orders. Use before handing over to the client.'}
            </p>
          </div>
          <button
            type="button"
            disabled={resetting}
            onClick={async () => {
              const confirmed = window.confirm(
                lang === 'fi'
                  ? 'Haluatko varmasti poistaa KAIKKI tilaukset? Tätä ei voi peruuttaa.'
                  : 'Are you sure you want to delete ALL orders? This cannot be undone.'
              );
              if (!confirmed) return;
              setResetting(true);
              const res = await fetch('/api/admin/reset-orders', { method: 'DELETE' });
              const data = await res.json();
              setResetting(false);
              if (res.ok) {
                alert(lang === 'fi' ? `Poistettu ${data.deleted} tilausta.` : `Deleted ${data.deleted} orders.`);
              } else {
                alert(lang === 'fi' ? 'Virhe poistamisessa.' : 'Error deleting orders.');
              }
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            {resetting
              ? (lang === 'fi' ? 'Poistetaan...' : 'Deleting...')
              : (lang === 'fi' ? 'Tyhjennä tilaukset' : 'Clear orders')}
          </button>
        </div>
      </section>

      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">
          {lang === 'fi' ? 'Ilmoitukset' : 'Notifications'}
        </h2>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            {lang === 'fi' ? 'Tilausvahvistusteksti' : 'Order confirmation text'}
          </label>
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
