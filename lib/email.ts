// Email sending stubs. Wire up a real provider (e.g. Resend) by replacing the
// console.log calls with API calls and setting RESEND_API_KEY / ADMIN_EMAIL in env.

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

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  // TODO: replace with Resend or other provider
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'Aavafloristi <noreply@aavafloristi.fi>',
  //   to: data.customerEmail,
  //   subject: `Tilausvahvistus ${data.orderNumber}`,
  //   html: buildConfirmationHtml(data),
  // });
  console.log(`[EMAIL] Order confirmation → ${data.customerEmail} | order: ${data.orderNumber} | total: ${data.total} €`);
}

export async function sendAdminOrderNotification(data: OrderEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || 'info@annaflowers.fi';
  // TODO: replace with Resend or other provider
  console.log(`[EMAIL] Admin notification → ${adminEmail} | order: ${data.orderNumber} | customer: ${data.customerName} | total: ${data.total} €`);
}
