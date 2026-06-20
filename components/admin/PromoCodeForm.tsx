'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AdminPromoCode } from '@/lib/admin/types';

const schema = z.object({
  code: z.string().min(1, 'Pakollinen').regex(/^[A-Z0-9_-]+$/i, 'Vain kirjaimia, numeroita, _ ja -'),
  discountType: z.enum(['PERCENT', 'FIXED']),
  discountValue: z.coerce.number().min(0, 'Ei negatiivinen'),
  minOrderAmount: z.coerce.number().min(0).optional().or(z.literal('')),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  maxUses: z.coerce.number().int().positive().optional().or(z.literal('')),
  maxUsesPerUser: z.coerce.number().int().positive().optional().or(z.literal('')),
  applicableTo: z.enum(['ALL', 'CATEGORIES', 'PRODUCTS']).default('ALL'),
  isActive: z.boolean().default(true),
}).refine((d) => {
  if (d.discountType === 'PERCENT' && d.discountValue > 100) return false;
  return true;
}, { message: 'Prosenttialennus ei voi ylittää 100%', path: ['discountValue'] })
.refine((d) => {
  if (d.startsAt && d.expiresAt && new Date(d.startsAt) >= new Date(d.expiresAt)) return false;
  return true;
}, { message: 'Päättymispäivä on ennen alkamispäivää', path: ['expiresAt'] });

type FormData = z.infer<typeof schema>;

export default function PromoCodeForm({ promo }: { promo?: AdminPromoCode }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!promo;

  const {
    register, handleSubmit, watch,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: promo
      ? {
          code: promo.code,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          minOrderAmount: promo.minOrderAmount ?? '',
          startsAt: promo.startsAt ? promo.startsAt.slice(0, 16) : '',
          expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 16) : '',
          maxUses: promo.maxUses ?? '',
          maxUsesPerUser: promo.maxUsesPerUser ?? '',
          applicableTo: promo.applicableTo,
          isActive: promo.isActive,
        }
      : { discountType: 'PERCENT', applicableTo: 'ALL', isActive: true },
  });

  const discountType = watch('discountType');

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...data,
        code: data.code.toUpperCase().trim(),
        minOrderAmount: data.minOrderAmount !== '' ? data.minOrderAmount : null,
        maxUses: data.maxUses !== '' ? data.maxUses : null,
        maxUsesPerUser: data.maxUsesPerUser !== '' ? data.maxUsesPerUser : null,
        startsAt: data.startsAt || null,
        expiresAt: data.expiresAt || null,
      };

      const url = isEdit ? `/api/admin/promo-codes/${promo.id}` : '/api/admin/promo-codes';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Virhe'); return; }
      router.push('/admin/promo-codes');
      router.refresh();
    } catch {
      setError('Verkkovirhe');
    } finally {
      setSaving(false);
    }
  };

  const Row = ({ label, children, error: err }: { label: string; children: React.ReactNode; error?: string }) => (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      {children}
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  );

  const inputClass = "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>
      )}

      <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Promokoodin tiedot</h2>

        <Row label="Koodi *" error={errors.code?.message}>
          <input
            {...register('code')}
            placeholder="FLOWERS10"
            className={`${inputClass} uppercase`}
            style={{ textTransform: 'uppercase' }}
          />
          <p className="text-xs text-stone-400 mt-1">Kirjoitetaan isoilla kirjaimilla automaattisesti</p>
        </Row>

        <div className="grid sm:grid-cols-2 gap-4">
          <Row label="Alennustyyppi *" error={errors.discountType?.message}>
            <select {...register('discountType')} className={`${inputClass} bg-white`}>
              <option value="PERCENT">Prosentti (%)</option>
              <option value="FIXED">Kiinteä summa (€)</option>
            </select>
          </Row>
          <Row label={discountType === 'PERCENT' ? 'Alennus (%) *' : 'Alennus (€) *'} error={errors.discountValue?.message}>
            <input {...register('discountValue')} type="number" step="0.01" placeholder={discountType === 'PERCENT' ? '10' : '5.00'} className={inputClass} />
          </Row>
        </div>

        <Row label="Minitilaussumma (€)" error={errors.minOrderAmount?.message}>
          <input {...register('minOrderAmount')} type="number" step="0.01" placeholder="0" className={inputClass} />
        </Row>

        <div className="grid sm:grid-cols-2 gap-4">
          <Row label="Alkaa" error={errors.startsAt?.message}>
            <input {...register('startsAt')} type="datetime-local" className={inputClass} />
          </Row>
          <Row label="Päättyy" error={errors.expiresAt?.message}>
            <input {...register('expiresAt')} type="datetime-local" className={inputClass} />
          </Row>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Row label="Max käyttökerrat (yhteensä)" error={errors.maxUses?.message}>
            <input {...register('maxUses')} type="number" placeholder="Rajaton" className={inputClass} />
          </Row>
          <Row label="Max per asiakas" error={errors.maxUsesPerUser?.message}>
            <input {...register('maxUsesPerUser')} type="number" placeholder="Rajaton" className={inputClass} />
          </Row>
        </div>

        <Row label="Soveltuu" error={errors.applicableTo?.message}>
          <select {...register('applicableTo')} className={`${inputClass} bg-white`}>
            <option value="ALL">Kaikki tuotteet</option>
            <option value="CATEGORIES">Valitut kategoriat</option>
            <option value="PRODUCTS">Valitut tuotteet</option>
          </select>
        </Row>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('isActive')} className="rounded border-stone-300 text-indigo-500 focus:ring-indigo-400" />
          <span className="text-sm text-stone-700">Aktiivinen</span>
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {saving ? 'Tallennetaan...' : isEdit ? 'Tallenna muutokset' : 'Luo promokoodi'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2.5"
        >
          Peruuta
        </button>
      </div>
    </form>
  );
}
