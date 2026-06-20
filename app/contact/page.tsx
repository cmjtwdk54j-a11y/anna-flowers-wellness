import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Yhteystiedot',
  description: 'Aavafloristi yhteystiedot. Löydät meidät Helsingistä. Ota yhteyttä puhelimitse, sähköpostilla tai WhatsAppin kautta.',
};

export default function ContactPage() {
  return <ContactClient />;
}
