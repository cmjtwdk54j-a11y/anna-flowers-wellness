'use client';

import { useState } from 'react';
import { MapPin, Truck, CheckCircle2, AlertCircle, Search, Clock } from 'lucide-react';

type ZoneResult = {
  city: string;
  fee: number;
  free: boolean;
  time: string;
  available: boolean;
};

function calcDelivery(postalCode: string): ZoneResult | null {
  const code = postalCode.replace(/\s+/g, '').trim();
  if (!/^\d{5}$/.test(code)) return null;

  const prefix = code.substring(0, 2);
  const num = parseInt(code, 10);

  if (prefix === '00') {
    return { city: 'Helsinki', fee: 0, free: true, time: '1–3 h', available: true };
  }
  if (prefix === '01' && num >= 1200 && num <= 1800) {
    return { city: 'Vantaa', fee: 9, free: false, time: '2–4 h', available: true };
  }
  if (prefix === '02' && num >= 2000 && num <= 2940) {
    return { city: 'Espoo', fee: 9, free: false, time: '2–4 h', available: true };
  }
  if (prefix === '04' && num >= 4200 && num <= 4260) {
    return { city: 'Kerava', fee: 8, free: false, time: '3–5 h', available: true };
  }

  return { city: '', fee: 0, free: false, time: '', available: false };
}

export default function DeliveryCalculatorClient() {
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [result, setResult] = useState<ZoneResult | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    const info = calcDelivery(postalCode);
    setResult(info);
    setChecked(true);
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}
          >
            <MapPin className="w-3.5 h-3.5" />
            Toimituslaskuri
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--burgundy)' }}>
            Laske toimitushinta
          </h2>
          <p className="text-gray-400 text-sm">Syötä osoitteesi ja näet heti toimitushinnan</p>
        </div>

        <div className="rounded-[32px] p-8 border border-pink-50 shadow-sm" style={{ backgroundColor: 'var(--soft-pink)' }}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-gray-500">
                Katuosoite
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Esim. Mannerheimintie 1"
                className="w-full bg-white border border-pink-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-gray-500">
                Postinumero
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="00100"
                  maxLength={5}
                  className="flex-1 bg-white border border-pink-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && postalCode.length === 5 && handleCheck()}
                />
                <button
                  onClick={handleCheck}
                  disabled={postalCode.length < 5}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 flex items-center gap-2"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  <Search className="w-4 h-4" />
                  Laske
                </button>
              </div>
            </div>
          </div>

          {checked && result && (
            <div className="mt-6 pt-6 border-t border-pink-100">
              {result.available ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-white rounded-[20px] p-4 border border-pink-50">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--soft-pink)' }}
                    >
                      {result.free ? (
                        <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--burgundy)' }} />
                      ) : (
                        <Truck className="w-6 h-6" style={{ color: 'var(--burgundy)' }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{result.city}</p>
                      <p className="text-xs text-gray-400">
                        {result.free ? 'Ilmainen toimitus!' : 'Toimitus saatavilla'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: result.free ? 'var(--burgundy)' : 'var(--gold)' }}
                      >
                        {result.free ? 'Ilmainen' : `${result.fee} €`}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">toimitushinta</p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 p-3 rounded-xl bg-white border border-pink-50"
                  >
                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--burgundy)' }} />
                    <p className="text-sm text-gray-500">
                      Arvioitu toimitusaika:{' '}
                      <strong style={{ color: 'var(--burgundy)' }}>{result.time}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-white rounded-[20px] p-4 border border-pink-50">
                  <AlertCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Toimitus ei ole saatavilla tähän osoitteeseen
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Toimitamme Helsinkiin, Espooseen, Vantaalle ja Keravalle
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
