'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const SLIDES_DATA = [
  {
    price: '45,00 €',
    priceLabel: 'Premium Collection',
    href: '/flowers',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop',
    bg: 'var(--soft-pink)',
  },
  {
    price: '120,00 €',
    priceLabel: 'Wedding Special',
    href: '/flowers',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
    bg: '#fdf6f0',
  },
  {
    price: '35,00 €',
    priceLabel: 'Seasonal Blooms',
    href: '/flowers',
    image: 'https://images.unsplash.com/photo-1487530811015-780f25e19780?q=80&w=1000&auto=format&fit=crop',
    bg: '#fdf2f5',
  },
  {
    price: '65,00 €',
    priceLabel: 'Premium Massage',
    href: '/massage',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop',
    bg: '#f5f0ed',
  },
  {
    price: '50,00 €',
    priceLabel: 'Gift Card',
    href: '/gift-cards',
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?q=80&w=1000&auto=format&fit=crop',
    bg: '#fdf2f5',
  },
];

const FEATURES_DATA = [
  { icon: '🌱', key: 'fresh' },
  { icon: '🚚', key: 'fast' },
  { icon: '🏆', key: 'quality' },
  { icon: '🎉', key: 'occasions' },
  { icon: '🍃', key: 'eco' },
] as const;

const SPA_CARDS = [
  { icon: '🌸', titleKey: 'spa.massage', descKey: 'services.massage.description' },
  { icon: '💨', titleKey: 'spa.aromatherapy', descKey: 'spa.aromatherapyDesc' },
  { icon: '✨', titleKey: 'spa.scalp', descKey: 'spa.scalpDesc' },
] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  } as const;
}

export default function HeroSection() {
  const t = useTranslations('home');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = SLIDES_DATA.length;

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  }, [total]);

  const prev = () => goTo(current - 1, -1);
  const next = () => goTo(current + 1, 1);

  useEffect(() => {
    const timer = setTimeout(() => goTo(current + 1, 1), 5000);
    return () => clearTimeout(timer);
  }, [current, goTo]);

  const slides = [
    { ...SLIDES_DATA[0], headline: [t('slides.s1h1'), t('slides.s1h2')] },
    { ...SLIDES_DATA[1], headline: [t('slides.s2h1'), t('slides.s2h2')] },
    { ...SLIDES_DATA[2], headline: [t('slides.s3h1'), t('slides.s3h2')] },
    { ...SLIDES_DATA[3], headline: [t('slides.s4h1'), t('slides.s4h2')] },
    { ...SLIDES_DATA[4], headline: [t('slides.s5h1'), t('slides.s5h2')] },
  ];

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const imgVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0, scale: 0.97 }),
  };

  return (
    <>
      {/* ── Hero Carousel ── */}
      <section
        className="relative pt-32 pb-12 lg:pt-44 lg:pb-24 px-6 lg:px-10 overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center"
        style={{ backgroundColor: slide.bg }}
      >
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-6 lg:gap-16 items-center relative z-10">
          {/* Text side */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0)} className="mb-4 lg:mb-6 flex items-center gap-3">
              <div className="flex text-sm" style={{ color: 'var(--gold)' }}>
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">325 Reviews</span>
            </motion.div>

            <div
              className="relative mb-6 lg:mb-8"
              style={{ minHeight: 'clamp(120px, 26vw, 220px)', overflow: 'clip' }}
            >
              <AnimatePresence custom={direction}>
                <motion.h1
                  key={`headline-${current}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  className="absolute inset-x-0 top-0 font-serif leading-[0.95] font-medium tracking-tighter"
                  style={{ fontSize: 'clamp(36px, 8vw, 96px)', color: 'var(--burgundy)' }}
                >
                  {slide.headline[0]}<br />{slide.headline[1]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.p {...fadeUp(0.2)} className="text-gray-500 text-base lg:text-lg mb-8 lg:mb-12 leading-relaxed max-w-md">
              {t('hero.subtitle')}
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex items-center gap-4 lg:gap-8">
              <Link
                href={slide.href}
                className="px-6 sm:px-10 py-3 sm:py-4 text-white rounded-full font-bold text-sm tracking-widest uppercase transition-all hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-0.5 active:scale-95"
                style={{ backgroundColor: 'var(--accent-pink)' }}
              >
                {t('hero.shopNow')}
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hidden sm:block">
                  {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous slide"
                    className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center transition-all hover:bg-white hover:shadow-sm active:scale-95"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next slide"
                    className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center transition-all hover:bg-white hover:shadow-sm active:scale-95"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-6 lg:mt-8">
              {slides.map((_, i) => (
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

          {/* Image side — hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex relative justify-end" style={{ minHeight: '520px' }}>
            <div className="relative w-full max-w-[560px] animate-float" style={{ height: '560px' }}>
              <AnimatePresence custom={direction}>
                <motion.div
                  key={`img-${current}`}
                  custom={direction}
                  variants={imgVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.headline.join(' ')}
                    fill
                    className="object-contain mask-fade scale-110"
                    priority={current === 0}
                    sizes="50vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Price badge */}
            <AnimatePresence>
              <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' }}
                className="absolute bottom-0 right-0 p-5 rounded-[28px] border border-white/40 shadow-2xl"
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
      <section className="py-10 lg:py-20 bg-white border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-10">
          {FEATURES_DATA.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-3 lg:gap-4 group cursor-default"
            >
              <div
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xl lg:text-2xl transition-all duration-500"
                style={{ backgroundColor: 'var(--soft-pink)' }}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-bold text-gray-800 uppercase tracking-widest">
                  {t(`features.${item.key}` as any)}
                </h3>
                <p className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-wider mt-1 hidden sm:block">
                  {t(`features.${item.key}Sub` as any)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Spa Section ── */}
      <section className="py-16 lg:py-32 px-6 lg:px-10" style={{ backgroundColor: 'rgba(245,240,237,0.4)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 lg:mb-24"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: 'var(--gold)' }}>
              {t('spa.label')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-medium mb-6" style={{ color: 'var(--burgundy)' }}>
              {t('services.massage.title')}
            </h2>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: 'var(--gold)' }} />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-10">
            {SPA_CARDS.map((item, i) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-6 sm:p-8 lg:p-12 rounded-[32px] lg:rounded-[48px] border flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl"
                style={{ borderColor: '#f0e8e0' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#f0e8e0')}
              >
                <div
                  className="w-16 h-16 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-6 lg:mb-10 text-2xl lg:text-4xl transition-colors duration-500"
                  style={{ backgroundColor: 'var(--soft-pink)' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl mb-3" style={{ color: 'var(--burgundy)' }}>
                  {t(item.titleKey as any)}
                </h3>
                <p className="text-gray-500 text-sm lg:text-base mb-6 lg:mb-10 leading-relaxed">
                  {t(item.descKey as any)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12 lg:mt-20"
          >
            <Link
              href="/massage"
              className="group inline-flex items-center gap-3 px-12 lg:px-16 py-5 lg:py-6 rounded-full text-sm lg:text-base font-bold uppercase tracking-widest text-white shadow-2xl transition-all duration-300 hover:scale-[1.04] active:scale-95 animate-pulse-glow"
              style={{ backgroundColor: 'var(--gold)', boxShadow: '0 12px 40px -8px var(--gold)' }}
            >
              <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
              {t('hero.bookMassage')}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
