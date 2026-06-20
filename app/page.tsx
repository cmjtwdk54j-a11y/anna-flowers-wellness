export const dynamic = 'force-dynamic';

import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Flower2, Hand, Truck, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations('home');

  const whyUsItems = [
    { icon: Star, key: 'fresh', desc: 'freshDesc' },
    { icon: Truck, key: 'fast', desc: 'fastDesc' },
    { icon: CheckCircle2, key: 'personal', desc: 'personalDesc' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-stone-50 to-amber-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <Flower2 className="w-3.5 h-3.5" />
                Helsinki · Espoo · Vantaa · Kerava
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 leading-tight mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-md">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/flowers"
                  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-rose-200"
                >
                  <Flower2 className="w-4 h-4" />
                  {t('hero.shopNow')}
                </Link>
                <Link
                  href="/massage"
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  <Hand className="w-4 h-4" />
                  {t('hero.bookMassage')}
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-stone-100">
                <div className="text-center">
                  <div className="text-xl font-bold text-stone-800">500+</div>
                  <div className="text-xs text-stone-400">{t('trustBadge.customers')}</div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div className="text-center">
                  <div className="text-xl font-bold text-stone-800">4.9★</div>
                  <div className="text-xs text-stone-400">{t('trustBadge.rating')}</div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div className="text-center">
                  <div className="text-xl font-bold text-stone-800">2–5h</div>
                  <div className="text-xs text-stone-400">{t('trustBadge.delivery')}</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-48 bg-rose-100">
                    <Image
                      src="https://images.unsplash.com/photo-1548266652-99cf27701ced?w=300&h=200&fit=crop"
                      alt="Kukkakimppu"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-32 bg-rose-50">
                    <Image
                      src="https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=300&h=150&fit=crop"
                      alt="Häät"
                      width={300}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl overflow-hidden h-32 bg-emerald-50">
                    <Image
                      src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=150&fit=crop"
                      alt="Hieronta"
                      width={300}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48 bg-amber-50">
                    <Image
                      src="https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=300&h=200&fit=crop"
                      alt="Tulppaanit"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-10">
            {t('services.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/flowers"
              className="group p-6 rounded-2xl border border-stone-100 hover:border-rose-200 hover:shadow-md transition-all bg-stone-50 hover:bg-rose-50"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                <Flower2 className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">{t('services.flowers.title')}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {t('services.flowers.description')}
              </p>
              <div className="flex items-center gap-1 mt-4 text-rose-500 text-sm font-medium group-hover:gap-2 transition-all">
                {t('services.flowers.link')} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/massage"
              className="group p-6 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:shadow-md transition-all bg-stone-50 hover:bg-emerald-50"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <Hand className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">{t('services.massage.title')}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {t('services.massage.description')}
              </p>
              <div className="flex items-center gap-1 mt-4 text-emerald-500 text-sm font-medium group-hover:gap-2 transition-all">
                {t('services.massage.link')} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/delivery"
              className="group p-6 rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all bg-stone-50 hover:bg-amber-50"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <Truck className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">{t('services.delivery.title')}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {t('services.delivery.description')}
              </p>
              <div className="flex items-center gap-1 mt-4 text-amber-500 text-sm font-medium group-hover:gap-2 transition-all">
                {t('services.delivery.link')} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts locale={locale} />

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-10">
            {t('whyUs.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyUsItems.map(({ icon: Icon, key, desc }) => (
              <div key={key} className="text-center">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">
                  {t(`whyUs.${key}` as any)}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {t(`whyUs.${desc}` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-rose-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('giftCardBanner.title')}
          </h2>
          <p className="text-rose-100 mb-6">
            {t('giftCardBanner.subtitle')}
          </p>
          <Link
            href="/gift-cards"
            className="inline-flex items-center gap-2 bg-white text-rose-500 hover:bg-rose-50 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t('giftCardBanner.button')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
