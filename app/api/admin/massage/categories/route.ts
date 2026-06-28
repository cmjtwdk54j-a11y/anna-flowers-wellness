import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await prisma.massageCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      services: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  return NextResponse.json(
    categories.map((cat) => ({
      ...cat,
      services: cat.services.map((s) => ({ ...s, price: Number(s.price) })),
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const category = await prisma.massageCategory.create({ data: body });
  return NextResponse.json(category);
}
