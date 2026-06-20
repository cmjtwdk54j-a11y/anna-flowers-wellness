import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { StoreSettingsData } from '@/lib/admin/types';
import { BUSINESS_INFO } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS: StoreSettingsData = {
  storeName: BUSINESS_INFO.name,
  phone: BUSINESS_INFO.phone,
  email: 'info@aavafloristi.fi',
  address: BUSINESS_INFO.address,
  instagram: '',
  telegram: '',
  deliveryFee: 9.9,
  minOrderAmount: 0,
  weekdays: BUSINESS_INFO.hours.weekdays,
  saturday: BUSINESS_INFO.hours.saturday,
  sunday: BUSINESS_INFO.hours.sunday,
  confirmationText: 'Kiitos tilauksestasi! Otamme sinuun yhteyttä pian.',
};

export async function GET() {
  try {
    const record = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
    const data = record ? (record.data as unknown as StoreSettingsData) : DEFAULT_SETTINGS;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Settings GET error:', err);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data: StoreSettingsData = await req.json();
    await prisma.storeSettings.upsert({
      where: { id: 'singleton' },
      update: { data: data as any },
      create: { id: 'singleton', data: data as any },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Settings PUT error:', err);
    return NextResponse.json({ error: 'Tallennus epäonnistui' }, { status: 500 });
  }
}
