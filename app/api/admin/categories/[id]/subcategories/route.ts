import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subs = await prisma.productSubcategory.findMany({
    where: { categoryId: id },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(subs);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name_fi, name_en, sortOrder } = await req.json();
    if (!name_fi || !name_en) return NextResponse.json({ error: 'name_fi and name_en required' }, { status: 400 });
    const sub = await prisma.productSubcategory.create({
      data: { categoryId: id, name_fi, name_en, sortOrder: sortOrder ?? 0 },
    });
    return NextResponse.json(sub, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
  }
}
