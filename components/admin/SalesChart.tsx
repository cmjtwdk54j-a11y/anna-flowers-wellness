'use client';

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data: DataPoint[];
  mode?: 'revenue' | 'orders';
  height?: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}`;
}

function formatEur(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k€`;
  return `${v.toFixed(0)}€`;
}

export default function SalesChart({ data, mode = 'revenue', height = 180 }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-stone-300 text-sm" style={{ height }}>
        Ei dataa
      </div>
    );
  }

  const values = data.map((d) => (mode === 'revenue' ? d.revenue : d.orders));
  const max = Math.max(...values, 1);
  const barW = 100 / data.length;
  const barPad = Math.min(4, barW * 0.2);
  const svgH = height - 28;

  // Show every Nth label to avoid crowding
  const labelStep = Math.ceil(data.length / 12);

  return (
    <div style={{ height }}>
      <svg viewBox={`0 0 ${data.length * 20} ${svgH + 24}`} className="w-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={0} x2={data.length * 20}
            y1={svgH * (1 - frac)} y2={svgH * (1 - frac)}
            stroke="#e7e5e4" strokeWidth="0.5"
          />
        ))}

        {data.map((d, i) => {
          const val = mode === 'revenue' ? d.revenue : d.orders;
          const barH = (val / max) * svgH;
          const x = i * 20 + barPad;
          const w = 20 - barPad * 2;
          const showLabel = i % labelStep === 0 || i === data.length - 1;

          return (
            <g key={d.date}>
              <rect
                x={x} y={svgH - barH} width={w} height={Math.max(barH, 1)}
                rx={1.5} fill={val > 0 ? '#6366f1' : '#e5e7eb'}
                opacity={0.85}
              >
                <title>{mode === 'revenue' ? formatEur(val) : `${val} tilaus`} — {formatDate(d.date)}</title>
              </rect>
              {showLabel && (
                <text
                  x={i * 20 + 10} y={svgH + 14}
                  textAnchor="middle" fontSize="5" fill="#a8a29e"
                >
                  {formatDate(d.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
