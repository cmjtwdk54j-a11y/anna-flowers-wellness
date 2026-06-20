'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flower2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const from = searchParams.get('from') || '/admin';
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Kirjautuminen epäonnistui');
      }
    } catch {
      setError('Verkkovirhe. Yritä uudelleen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">Aavafloristi</p>
              <p className="text-stone-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="bg-stone-800 rounded-2xl p-6 shadow-xl border border-stone-700">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-stone-400" />
            <h1 className="text-sm font-semibold text-stone-200">Kirjaudu sisään</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Salasana</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                placeholder="••••••••"
                className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/30 px-3 py-2 rounded-lg border border-red-800/40">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
            </button>
          </form>

          <p className="text-xs text-stone-500 text-center mt-4">
            Oletussalasana: <code className="text-stone-400">admin123</code>
            <br />
            <span className="text-stone-600">Muuta ADMIN_PASSWORD ympäristömuuttujaa</span>
          </p>
        </div>
      </div>
    </div>
  );
}
