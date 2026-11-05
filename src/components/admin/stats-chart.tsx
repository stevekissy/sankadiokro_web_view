export function StatsChart({ series }: { series: { date: string; views: number }[] }) {
  const max = Math.max(1, ...series.map((s) => s.views));
  const w = 600;
  const h = 160;
  const bw = w / series.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} className="h-48 w-full" role="img" aria-label="Vues par jour sur 30 jours">
      {series.map((s, i) => {
        const bh = Math.round((s.views / max) * h);
        return (
          <g key={s.date}>
            <rect x={i * bw + 2} y={h - bh} width={bw - 4} height={bh} rx={3} className="fill-forest/80 hover:fill-gold" >
              <title>{`${s.date} : ${s.views} vue(s)`}</title>
            </rect>
            {i % 5 === 0 && (
              <text x={i * bw + bw / 2} y={h + 16} textAnchor="middle" className="fill-ink/50 text-[10px]">
                {s.date.slice(8, 10)}/{s.date.slice(5, 7)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
