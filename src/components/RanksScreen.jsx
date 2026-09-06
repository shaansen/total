import { fmt, rankPlayers } from '../lib/score';
import { Card } from './ui';
import { meepleColor } from '../lib/colors';

const MEDAL = {
  1: 'bg-gold/20 text-gold',
  2: 'bg-silver/20 text-silver',
  3: 'bg-bronze/20 text-bronze',
};

export default function RanksScreen({ game }) {
  const rows = rankPlayers(game);
  const seat = Object.fromEntries(game.players.map((p, i) => [p.id, i]));

  if (!rows.length) {
    return <div className="px-6 py-10 text-center text-sm text-ink3">No players yet</div>;
  }

  const list = rows.map((r) => r.total);
  const max = Math.max(...list);
  const min = Math.min(...list);
  const span = max - min;
  const leader = rows[0].total;

  return (
    <div className="px-4 pb-8 pt-4">
      <Card>
        {rows.map((r) => {
          /* bar length shows standing: the leader is always full width */
          const frac = span === 0 ? 1 : game.order === 'low' ? (max - r.total) / span : (r.total - min) / span;
          const gap = game.order === 'low' ? r.total - leader : leader - r.total;
          return (
            <div key={r.id} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-line p-3.5 last:border-b-0">
              <span className={`tnum grid size-8 place-items-center rounded-full text-[13px] font-bold ${MEDAL[r.rank] || 'bg-surface2 text-ink2'}`}>
                {r.tied ? 'T' : ''}{r.rank}
              </span>
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">{r.name || 'Unnamed'}</div>
                <div className="mt-0.5 text-xs text-ink3">
                  {r.rank === 1 ? (r.tied ? 'Tied for the lead' : 'Leading') : `${fmt(gap)} behind`}
                </div>
              </div>
              <div className="tnum text-right text-xl font-extrabold">{fmt(r.total)}</div>
              <div className="col-start-2 col-end-4 h-2 overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(6, Math.round(frac * 100))}%`, backgroundColor: meepleColor(seat[r.id] ?? 0) }}
                />
              </div>
            </div>
          );
        })}
      </Card>

    </div>
  );
}
