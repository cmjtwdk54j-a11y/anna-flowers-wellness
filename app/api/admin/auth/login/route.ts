import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, ADMIN_COOKIE } from '@/lib/admin/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: 'Väärä salasana' }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Kirjautuminen epäonnistui' }, { status: 500 });
  }
}
