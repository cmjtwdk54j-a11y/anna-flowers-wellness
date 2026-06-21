import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth/')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  const valid = session ? await verifySessionToken(session) : false;

  if (!valid) {
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SECRET || 'admin-secret-change-me-in-production';
    const [data, sig] = token.split('.');
    if (!data || !sig) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const signature = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify('HMAC', key, signature, encoder.encode(data));
  } catch {
    return false;
  }
}

export const config = {
  matcher: [
    '/admin',
    '/admin/((?!login$).*)',
    '/api/admin/((?!auth/).*)',
  ],
};
