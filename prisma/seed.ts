import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Categories
  const bouquets = await prisma.productCategory.upsert({
    where: { slug: 'bouquets' },
    update: { name_fi: 'Kukkakimput', name_en: 'Bouquets' },
    create: {
      slug: 'bouquets',
      name_fi: 'Kukkakimput',
      name_en: 'Bouquets',
      description_fi: 'Kauniit tuoreet kukkakimput jokaiseen tilaisuuteen',
      description_en: 'Beautiful fresh bouquets for every occasion',
      sortOrder: 1,
    },
  });

  const wedding = await prisma.productCategory.upsert({
    where: { slug: 'wedding' },
    update: { name_fi: 'Hääkukat', name_en: 'Wedding Flowers' },
    create: {
      slug: 'wedding',
      name_fi: 'Hääkukat',
      name_en: 'Wedding Flowers',
      description_fi: 'Kauniit hääkukat erityiselle päivälle',
      description_en: 'Beautiful wedding arrangements for your special day',
      sortOrder: 2,
    },
  });

  const funeral = await prisma.productCategory.upsert({
    where: { slug: 'funeral' },
    update: { name_fi: 'Muistokukat', name_en: 'Memorial Flowers' },
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
      slug: 'romanttinen-ruusukimppu',
      name_fi: 'Romanttinen ruusukimppu',
      name_en: 'Romantic Rose Bouquet',
      description_fi: 'Kaunis romanttinen ruusukimppu punaisista ruusuista. Sopii täydellisesti lahjaksi rakkaalle.',
      description_en: 'Beautiful romantic bouquet of red roses. Perfect as a gift for your loved one.',
      composition_fi: '15 punaista ruusua, eukalyptusta ja koristevihreää',
      composition_en: '15 red roses, eucalyptus and decorative greenery',
      careInfo_fi: 'Vaihda vesi 2–3 päivän välein ja leikkaa varret viistosti. Pidä poissa suorasta auringonvalosta. Kestää 7–10 päivää.',
      careInfo_en: 'Change the water every 2–3 days and cut the stems at an angle. Keep out of direct sunlight. Lasts 7–10 days.',
      priceSmall: 35.0, priceLarge: 65.0,
      imageUrl: 'https://images.unsplash.com/photo-1548266652-99cf27701ced?w=600&h=600&fit=crop',
      imageUrls: [
        'https://images.unsplash.com/photo-1548266652-99cf27701ced?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop',
      ],
      categoryId: bouquets.id, occasions: ['love', 'birthday', 'thanks'], color: 'red',
      flowerCount: 15, heightCm: 45, popularity: 100, isFeatured: true,
    },
    {
      slug: 'valkoinen-haakimppu',
      name_fi: 'Valkoinen hääkimppu',
      name_en: 'White Wedding Bouquet',
      description_fi: 'Elegantti valkoinen hääkimppu ruusuista, pioneista ja vihreydestä.',
      description_en: 'Elegant white wedding bouquet with roses, peonies and greenery.',
      composition_fi: 'Valkoisia ruusuja, pioneja, eukalyptusta ja silkkinauha',
      composition_en: 'White roses, peonies, eucalyptus and a silk ribbon',
      careInfo_fi: 'Säilytä viileässä ennen seremoniaa ja pidä varret vedessä mahdollisimman pitkään.',
      careInfo_en: 'Keep cool before the ceremony and keep the stems in water as long as possible.',
      priceSmall: 85.0, priceLarge: 150.0,
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=600&h=600&fit=crop'],
      categoryId: wedding.id, occasions: ['wedding', 'love'], color: 'white',
      flowerCount: 25, heightCm: 40, popularity: 80, isWedding: true, isFeatured: true,
    },
    {
      slug: 'vaaleanpunainen-sekakimppu',
      name_fi: 'Vaaleanpunainen sekakimppu',
      name_en: 'Pink Mixed Bouquet',
      description_fi: 'Pirteä vaaleanpunainen sekakimppu kausiluonteisista kukista.',
      description_en: 'Cheerful pink mixed bouquet of seasonal flowers.',
      composition_fi: 'Vaaleanpunaisia ruusuja, neilikoita, kausikukkia ja vihreää',
      composition_en: 'Pink roses, carnations, seasonal flowers and greenery',
      careInfo_fi: 'Vaihda vesi säännöllisesti ja poista lakastuneet kukat. Kestää 5–7 päivää.',
      careInfo_en: 'Change the water regularly and remove wilted flowers. Lasts 5–7 days.',
      priceSmall: 28.0, priceLarge: 55.0,
      imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop'],
      categoryId: bouquets.id, occasions: ['birthday', 'thanks', 'congratulations', 'seasonal'], color: 'pink',
      flowerCount: 18, heightCm: 40, popularity: 90, isFeatured: true,
    },
    {
      slug: 'kevaan-tulppaanit',
      name_fi: 'Kevään tulppaanit',
      name_en: 'Spring Tulip Bouquet',
      description_fi: 'Kirkkaat kevättulppaanit eri väreissä. Iloa jokaiseen kotiin.',
      description_en: 'Bright spring tulips in various colours. Joy for every home.',
      composition_fi: '20 värikästä tulppaania kausivalikoiman mukaan',
      composition_en: '20 colourful tulips depending on the seasonal selection',
      careInfo_fi: 'Tulppaanit kasvavat vielä maljakossa. Käytä raikasta vettä ja viileää paikkaa.',
      careInfo_en: 'Tulips keep growing in the vase. Use fresh water and a cool spot.',
      priceSmall: 22.0, priceLarge: 42.0,
      imageUrl: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&h=600&fit=crop'],
      categoryId: bouquets.id, occasions: ['seasonal', 'birthday', 'thanks'], color: 'mixed',
      flowerCount: 20, heightCm: 35, popularity: 85, isFeatured: true,
    },
    {
      slug: 'hautajaiskimppu-valkoinen',
      name_fi: 'Valkoinen muistokimppu',
      name_en: 'Funeral White Bouquet',
      description_fi: 'Arvokas ja kunnioittava valkoinen kimppu hautajaisiin.',
      description_en: 'Dignified and respectful white bouquet for funerals.',
      composition_fi: 'Valkoisia liljoja, ruusuja ja krysanteemeja kunnioittavasti aseteltuna',
      composition_en: 'White lilies, roses and chrysanthemums arranged respectfully',
      careInfo_fi: 'Toimitamme kimpun tuoreena suoraan tilaisuuteen. Suosittelemme tilaamaan 3–5 päivää etukäteen.',
      careInfo_en: 'We deliver the arrangement fresh to the ceremony. We recommend ordering 3–5 days in advance.',
      priceSmall: 45.0, priceLarge: 90.0,
      imageUrl: 'https://images.unsplash.com/photo-1561059488-916d8cdb01c5?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1561059488-916d8cdb01c5?w=600&h=600&fit=crop'],
      categoryId: funeral.id, occasions: ['funeral', 'sympathy'], color: 'white',
      flowerCount: 20, heightCm: 50, popularity: 60, isFuneral: true,
    },
    {
      slug: 'roosa-haakimppu',
      name_fi: 'Roosa hääkimppu',
      name_en: 'Pink Wedding Bouquet',
      description_fi: 'Romanttinen vaaleanpunainen hääkimppu pioneista ja ruusuista.',
      description_en: 'Romantic pink wedding bouquet with peonies and roses.',
      composition_fi: 'Vaaleanpunaisia pioneja, ruusuja, ranunkeluksia ja silkkinauha',
      composition_en: 'Pink peonies, roses, ranunculus and a silk ribbon',
      careInfo_fi: 'Säilytä viileässä ennen seremoniaa. Pioni on herkkä – käsittele varovasti.',
      careInfo_en: 'Keep cool before the ceremony. Peonies are delicate – handle with care.',
      priceSmall: 95.0, priceLarge: 175.0,
      imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=600&fit=crop'],
      categoryId: wedding.id, occasions: ['wedding', 'love'], color: 'pink',
      flowerCount: 22, heightCm: 40, popularity: 70, isWedding: true,
    },
    {
      slug: 'auringonkukkakimppu',
      name_fi: 'Auringonkukkakimppu',
      name_en: 'Sunflower Bouquet',
      description_fi: 'Iloinen ja kirkas auringonkukkakimppu, joka tuo auringonpaisteen sisätiloihin.',
      description_en: 'Cheerful and bright sunflower bouquet that brings sunshine indoors.',
      composition_fi: '7 auringonkukkaa, kausivihreää ja koristeoksia',
      composition_en: '7 sunflowers, seasonal greenery and decorative branches',
      careInfo_fi: 'Auringonkukat juovat paljon vettä – tarkista vesimäärä päivittäin.',
      careInfo_en: 'Sunflowers drink a lot of water – check the water level daily.',
      priceSmall: 25.0, priceLarge: 48.0,
      imageUrl: 'https://images.unsplash.com/photo-1469439870-4a45f0b2a284?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1469439870-4a45f0b2a284?w=600&h=600&fit=crop'],
      categoryId: bouquets.id, occasions: ['birthday', 'thanks', 'congratulations', 'seasonal'], color: 'yellow',
      flowerCount: 7, heightCm: 55, popularity: 75,
    },
    {
      slug: 'muistokimppu-punainen',
      name_fi: 'Punainen muistokimppu',
      name_en: 'Memorial Red Bouquet',
      description_fi: 'Kaunis ja arvokas punainen muistokimppu hautajaisiin.',
      description_en: 'Beautiful and dignified red memorial bouquet for funerals.',
      composition_fi: 'Punaisia ruusuja ja krysanteemeja tummalla vihreydellä',
      composition_en: 'Red roses and chrysanthemums with dark greenery',
      careInfo_fi: 'Toimitamme kimpun tuoreena suoraan tilaisuuteen. Suosittelemme tilaamaan 3–5 päivää etukäteen.',
      careInfo_en: 'We deliver the arrangement fresh to the ceremony. We recommend ordering 3–5 days in advance.',
      priceSmall: 50.0, priceLarge: 95.0,
      imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=600&fit=crop',
      imageUrls: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=600&fit=crop'],
      categoryId: funeral.id, occasions: ['funeral', 'sympathy'], color: 'red',
      flowerCount: 18, heightCm: 50, popularity: 55, isFuneral: true,
    },
  ];

  for (const product of products) {
    const { isFeatured, isFuneral, isWedding, ...rest } = product as typeof product & {
      isFeatured?: boolean; isFuneral?: boolean; isWedding?: boolean;
    };
    const data = {
      ...rest,
      priceLarge: product.priceLarge ?? null,
      isFeatured: isFeatured ?? false,
      isFuneral: isFuneral ?? false,
      isWedding: isWedding ?? false,
    };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
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
