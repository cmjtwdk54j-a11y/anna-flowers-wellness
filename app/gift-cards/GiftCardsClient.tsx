'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Gift, CheckCircle2, Flower2, Hand, Star, Clock } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

const PRESET_AMOUNTS = [50, 75, 100, 150];

export default function GiftCardsClient() {
  const t = useTranslations('giftCards');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [form, setForm] = useState({
    yourName: '', yourEmail: '',
    recipientName: '', recipientEmail: '', message: '',
  });
  const [step, setStep] = useState<'select' | 'details' | 'done'>('select');

  const finalAmount = isCustom ? (parseFloat(customAmount) || 0) : amount;

  const handleNext = () => {
    if (finalAmount < 50) return;
    setStep('details');
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          purchaserName: form.yourName,
          purchaserEmail: form.yourEmail,
          recipientName: form.recipientName,
          recipientEmail: form.recipientEmail,
          message: form.message,
        }),
      });
    } catch {}
    setStep('done');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-rose-50 to-stone-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Gift className="w-3.5 h-3.5" />
              Lahjakortit
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-3">{t('title')}</h1>
            <p className="text-lg text-stone-500 mb-4">{t('subtitle')}</p>
            <p className="text-sm text-stone-400 leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Clock, text: t('validFor') },
              { icon: Flower2, text: 'Voidaan käyttää kukkiin' },
              { icon: Hand, text: 'Voidaan käyttää hierontaan' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <p className="text-sm text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-14 bg-stone-50">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'select' && (
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-800 mb-6">{t('amount')}</h2>

              {/* Preset amounts */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => { setAmount(preset); setIsCustom(false); }}
                    className={cn(
                      'py-3 rounded-xl border text-sm font-semibold transition-colors',
                      !isCustom && amount === preset
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-rose-300'
                    )}
                  >
                    {preset} €
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={isCustom}
                    onChange={(e) => { setIsCustom(e.target.checked); }}
                    className="rounded border-stone-300 text-rose-500"
                  />
                  <span className="text-sm text-stone-600">{t('customAmount')}</span>
                </label>
                {isCustom && (
                  <div className="relative">
                    <input
                      type="number"
                      min={50}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 pr-10"
                      placeholder="50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">€</span>
                  </div>
                )}
                {isCustom && parseFloat(customAmount) < 50 && customAmount !== '' && (
                  <p className="text-xs text-red-500 mt-1">{t('minAmount')}</p>
                )}
              </div>

              {/* Preview card */}
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 mb-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">AF</span>
                    </div>
                    <span className="text-sm font-medium">Anna Flowers & Wellness</span>
                  </div>
                  <Gift className="w-5 h-5 text-rose-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{formatPrice(finalAmount)}</div>
                <div className="text-rose-200 text-xs">Lahjakortti · Voimassa 12 kk</div>
              </div>

              <button
                onClick={handleNext}
                disabled={finalAmount < 50}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Jatka →
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleBuy} className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <button onClick={() => setStep('select')} className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">
                ← Takaisin
              </button>
              <h2 className="text-xl font-semibold text-stone-800 mb-6">Tiedot</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Ostaja</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text" required
                      value={form.yourName}
                      onChange={(e) => setForm({ ...form, yourName: e.target.value })}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder={t('yourName')}
                    />
                    <input
                      type="email" required
                      value={form.yourEmail}
                      onChange={(e) => setForm({ ...form, yourEmail: e.target.value })}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder={t('yourEmail')}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Vastaanottaja (valinnainen)</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={form.recipientName}
                      onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder={t('recipientName')}
                    />
                    <input
                      type="email"
                      value={form.recipientEmail}
                      onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder={t('recipientEmail')}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 resize-none"
                    placeholder={t('message')}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-stone-100">
                  <span className="text-sm text-stone-500">Lahjakortin arvo</span>
                  <span className="text-lg font-bold text-stone-800">{formatPrice(finalAmount)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  {t('buyNow')}
                </button>
              </div>
            </form>
          )}

          {step === 'done' && (
            <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">Tilaus vastaanotettu!</h2>
              <p className="text-stone-500 text-sm mb-6">
                Lähetämme lahjakortin sähköpostiin {form.yourEmail}. Kiitos tilauksestasi!
              </p>
              <div className="flex gap-3">
                <Link href="/flowers" className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors text-center">
                  Selaa kukkia
                </Link>
                <Link href="/" className="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50 transition-colors text-center">
                  Etusivulle
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
