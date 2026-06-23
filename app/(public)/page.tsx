export const revalidate = 60;

import { getLocale } from 'next-intl/server';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HeroSection from '@/components/home/HeroSection';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import { getFeaturedProducts } from '@/lib/products';

export default async function HomePage() {
  const locale = await getLocale();
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <>
      <HeroSection />
      <FeaturedProducts locale={locale} products={featuredProducts} />
      <NewsletterCTA locale={locale} />
    </>
  );
}
