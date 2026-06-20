import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${num.toFixed(2)} €`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AF-${timestamp}-${random}`;
}

export const DELIVERY_ZONES = [
  {
    city: 'Helsinki',
    freeRadiusKm: 5,
    priceOutside: 10,
    sameDayCity: true,
  },
  {
    city: 'Espoo',
    freeRadiusKm: 3,
    priceOutside: 9,
    sameDayCity: false,
  },
  {
    city: 'Vantaa',
    freeRadiusKm: 3,
    priceOutside: 9,
    sameDayCity: false,
  },
  {
    city: 'Kerava',
    freeRadiusKm: 2,
    priceOutside: 8,
    sameDayCity: false,
  },
];

export const MASSAGE_SERVICES = [
  {
    id: 'basic',
    name_fi: 'Perus päänahkahieronta',
    name_en: 'Basic Head Massage',
    duration: 30,
    price: 35,
  },
  {
    id: 'premium',
    name_fi: 'Premium päänahkahieronta',
    name_en: 'Premium Head Massage',
    duration: 60,
    price: 65,
  },
  {
    id: 'treatment',
    name_fi: 'Hoitava päänahkahieronta',
    name_en: 'Treatment Head Massage',
    duration: 45,
    price: 50,
  },
];

export const BUSINESS_INFO = {
  name: 'Aavafloristi',
  address: 'Puistolantori 1, 00760 Helsinki',
  phone: '+358 50 123 4567',
  email: 'info@annaflowers.fi',
  whatsapp: '+358 50 123 4567',
  googleMapsUrl: 'https://maps.google.com',
  parking: {
    spot1: '1 pysäköintipaikka – 3 tunnin aikaraja',
    spot2: '2 lisäpaikkaa – 2 tunnin aikaraja',
  },
  hours: {
    weekdays: '9:00–18:00',
    saturday: '10:00–16:00',
    sunday: 'Suljettu',
  },
};
