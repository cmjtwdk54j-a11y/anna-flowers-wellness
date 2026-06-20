import Stripe from 'stripe';

let _instance: Stripe | null = null;

function getInstance(): Stripe {
  if (!_instance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _instance = new Stripe(key);
  }
  return _instance;
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    const instance = getInstance();
    const val = (instance as any)[prop];
    return typeof val === 'function' ? (val as Function).bind(instance) : val;
  },
});
