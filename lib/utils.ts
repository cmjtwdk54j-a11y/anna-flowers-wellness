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

export const MASSAGE_CATEGORIES = [
  { id: 'urh',      label: 'Urheiluhieronta',        label_en: 'Sports Massage' },
  { id: 'tiger',    label: 'Tiger balm oil',          label_en: 'Tiger Balm Oil' },
  { id: 'thai',     label: 'Thaihieronta',            label_en: 'Thai Massage' },
  { id: 'jalka',    label: 'Jalkahieronta',           label_en: 'Foot Massage' },
  { id: 'paa',      label: 'Päähieronta',             label_en: 'Head Massage' },
  { id: 'selka',    label: 'Selkä, hartiat & niska',  label_en: 'Back, Shoulders & Neck' },
  { id: 'klass',    label: 'Klassinen öljy',          label_en: 'Classic Oil Massage' },
  { id: 'vietn',    label: 'Vietnamilainen hieronta', label_en: 'Vietnamese Massage' },
  { id: 'headspa',  label: 'Head Spa',                label_en: 'Head Spa' },
] as const;

export const MASSAGE_SERVICES = [
  // Urheiluhieronta
  { id: 'urh-60',  category: 'urh',     name_fi: 'Urheiluhieronta',                      name_en: 'Sports Massage',              duration: 60,  price: 79,  desc_fi: 'Urheiluhieronta on erityisesti lihasta venyttävää ja muokkaavaa hierontaa.' },
  { id: 'urh-90',  category: 'urh',     name_fi: 'Urheiluhieronta',                      name_en: 'Sports Massage',              duration: 90,  price: 120, desc_fi: 'Urheiluhieronta on erityisesti lihasta venyttävää ja muokkaavaa hierontaa.' },
  { id: 'urh-120', category: 'urh',     name_fi: 'Urheiluhieronta',                      name_en: 'Sports Massage',              duration: 120, price: 149, desc_fi: 'Urheiluhieronta on erityisesti lihasta venyttävää ja muokkaavaa hierontaa.' },
  // Tiger balm oil
  { id: 'tiger-60',  category: 'tiger', name_fi: 'Tiger balm oil (Tiikeribalsami öljy)', name_en: 'Tiger Balm Oil Massage',      duration: 60,  price: 79,  desc_fi: 'Hieronta (syväkudoshieronta). Painonhallinta, Rentoutuminen.' },
  { id: 'tiger-90',  category: 'tiger', name_fi: 'Tiger balm oil (Tiikeribalsami öljy)', name_en: 'Tiger Balm Oil Massage',      duration: 90,  price: 120, desc_fi: 'Hieronta (syväkudoshieronta). Painonhallinta, Rentoutuminen.' },
  { id: 'tiger-120', category: 'tiger', name_fi: 'Tiger balm oil (Tiikeribalsami öljy)', name_en: 'Tiger Balm Oil Massage',      duration: 120, price: 149, desc_fi: 'Hieronta (syväkudoshieronta). Painonhallinta, Rentoutuminen.' },
  // Thaihieronta
  { id: 'thai-30', category: 'thai',    name_fi: 'Thaihieronta',                         name_en: 'Thai Massage',                duration: 30,  price: 45,  desc_fi: 'Yleinen hieronta, syvä lihasrentoutus ja tehokas kivunlievitys.' },
  { id: 'thai-45', category: 'thai',    name_fi: 'Thaihieronta',                         name_en: 'Thai Massage',                duration: 45,  price: 59,  desc_fi: 'Yleinen hieronta, syvä lihasrentoutus ja tehokas kivunlievitys.' },
  { id: 'thai-60', category: 'thai',    name_fi: 'Thaihieronta',                         name_en: 'Thai Massage',                duration: 60,  price: 79,  desc_fi: 'Yleinen hieronta, syvä lihasrentoutus ja tehokas kivunlievitys.' },
  { id: 'thai-90', category: 'thai',    name_fi: 'Thaihieronta',                         name_en: 'Thai Massage',                duration: 90,  price: 120, desc_fi: 'Yleinen hieronta, syvä lihasrentoutus ja tehokas kivunlievitys.' },
  // Jalkahieronta
  { id: 'jalka-30', category: 'jalka',  name_fi: 'Jalkahieronta',                        name_en: 'Foot Massage',                duration: 30,  price: 45,  desc_fi: 'Perinteinen thaimaalainen jalkahieronta, jalkaterät ja pohkeet.' },
  { id: 'jalka-45', category: 'jalka',  name_fi: 'Jalkahieronta',                        name_en: 'Foot Massage',                duration: 45,  price: 59,  desc_fi: 'Perinteinen thaimaalainen jalkahieronta, jalkaterät ja pohkeet.' },
  { id: 'jalka-60', category: 'jalka',  name_fi: 'Jalkahieronta',                        name_en: 'Foot Massage',                duration: 60,  price: 79,  desc_fi: 'Perinteinen thaimaalainen jalkahieronta, jalkaterät ja pohkeet.' },
  { id: 'jalka-90', category: 'jalka',  name_fi: 'Jalkahieronta',                        name_en: 'Foot Massage',                duration: 90,  price: 120, desc_fi: 'Perinteinen thaimaalainen jalkahieronta, jalkaterät ja pohkeet.' },
  // Päähieronta
  { id: 'paa-30',  category: 'paa',     name_fi: 'Päähieronta',                          name_en: 'Head Massage',                duration: 30,  price: 45,  desc_fi: 'Lievittää pään, kasvojen, niskan ja hartioiden jännitystä. Helpottaa työstä johtuvaa stressiä ja väsymystä.' },
  { id: 'paa-45',  category: 'paa',     name_fi: 'Päähieronta',                          name_en: 'Head Massage',                duration: 45,  price: 59,  desc_fi: 'Lievittää pään, kasvojen, niskan ja hartioiden jännitystä. Helpottaa työstä johtuvaa stressiä ja väsymystä.' },
  { id: 'paa-60',  category: 'paa',     name_fi: 'Päähieronta',                          name_en: 'Head Massage',                duration: 60,  price: 79,  desc_fi: 'Lievittää pään, kasvojen, niskan ja hartioiden jännitystä. Helpottaa työstä johtuvaa stressiä ja väsymystä.' },
  // Selkä, hartiat ja niska
  { id: 'selka-30', category: 'selka',  name_fi: 'Selkä, hartiat ja niska',              name_en: 'Back, Shoulders & Neck',      duration: 30,  price: 55,  desc_fi: 'Stressin vapauttamiseen. Syvä vaivaus- ja puristusliikkeitä niskan, hartioiden ja lapaluiden alueella.' },
  { id: 'selka-45', category: 'selka',  name_fi: 'Selkä, hartiat ja niska',              name_en: 'Back, Shoulders & Neck',      duration: 45,  price: 75,  desc_fi: 'Stressin vapauttamiseen. Syvä vaivaus- ja puristusliikkeitä niskan, hartioiden ja lapaluiden alueella.' },
  { id: 'selka-60', category: 'selka',  name_fi: 'Selkä, hartiat ja niska',              name_en: 'Back, Shoulders & Neck',      duration: 60,  price: 85,  desc_fi: 'Stressin vapauttamiseen. Syvä vaivaus- ja puristusliikkeitä niskan, hartioiden ja lapaluiden alueella.' },
  // Klassinen öljy
  { id: 'klass-45', category: 'klass',  name_fi: 'Klassinen öljy',                       name_en: 'Classic Oil Massage',         duration: 45,  price: 59,  desc_fi: 'Rentouttava hieronta väsymyksen lievittämiseen. Luonnolliset öljyt hierontaterapiaan.' },
  { id: 'klass-60', category: 'klass',  name_fi: 'Klassinen öljy',                       name_en: 'Classic Oil Massage',         duration: 60,  price: 69,  desc_fi: 'Rentouttava hieronta väsymyksen lievittämiseen. Luonnolliset öljyt hierontaterapiaan.' },
  { id: 'klass-90', category: 'klass',  name_fi: 'Klassinen öljy',                       name_en: 'Classic Oil Massage',         duration: 90,  price: 89,  desc_fi: 'Rentouttava hieronta väsymyksen lievittämiseen. Luonnolliset öljyt hierontaterapiaan.' },
  // Vietnamilainen hieronta
  { id: 'vietn-60',       category: 'vietn', name_fi: 'Vietnamilainen kokovartalohieronta', name_en: 'Vietnamese Full Body Massage', duration: 60,  price: 79,  desc_fi: 'Lempeä rentoutus ja stressin vähentäminen.' },
  { id: 'vietn-75',       category: 'vietn', name_fi: 'Vietnamilainen kokovartalohieronta', name_en: 'Vietnamese Full Body Massage', duration: 75,  price: 90,  desc_fi: 'Lempeä rentoutus ja stressin vähentäminen.' },
  { id: 'vietn-90',       category: 'vietn', name_fi: 'Vietnamilainen kokovartalohieronta', name_en: 'Vietnamese Full Body Massage', duration: 90,  price: 110, desc_fi: 'Lempeä rentoutus ja stressin vähentäminen.' },
  { id: 'vietn-perin-30', category: 'vietn', name_fi: 'Perinteinen hieronta 1 kohdealue',  name_en: 'Traditional Massage 1 Zone',  duration: 30,  price: 45,  desc_fi: '1 kohdealue, 30 minuuttia.' },
  { id: 'vietn-perin-45', category: 'vietn', name_fi: 'Perinteinen hieronta 2 kohdealue',  name_en: 'Traditional Massage 2 Zones', duration: 45,  price: 55,  desc_fi: '2 kohdealuetta, 45 minuuttia.' },
  { id: 'vietn-olka-30',  category: 'vietn', name_fi: 'Olkapää, Niska- ja hartiahieronta', name_en: 'Shoulder, Neck & Upper Back',  duration: 30,  price: 45,  desc_fi: 'Olkapää, Niska- ja hartialueen hieronta etenkin päätetyötä tekeville.' },
  { id: 'vietn-olka-45',  category: 'vietn', name_fi: 'Olkapää, Niska- ja hartiahieronta', name_en: 'Shoulder, Neck & Upper Back',  duration: 45,  price: 59,  desc_fi: 'Olkapää, Niska- ja hartialueen hieronta etenkin päätetyötä tekeville.' },
  // Head Spa
  { id: 'headspa-classic',  category: 'headspa', name_fi: 'Head Spa Classic',  name_en: 'Head Spa Classic',  duration: 45, price: 59,  desc_fi: 'Perus rentouttava päänahan hoito: hiustenpesu ja kevyt hieronta (sisältää föönauksen).' },
  { id: 'headspa-deluxe',   category: 'headspa', name_fi: 'Head Spa Deluxe',   name_en: 'Head Spa Deluxe',   duration: 60, price: 79,  desc_fi: 'Syvempi hoito: hiustenpesu, päänahan sekä niska-hartiaseudun ja ylävartalon hieronta, hiusnaamio ja kasvonaamio (sisältää föönauksen).' },
  { id: 'headspa-diamond',  category: 'headspa', name_fi: 'Head Spa Diamond',  name_en: 'Head Spa Diamond',  duration: 90, price: 109, desc_fi: 'Ylellinen hoito: kokonaisvaltainen päänahan ja ylävartalon hieronta aromaattisilla öljyillä, syväpuhdistus.' },
];

export const BUSINESS_INFO = {
  name: 'Aavafloristi',
  address: 'Puistolantori 1, 00760 Helsinki',
  phone: '+358 50 123 4567',
  email: 'info@aavafloristi.fi',
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
