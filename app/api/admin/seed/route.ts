import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const bouquets = await prisma.productCategory.upsert({
      where: { slug: 'bouquets' },
      update: { name_fi: 'Kukkakimput', name_en: 'Bouquets', sortOrder: 1 },
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
      update: { name_fi: 'Hääkukat', name_en: 'Wedding Flowers', sortOrder: 2 },
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
      update: { name_fi: 'Muistokukat', name_en: 'Memorial Flowers', sortOrder: 3 },
      create: {
        slug: 'funeral',
        name_fi: 'Muistokukat',
        name_en: 'Memorial Flowers',
        description_fi: 'Arvokkaat muistokukat läheisesi muistoksi',
        description_en: 'Dignified memorial flowers in memory of your loved one',
        sortOrder: 3,
      },
    });

    await prisma.productCategory.upsert({
      where: { slug: 'plants' },
      update: { name_fi: 'Viherkasut', name_en: 'Plants', sortOrder: 4 },
      create: {
        slug: 'plants',
        name_fi: 'Viherkasut',
        name_en: 'Plants',
        description_fi: 'Kauniit viherkasut kotiin ja toimistoon',
        description_en: 'Beautiful plants for home and office',
        sortOrder: 4,
      },
    });

    // Seed demo products
    const products = [
      {
        slug: 'romanttinen-ruusukimppu',
        name_fi: 'Romanttinen ruusukimppu',
        name_en: 'Romantic Rose Bouquet',
        description_fi: 'Kaunis romanttinen ruusukimppu punaisista ruusuista. Sopii täydellisesti lahjaksi rakkaalle.',
        description_en: 'Beautiful romantic bouquet of red roses. Perfect as a gift for your loved one.',
        composition_fi: '15 punaista ruusua, eukalyptusta ja koristevihreää',
        composition_en: '15 red roses, eucalyptus and decorative greenery',
        careInfo_fi: 'Vaihda vesi 2–3 päivän välein ja leikkaa varret viistosti.',
        careInfo_en: 'Change the water every 2–3 days and cut the stems at an angle.',
        priceSmall: 35.0, priceLarge: 65.0,
        imageUrl: 'https://images.unsplash.com/photo-1548266652-99cf27701ced?w=600&h=600&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1548266652-99cf27701ced?w=600&h=600&fit=crop'],
        categoryId: bouquets.id, occasions: ['love', 'birthday', 'thanks'], color: 'red',
        flowerCount: 15, heightCm: 45, popularity: 100, isFeatured: true, isFuneral: false, isWedding: false,
      },
      {
        slug: 'vaaleanpunainen-sekakimppu',
        name_fi: 'Vaaleanpunainen sekakimppu',
        name_en: 'Pink Mixed Bouquet',
        description_fi: 'Pirteä vaaleanpunainen sekakimppu kausiluonteisista kukista.',
        description_en: 'Cheerful pink mixed bouquet of seasonal flowers.',
        composition_fi: 'Vaaleanpunaisia ruusuja, neilikoita ja kausikukkia',
        composition_en: 'Pink roses, carnations and seasonal flowers',
        careInfo_fi: 'Vaihda vesi säännöllisesti. Kestää 5–7 päivää.',
        careInfo_en: 'Change the water regularly. Lasts 5–7 days.',
        priceSmall: 28.0, priceLarge: 55.0,
        imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=600&fit=crop'],
        categoryId: bouquets.id, occasions: ['birthday', 'thanks'], color: 'pink',
        flowerCount: 18, heightCm: 40, popularity: 90, isFeatured: true, isFuneral: false, isWedding: false,
      },
      {
        slug: 'valkoinen-haakimppu',
        name_fi: 'Valkoinen hääkimppu',
        name_en: 'White Wedding Bouquet',
        description_fi: 'Elegantti valkoinen hääkimppu ruusuista ja pioneista.',
        description_en: 'Elegant white wedding bouquet with roses and peonies.',
        composition_fi: 'Valkoisia ruusuja, pioneja ja eukalyptusta',
        composition_en: 'White roses, peonies and eucalyptus',
        careInfo_fi: 'Säilytä viileässä ennen seremoniaa.',
        careInfo_en: 'Keep cool before the ceremony.',
        priceSmall: 85.0, priceLarge: 150.0,
        imageUrl: 'https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=600&h=600&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=600&h=600&fit=crop'],
        categoryId: wedding.id, occasions: ['wedding'], color: 'white',
        flowerCount: 25, heightCm: 40, popularity: 80, isFeatured: true, isFuneral: false, isWedding: true,
      },
      {
        slug: 'hautajaiskimppu-valkoinen',
        name_fi: 'Valkoinen muistokimppu',
        name_en: 'Funeral White Bouquet',
        description_fi: 'Arvokas ja kunnioittava valkoinen kimppu hautajaisiin.',
        description_en: 'Dignified and respectful white bouquet for funerals.',
        composition_fi: 'Valkoisia liljoja, ruusuja ja krysanteemeja',
        composition_en: 'White lilies, roses and chrysanthemums',
        careInfo_fi: 'Toimitamme tuoreena suoraan tilaisuuteen.',
        careInfo_en: 'We deliver fresh to the ceremony.',
        priceSmall: 45.0, priceLarge: 90.0,
        imageUrl: 'https://images.unsplash.com/photo-1561059488-916d8cdb01c5?w=600&h=600&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1561059488-916d8cdb01c5?w=600&h=600&fit=crop'],
        categoryId: funeral.id, occasions: ['funeral'], color: 'white',
        flowerCount: 20, heightCm: 50, popularity: 60, isFeatured: false, isFuneral: true, isWedding: false,
      },
    ];

    let created = 0;
    for (const p of products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      });
      created++;
    }

    return NextResponse.json({
      ok: true,
      message: `Lisätty 4 kategoriaa ja ${created} tuotetta`,
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
