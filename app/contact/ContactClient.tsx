'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, MessageCircle, Clock, Car, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/utils';

export default function ContactClient() {
  const t = useTranslations('contact');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-stone-50 to-rose-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-3">{t('title')}</h1>
          <p className="text-stone-500">Olemme täällä sinua varten.</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      {t('address')}
                    </p>
                    <p className="text-stone-700">{BUSINESS_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      {t('phone')}
                    </p>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-stone-700 hover:text-rose-500 transition-colors">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      {t('email')}
                    </p>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="text-stone-700 hover:text-rose-500 transition-colors">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[\s+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl transition-colors w-fit"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">WhatsApp: {BUSINESS_INFO.whatsapp}</span>
                </a>
              </div>

              {/* Opening hours */}
              <div className="bg-stone-50 rounded-2xl p-5 mb-6">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-rose-400" />
                  {t('openingHours')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-stone-500">Ma – Pe</span>
                    <span className="text-stone-800 font-medium">{BUSINESS_INFO.hours.weekdays}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-stone-500">La</span>
                    <span className="text-stone-800 font-medium">{BUSINESS_INFO.hours.saturday}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-stone-500">Su</span>
                    <span className="text-stone-400">{BUSINESS_INFO.hours.sunday}</span>
                  </li>
                </ul>
              </div>

              {/* Parking */}
              <div className="bg-amber-50 rounded-2xl p-5">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-amber-500" />
                  {t('parking.title')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-600">{t('parking.spot1')}</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-600">{t('parking.spot2')}</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right column: Map + Contact form */}
            <div className="space-y-6">
              {/* Google Maps embed */}
              <div className="rounded-2xl overflow-hidden border border-stone-100 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15919.85461441765!2d24.920584!3d60.169857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bc796210691%3A0xad6039088b0b6af0!2sHelsinki!5e0!3m2!1sfi!2sfi!4v1700000000000!5m2!1sfi!2sfi"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Anna Flowers & Wellness sijainti"
                />
              </div>

              {/* Contact form */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <h2 className="font-semibold text-stone-800 mb-5">{t('sendMessage')}</h2>
                {sent ? (
                  <div className="flex flex-col items-center text-center py-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
                    <p className="text-stone-700 font-medium">Viesti lähetetty!</p>
                    <p className="text-stone-400 text-sm mt-1">Vastaamme pian sähköpostiisi.</p>
                    <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }} className="mt-4 text-sm text-rose-500 hover:text-rose-600">
                      Lähetä uusi viesti
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t('name')}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 bg-white"
                    />
                    <input
                      type="email" required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t('yourEmail')}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 bg-white"
                    />
                    <textarea
                      rows={4} required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t('message')}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 bg-white resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl transition-colors"
                    >
                      {t('send')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
