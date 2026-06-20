import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Kassa',
  description: 'Viimeistele tilauksesi turvallisesti. Hyväksymme pankkikortit, MobilePay ja Edenred.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
