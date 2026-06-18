import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MASSAGE_SERVICES } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, notes } = body;

    const serviceInfo = MASSAGE_SERVICES.find((s) => s.id === service);
    if (!serviceInfo) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    const booking = await prisma.massageBooking.create({
      data: {
        name,
        email,
        phone,
        service: serviceInfo.name_fi,
        servicePrice: serviceInfo.price,
        duration: serviceInfo.duration,
        date: new Date(date),
        time,
        notes,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.massageBooking.findMany({
      orderBy: { date: 'asc' },
      where: { date: { gte: new Date() } },
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
