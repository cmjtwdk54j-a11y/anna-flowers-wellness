'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Gift, CheckCircle2, Flower2, Hand, Clock } from 'lucide-react';
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
  const [buyError, setBuyError] = useState('');
  const [buying, setBuying] = useState(false);

  const finalAmount = isCustom ? (parseFloat(customAmount) || 0) : amount;

  const handleNext = () => {
    if (finalAmount < 50) return;
    setStep('details');
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuying(true);
    setBuyError('');
    try {
      const res = await fetch('/api/gift-cards', {
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
      if (!res.ok) throw new Error('Failed');
      setStep('done');
    } catch {
      setBuyError(t('error'));
    } finally {
      setBuying(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #fdf2f5 0%, #fff 50%, #f5f0ed 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-soft-pink text-burgundy text-xs font-medium px-3 py-1.5 rounded-full mb-4" style={{ color: 'var(--burgundy)' }}>
              <Gift className="w-3.5 h-3.5" />
              {t('badge')}
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-3" style={{ color: 'var(--burgundy)' }}>{t('title')}</h1>
            <p className="text-lg text-gray-500 mb-4">{t('subtitle')}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{t('description')}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-white border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Clock, text: t('validFor') },
              { icon: Flower2, text: t('usableFlowers') },
              { icon: Hand, text: t('usableMassage') },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--soft-pink)' }}>
                  <Icon className="w-[18px] h-[18px]" style={{ color: 'var(--gold)' }} />
                </div>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-14" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 'select' && (
            <div className="bg-white rounded-[28px] border border-pink-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('amount')}</h2>

              {/* Preset amounts */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {PRESET_AMOUNTS.map((preset) => {
                  const active = !isCustom && amount === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => { setAmount(preset); setIsCustom(false); }}
                      className="py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                      style={{
                        borderColor: active ? 'var(--accent-pink)' : '#fce7f3',
                        backgroundColor: active ? 'var(--soft-pink)' : 'white',
                        color: active ? 'var(--burgundy)' : '#6b7280',
                      }}
                    >
                      {preset} €
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={isCustom}
                    onChange={(e) => { setIsCustom(e.target.checked); }}
                    className="rounded border-pink-200"
                    style={{ accentColor: 'var(--burgundy)' }}
                  />
                  <span className="text-sm text-gray-600">{t('customAmount')}</span>
                </label>
                {isCustom && (
                  <div className="relative">
                    <input
                      type="number"
                      min={50}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors pr-10"
                      placeholder="50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                  </div>
                )}
                {isCustom && parseFloat(customAmount) < 50 && customAmount !== '' && (
                  <p className="text-xs text-red-500 mt-1">{t('minAmount')}</p>
                )}
              </div>

              {/* Preview card */}
              <div
                className="rounded-[20px] p-5 mb-6 text-white"
                style={{ background: 'linear-gradient(135deg, var(--burgundy) 0%, #6b2d3a 100%)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">AF</span>
                    </div>
                    <span className="text-sm font-medium">Aavafloristi</span>
                  </div>
                  <Gift className="w-5 h-5 text-white/50" />
                </div>
                <div className="text-3xl font-bold mb-1">{formatPrice(finalAmount)}</div>
                <div className="text-white/60 text-xs">Lahjakortti · {t('validity')}</div>
              </div>

              <button
                onClick={handleNext}
                disabled={finalAmount < 50}
                className="w-full text-white font-medium py-3 rounded-full transition-colors disabled:opacity-40"
                style={{ backgroundColor: 'var(--burgundy)' }}
              >
                {t('continue')} →
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleBuy} className="bg-white rounded-[28px] border border-pink-50 p-6 shadow-sm">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="text-sm text-gray-400 hover:text-gray-600 mb-4 block transition-colors"
              >
                {t('back')}
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('details')}</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--burgundy)' }}>{t('buyer')}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text" required
                      value={form.yourName}
                      onChange={(e) => setForm({ ...form, yourName: e.target.value })}
                      className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                      placeholder={t('yourName')}
                    />
                    <input
                      type="email" required
                      value={form.yourEmail}
                      onChange={(e) => setForm({ ...form, yourEmail: e.target.value })}
                      className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                      placeholder={t('yourEmail')}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--burgundy)' }}>{t('recipient')}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={form.recipientName}
                      onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                      className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                      placeholder={t('recipientName')}
                    />
                    <input
                      type="email"
                      value={form.recipientEmail}
                      onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                      className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                      placeholder={t('recipientEmail')}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors resize-none"
                    placeholder={t('message')}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-pink-50">
                  <span className="text-sm text-gray-400">{t('cardValue')}</span>
                  <span className="text-lg font-bold" style={{ color: 'var(--burgundy)' }}>{formatPrice(finalAmount)}</span>
                </div>

                {buyError && (
                  <p className="text-xs text-red-500 text-center">{buyError}</p>
                )}
                <button
                  type="submit"
                  disabled={buying}
                  className="w-full text-white font-medium py-3 rounded-full transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  <Gift className="w-4 h-4" />
                  {buying ? '...' : t('buyNow')}
                </button>
              </div>
            </form>
          )}

          {step === 'done' && (
            <div className="bg-white rounded-[28px] border border-pink-50 p-8 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--soft-pink)' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--burgundy)' }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('orderReceived')}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {t('orderSentTo')} <strong style={{ color: 'var(--burgundy)' }}>{form.yourEmail}</strong>. {t('thankYou')}
              </p>
              <div className="flex gap-3">
                <Link
                  href="/flowers"
                  className="flex-1 py-2.5 text-white rounded-full text-sm font-medium transition-colors text-center"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  {t('browseFlowers')}
                </Link>
                <Link
                  href="/"
                  className="flex-1 py-2.5 border border-pink-100 text-gray-500 rounded-full text-sm hover:bg-pink-50 transition-colors text-center"
                >
                  {t('home')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
