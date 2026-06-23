import Link from 'next/link';
import { Flower2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-stone-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-soft-pink rounded-full flex items-center justify-center">
            <Flower2 className="w-10 h-10 text-accent-pink" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-stone-800 mb-3">404</h1>
        <p className="text-xl font-medium text-stone-600 mb-2">Sivua ei löydy</p>
        <p className="text-stone-400 mb-8 max-w-sm mx-auto">
          Etsimäsi sivu on poistettu tai siirretty toiseen osoitteeseen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy/90 text-white font-medium px-6 py-3 rounded-full transition-colors"
          >
            Takaisin etusivulle
          </Link>
          <Link
            href="/flowers"
            className="inline-flex items-center justify-center gap-2 border border-stone-200 hover:bg-stone-100 text-stone-700 font-medium px-6 py-3 rounded-full transition-colors"
          >
            Selaa kukkia
          </Link>
        </div>
      </div>
    </div>
  );
}
