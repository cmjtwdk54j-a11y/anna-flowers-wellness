'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, GripVertical, Eye, EyeOff } from 'lucide-react';

interface HeroSlide {
  id: string;
  order: number;
  imageUrl: string;
  bgColor: string;
  href: string;
  price: string;
  priceLabel: string;
  headline_fi: string;
  headline_fi2: string;
  headline_en: string;
  headline_en2: string;
  isActive: boolean;
}

const DEFAULT_SLIDES: Omit<HeroSlide, 'id' | 'order' | 'isActive'>[] = [
  { imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop', bgColor: '#e0f2fe', href: '/flowers', price: '45,00 €', priceLabel: 'Premium Collection', headline_fi: 'Kauneutta ja', headline_fi2: 'hyvinvointia', headline_en: 'Beauty &', headline_en2: 'Wellbeing' },
  { imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop', bgColor: '#f0f9ff', href: '/flowers', price: '120,00 €', priceLabel: 'Wedding Special', headline_fi: 'Täydellinen', headline_fi2: 'hääkimppu', headline_en: 'The Perfect', headline_en2: 'Wedding' },
  { imageUrl: 'https://images.unsplash.com/photo-1487530811015-780f25e19780?q=80&w=1000&auto=format&fit=crop', bgColor: '#e0f2fe', href: '/flowers', price: '35,00 €', priceLabel: 'Seasonal Blooms', headline_fi: 'Värikäs', headline_fi2: 'kukkakokoelma', headline_en: 'Colourful', headline_en2: 'Collection' },
  { imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop', bgColor: '#f0f9ff', href: '/massage', price: '65,00 €', priceLabel: 'Premium Massage', headline_fi: 'Rentouttava', headline_fi2: 'hieronta', headline_en: 'Relaxing', headline_en2: 'Massage' },
  { imageUrl: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?q=80&w=1000&auto=format&fit=crop', bgColor: '#e0f2fe', href: '/gift-cards', price: '50,00 €', priceLabel: 'Gift Card', headline_fi: 'Täydellinen', headline_fi2: 'lahja kaikille', headline_en: 'The Perfect', headline_en2: 'Gift' },
];

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
      />
    </div>
  );
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchSlides = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/hero-slides');
    if (res.ok) setSlides(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    for (let i = 0; i < DEFAULT_SLIDES.length; i++) {
      await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...DEFAULT_SLIDES[i], order: i, isActive: true }),
      });
    }
    await fetchSlides();
    setSeeding(false);
  };

  const handleImageUpload = async (slideId: string, file: File) => {
    setUploading(slideId);
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!uploadRes.ok) { setUploading(null); return; }
    const { url } = await uploadRes.json();
    await fetch(`/api/admin/hero-slides/${slideId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: url }),
    });
    await fetchSlides();
    setUploading(null);
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    await fetch(`/api/admin/hero-slides/${slide.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !slide.isActive }),
    });
    setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleField = async (slide: HeroSlide, field: keyof HeroSlide, value: string) => {
    await fetch(`/api/admin/hero-slides/${slide.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, [field]: value } : s));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить слайд?')) return;
    await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSlide = async () => {
    const res = await fetch('/api/admin/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...DEFAULT_SLIDES[0], order: slides.length, isActive: true }),
    });
    if (res.ok) await fetchSlides();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hero слайды</h1>
        <div className="flex gap-3">
          {slides.length === 0 && (
            <button onClick={handleSeedDefaults} disabled={seeding}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              {seeding ? 'Загрузка...' : 'Загрузить дефолтные'}
            </button>
          )}
          <button onClick={handleAddSlide}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1e3a8a' }}>
            <Plus className="w-4 h-4" /> Добавить слайд
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Загрузка...</div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400">Слайдов нет. Нажмите «Загрузить дефолтные» или «Добавить слайд».</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex gap-4 p-4">

                {/* Order + drag */}
                <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <span className="text-xs font-bold text-gray-300">#{idx + 1}</span>
                </div>

                {/* Image preview */}
                <div className="relative w-36 h-36 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group"
                  style={{ backgroundColor: slide.bgColor }}
                  onClick={() => fileInputRefs.current[slide.id]?.click()}>
                  <Image src={slide.imageUrl} alt={`Slide ${idx + 1}`} fill className="object-cover" sizes="144px" unoptimized />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploading === slide.id
                      ? <span className="text-white text-xs font-bold">Загрузка...</span>
                      : <Upload className="w-6 h-6 text-white" />}
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    ref={(el) => { fileInputRefs.current[slide.id] = el; }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(slide.id, f); }} />
                </div>

                {/* All fields */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3">

                  {/* Headlines FI */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">🇫🇮 Финский заголовок</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Строка 1 (FI)" value={slide.headline_fi} placeholder="Kauneutta ja"
                        onChange={(v) => handleField(slide, 'headline_fi', v)} />
                      <Field label="Строка 2 (FI)" value={slide.headline_fi2} placeholder="hyvinvointia"
                        onChange={(v) => handleField(slide, 'headline_fi2', v)} />
                    </div>
                  </div>

                  {/* Headlines EN */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">🇬🇧 Английский заголовок</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Строка 1 (EN)" value={slide.headline_en} placeholder="Beauty &"
                        onChange={(v) => handleField(slide, 'headline_en', v)} />
                      <Field label="Строка 2 (EN)" value={slide.headline_en2} placeholder="Wellbeing"
                        onChange={(v) => handleField(slide, 'headline_en2', v)} />
                    </div>
                  </div>

                  {/* Link + color */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Ссылка кнопки</label>
                    <select value={slide.href} onChange={(e) => handleField(slide, 'href', e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                      <option value="/flowers">Цветочный магазин</option>
                      <option value="/massage">Массаж</option>
                      <option value="/gift-cards">Подарочные карты</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Цвет фона</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={slide.bgColor}
                        onChange={(e) => handleField(slide, 'bgColor', e.target.value)}
                        className="w-10 h-9 rounded border border-gray-200 cursor-pointer" />
                      <span className="text-sm text-gray-500 font-mono">{slide.bgColor}</span>
                    </div>
                  </div>

                  {/* Price badge */}
                  <Field label="Цена (бейдж)" value={slide.price} placeholder="45,00 €"
                    onChange={(v) => handleField(slide, 'price', v)} />
                  <Field label="Подпись бейджа" value={slide.priceLabel} placeholder="Premium Collection"
                    onChange={(v) => handleField(slide, 'priceLabel', v)} />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => handleToggleActive(slide)} title={slide.isActive ? 'Скрыть' : 'Показать'}
                    className={`p-2 rounded-lg transition-colors ${slide.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-3 ml-[76px]">
                <p className="text-[11px] text-gray-400">Нажмите на фото чтобы заменить (JPG/PNG/WebP, макс. 5MB)</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
