import { MetadataRoute } from 'next';

const baseUrl = 'https://anna-flowers.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/flowers`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/massage`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/gift-cards`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/delivery`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
  ];

  const productSlugs = [
    'romanttinen-ruusukukka',
    'haiden-valkoinen-kimppu',
    'vaaleanpunainen-sekakimppu',
    'kevainen-tulppaanikimppu',
    'hautajaiskimppu-valkoinen',
    'haiden-roosa-kimppu',
    'auringonkukkakimppu',
    'muistokimppu-punainen',
  ];

  const productRoutes = productSlugs.map((slug) => ({
    url: `${baseUrl}/flowers/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
