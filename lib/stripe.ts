import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: 'SMALL' | 'LARGE';
  imageUrl?: string;
}

export async function createCheckoutSession(params: {
  items: CartItem[];
  deliveryFee: number;
  customerEmail?: string;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const { items, deliveryFee, customerEmail, orderId, successUrl, cancelUrl } = params;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: `${item.name} (${item.size === 'SMALL' ? 'Pieni' : 'Suuri'})`,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (deliveryFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Toimitusmaksu',
        },
        unit_amount: Math.round(deliveryFee * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: customerEmail,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      orderId,
    },
    payment_intent_data: {
      metadata: {
        orderId,
      },
    },
  });

  return session;
}
