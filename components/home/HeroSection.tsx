'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

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

const SLIDES = [
  {
    tag: 'Premium Collection',
    headline: ['Kauneutta ja', 'hyvinvointia'],
    price: '45,00 €',
    priceLabel: 'Premium Collection',
    href: '/flowers',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop',
    bg: 'var(--soft-pink)',
  },
  {
    tag: 'Häät & Juhlat',
    headline: ['Täydellinen', 'hääkimppu'],
    price: '120,00 €',
    priceLabel: 'Wedding Special',
    href: '/flowers',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
    bg: '#fdf6f0',
  },
  {
    tag: 'Kausikokoelma',
    headline: ['Värikäs', 'kukkakokoelma'],
    price: '35,00 €',
    priceLabel: 'Seasonal Blooms',
    href: '/flowers',
    image: 'https://images.unsplash.com/photo-1487530811015-780f25e19780?q=80&w=1000&auto=format&fit=crop',
    bg: '#fdf2f5',
  },
  {
    tag: 'Aromaterapia',
    headline: ['Rentouttava', 'hieronta'],
    price: '65,00 €',
    priceLabel: 'Premium Massage',
    href: '/massage',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop',
    bg: '#f5f0ed',
  },
  {
    tag: 'Lahjakortit',
    headline: ['Täydellinen', 'lahja kaikille'],
    price: '50,00 €',
    priceLabel: 'Gift Card',
    href: '/gift-cards',
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?q=80&w=1000&auto=format&fit=crop',
    bg: '#fdf2f5',
  },
];

const FEATURES = [
  { icon: '🌱', fi: 'Tuoreet kukat', en: 'Fresh Blooms', sub_fi: 'Poimittu päivittäin', sub_en: 'Handpicked daily' },
  { icon: '🚚', fi: 'Nopea toimitus', en: 'Fast Delivery', sub_fi: 'Samana päivänä', sub_en: 'Same-day service' },
  { icon: '🏆', fi: 'Korkea laatu', en: 'Top Quality', sub_fi: 'Sertifioidut asiantuntijat', sub_en: 'Certified experts' },
  { icon: '🎉', fi: 'Kaikki tilaisuudet', en: 'All Occasions', sub_fi: 'Syntymäpäivistä häihin', sub_en: 'Birthday to Weddings' },
  { icon: '🍃', fi: 'Ekologinen', en: 'Eco Care', sub_fi: 'Kestävä kehitys', sub_en: 'Sustainable growth' },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  } as const;
}

export default function HeroSection({ t }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = SLIDES.length;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  }, [total]);

  const prev = () => goTo(current - 1, -1);
  const next = () => goTo(current + 1, 1);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => goTo(current + 1, 1), 5000);
    return () => clearTimeout(timer);
  }, [current, goTo]);

  const slide = SLIDES[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const imgVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  };

  return (
    <>
      {/* ── Hero Carousel ── */}
      <section
        className="relative pt-44 pb-24 px-6 lg:px-10 overflow-hidden min-h-[90vh] flex items-center transition-colors duration-700"
        style={{ backgroundColor: slide.bg }}
      >
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text side */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0)} className="mb-6 flex items-center gap-3">
              <div className="flex text-sm" style={{ color: 'var(--gold)' }}>
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">325 Reviews</span>
            </motion.div>

            <div className="overflow-hidden mb-8" style={{ minHeight: '200px' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.h1
                  key={`headline-${current}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="font-serif leading-[0.95] font-medium tracking-tighter"
                  style={{ fontSize: 'clamp(56px, 7vw, 96px)', color: 'var(--burgundy)' }}
                >
                  {slide.headline[0]}<br />{slide.headline[1]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p {...fadeUp(0.2)} className="text-gray-500 text-lg mb-12 leading-relaxed max-w-md">
              {t.heroSubtitle}
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex items-center gap-8">
              <Link
                href={slide.href}
                className="px-10 py-4 text-white rounded-full font-bold text-sm tracking-widest uppercase transition-all hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--accent-pink)' }}
              >
                {t.heroShopNow}
              </Link>

              {/* Working carousel controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                  {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous slide"
                    className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center transition-all hover:bg-white hover:shadow-sm active:scale-95"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next slide"
                    className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center transition-all hover:bg-white hover:shadow-sm active:scale-95"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-8">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  aria-label={`Slide ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? '24px' : '6px',
                    height: '6px',
                    backgroundColor: i === current ? 'var(--burgundy)' : '#fce7f3',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className="relative flex justify-center lg:justify-end">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`img-${current}`}
                custom={direction}
                variants={imgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative w-full max-w-[560px] animate-float"
              >
                <Image
                  src={slide.image}
                  alt={slide.headline.join(' ')}
                  width={560}
                  height={640}
                  className="w-full h-auto object-contain mask-fade scale-110"
                  priority={current === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Price badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                className="absolute bottom-0 right-0 p-6 rounded-[32px] border border-white/40 shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)' }}
              >
                <div className="font-serif text-3xl font-bold" style={{ color: 'var(--burgundy)' }}>{slide.price}</div>
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">{slide.priceLabel}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Features bar ── */}
      <section className="py-20 bg-white border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.fi}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-4 group cursor-default"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500"
                style={{ backgroundColor: 'var(--soft-pink)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-pink)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--soft-pink)')}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{item.fi}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{item.sub_fi}</p>
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
              { icon: '💨', title: 'Aromaterapia', desc: 'Aistillinen parantaminen puhtailla kasvisesensseillä syvään palautumiseen.', href: '/massage' },
              { icon: '✨', title: 'Päänahkahieronta', desc: 'Kosteuta ja elvytä hiuspohjaasi kasvishoitohieronnoilla.', href: '/massage' },
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
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-10 text-4xl transition-colors duration-500"
                  style={{ backgroundColor: 'var(--soft-pink)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--soft-pink)')}
                >
                  {item.icon}
                </div>
                <h3 className="font-serif text-3xl mb-4" style={{ color: 'var(--burgundy)' }}>{item.title}</h3>
                <p className="text-gray-500 mb-10 leading-relaxed">{item.desc}</p>
                <Link
                  href={item.href}
                  className="mt-auto px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gold)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                  }}
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
