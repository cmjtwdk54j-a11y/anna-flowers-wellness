import type { Metadata } from 'next';
import FlowerShopClient from './FlowerShopClient';
import { getProducts } from '@/lib/products';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kukkakauppa',
  description: 'Tilaa tuoreita kukkia – kukkakimppuja, hääkukkia ja muistokukkia. Toimitus Helsingissä samana päivänä.',
};

export default async function FlowersPage() {
  const products = await getProducts();
  return <FlowerShopClient products={products} />;
}
