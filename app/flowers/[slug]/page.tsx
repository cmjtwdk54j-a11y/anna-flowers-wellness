import type { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' '),
    description: 'Tilaa kaunis kukkakimppu Anna Flowers & Wellness -kukkakaupasta.',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
