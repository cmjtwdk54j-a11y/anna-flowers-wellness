import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, purchaserName, purchaserEmail, recipientName, recipientEmail, message } = body;

    if (!amount || parseFloat(amount) < 50) {
      return NextResponse.json({ error: 'Minimum gift card amount is 50€' }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const giftCard = await prisma.giftCard.create({
      data: {
        amount: parseFloat(amount),
        balance: parseFloat(amount),
        purchaserName,
        purchaserEmail,
        recipientName: recipientName || null,
        recipientEmail: recipientEmail || null,
        message: message || null,
        expiresAt,
      },
    });

    return NextResponse.json({ giftCard, code: giftCard.code });
  } catch (error) {
    console.error('Gift card creation failed:', error);
    return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
  }
}
