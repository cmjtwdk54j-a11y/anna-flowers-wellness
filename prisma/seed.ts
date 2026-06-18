import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const bouquets = await prisma.productCategory.upsert({
    where: { slug: 'bouquets' },
    update: {},
    create: {
      slug: 'bouquets',
      name_fi: 'Kukkakimput',
      name_en: 'Bouquets',
      description_fi: 'Kauniit tuorelukkuut jokaiseen tilaisuuteen',
      description_en: 'Beautiful fresh bouquets for every occasion',
      sortOrder: 1,
    },
  });

  const wedding = await prisma.productCategory.upsert({
    where: { slug: 'wedding' },
    update: {},
    create: {
      slug: 'wedding',
      name_fi: 'Häätarjoilut',
      name_en: 'Wedding',
      description_fi: 'Kauniit häätarjoilut erityiselle päivälle',
      description_en: 'Beautiful wedding arrangements for your special day',
      sortOrder: 2,
    },
  });

  const funeral = await prisma.productCategory.upsert({
    where: { slug: 'funeral' },
    update: {},
    create: {
      slug: 'funeral',
      name_fi: 'Muistokukat',
      name_en: 'Memorial Flowers',
      description_fi: 'Arvokkaat muistokukat läheisesi muistoksi',
      description_en: 'Dignified memorial flowers in memory of your loved one',
      sortOrder: 3,
    },
  });

  // Products
  const products = [
    {
      slug: 'romanttinen-ruusukukka',
      name_fi: 'Romanttinen ruusukukka',
      name_en: 'Romantic Rose Bouquet',
      description_fi: 'Kaunis romanttinen ruusukukka punaisista ruusuista. Sopii täydellisesti lahjaksi rakkaalle.',
      description_en: 'Beautiful romantic bouquet of red roses. Perfect as a gift for your loved one.',
      priceSmall: 35.00, priceLarge: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=500&h=500&fit=crop',
      categoryId: bouquets.id, isFeatured: true,
    },
    {
      slug: 'haiden-valkoinen-kimppu',
      name_fi: 'Häiden valkoinen kimppu',
      name_en: 'Wedding White Bouquet',
      description_fi: 'Elegantti valkoinen häätarjoilu ruusuilla ja pioneilla.',
      description_en: 'Elegant white wedding bouquet with roses and peonies.',
      priceSmall: 85.00, priceLarge: 150.00,
      imageUrl: 'https://images.unsplash.com/photo-1487530811015-780a59f9e2e0?w=500&h=500&fit=crop',
      categoryId: wedding.id, isWedding: true, isFeatured: true,
    },
    {
      slug: 'vaaleanpunainen-sekakimppu',
      name_fi: 'Vaaleanpunainen sekakimppu',
      name_en: 'Pink Mixed Bouquet',
      description_fi: 'Pirteä vaaleanpunainen sekakimppu kausiluonteisista kukista.',
      description_en: 'Cheerful pink mixed bouquet of seasonal flowers.',
      priceSmall: 28.00, priceLarge: 55.00,
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc66?w=500&h=500&fit=crop',
      categoryId: bouquets.id, isFeatured: true,
    },
    {
      slug: 'kevainen-tulppaanikimppu',
      name_fi: 'Kevään tulppaanit',
      name_en: 'Spring Tulip Bouquet',
      description_fi: 'Kirkkaat kevättulppaanit eri väreissä.',
      description_en: 'Bright spring tulips in various colors.',
      priceSmall: 22.00, priceLarge: 42.00,
      imageUrl: 'https://images.unsplash.com/photo-1453293425659-d33fef51fa7c?w=500&h=500&fit=crop',
      categoryId: bouquets.id, isFeatured: true,
    },
    {
      slug: 'hautajaiskimppu-valkoinen',
      name_fi: 'Hautajaisten valkoinen kimppu',
      name_en: 'Funeral White Bouquet',
      description_fi: 'Arvokas ja kunnioittava valkoinen kimppu hautajaisiin.',
      description_en: 'Dignified and respectful white bouquet for funerals.',
      priceSmall: 45.00, priceLarge: 90.00,
      imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop',
      categoryId: funeral.id, isFuneral: true,
    },
    {
      slug: 'haiden-roosa-kimppu',
      name_fi: 'Häiden roosa kimppu',
      name_en: 'Wedding Pink Bouquet',
      description_fi: 'Romanttinen vaaleanpunainen häätarjoilu.',
      description_en: 'Romantic pink wedding bouquet.',
      priceSmall: 95.00, priceLarge: 175.00,
      imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500&h=500&fit=crop',
      categoryId: wedding.id, isWedding: true,
    },
    {
      slug: 'auringonkukkakimppu',
      name_fi: 'Auringonkukkakimppu',
      name_en: 'Sunflower Bouquet',
      description_fi: 'Iloinen ja kirkas auringonkukkakimppu.',
      description_en: 'Cheerful and bright sunflower bouquet.',
      priceSmall: 25.00, priceLarge: 48.00,
      imageUrl: 'https://images.unsplash.com/photo-1416339134316-0e91dc9ded92?w=500&h=500&fit=crop',
      categoryId: bouquets.id,
    },
    {
      slug: 'muistokimppu-punainen',
      name_fi: 'Muistokimppu punainen',
      name_en: 'Memorial Red Bouquet',
      description_fi: 'Kaunis ja arvokas punainen muistokimppu hautajaisiin.',
      description_en: 'Beautiful and dignified red memorial bouquet.',
      priceSmall: 50.00, priceLarge: 95.00,
      imageUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500&h=500&fit=crop',
      categoryId: funeral.id, isFuneral: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        priceSmall: product.priceSmall,
        priceLarge: product.priceLarge || null,
        isFeatured: (product as any).isFeatured || false,
        isFuneral: (product as any).isFuneral || false,
        isWedding: (product as any).isWedding || false,
      },
    });
  }

  // Delivery zones
  const zones = [
    { city: 'Helsinki', freeRadiusKm: 5, priceOutside: 10, sameDayCity: true },
    { city: 'Espoo', freeRadiusKm: 3, priceOutside: 9, sameDayCity: false },
    { city: 'Vantaa', freeRadiusKm: 3, priceOutside: 9, sameDayCity: false },
    { city: 'Kerava', freeRadiusKm: 2, priceOutside: 8, sameDayCity: false },
  ];

  for (const zone of zones) {
    const existing = await prisma.deliveryZone.findFirst({ where: { city: zone.city } });
    if (!existing) {
      await prisma.deliveryZone.create({ data: zone });
    }
  }

  // Payment methods
  const paymentMethods = [
    { name: 'Pankkikortti', provider: 'stripe', description_fi: 'Visa, Mastercard', isActive: true, sortOrder: 1 },
    { name: 'MobilePay', provider: 'mobilepay', description_fi: 'MobilePay (tulossa)', isActive: false, sortOrder: 2 },
    { name: 'Edenred', provider: 'edenred', description_fi: 'Edenred Virike & Kulttuuri', isActive: true, sortOrder: 3 },
  ];

  for (const pm of paymentMethods) {
    const existing = await prisma.paymentMethod.findFirst({ where: { provider: pm.provider } });
    if (!existing) {
      await prisma.paymentMethod.create({ data: pm });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
