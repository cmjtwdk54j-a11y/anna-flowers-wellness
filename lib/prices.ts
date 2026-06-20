import { DELIVERY_ZONES } from './utils';

// Server-side source of truth for product prices.
// These must match the PRODUCTS array in FlowerShopClient / ProductPageClient.
const PRODUCT_PRICES: Record<string, { small: number; large: number }> = {
  '1': { small: 35, large: 65 },
  '2': { small: 85, large: 150 },
  '3': { small: 28, large: 55 },
  '4': { small: 22, large: 42 },
  '5': { small: 45, large: 90 },
  '6': { small: 95, large: 175 },
  '7': { small: 25, large: 48 },
  '8': { small: 50, large: 95 },
};

export function getProductPrice(productId: string, size: 'SMALL' | 'LARGE'): number | null {
  const prices = PRODUCT_PRICES[productId];
  if (!prices) return null;
  return size === 'SMALL' ? prices.small : prices.large;
}

export function calcDeliveryFee(deliveryType: string, city: string): number {
  if (deliveryType === 'PICKUP' || deliveryType === 'CITY_CENTER') return 0;
  const zone = DELIVERY_ZONES.find((z) => z.city === city);
  return zone ? zone.priceOutside : 0;
}
