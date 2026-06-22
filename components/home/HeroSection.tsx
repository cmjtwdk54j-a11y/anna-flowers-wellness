'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Flower2, Hand, ChevronLeft, ChevronRight } from 'lucide-react';
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
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  } as const;
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-44 pb-24 px-6 lg:px-10 overflow-hidden min-h-[90vh] flex items-center" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0)} className="mb-6 flex items-center gap-3">
              <div className="flex text-sm" style={{ color: 'var(--gold)' }}>
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">325 Reviews</span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-serif leading-[0.95] font-medium tracking-tighter mb-8"
              style={{ fontSize: 'clamp(60px, 8vw, 100px)', color: 'var(--burgundy)' }}
            >
              Kauneutta ja<br />hyvinvointia
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-gray-500 text-lg mb-12 leading-relaxed max-w-md">
              {t.heroSubtitle}
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex items-center gap-8">
              <Link
                href="/flowers"
                className="px-10 py-4 text-white rounded-full font-bold text-sm tracking-widest uppercase transition-all hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--accent-pink)' }}
              >
                {t.heroShopNow}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">01 / 05</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center transition-all hover:bg-white" style={{ color: 'var(--burgundy)' }}>
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center transition-all hover:bg-white" style={{ color: 'var(--burgundy)' }}>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px] animate-float">
              <Image
                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop"
                alt="Elegant floral arrangement"
                width={560}
                height={640}
                className="w-full h-auto object-contain mask-fade scale-110"
                priority
              />
            </div>
            {/* Price badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-0 right-0 p-6 rounded-[32px] border border-white/40 shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)' }}
            >
              <div className="font-serif text-3xl font-bold" style={{ color: 'var(--burgundy)' }}>45,00 €</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Premium Collection</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Us / Features ── */}
      <section className="py-24 bg-white border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {[
            { icon: '🌱', title: 'Fresh Blooms', sub: 'Handpicked daily' },
            { icon: '🚚', title: 'Fast Delivery', sub: 'Same-day service' },
            { icon: '🏆', title: 'Top Quality', sub: 'Certified experts' },
            { icon: '🎉', title: 'All Occasions', sub: 'Birthday to Weddings' },
            { icon: '🍃', title: 'Eco Care', sub: 'Sustainable growth' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-4 group cursor-default"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500 group-hover:text-white"
                style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--accent-pink)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-pink)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--soft-pink)')}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{item.title}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Spa Section ── */}
      <section className="py-32 px-6 lg:px-10" style={{ backgroundColor: 'rgba(245,240,237,0.4)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: 'var(--gold)' }}>
              Luxury Wellness
            </span>
            <h2 className="font-serif text-5xl lg:text-6xl font-medium mb-6" style={{ color: 'var(--burgundy)' }}>
              {t.massageTitle}
            </h2>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: 'var(--gold)' }} />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: '🌸', title: 'Rentouttava Hieronta', desc: t.massageDesc, href: '/massage' },
              { icon: '💨', title: 'Aromaterapia', desc: 'Sensory healing through pure botanical essences for deep restoration.', href: '/massage' },
              { icon: '✨', title: 'Päänahkahieronta', desc: 'Illuminate your radiance with botanical scalp treatments.', href: '/massage' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-12 rounded-[48px] border flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl"
                style={{ borderColor: '#f0e8e0' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#f0e8e0')}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-10 text-4xl transition-colors duration-500 group-hover:text-white"
                  style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--soft-pink)')}
                >
                  {item.icon}
                </div>
                <h3 className="font-serif text-3xl mb-4" style={{ color: 'var(--burgundy)' }}>{item.title}</h3>
                <p className="text-gray-500 mb-10 leading-relaxed">{item.desc}</p>
                <Link
                  href={item.href}
                  className="mt-auto px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all hover:text-white"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                >
                  {t.heroBookMassage}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
