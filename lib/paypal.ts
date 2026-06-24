const BASE =
  process.env.PAYPAL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PayPal credentials not configured');

  const creds = Buffer.from(`${id}:${secret}`).toString('base64');
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`PayPal token error: ${JSON.stringify(data)}`);
  return data.access_token as string;
}

export async function createPayPalOrder(amountEur: number): Promise<{ id: string; status: string }> {
  const token = await getToken();
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'EUR', value: amountEur.toFixed(2) } }],
    }),
  });
  return res.json();
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<{ status: string }> {
  const token = await getToken();
  const res = await fetch(`${BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return res.json();
}
