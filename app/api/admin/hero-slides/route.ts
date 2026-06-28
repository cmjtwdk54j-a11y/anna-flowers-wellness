import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slide = await prisma.heroSlide.create({ data: body });
  return NextResponse.json(slide);
}
