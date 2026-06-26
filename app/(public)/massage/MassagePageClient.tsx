'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, MapPin, X, Calendar, User, Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { MASSAGE_SERVICES, MASSAGE_CATEGORIES, cn } from '@/lib/utils';

type ServiceVariant = typeof MASSAGE_SERVICES[number];

interface ModalState {
  service: ServiceVariant;
}

export default function MassagePageClient() {
  const t = useTranslations('massage');
  const locale = useLocale();
  const isFi = locale === 'fi';
  const fromWord = isFi ? 'alkaen' : 'from';
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const openModal = (service: ServiceVariant) => {
    setModal({ service });
    setSubmitted(false);
    setError('');
    setForm({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  };

  const closeModal = () => setModal(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service: modal.service.id }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(t('booking.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-28 pb-10 lg:pt-36 lg:pb-14 px-4 sm:px-6 lg:px-10" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--accent-pink)' }}>
            Aava Floristi · Sincere 9-Master
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-4" style={{ color: 'var(--burgundy)' }}>
            Hieronta & Spa
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            Puistolantori 1 · Puistola · Helsinki
          </div>
        </div>
      </section>

      {/* Accordion */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-2">
        {MASSAGE_CATEGORIES.map((cat) => {
          const services = MASSAGE_SERVICES.filter((s) => s.category === cat.id);
          const isOpen = openCategory === cat.id;
          const minPrice = Math.min(...services.map((s) => s.price));

          return (
            <div
              key={cat.id}
              className="rounded-2xl overflow-hidden border transition-all duration-200"
              style={{ borderColor: isOpen ? 'var(--accent-pink)' : '#e2e8f0' }}
            >
              {/* Category header */}
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{ backgroundColor: isOpen ? 'var(--soft-pink)' : 'white' }}
              >
                <div>
                  <span className="font-semibold text-base" style={{ color: 'var(--burgundy)' }}>
                    {isFi ? cat.label : cat.label_en}
                  </span>
                  {!isOpen && (
                    <span className="ml-3 text-xs text-gray-400">{fromWord} {minPrice} €</span>
                  )}
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>

              {/* Services */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    {/* Description */}
                    {services[0]?.desc_fi && (
                      <p className="px-5 pb-3 text-sm text-gray-400 leading-relaxed border-b border-gray-100">
                        {services[0].desc_fi}
                      </p>
                    )}

                    <div className="divide-y divide-gray-50">
                      {services.map((s) => (
                        <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                            {s.duration} min
                            {s.name_fi !== services[0].name_fi && (
                              <span className="text-xs text-gray-400 ml-1">· {isFi ? s.name_fi : s.name_en}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-base" style={{ color: 'var(--burgundy)' }}>
                              {s.price} €
                            </span>
                            <button
                              onClick={() => openModal(s)}
                              className="text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all text-white"
                              style={{ backgroundColor: 'var(--burgundy)' }}
                            >
                              Varaa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white rounded-[28px] shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">Varaa aika</p>
                  <p className="font-semibold text-base" style={{ color: 'var(--burgundy)' }}>
                    {isFi ? modal.service.name_fi : modal.service.name_en}
                  </p>
                  <p className="text-sm text-gray-400">{modal.service.duration} min · {modal.service.price} €</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--soft-pink)' }}>
                      <CheckCircle2 className="w-7 h-7" style={{ color: 'var(--burgundy)' }} />
                    </div>
                    <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--burgundy)' }}>{t('booking.thanks')}</h3>
                    <p className="text-sm text-gray-400">{t('booking.success')}</p>
                    <button onClick={closeModal} className="mt-5 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--accent-pink)' }}>
                      Sulje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          <User className="w-3 h-3" /> {t('booking.name')} *
                        </label>
                        <input
                          type="text" required value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Etunimi Sukunimi"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          <Phone className="w-3 h-3" /> {t('booking.phone')} *
                        </label>
                        <input
                          type="tel" required value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+358 50 000 0000"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          <Mail className="w-3 h-3" /> {t('booking.email')} *
                        </label>
                        <input
                          type="email" required value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="email@gmail.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          <Calendar className="w-3 h-3" /> {t('booking.date')} *
                        </label>
                        <input
                          type="date" required min={today} value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          <Clock className="w-3 h-3" /> {t('booking.time')} *
                        </label>
                        <select
                          required value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition-colors"
                        >
                          <option value="">—</option>
                          {times.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          <MessageSquare className="w-3 h-3" /> {t('booking.notes')}
                        </label>
                        <textarea
                          rows={2} value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          placeholder="Lisätietoja..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                    <button
                      type="submit" disabled={loading}
                      className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--burgundy)' }}
                    >
                      {loading ? t('booking.sending') : t('booking.submit')}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
