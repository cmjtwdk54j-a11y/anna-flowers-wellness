import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Code required' });
  }

  try {
    const giftCard = await prisma.giftCard.findUnique({ where: { code } });

    if (!giftCard) {
      return NextResponse.json({ valid: false, error: 'Gift card not found' });
    }
    if (giftCard.status !== 'ACTIVE') {
      return NextResponse.json({ valid: false, error: 'Gift card is not active' });
    }
    if (new Date() > giftCard.expiresAt) {
      return NextResponse.json({ valid: false, error: 'Gift card has expired' });
    }
    if (parseFloat(giftCard.balance.toString()) <= 0) {
      return NextResponse.json({ valid: false, error: 'Gift card balance is zero' });
    }

    return NextResponse.json({
      valid: true,
      balance: parseFloat(giftCard.balance.toString()),
      amount: parseFloat(giftCard.amount.toString()),
    });
  } catch {
    return NextResponse.json({ valid: false, error: 'Error validating gift card' });
  }
}
