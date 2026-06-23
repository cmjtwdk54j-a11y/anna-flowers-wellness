'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import type { AdminCategory, AdminProduct } from '@/lib/admin/types';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangContext';

const schema = z.object({
  slug: z.string().min(1, 'Pakollinen').regex(/^[a-z0-9-]+$/, 'Vain pieniä kirjaimia, numeroita ja viivoja'),
  name_fi: z.string().min(1, 'Pakollinen'),
  name_en: z.string().min(1, 'Pakollinen'),
  description_fi: z.string().min(1, 'Pakollinen'),
  description_en: z.string().min(1, 'Pakollinen'),
  composition_fi: z.string().optional(),
  composition_en: z.string().optional(),
  careInfo_fi: z.string().optional(),
  careInfo_en: z.string().optional(),
  priceSmall: z.coerce.number().positive('Hinnan on oltava positiivinen'),
  priceLarge: z.coerce.number().positive().optional().or(z.literal('')),
  imageUrl: z.string().url('Virheellinen URL').min(1, 'Pakollinen'),
  imageUrls: z.string().optional(),
  categoryId: z.string().min(1, 'Valitse kategoria'),
  occasions: z.string().optional(),
  color: z.string().optional(),
  flowerCount: z.coerce.number().int().positive().optional().or(z.literal('')),
  heightCm: z.coerce.number().int().positive().optional().or(z.literal('')),
  popularity: z.coerce.number().int().min(0).default(0),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isFuneral: z.boolean().default(false),
  isWedding: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  product?: AdminProduct;
  categories: AdminCategory[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const { t, lang } = useAdminLang();
  const tf = t.productForm;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: product
      ? {
          ...product,
          composition_fi: product.composition_fi ?? undefined,
          composition_en: product.composition_en ?? undefined,
          careInfo_fi: product.careInfo_fi ?? undefined,
          careInfo_en: product.careInfo_en ?? undefined,
          color: product.color ?? undefined,
          priceLarge: product.priceLarge ?? '',
          imageUrls: product.imageUrls.join('\n'),
          occasions: product.occasions.join(', '),
          flowerCount: product.flowerCount ?? '',
          heightCm: product.heightCm ?? '',
        }
      : { inStock: true, isFeatured: false, isFuneral: false, isWedding: false, popularity: 0 },
  });

  const imageUrl = watch('imageUrl');
  const isEdit = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      let url: string;

      if (cloudName && uploadPreset) {
        // Cloudinary direct upload (no server needed)
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST', body: fd,
        });
        const data = await res.json();
        if (!res.ok || !data.secure_url) { setUploadError('Cloudinary-virhe: ' + (data.error?.message || 'tuntematon')); return; }
        url = data.secure_url;
      } else {
        // Vercel Blob fallback
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) { setUploadError(data.error || 'Virhe'); return; }
        url = data.url;
      }

      setValue('imageUrl', url);
    } catch {
      setUploadError('Verkkovirhe');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...data,
        priceLarge: data.priceLarge !== '' ? data.priceLarge : null,
        imageUrls: data.imageUrls ? data.imageUrls.split('\n').map((u) => u.trim()).filter(Boolean) : [],
        occasions: data.occasions ? data.occasions.split(',').map((o) => o.trim()).filter(Boolean) : [],
        flowerCount: data.flowerCount !== '' ? data.flowerCount : null,
        heightCm: data.heightCm !== '' ? data.heightCm : null,
      };

      const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || t.common.error); return; }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError(tf.errorNetwork);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, textarea, type = 'text', placeholder }: {
    label: string; name: keyof FormData; textarea?: boolean; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      {textarea ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      ) : (
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      )}
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]?.message as string}</p>}
    </div>
  );

  const CheckField = ({ label, name }: { label: string; name: keyof FormData }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" {...register(name)} className="rounded border-stone-300 text-indigo-500 focus:ring-indigo-400" />
      <span className="text-sm text-stone-700">{label}</span>
    </label>
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>
      )}

      {/* Perustiedot */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">{tf.basicInfo}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={tf.slug} name="slug" placeholder="ruusukimppu-klassinen" />
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">{tf.category}</label>
            <select
              {...register('categoryId')}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">{tf.selectCategory}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{lang === 'en' ? c.name_en : c.name_fi}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
          </div>
          <Field label={tf.nameFi} name="name_fi" placeholder="Klassinen ruusukimppu" />
          <Field label={tf.nameEn} name="name_en" placeholder="Classic rose bouquet" />
          <div className="sm:col-span-2">
            <Field label={tf.descFi} name="description_fi" textarea placeholder="Kaunis klassinen ruusukimppu..." />
          </div>
          <div className="sm:col-span-2">
            <Field label={tf.descEn} name="description_en" textarea placeholder="Beautiful classic rose bouquet..." />
          </div>
          <Field label={tf.compositionFi} name="composition_fi" textarea placeholder="10 punaista ruusua, vihreät..." />
          <Field label={tf.compositionEn} name="composition_en" textarea placeholder="10 red roses, greenery..." />
          <Field label={tf.careFi} name="careInfo_fi" textarea placeholder="Vaihda vesi päivittäin..." />
          <Field label={tf.careEn} name="careInfo_en" textarea placeholder="Change water daily..." />
        </div>
      </section>

      {/* Hinnat */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">{tf.prices}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={tf.priceSmall} name="priceSmall" type="number" placeholder="35.00" />
          <Field label={tf.priceLarge} name="priceLarge" type="number" placeholder="65.00" />
        </div>
      </section>

      {/* Kuvat */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">{tf.images}</h2>
        <div className="space-y-4">
          {/* Upload zone */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">{tf.mainImage}</label>
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                uploading ? 'border-indigo-300 bg-indigo-50' : 'border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/40'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              {imageUrl ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0">
                    <Image src={imageUrl} alt="Esikatselu" width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-stone-700">{tf.photoSelected}</p>
                    <p className="text-xs text-stone-400 mt-0.5 break-all line-clamp-2">{imageUrl}</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="text-xs text-indigo-600 hover:underline mt-1"
                    >
                      {tf.changePhoto}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                      <p className="text-sm text-indigo-600">{tf.uploading}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-stone-300" />
                      <p className="text-sm font-medium text-stone-600">{tf.uploadPhoto}</p>
                      <p className="text-xs text-stone-400">{tf.uploadHint}</p>
                    </>
                  )}
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1.5">
                {uploadError.includes('Blob Storage') ? tf.uploadFailHint : uploadError}
              </p>
            )}
            {errors.imageUrl && <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>}
          </div>

          {/* Manual URL fallback */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">{tf.orUrl}</label>
            <input
              {...register('imageUrl')}
              placeholder="https://..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">{tf.extraImages}</label>
            <textarea
              {...register('imageUrls')}
              rows={3}
              placeholder="https://..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Lisätiedot */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">{tf.details}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label={tf.color} name="color" placeholder="Punainen" />
          <Field label={tf.flowerCount} name="flowerCount" type="number" placeholder="10" />
          <Field label={tf.height} name="heightCm" type="number" placeholder="40" />
          <Field label={tf.popularity} name="popularity" type="number" placeholder="0" />
          <div className="sm:col-span-2">
            <Field label={tf.occasions} name="occasions" placeholder="Syntymäpäivä, Häät, Juhla" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <CheckField label={tf.inStock} name="inStock" />
          <CheckField label={tf.featured} name="isFeatured" />
          <CheckField label={tf.funeral} name="isFuneral" />
          <CheckField label={tf.wedding} name="isWedding" />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {saving ? tf.saving : isEdit ? tf.save : tf.create}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2.5"
        >
          {tf.cancel}
        </button>
      </div>
    </form>
  );
}
