import type { Metadata } from 'next';
import MassagePageClient from './MassagePageClient';

export const metadata: Metadata = {
  title: 'Hieronta & Head Spa',
  description: 'Varaa hieronta-aika verkossa Helsingissä. Urheiluhieronta, thaihieronta, vietnamilainen hieronta, klassinen öljy, jalkahieronta, Head Spa ja paljon muuta. Puistolantori 1, Puistola.',
};

export default function MassagePage() {
  return <MassagePageClient />;
}
