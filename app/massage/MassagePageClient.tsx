'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Hand, Clock, CheckCircle2, Droplets, Wind, Zap, Brain, Smile, Heart,
  Calendar, User, Mail, Phone, MessageSquare
} from 'lucide-react';
import { MASSAGE_SERVICES } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MassagePageClient() {
  const t = useTranslations('massage');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', date: '', time: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const benefits = [
    { icon: Droplets, key: 'circulation' },
    { icon: Wind, key: 'stress' },
    { icon: Zap, key: 'hair' },
    { icon: Smile, key: 'relax' },
    { icon: Heart, key: 'headache' },
    { icon: Brain, key: 'focus' },
  ];

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBookingError('');
    try {
      const service = MASSAGE_SERVICES.find((s) => s.id === form.service);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          servicePrice: service?.price || 0,
          duration: service?.duration || 30,
          date: new Date(form.date).toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setBookingError(t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-stone-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Hand className="w-3.5 h-3.5" />
              {t('booking.wellness')}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-4">{t('title')}</h1>
            <p className="text-lg text-stone-500 mb-6">{t('subtitle')}</p>
            <p className="text-stone-500 text-sm leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">{t('benefits.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-[18px] h-[18px] text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-stone-700 leading-snug">
                  {t(`benefits.${key}` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Pricing */}
      <section className="py-14 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">{t('services.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: 'basic', nameKey: 'basic', durationKey: 'basic_duration', priceKey: 'basic_price', descKey: 'basic_desc', featured: false },
              { id: 'premium', nameKey: 'premium', durationKey: 'premium_duration', priceKey: 'premium_price', descKey: 'premium_desc', featured: true },
              { id: 'treatment', nameKey: 'treatment', durationKey: 'treatment_duration', priceKey: 'treatment_price', descKey: 'treatment_desc', featured: false },
            ].map((service) => (
              <div
                key={service.id}
                className={cn(
                  'rounded-2xl p-6 border transition-all',
                  service.featured
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'bg-white border-stone-100 hover:border-emerald-200 hover:shadow-md'
                )}
              >
                {service.featured && (
                  <span className="inline-block bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full mb-3">
                    {t('booking.popular')}
                  </span>
                )}
                <h3 className={cn('font-semibold text-lg mb-1', service.featured ? 'text-white' : 'text-stone-800')}>
                  {t(`services.${service.nameKey}` as any)}
                </h3>
                <div className={cn('flex items-center gap-2 mb-3', service.featured ? 'text-emerald-100' : 'text-stone-400')}>
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-sm">{t(`services.${service.durationKey}` as any)}</span>
                </div>
                <p className={cn('text-sm leading-relaxed mb-4', service.featured ? 'text-emerald-100' : 'text-stone-500')}>
                  {t(`services.${service.descKey}` as any)}
                </p>
                <div className={cn('text-2xl font-bold', service.featured ? 'text-white' : 'text-stone-800')}>
                  {t(`services.${service.priceKey}` as any)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-14 bg-white" id="booking">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">{t('booking.title')}</h2>
          <p className="text-stone-500 text-sm mb-8">{t('booking.formDesc')}</p>

          {submitted ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">{t('booking.thanks')}</h3>
              <p className="text-stone-500 text-sm">{t('booking.success')}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' }); }}
                className="mt-6 text-sm text-emerald-500 hover:text-emerald-600 font-medium"
              >
                {t('booking.newBooking')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    {t('booking.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    placeholder="Etunimi Sukunimi"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {t('booking.phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    placeholder="+358 50 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {t('booking.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  placeholder="etunimi@esimerkki.fi"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block">
                  {t('booking.service')} *
                </label>
                <select
                  required
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  <option value="">{t('booking.selectService')}</option>
                  {MASSAGE_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name_fi} – {s.duration} min – {s.price} €
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('booking.date')} *
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t('booking.time')} *
                  </label>
                  <select
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="">{t('booking.selectTime')}</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-stone-600 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t('booking.notes')}
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                  placeholder="Lisätietoja, erityistoiveet..."
                />
              </div>

              {bookingError && (
                <p className="text-xs text-red-500 text-center">{bookingError}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Hand className="w-4 h-4" />
                {loading ? t('booking.sending') : t('booking.submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
