'use client';

import { useEffect, useState } from 'react';
import SalesChart from '@/components/admin/SalesChart';
import type { SalesAnalytics } from '@/lib/admin/types';
import { useAdminLang } from '@/components/admin/AdminLangContext';

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? '+∞' : '0';
  const diff = ((current - previous) / previous) * 100;
  return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
}

export default function AnalyticsPage() {
  const { lang, t } = useAdminLang();
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'revenue' | 'orders'>('revenue');

  const fmt = (v: number) =>
    v.toLocaleString(lang === 'fi' ? 'fi-FI' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  const PERIODS = lang === 'fi'
    ? [{ value: 'today', label: 'Tänään' }, { value: '7d', label: '7 päivää' }, { value: '30d', label: '30 päivää' }, { value: 'month', label: 'Tämä kuukausi' }]
    : [{ value: 'today', label: 'Today' }, { value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: 'month', label: 'This month' }];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-800">{t.analytics.title}</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {lang === 'fi' ? 'Myynnin kehitys ja raportit' : 'Sales trends and reports'}
          </p>
        </div>
        <div className="flex gap-1.5 bg-stone-100 p-1 rounded-xl">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                period === p.value ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-sm text-stone-400 py-10 text-center">{t.common.loading}</div>
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-xs text-stone-400 uppercase tracking-wide">{lang === 'fi' ? 'Myynti' : 'Revenue'}</p>
              <p className="text-2xl font-bold text-stone-800 mt-1">{fmt(data.currentRevenue)}</p>
              <p className={`text-xs font-medium mt-1 ${data.currentRevenue >= data.previousRevenue ? 'text-emerald-600' : 'text-red-500'}`}>
                {pctChange(data.currentRevenue, data.previousRevenue)} {lang === 'fi' ? 'edelliseen jaksoon' : 'vs previous period'}
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-xs text-stone-400 uppercase tracking-wide">{lang === 'fi' ? 'Tilauksia' : 'Orders'}</p>
              <p className="text-2xl font-bold text-stone-800 mt-1">{data.totalOrders}</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-xs text-stone-400 uppercase tracking-wide">{lang === 'fi' ? 'Keskim. tilaus' : 'Avg. order'}</p>
              <p className="text-2xl font-bold text-stone-800 mt-1">
                {data.totalOrders > 0 ? fmt(data.currentRevenue / data.totalOrders) : '—'}
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-xs text-stone-400 uppercase tracking-wide">{lang === 'fi' ? 'Peruutettu' : 'Cancelled'}</p>
              <p className="text-2xl font-bold text-stone-800 mt-1">{data.cancelledCount}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-700">
                {lang === 'fi' ? 'Myyntikehitys' : 'Sales trend'}
              </h2>
              <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setMode('revenue')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${mode === 'revenue' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'}`}
                >{lang === 'fi' ? 'Myynti (€)' : 'Revenue (€)'}</button>
                <button
                  onClick={() => setMode('orders')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${mode === 'orders' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'}`}
                >{lang === 'fi' ? 'Tilaukset' : 'Orders'}</button>
              </div>
            </div>
            <SalesChart data={data.salesByDay} mode={mode} height={220} />
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                {lang === 'fi' ? 'Top tuotteet' : 'Top products'}
              </h2>
              {data.topProducts.length === 0
                ? <p className="text-sm text-stone-400">{lang === 'fi' ? 'Ei dataa' : 'No data'}</p>
                : (
                  <div className="space-y-3">
                    {data.topProducts.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 truncate">{p.name}</p>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${Math.round((p.count / data.topProducts[0].count) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold text-stone-700">{p.count} {lang === 'fi' ? 'kpl' : 'pcs'}</p>
                          <p className="text-xs text-stone-400">{fmt(p.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-stone-700 mb-4">
                {lang === 'fi' ? 'Top kategoriat' : 'Top categories'}
              </h2>
              {data.topCategories.length === 0
                ? <p className="text-sm text-stone-400">{lang === 'fi' ? 'Ei dataa' : 'No data'}</p>
                : (
                  <div className="space-y-3">
                    {data.topCategories.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-stone-700 truncate">{c.name}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-xs font-semibold text-stone-700">{fmt(c.revenue)}</p>
                          <p className="text-xs text-stone-400">{c.count} {lang === 'fi' ? 'kpl' : 'pcs'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        </>
      )}

      {!loading && !data && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl">
          {lang === 'fi' ? 'Analytiikan haku epäonnistui. Varmista tietokantayhteys.' : 'Failed to load analytics. Check database connection.'}
        </div>
      )}
    </div>
  );
}
