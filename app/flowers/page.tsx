import type { Metadata } from 'next';
import FlowerShopClient from './FlowerShopClient';

export const metadata: Metadata = {
  title: 'Kukkakauppa',
  description: 'Tilaa tuoreita kukkia – kukkakimppuja, häätarjoiluja ja muistokukkia. Toimitus Helsingissä samana päivänä.',
};

export default function FlowersPage() {
  return <FlowerShopClient />;
}
