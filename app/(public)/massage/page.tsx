import type { Metadata } from 'next';
import MassagePageClient from './MassagePageClient';

export const metadata: Metadata = {
  title: 'Päänahkahieronta',
  description: 'Rentouttava päänahkahieronta Helsingissä. Varaa aika online – perus, premium ja hoitava hieronta.',
};

export default function MassagePage() {
  return <MassagePageClient />;
}
