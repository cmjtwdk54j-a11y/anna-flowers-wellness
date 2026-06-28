import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name_fi !== undefined) data.name_fi = body.name_fi;
  if (body.name_en !== undefined) data.name_en = body.name_en;
  if (body.desc_fi !== undefined) data.desc_fi = body.desc_fi;
  if (body.desc_en !== undefined) data.desc_en = body.desc_en;
  if (body.duration !== undefined) data.duration = Number(body.duration);
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.isActive !== undefined) data.isActive = body.isActive;
  const service = await prisma.massageService.update({ where: { id }, data });
  return NextResponse.json({ ...service, price: Number(service.price) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.massageService.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
