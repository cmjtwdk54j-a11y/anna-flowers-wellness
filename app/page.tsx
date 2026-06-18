import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Flower2, Hand, Truck, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');
  const tFlowers = useTranslations('flowers');

  const featuredProducts = [
    {
      id: '1',
      slug: 'romanttinen-ruusukukka',
      name_fi: 'Romanttinen ruusukukka',
      name_en: 'Romantic Rose Bouquet',
      priceSmall: 35,
      priceLarge: 65,
      imageUrl: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=400&fit=crop',
      category: 'bouquets',
    },
    {
      id: '2',
      slug: 'haat-valkoinen',
      name_fi: 'Häiden valkoinen kimppu',
      name_en: 'Wedding White Bouquet',
      priceSmall: 85,
      priceLarge: 150,
      imageUrl: 'https://images.unsplash.com/photo-1487530811015-780a59f9e2e0?w=400&h=400&fit=crop',
      category: 'wedding',
    },
    {
      id: '3',
      slug: 'vaaleanpunainen-sekakimppu',
      name_fi: 'Vaaleanpunainen sekakimppu',
      name_en: 'Pink Mixed Bouquet',
      priceSmall: 28,
      priceLarge: 55,
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc66?w=400&h=400&fit=crop',
      category: 'bouquets',
    },
    {
      id: '4',
      slug: 'kevainen-tulppaanikimppu',
      name_fi: 'Kevään tulppaanit',
      name_en: 'Spring Tulip Bouquet',
      priceSmall: 22,
      priceLarge: 42,
      imageUrl: 'https://images.unsplash.com/photo-1453293425659-d33fef51fa7c?w=400&h=400&fit=crop',
      category: 'bouquets',
    },
  ];

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
                  <div className="text-xs text-stone-400">tyytyväistä asiakasta</div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div className="text-center">
                  <div className="text-xl font-bold text-stone-800">4.9★</div>
                  <div className="text-xs text-stone-400">asiakasarvio</div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div className="text-center">
                  <div className="text-xl font-bold text-stone-800">2–5h</div>
                  <div className="text-xs text-stone-400">toimitusaika</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-48 bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1490750967868-88df5691cc66?w=300&h=200&fit=crop"
                      alt="Kukkakimppu"
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-32 bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1487530811015-780a59f9e2e0?w=300&h=150&fit=crop"
                      alt="Häät"
                      width={300}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl overflow-hidden h-32 bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=150&fit=crop"
                      alt="Hieronta"
                      width={300}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48 bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1453293425659-d33fef51fa7c?w=300&h=200&fit=crop"
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
                Katso tuotteet <ArrowRight className="w-4 h-4" />
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
                Varaa aika <ArrowRight className="w-4 h-4" />
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
                Toimitusalueet <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-stone-800">{t('featured')}</h2>
            <Link
              href="/flowers"
              className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
            >
              Kaikki tuotteet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/flowers/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-rose-200 hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden bg-stone-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name_fi}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-stone-800 leading-tight mb-1">
                    {product.name_fi}
                  </h3>
                  <p className="text-xs text-stone-400 mb-2">
                    {tFlowers('from')} {product.priceSmall} €
                  </p>
                  <span className="inline-block text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-medium">
                    {tFlowers('addToCart')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            Osta lahjakortti läheisellesi
          </h2>
          <p className="text-rose-100 mb-6">
            Lahjakortit alkaen 50 € – sopii kaikille tilaisuuksiin
          </p>
          <Link
            href="/gift-cards"
            className="inline-flex items-center gap-2 bg-white text-rose-500 hover:bg-rose-50 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Osta lahjakortti <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
