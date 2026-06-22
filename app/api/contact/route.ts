import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log('[Contact form]', { name, email, message, at: new Date().toISOString() });

    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: process.env.ADMIN_EMAIL,
          subject: `Uusi yhteydenottopyyntö – ${name}`,
          html: `
            <p><strong>Nimi:</strong> ${name}</p>
            <p><strong>Sähköposti:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Viesti:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
      } catch (emailErr) {
        console.error('[Contact form] Email send failed:', emailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
