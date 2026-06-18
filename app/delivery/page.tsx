import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Truck, MapPin, Clock, CheckCircle2, School, Home, Building2 } from 'lucide-react';
import { DELIVERY_ZONES } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Toimitusehdot',
  description: 'Toimitamme tuoreita kukkia Helsingissä, Espoossa, Vantaalla ja Keravalla. Ilmainen toimitus lähialueille.',
};

export default function DeliveryPage() {
  const t = useTranslations('delivery');

  const deliveryTypes = [
    { icon: Home, label: 'Kotiinkuljetus', desc: 'Toimitus suoraan kotiovellesi' },
    { icon: School, label: 'Kouluun', desc: 'Toimitus kouluun tai päiväkotiin' },
    { icon: Building2, label: 'Kaupunkikeskusta', desc: 'Samana päivänä kaupunkikeskustaan' },
    { icon: MapPin, label: 'Nouto liikkeestä', desc: 'Nouda itse myymälästämme' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-stone-50 to-blue-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Truck className="w-3.5 h-3.5" />
              Toimitus
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-3">{t('title')}</h1>
            <p className="text-lg text-stone-500">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Delivery zones */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">{t('zones.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DELIVERY_ZONES.map((zone) => (
              <div key={zone.city} className="bg-stone-50 rounded-2xl p-5 border border-stone-100 hover:border-sky-200 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-stone-800">{zone.city}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-stone-600">
                      Ilmainen toimitus {zone.freeRadiusKm} km säteellä
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-stone-600">
                      {zone.priceOutside} € sen ulkopuolella
                    </p>
                  </div>
                  {zone.sameDayCity && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-stone-600">Samana päivänä saatavilla</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery types */}
      <section className="py-14 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-8">Toimitustavat</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryTypes.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-stone-100 text-center">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-sky-500" />
                </div>
                <h3 className="font-semibold text-stone-800 text-sm mb-1">{label}</h3>
                <p className="text-xs text-stone-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery times */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-6">{t('times.title')}</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 py-3 border-b border-stone-100">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Maanantai – Perjantai</p>
                    <p className="text-sm text-stone-500">9:00 – 18:00</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 py-3 border-b border-stone-100">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Lauantai</p>
                    <p className="text-sm text-stone-500">10:00 – 16:00</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 py-3">
                  <Clock className="w-4 h-4 text-stone-300" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Sunnuntai</p>
                    <p className="text-sm text-stone-400">Suljettu</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Tietoa toimituksesta</h2>
              <ul className="space-y-3">
                {[
                  'Toimitus Helsinki kaupunkikeskustaan samana päivänä tilattaessa ennen klo 14:00',
                  'Ennakkotilaus mahdollinen – valitse haluamasi toimituspäivä ja -aika',
                  'Saat vahvistuksen ja seurantatiedon sähköpostiisi',
                  'Kukat pakataan huolellisesti tuoreena',
                  'Toimitus kouluihin ja päiväkoteihin onnistuu',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-600">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
