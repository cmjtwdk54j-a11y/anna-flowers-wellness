import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = await prisma.massageService.findMany({
    orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
    include: { category: true },
  });
  return NextResponse.json(
    services.map((s) => ({ ...s, price: Number(s.price) }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { categoryId, name_fi, name_en, desc_fi = '', desc_en = '', duration, price, sortOrder = 0 } = body;
  const service = await prisma.massageService.create({
    data: { categoryId, name_fi, name_en, desc_fi, desc_en, duration: Number(duration), price: Number(price), sortOrder: Number(sortOrder) },
  });
  return NextResponse.json({ ...service, price: Number(service.price) });
}
