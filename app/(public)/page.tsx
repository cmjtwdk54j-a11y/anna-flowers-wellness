export const revalidate = 60;

import { getTranslations, getLocale } from 'next-intl/server';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HeroSection from '@/components/home/HeroSection';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import { getFeaturedProducts } from '@/lib/products';

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations('home');
  const featuredProducts = await getFeaturedProducts(4);

  const heroT = {
    heroTitle: t('hero.title'),
    heroSubtitle: t('hero.subtitle'),
    heroShopNow: t('hero.shopNow'),
    heroBookMassage: t('hero.bookMassage'),
    trustCustomers: t('trustBadge.customers'),
    trustRating: t('trustBadge.rating'),
    trustDelivery: t('trustBadge.delivery'),
    servicesTitle: t('services.title'),
    flowersTitle: t('services.flowers.title'),
    flowersDesc: t('services.flowers.description'),
    flowersLink: t('services.flowers.link'),
    massageTitle: t('services.massage.title'),
    massageDesc: t('services.massage.description'),
    massageLink: t('services.massage.link'),
    deliveryTitle: t('services.delivery.title'),
    deliveryDesc: t('services.delivery.description'),
    deliveryLink: t('services.delivery.link'),
    whyUsTitle: t('whyUs.title'),
    whyFresh: t('whyUs.fresh'),
    whyFreshDesc: t('whyUs.freshDesc'),
    whyFast: t('whyUs.fast'),
    whyFastDesc: t('whyUs.fastDesc'),
    whyPersonal: t('whyUs.personal'),
    whyPersonalDesc: t('whyUs.personalDesc'),
    giftCardTitle: t('giftCardBanner.title'),
    giftCardSubtitle: t('giftCardBanner.subtitle'),
    giftCardButton: t('giftCardBanner.button'),
  };

  return (
    <>
      <HeroSection t={heroT} />
      <FeaturedProducts locale={locale} products={featuredProducts} />
      <NewsletterCTA locale={locale} />
    </>
  );
}
