import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MASSAGE_CATEGORIES, MASSAGE_SERVICES } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const existing = await prisma.massageCategory.count();
    if (existing > 0) {
      return NextResponse.json({ message: 'Already seeded', count: existing });
    }

    for (let i = 0; i < MASSAGE_CATEGORIES.length; i++) {
      const cat = MASSAGE_CATEGORIES[i];
      const created = await prisma.massageCategory.create({
        data: {
          slug: cat.id,
          name_fi: cat.label,
          name_en: cat.label_en,
          sortOrder: i,
          isActive: true,
        },
      });

      const catServices = MASSAGE_SERVICES
        .map((s, idx) => ({ ...s, _idx: idx }))
        .filter((s) => s.category === cat.id);

      for (let j = 0; j < catServices.length; j++) {
        const s = catServices[j];
        await prisma.massageService.create({
          data: {
            categoryId: created.id,
            name_fi: s.name_fi,
            name_en: s.name_en,
            desc_fi: s.desc_fi,
            desc_en: s.desc_en,
            duration: s.duration,
            price: s.price,
            sortOrder: j,
            isActive: true,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
