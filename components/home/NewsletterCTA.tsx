'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NewsletterCTA({ locale }: { locale: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  const copy = {
    fi: {
      tag: 'Eksklusiiviset tarjoukset',
      title: 'Tilaa uutiskirjeemme',
      sub: 'Saa ensimmäisenä tietää kausikokoelmistamme, erikoistarjouksista ja hoitovinkkeistä.',
      placeholder: 'Sähköpostiosoitteesi',
      btn: 'Tilaa',
      success: 'Kiitos! Olet nyt uutiskirjeemme tilaaja.',
    },
    en: {
      tag: 'Exclusive Offers',
      title: 'Subscribe to our newsletter',
      sub: 'Be the first to know about seasonal collections, special offers, and wellness tips.',
      placeholder: 'Your email address',
      btn: 'Subscribe',
      success: 'Thank you! You are now subscribed.',
    },
  };

  const c = locale === 'fi' ? copy.fi : copy.en;

  return (
    <section className="py-24 px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto rounded-[80px] px-10 py-16 text-center"
        style={{ backgroundColor: 'var(--soft-pink)' }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-pink)' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--gold)' }}>
            {c.tag}
          </span>
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-pink)' }} />
        </div>

        <h2 className="font-serif text-4xl lg:text-5xl font-medium mb-5" style={{ color: 'var(--burgundy)' }}>
          {c.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-lg mx-auto">{c.sub}</p>

        {sent ? (
          <p className="font-serif italic text-lg" style={{ color: 'var(--burgundy)' }}>{c.success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              required
              className="flex-1 px-6 py-3 rounded-full bg-white border border-pink-100 text-sm outline-none focus:border-pink-300 transition-colors"
              style={{ color: 'var(--warm-gray)' }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-sm font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-pink-200"
              style={{ backgroundColor: 'var(--accent-pink)' }}
            >
              {c.btn}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
