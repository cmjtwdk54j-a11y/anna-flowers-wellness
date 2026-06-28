'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, MessageCircle, Clock, Car, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/utils';

export default function ContactClient() {
  const t = useTranslations('contact');

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-stone-50 to-rose-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-3">{t('title')}</h1>
          <p className="text-stone-500">{t('here')}</p>
        </div>
      </section>

      {/* Full-width OpenStreetMap */}
      <div className="w-full h-96 relative border-b border-stone-100">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=25.072%2C60.285%2C25.092%2C60.295&layer=mapnik&marker=60.2897%2C25.0820"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          title="Aavafloristi – Puistolantori 1, 00760 Helsinki"
        />
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-burgundy flex-shrink-0" />
          <span className="text-sm font-medium text-stone-700">Puistolantori 1, 00760 Helsinki</span>
        </div>
        <a
          href="https://www.google.com/maps/search/Puistolantori+1+00760+Helsinki"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-white hover:bg-stone-50 text-stone-700 rounded-xl shadow-lg px-4 py-2.5 text-sm font-medium transition-colors border border-stone-100"
        >
          Avaa Google Maps ↗
        </a>
      </div>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-soft-pink rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-pink" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      {t('address')}
                    </p>
                    <p className="text-stone-700">{BUSINESS_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-soft-pink rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent-pink" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      {t('phone')}
                    </p>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-stone-700 hover:text-burgundy transition-colors">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-soft-pink rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent-pink" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-0.5">
                      {t('email')}
                    </p>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="text-stone-700 hover:text-burgundy transition-colors">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[\s+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-burgundy hover:bg-burgundy/90 text-white px-5 py-3 rounded-full transition-colors w-fit"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">WhatsApp: {BUSINESS_INFO.whatsapp}</span>
                </a>
              </div>
            </div>

            {/* Right column: Opening hours + Parking */}
            <div className="space-y-6">
              {/* Opening hours */}
              <div className="bg-stone-50 rounded-2xl p-6">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-accent-pink" />
                  {t('openingHours')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-stone-500">{t('weekdays')}</span>
                    <span className="text-stone-800 font-medium">{BUSINESS_INFO.hours.weekdays}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-stone-500">{t('saturday')}</span>
                    <span className="text-stone-800 font-medium">{BUSINESS_INFO.hours.saturday}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-stone-500">{t('sunday')}</span>
                    <span className="text-stone-400">{BUSINESS_INFO.hours.sunday}</span>
                  </li>
                </ul>
              </div>

              {/* Parking */}
              <div className="bg-soft-pink rounded-2xl p-6">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-gold" />
                  {t('parking.title')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-600">{t('parking.spot1')}</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-600">{t('parking.spot2')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
