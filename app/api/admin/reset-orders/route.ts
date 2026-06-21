import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE() {
  try {
    await prisma.orderItem.deleteMany({});
    const { count } = await prisma.order.deleteMany({});
    return NextResponse.json({ ok: true, deleted: count });
  } catch (err) {
    console.error('Reset orders error:', err);
    return NextResponse.json({ error: 'Virhe' }, { status: 500 });
  }
}
