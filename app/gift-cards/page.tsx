import type { Metadata } from 'next';
import GiftCardsClient from './GiftCardsClient';

export const metadata: Metadata = {
  title: 'Lahjakortit',
  description: 'Osta lahjakortti kukkakauppaan tai päänahkahierontaan. Lahjakortit alkaen 50 €, voimassa 12 kuukautta.',
};

export default function GiftCardsPage() {
  return <GiftCardsClient />;
}
