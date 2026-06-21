import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Kuvanlataus ei ole käytössä. Lisää Vercel Blob Storage projektiin.' },
        { status: 503 }
      );
    }

    const { put } = await import('@vercel/blob');

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tiedosto puuttuu' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sallitut formaatit: JPG, PNG, WebP, GIF' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Tiedosto on liian suuri (max 5MB)' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Lataus epäonnistui' }, { status: 500 });
  }
}
