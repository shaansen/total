import { useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, PrimaryButton } from './ui';
import { meepleColor } from '../lib/colors';

export default function PlayersScreen({ game, actions, onStart, onConfirm }) {
  const listRef = useRef(null);
  const focusNew = useRef(null);

  useEffect(() => {
    if (!focusNew.current) return;
    const el = listRef.current?.querySelector(`input[data-id="${focusNew.current}"]`);
    focusNew.current = null;
    el?.focus();
  }, [game.players.length]);

  return (
    <div className="h-full overflow-y-auto px-4 pb-8 pt-4">
      <Card>
        {game.players.length === 0 && (
          <div className="px-4 py-7 text-center text-sm text-ink3">
            No players yet
          </div>
        )}
        <div ref={listRef}>
          {game.players.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 border-b border-line px-3 py-2 last:border-b-0">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white"
                style={{ backgroundColor: meepleColor(i) }}
              >
                {i + 1}
              </span>
              <input
                data-id={p.id}
                value={p.name}
                placeholder={`Player ${i + 1}`}
                onChange={(e) => actions.renamePlayer(p.id, e.target.value)}
                onFocus={(e) => setTimeout(() => e.target?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300)}
                onBlur={(e) => { if (!e.target.value.trim()) actions.renamePlayer(p.id, `Player ${i + 1}`); }}
                className="min-w-0 flex-1 bg-transparent py-2 text-[17px] font-semibold outline-none placeholder:font-medium placeholder:text-ink3"
              />
              <button
                aria-label={`Remove ${p.name || `Player ${i + 1}`}`}
                onClick={() =>
                  onConfirm({
                    title: `Remove ${p.name || `Player ${i + 1}`}?`,
                    text: 'Their scores are deleted too.',
                    confirmLabel: 'Remove player',
                    onConfirm: () => actions.removePlayer(p.id),
                  })
                }
                className="grid size-9 shrink-0 place-items-center rounded-full text-ink3 transition active:bg-danger/10 active:text-danger"
              >
                <X size={17} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={() => { focusNew.current = actions.addPlayer(); }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed
          border-line bg-surface py-3.5 text-base font-semibold text-accent transition active:bg-accent/10"
      >
        <Plus size={18} /> Add player
      </button>

      <PrimaryButton className="mt-3 w-full" disabled={!game.players.length} onClick={onStart}>
        Start scoring →
      </PrimaryButton>
    </div>
  );
}
