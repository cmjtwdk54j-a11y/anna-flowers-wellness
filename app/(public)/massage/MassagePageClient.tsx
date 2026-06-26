'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Clock, CheckCircle2, Calendar, User, Mail, Phone,
  MessageSquare, MapPin, ChevronRight,
} from 'lucide-react';
import { MASSAGE_SERVICES, MASSAGE_CATEGORIES, cn } from '@/lib/utils';

type CategoryId = typeof MASSAGE_CATEGORIES[number]['id'];

interface ServiceGroup {
  name_fi: string;
  desc_fi: string;
  variants: typeof MASSAGE_SERVICES;
}

function groupByName(services: typeof MASSAGE_SERVICES): ServiceGroup[] {
  const map = new Map<string, ServiceGroup>();
  for (const s of services) {
    if (!map.has(s.name_fi)) {
      map.set(s.name_fi, { name_fi: s.name_fi, desc_fi: s.desc_fi, variants: [] });
    }
    map.get(s.name_fi)!.variants.push(s);
  }
  return Array.from(map.values());
}

export default function MassagePageClient() {
  const t = useTranslations('massage');
  const formRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryId>('urh');
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const today = new Date().toISOString().split('T')[0];

  const selectService = (id: string) => {
    setForm((f) => ({ ...f, service: id }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBookingError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setBookingError(t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  const categoryServices = MASSAGE_SERVICES.filter((s) => s.category === activeCategory);
  const groups = groupByName(categoryServices);
  const selectedServiceInfo = MASSAGE_SERVICES.find((s) => s.id === form.service);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light-gray)' }}>

      {/* Hero */}
      <section className="pt-28 pb-12 lg:pt-36 lg:pb-16" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--accent-pink)' }}>
            Aava Floristi · Sincere 9-Master
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium mb-4" style={{ color: 'var(--burgundy)' }}>
            {t('title')}
          </h1>
          <p className="text-gray-500 text-lg mb-6 max-w-xl">{t('subtitle')}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>Puistolantori 1 · Puistola · Helsinki</span>
          </div>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--burgundy)' }}
          >
            {t('booking.title')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-blue-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {MASSAGE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as CategoryId)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-blue-50'
                )}
                style={activeCategory === cat.id ? { backgroundColor: 'var(--burgundy)' } : undefined}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid sm:grid-cols-2 gap-5">
          {groups.map((group) => (
            <div
              key={group.name_fi}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 4px 20px rgba(15,58,125,0.06)' }}
            >
              <h3 className="font-serif text-xl font-medium mb-2" style={{ color: 'var(--burgundy)' }}>
                {group.name_fi}
              </h3>
              {group.desc_fi && (
                <p className="text-sm text-gray-400 leading-relaxed mb-5">{group.desc_fi}</p>
              )}

              <div className="space-y-2">
                {group.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => selectService(v.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left',
                      form.service === v.id
                        ? 'border-transparent text-white'
                        : 'border-blue-100 hover:border-blue-300 bg-white'
                    )}
                    style={form.service === v.id ? { backgroundColor: 'var(--burgundy)' } : undefined}
                  >
                    <span className={cn('flex items-center gap-2 text-sm font-medium', form.service === v.id ? 'text-white' : 'text-gray-700')}>
                      <Clock className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                      {v.duration} min
                    </span>
                    <span className={cn('text-base font-bold', form.service === v.id ? 'text-white' : '')} style={form.service !== v.id ? { color: 'var(--burgundy)' } : undefined}>
                      {v.price} €
                    </span>
                  </button>
                ))}
              </div>

              {group.variants.some((v) => form.service === v.id) && (
                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider border-2 transition-all"
                  style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}
                >
                  Varaa aika →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking form */}
      <div ref={formRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
        <div className="bg-white rounded-[32px] p-8 lg:p-10" style={{ boxShadow: '0 8px 40px rgba(15,58,125,0.08)' }}>
          <h2 className="font-serif text-3xl font-medium mb-1" style={{ color: 'var(--burgundy)' }}>
            {t('booking.title')}
          </h2>
          <p className="text-sm text-gray-400 mb-8">{t('booking.formDesc')}</p>

          {submitted ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--soft-pink)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--burgundy)' }} />
              </div>
              <h3 className="font-serif text-2xl mb-2" style={{ color: 'var(--burgundy)' }}>{t('booking.thanks')}</h3>
              <p className="text-gray-400 text-sm max-w-sm">{t('booking.success')}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' }); }}
                className="mt-6 text-sm font-bold uppercase tracking-wider"
                style={{ color: 'var(--accent-pink)' }}
              >
                {t('booking.newBooking')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Selected service display */}
              {selectedServiceInfo && (
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl border-2" style={{ borderColor: 'var(--accent-pink)', backgroundColor: 'var(--soft-pink)' }}>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Valittu palvelu</p>
                    <p className="font-semibold text-sm" style={{ color: 'var(--burgundy)' }}>
                      {selectedServiceInfo.name_fi} · {selectedServiceInfo.duration} min
                    </p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--burgundy)' }}>{selectedServiceInfo.price} €</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />{t('booking.name')} *
                  </label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Etunimi Sukunimi"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    <Phone className="w-3.5 h-3.5" />{t('booking.phone')} *
                  </label>
                  <input
                    type="tel" required value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+358 50 000 0000"
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5" />{t('booking.email')} *
                </label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="etunimi@esimerkki.fi"
                  className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  {t('booking.service')} *
                </label>
                <select
                  required value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                >
                  <option value="">{t('booking.selectService')}</option>
                  {MASSAGE_CATEGORIES.map((cat) => (
                    <optgroup key={cat.id} label={cat.label}>
                      {MASSAGE_SERVICES.filter((s) => s.category === cat.id).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name_fi} – {s.duration} min – {s.price} €
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />{t('booking.date')} *
                  </label>
                  <input
                    type="date" required min={today} value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />{t('booking.time')} *
                  </label>
                  <select
                    required value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                  >
                    <option value="">{t('booking.selectTime')}</option>
                    {availableTimes.map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" />{t('booking.notes')}
                </label>
                <textarea
                  rows={3} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Lisätietoja, erityistoiveet..."
                  className="w-full border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300 transition-colors resize-none"
                />
              </div>

              {bookingError && <p className="text-xs text-red-500 text-center">{bookingError}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--burgundy)' }}
              >
                {loading ? t('booking.sending') : t('booking.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
