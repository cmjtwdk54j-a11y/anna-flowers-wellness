import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { MASSAGE_SERVICES } from '@/lib/utils';
import { rateLimit } from '@/lib/rateLimit';

const VALID_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] as const;
const VALID_IDS = MASSAGE_SERVICES.map((s) => s.id) as [string, ...string[]];

const bookingSchema = z.object({
  name:    z.string().min(2, 'Nimi liian lyhyt').max(100).trim(),
  email:   z.string().email('Virheellinen sähköpostiosoite').max(200),
  phone:   z.string().min(6, 'Puhelinnumero liian lyhyt').max(30).trim(),
  service: z.enum(VALID_IDS, { error: 'Valitse palvelu' }),
  date:    z.string().refine((v) => !isNaN(Date.parse(v)) && new Date(v) >= new Date(new Date().toDateString()), {
    message: 'Valitse tuleva päivämäärä',
  }),
  time:    z.enum(VALID_TIMES, { error: 'Valitse aika' }),
  notes:   z.string().max(500).trim().optional(),
});

export async function POST(request: NextRequest) {
  // Rate limit: 5 booking attempts per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: 'Liian monta yritystä. Yritä hetken päästä uudelleen.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Virheellinen pyyntö' }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Tarkista lomakkeen tiedot';
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const { name, email, phone, service, date, time, notes } = parsed.data;

  const serviceInfo = MASSAGE_SERVICES.find((s) => s.id === service)!;

  try {
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
    return NextResponse.json({ error: 'Varauksen luominen epäonnistui' }, { status: 500 });
  }
}
