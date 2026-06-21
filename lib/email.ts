import { Resend } from 'resend';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ name_fi: string; size: string; quantity: number; price: number }>;
  deliveryType: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  scheduledAt?: Date | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

function fmt(n: number) {
  return n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('fi-FI', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function deliveryLabel(type: string) {
  switch (type) {
    case 'PICKUP': return 'Nouto myymälästä';
    case 'DELIVERY': return 'Kuljetus';
    case 'SCHEDULED': return 'Ajoitettu toimitus';
    default: return type;
  }
}

function sizeLabel(size: string) {
  return size === 'LARGE' ? 'Suuri' : 'Pieni';
}

function buildItemsTable(items: OrderEmailData['items']) {
  const rows = items.map(i => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ebe6;color:#3d2c1e;">${i.name_fi} <span style="color:#9e8575;font-size:13px;">(${sizeLabel(i.size)})</span></td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ebe6;color:#9e8575;text-align:center;">${i.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0ebe6;color:#3d2c1e;text-align:right;white-space:nowrap;">${fmt(i.price * i.quantity)}</td>
    </tr>`).join('');

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:8px;">
    <thead>
      <tr style="background:#f9f5f2;">
        <th style="padding:10px 12px;text-align:left;font-size:12px;color:#9e8575;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Tuote</th>
        <th style="padding:10px 12px;text-align:center;font-size:12px;color:#9e8575;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Kpl</th>
        <th style="padding:10px 12px;text-align:right;font-size:12px;color:#9e8575;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Hinta</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function buildConfirmationHtml(data: OrderEmailData): string {
  const deliverySection = data.deliveryType !== 'PICKUP' && (data.deliveryAddress || data.deliveryCity)
    ? `<p style="margin:4px 0;color:#3d2c1e;">📍 ${[data.deliveryAddress, data.deliveryCity].filter(Boolean).join(', ')}</p>`
    : '';

  const scheduledSection = data.scheduledAt
    ? `<p style="margin:4px 0;color:#3d2c1e;">🕐 ${fmtDate(data.scheduledAt)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="fi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf8f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(90,60,30,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#8b5e3c 0%,#a0522d 100%);padding:36px 40px;text-align:center;">
          <p style="margin:0 0 6px;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Aavafloristi</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">Tilausvahvistus</h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Kiitos tilauksestasi, ${data.customerName}! 🌸</p>
        </td></tr>

        <!-- Order number -->
        <tr><td style="padding:24px 40px 0;">
          <div style="background:#fdf8f4;border:1px solid #ecddd3;border-radius:10px;padding:16px 20px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#9e8575;text-transform:uppercase;letter-spacing:0.06em;">Tilausnumero</p>
            <p style="margin:0;font-size:20px;font-weight:700;color:#8b5e3c;font-family:monospace;">${data.orderNumber}</p>
          </div>
        </td></tr>

        <!-- Items -->
        <tr><td style="padding:24px 40px 0;">
          <h2 style="margin:0 0 12px;font-size:15px;font-weight:600;color:#3d2c1e;">Tilatut tuotteet</h2>
          ${buildItemsTable(data.items)}
        </td></tr>

        <!-- Totals -->
        <tr><td style="padding:16px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;color:#9e8575;">Välisumma</td>
              <td style="padding:6px 0;text-align:right;color:#3d2c1e;">${fmt(data.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9e8575;">Toimitusmaksu</td>
              <td style="padding:6px 0;text-align:right;color:#3d2c1e;">${data.deliveryFee > 0 ? fmt(data.deliveryFee) : 'Maksuton'}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0;border-top:2px solid #ecddd3;font-size:17px;font-weight:700;color:#3d2c1e;">Yhteensä</td>
              <td style="padding:12px 0 0;border-top:2px solid #ecddd3;text-align:right;font-size:17px;font-weight:700;color:#8b5e3c;">${fmt(data.total)}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Delivery info -->
        <tr><td style="padding:24px 40px 0;">
          <h2 style="margin:0 0 10px;font-size:15px;font-weight:600;color:#3d2c1e;">Toimitustiedot</h2>
          <div style="background:#fdf8f4;border:1px solid #ecddd3;border-radius:10px;padding:16px 20px;">
            <p style="margin:0 0 4px;color:#3d2c1e;font-weight:600;">🚚 ${deliveryLabel(data.deliveryType)}</p>
            ${deliverySection}
            ${scheduledSection}
          </div>
        </td></tr>

        <!-- Contact info -->
        <tr><td style="padding:16px 40px 0;">
          <div style="background:#fdf8f4;border:1px solid #ecddd3;border-radius:10px;padding:16px 20px;">
            <p style="margin:0 0 6px;font-size:12px;color:#9e8575;text-transform:uppercase;letter-spacing:0.06em;">Yhteystietosi</p>
            <p style="margin:2px 0;color:#3d2c1e;">${data.customerName}</p>
            <p style="margin:2px 0;color:#3d2c1e;">${data.customerPhone}</p>
            <p style="margin:2px 0;color:#3d2c1e;">${data.customerEmail}</p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:14px;color:#9e8575;">Olethan yhteydessä, jos sinulla on kysyttävää:</p>
          <p style="margin:0;font-size:14px;"><a href="mailto:info@aavafloristi.fi" style="color:#8b5e3c;text-decoration:none;font-weight:600;">info@aavafloristi.fi</a></p>
          <p style="margin:24px 0 0;font-size:12px;color:#c4b5a5;">© ${new Date().getFullYear()} Aavafloristi — Kaikki oikeudet pidätetään</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAdminNotificationHtml(data: OrderEmailData): string {
  const deliveryInfo = [
    deliveryLabel(data.deliveryType),
    data.deliveryAddress,
    data.deliveryCity,
    data.scheduledAt ? fmtDate(data.scheduledAt) : null,
  ].filter(Boolean).join(' · ');

  return `<!DOCTYPE html>
<html lang="fi">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1a1a2e;padding:24px 32px;display:flex;align-items:center;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">🛍️ Uusi tilaus</h1>
          <p style="margin:6px 0 0;color:#aaa;font-size:13px;">Aavafloristi Admin</p>
        </td></tr>

        <!-- Alert -->
        <tr><td style="padding:20px 32px 0;">
          <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:14px 18px;">
            <p style="margin:0;font-size:14px;color:#92400e;">⚡ <strong>Uusi tilaus saapunut</strong> — tarkista ja vahvista adminissa.</p>
          </div>
        </td></tr>

        <!-- Order number + total -->
        <tr><td style="padding:20px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:50%;">
                <p style="margin:0 0 2px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Tilausnumero</p>
                <p style="margin:0;font-size:16px;font-weight:700;font-family:monospace;color:#1a1a2e;">${data.orderNumber}</p>
              </td>
              <td style="width:50%;text-align:right;">
                <p style="margin:0 0 2px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Yhteensä</p>
                <p style="margin:0;font-size:22px;font-weight:800;color:#059669;">${fmt(data.total)}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Customer -->
        <tr><td style="padding:20px 32px 0;">
          <h2 style="margin:0 0 10px;font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Asiakas</h2>
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;">
            <p style="margin:0 0 4px;font-weight:600;color:#1a1a2e;">${data.customerName}</p>
            <p style="margin:2px 0;color:#555;">${data.customerPhone}</p>
            <p style="margin:2px 0;color:#555;">${data.customerEmail}</p>
          </div>
        </td></tr>

        <!-- Items -->
        <tr><td style="padding:20px 32px 0;">
          <h2 style="margin:0 0 10px;font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Tuotteet</h2>
          ${buildItemsTable(data.items)}
        </td></tr>

        <!-- Delivery -->
        <tr><td style="padding:20px 32px 0;">
          <h2 style="margin:0 0 10px;font-size:13px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Toimitus</h2>
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;">
            <p style="margin:0;color:#1a1a2e;">${deliveryInfo}</p>
          </div>
        </td></tr>

        <!-- Totals -->
        <tr><td style="padding:20px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tr style="background:#f9fafb;">
              <td style="padding:10px 18px;color:#555;">Välisumma</td>
              <td style="padding:10px 18px;text-align:right;color:#1a1a2e;">${fmt(data.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:10px 18px;color:#555;border-top:1px solid #e5e7eb;">Toimitusmaksu</td>
              <td style="padding:10px 18px;text-align:right;color:#1a1a2e;border-top:1px solid #e5e7eb;">${data.deliveryFee > 0 ? fmt(data.deliveryFee) : 'Maksuton'}</td>
            </tr>
            <tr style="background:#f0fdf4;">
              <td style="padding:12px 18px;font-weight:700;color:#065f46;border-top:2px solid #d1fae5;">Yhteensä</td>
              <td style="padding:12px 18px;text-align:right;font-size:18px;font-weight:800;color:#059669;border-top:2px solid #d1fae5;">${fmt(data.total)}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;">Aavafloristi Admin — ${new Date().toLocaleString('fi-FI')}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Use verified domain in production; on Resend free tier only onboarding@resend.dev works without domain verification
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  return new Resend(apiKey);
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  try {
    const resend = getResend();
    const { data: result, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: data.customerEmail,
      subject: `Tilausvahvistus – ${data.orderNumber}`,
      html: buildConfirmationHtml(data),
    });

    if (error) {
      console.error('[EMAIL] Resend error (confirmation):', JSON.stringify(error));
    } else {
      console.log('[EMAIL] Confirmation sent:', result?.id, '→', data.customerEmail);
    }
  } catch (err) {
    console.error('[EMAIL] sendOrderConfirmationEmail failed:', err);
  }
}

export async function sendAdminOrderNotification(data: OrderEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('[EMAIL] ADMIN_EMAIL not set — skipping admin notification');
    return;
  }

  try {
    const resend = getResend();
    const { data: result, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: adminEmail,
      subject: `🛍️ Uusi tilaus ${data.orderNumber} — ${data.customerName}`,
      html: buildAdminNotificationHtml(data),
    });

    if (error) {
      console.error('[EMAIL] Resend error (admin notification):', JSON.stringify(error));
    } else {
      console.log('[EMAIL] Admin notification sent:', result?.id, '→', adminEmail);
    }
  } catch (err) {
    console.error('[EMAIL] sendAdminOrderNotification failed:', err);
  }
}
