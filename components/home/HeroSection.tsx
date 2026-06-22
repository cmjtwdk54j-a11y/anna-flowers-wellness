'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Flower2, Hand, Truck, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  t: {
    heroTitle: string;
    heroSubtitle: string;
    heroShopNow: string;
    heroBookMassage: string;
    trustCustomers: string;
    trustRating: string;
    trustDelivery: string;
    servicesTitle: string;
    flowersTitle: string;
    flowersDesc: string;
    flowersLink: string;
    massageTitle: string;
    massageDesc: string;
    massageLink: string;
    deliveryTitle: string;
    deliveryDesc: string;
    deliveryLink: string;
    whyUsTitle: string;
    whyFresh: string;
    whyFreshDesc: string;
    whyFast: string;
    whyFastDesc: string;
    whyPersonal: string;
    whyPersonalDesc: string;
    giftCardTitle: string;
    giftCardSubtitle: string;
    giftCardButton: string;
  };
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: 'easeOut' },
  } as const;
}

export default function HeroSection({ t }: HeroSectionProps) {
  const whyItems = [
    { icon: Star, key: 'fresh', title: t.whyFresh, desc: t.whyFreshDesc },
    { icon: Truck, key: 'fast', title: t.whyFast, desc: t.whyFastDesc },
    { icon: CheckCircle2, key: 'personal', title: t.whyPersonal, desc: t.whyPersonalDesc },
  ];

  const services = [
    { href: '/flowers', color: 'rose', icon: Flower2, title: t.flowersTitle, desc: t.flowersDesc, link: t.flowersLink },
    { href: '/massage', color: 'emerald', icon: Hand, title: t.massageTitle, desc: t.massageDesc, link: t.massageLink },
    { href: '/delivery', color: 'amber', icon: Truck, title: t.deliveryTitle, desc: t.deliveryDesc, link: t.deliveryLink },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-stone-50 to-amber-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <Flower2 className="w-3.5 h-3.5" />
                Helsinki · Espoo · Vantaa · Kerava
              </motion.div>

              <motion.h1 {...fadeUp(0.1)} className="text-4xl lg:text-5xl font-bold text-stone-800 leading-tight mb-4">
                {t.heroTitle}
              </motion.h1>

              <motion.p {...fadeUp(0.2)} className="text-lg text-stone-500 leading-relaxed mb-8 max-w-md">
                {t.heroSubtitle}
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3">
                <Link href="/flowers" className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5">
                  <Flower2 className="w-4 h-4" />
                  {t.heroShopNow}
                </Link>
                <Link href="/massage" className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-medium px-6 py-3 rounded-xl transition-colors">
                  <Hand className="w-4 h-4" />
                  {t.heroBookMassage}
                </Link>
              </motion.div>

              <motion.div {...fadeUp(0.4)} className="flex items-center gap-6 mt-8 pt-8 border-t border-stone-100">
                {[
                  { value: '500+', label: t.trustCustomers },
                  { value: '4.9★', label: t.trustRating },
                  { value: '2–5h', label: t.trustDelivery },
                ].map((badge, i) => (
                  <div key={i} className={i > 0 ? 'flex items-center gap-6' : ''}>
                    {i > 0 && <div className="w-px h-8 bg-stone-200" />}
                    <div className="text-center">
                      <div className="text-xl font-bold text-stone-800">{badge.value}</div>
                      <div className="text-xs text-stone-400">{badge.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Image grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-48 bg-rose-100">
                    <Image src="https://images.unsplash.com/photo-1548266652-99cf27701ced?w=300&h=200&fit=crop" alt="Kukkakimppu" width={300} height={200} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-32 bg-rose-50">
                    <Image src="https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=300&h=150&fit=crop" alt="Häät" width={300} height={150} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl overflow-hidden h-32 bg-emerald-50">
                    <Image src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=150&fit=crop" alt="Hieronta" width={300} height={150} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-48 bg-amber-50">
                    <Image src="https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=300&h=200&fit=crop" alt="Tulppaanit" width={300} height={200} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-stone-800 text-center mb-10"
          >
            {t.servicesTitle}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={s.href} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Link href={s.href} className={`group p-6 rounded-2xl border border-stone-100 hover:border-${s.color}-200 hover:shadow-md transition-all bg-stone-50 hover:bg-${s.color}-50 block`}>
                  <div className={`w-12 h-12 bg-${s.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${s.color}-200 transition-colors`}>
                    <s.icon className={`w-6 h-6 text-${s.color}-500`} />
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-2">{s.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
                  <div className={`flex items-center gap-1 mt-4 text-${s.color}-500 text-sm font-medium group-hover:gap-2 transition-all`}>
                    {s.link} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-stone-800 text-center mb-10"
          >
            {t.whyUsTitle}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyItems.map(({ icon: Icon, key, title, desc }, i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}
        className="py-12 bg-rose-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{t.giftCardTitle}</h2>
          <p className="text-rose-100 mb-6">{t.giftCardSubtitle}</p>
          <Link href="/gift-cards" className="inline-flex items-center gap-2 bg-white text-rose-500 hover:bg-rose-50 font-semibold px-6 py-3 rounded-xl transition-colors hover:-translate-y-0.5 hover:shadow-lg">
            {t.giftCardButton} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>
    </>
  );
}
