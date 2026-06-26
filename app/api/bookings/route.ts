import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MASSAGE_SERVICES } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, notes } = body;

    const serviceInfo = MASSAGE_SERVICES.find((s) => s.id === service);
    if (!serviceInfo) {
      return NextResponse.json({ error: 'Palvelua ei löydy' }, { status: 400 });
    }

    const booking = await prisma.massageBooking.create({
      data: {
        name,
        email,
        phone,
        service: `${serviceInfo.name_fi} (${serviceInfo.duration} min)`,
        servicePrice: serviceInfo.price,
        duration: serviceInfo.duration,
        date: new Date(date),
        time,
        notes: notes || null,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// GET not exposed — admin-only data. Next.js returns 405 for unlisted methods.
