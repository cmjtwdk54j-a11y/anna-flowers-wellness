import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Truck, MapPin, Clock, CheckCircle2, School, Home, Building2 } from 'lucide-react';
import { DELIVERY_ZONES } from '@/lib/utils';
import DeliveryCalculatorClient from './DeliveryCalculatorClient';

export const metadata: Metadata = {
  title: 'Delivery Information',
  description: 'We deliver fresh flowers in Helsinki, Espoo, Vantaa and Kerava. Free delivery to nearby areas.',
};

export default function DeliveryPage() {
  const t = useTranslations('delivery');

  const deliveryTypes = [
    { icon: Home, label: t('types.home'), desc: t('types.homeDesc') },
    { icon: School, label: t('types.school'), desc: t('types.schoolDesc') },
    { icon: Building2, label: t('types.city'), desc: t('types.cityDesc') },
    { icon: MapPin, label: t('types.pickup'), desc: t('types.pickupDesc') },
  ];

  const infoItems = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;

  return (
    <div>
      {/* Hero */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #fdf2f5 0%, #fff 50%, #f5f0ed 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}
            >
              <Truck className="w-3.5 h-3.5" />
              {t('subtitle')}
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-3" style={{ color: 'var(--burgundy)' }}>
              {t('title')}
            </h1>
            <p className="text-lg text-gray-500">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Delivery zones */}
      <section className="py-14" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--burgundy)' }}>{t('zones.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DELIVERY_ZONES.map((zone) => (
              <div
                key={zone.city}
                className="bg-white rounded-[24px] p-5 border border-pink-50 hover:border-[#ffb6d9] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--soft-pink)' }}
                  >
                    <MapPin className="w-4 h-4" style={{ color: 'var(--burgundy)' }} />
                  </div>
                  <h3 className="font-semibold text-gray-800">{zone.city}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--burgundy)' }} />
                    <p className="text-xs text-gray-500">
                      {t('zones.freeRadius', { km: zone.freeRadiusKm })}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-pink)' } as any} />
                    <p className="text-xs text-gray-500">
                      {t('zones.outsidePrice', { price: zone.priceOutside })}
                    </p>
                  </div>
                  {zone.sameDayCity && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                      <p className="text-xs text-gray-500">{t('zones.sameDayLabel')}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Calculator */}
      <DeliveryCalculatorClient />

      {/* Delivery types */}
      <section className="py-14" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--burgundy)' }}>{t('types.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryTypes.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-[24px] p-5 border border-pink-50 text-center">
                <div
                  className="w-12 h-12 rounded-[16px] flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'var(--soft-pink)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: 'var(--burgundy)' }} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{label}</h3>
                <p className="text-xs text-gray-400">{desc}</p>
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
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--burgundy)' }}>{t('times.title')}</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 py-3 border-b border-pink-50">
                  <Clock className="w-4 h-4" style={{ color: 'var(--burgundy)' }} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t('times.mondayLabel')}</p>
                    <p className="text-sm text-gray-400">9:00 – 19:00</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 py-3 border-b border-pink-50">
                  <Clock className="w-4 h-4" style={{ color: 'var(--burgundy)' }} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t('times.saturdayLabel')}</p>
                    <p className="text-sm text-gray-400">9:00 – 16:00</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 py-3">
                  <Clock className="w-4 h-4" style={{ color: 'var(--burgundy)' }} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t('times.sundayLabel')}</p>
                    <p className="text-sm text-gray-400">9:00 – 16:00</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--burgundy)' }}>{t('info.title')}</h2>
              <ul className="space-y-3">
                {infoItems.map((key) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--burgundy)' }} />
                    <p className="text-sm text-gray-500">{t(`info.${key}` as any)}</p>
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
