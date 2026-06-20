import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import { getProductBySlug } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: 'Tuotetta ei löytynyt' };
  }
  return {
    title: product.name_fi,
    description: product.description_fi,
    openGraph: {
      title: product.name_fi,
      description: product.description_fi,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_fi,
    description: product.description_fi,
    image: product.imageUrls.length ? product.imageUrls : [product.imageUrl],
    sku: product.id,
    category: product.categorySlug,
    brand: { '@type': 'Brand', name: 'Aavafloristi' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.priceSmall,
      availability: 'https://schema.org/InStock',
      url: `${appUrl}/flowers/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
