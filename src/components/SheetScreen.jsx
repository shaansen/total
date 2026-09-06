import { bestTotal, categoryLabel, fmt, getScore, totalFor } from '../lib/score';
import { meepleColor } from '../lib/colors';

export default function SheetScreen({ game, onEditCell }) {
  if (!game.players.length) {
    return <div className="px-6 py-10 text-center text-sm text-ink3">No players yet</div>;
  }

  const nameCol = 132;
  const best = bestTotal(game);

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar min-h-0 flex-1 overflow-auto px-3 pb-4 pt-3">
        <div
          className="grid w-max min-w-full overflow-hidden rounded-2xl border border-line bg-surface"
          style={{ gridTemplateColumns: `${nameCol}px repeat(${game.players.length}, minmax(84px, 1fr))` }}
        >
          <div className="sticky left-0 top-0 z-30 border-b border-r border-line bg-surface2 px-3 py-3 text-[11px] font-bold uppercase tracking-widest text-ink2">
            Category
          </div>
          {game.players.map((p, i) => (
            <div
              key={p.id}
              className={`sticky top-0 z-20 border-b border-line bg-surface2 px-2 pb-2 pt-3 text-center ${
                i === game.players.length - 1 ? '' : 'border-r'
              }`}
            >
              <div className="truncate text-[13px] font-bold">{p.name || `Player ${i + 1}`}</div>
              <div className="mx-auto mt-1.5 h-1 w-8 rounded-full" style={{ backgroundColor: meepleColor(i) }} />
            </div>
          ))}

          {game.categories.map((cat, ci) => (
            <Row key={cat.id} game={game} cat={cat} ci={ci} onEditCell={onEditCell} />
          ))}

          <div className="sticky bottom-0 left-0 z-30 border-r border-t-2 border-line bg-surface2 px-3 py-3 text-[11px] font-bold uppercase tracking-widest text-ink2">
            Total
          </div>
          {game.players.map((p, i) => {
            const t = totalFor(game, p.id);
            const leader = game.players.length > 1 && t === best;
            return (
              <div
                key={p.id}
                className={`tnum sticky bottom-0 z-20 border-t-2 border-line bg-surface2 px-2 py-3 text-center text-lg font-extrabold ${
                  i === game.players.length - 1 ? '' : 'border-r'
                } ${leader ? 'text-accent' : 'text-ink'}`}
              >
                {fmt(t)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ game, cat, ci, onEditCell }) {
  const named = String(cat.name || '').trim();
  return (
    <>
      <div className="sticky left-0 z-10 truncate border-b border-r border-line bg-surface px-3 py-3 text-sm font-semibold">
        {named || <span className="font-normal text-ink3">{categoryLabel(ci)}</span>}
      </div>
      {game.players.map((p, i) => {
        const v = getScore(game, cat.id, p.id);
        return (
          <button
            key={p.id}
            onClick={() => onEditCell(ci, p.id)}
            className={`tnum border-b border-line px-2 py-3 text-center text-[17px] transition active:bg-accent/10 ${
              i === game.players.length - 1 ? '' : 'border-r'
            } ${v === null ? 'font-normal text-ink3' : 'font-semibold text-ink'}`}
          >
            {v === null ? '0' : fmt(v)}
          </button>
        );
      })}
    </>
  );
}
