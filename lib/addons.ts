export interface Addon {
  id: string;
  name_fi: string;
  name_en: string;
  price: number;
  emoji: string;
}

export const ADDONS: Addon[] = [
  { id: 'card',      name_fi: 'Onnittelukortti', name_en: 'Greeting Card',   price: 3.5,  emoji: '💌' },
  { id: 'chocolate', name_fi: 'Suklaa',           name_en: 'Chocolate Box',   price: 8.0,  emoji: '🍫' },
  { id: 'vase',      name_fi: 'Maljakko',         name_en: 'Vase',            price: 12.0, emoji: '🏺' },
  { id: 'teddy',     name_fi: 'Pehmolelu',        name_en: 'Stuffed Animal',  price: 15.0, emoji: '🧸' },
];
