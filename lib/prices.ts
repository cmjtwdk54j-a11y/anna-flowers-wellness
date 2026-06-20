import { prisma } from './prisma';
import { DELIVERY_ZONES } from './utils';

// Server-side source of truth for product prices — read straight from the DB so
// client-sent prices are never trusted.
export async function getProductPrice(
  productId: string,
  size: 'SMALL' | 'LARGE'
): Promise<number | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { priceSmall: true, priceLarge: true },
  });
  if (!product) return null;
  const price = size === 'LARGE' ? product.priceLarge : product.priceSmall;
  return price === null ? null : Number(price);
}

export function calcDeliveryFee(deliveryType: string, city: string): number {
  if (deliveryType === 'PICKUP' || deliveryType === 'CITY_CENTER') return 0;
  const zone = DELIVERY_ZONES.find((z) => z.city === city);
  return zone ? zone.priceOutside : 0;
}
