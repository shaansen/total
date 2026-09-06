import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trash2, Flag } from 'lucide-react';
import ScoreField from './ScoreField';
import { categoryLabel, fmt, getScore, totalFor } from '../lib/score';
import { PrimaryButton } from './ui';
import { meepleColor } from '../lib/colors';

export default function ScoreScreen({
  game, actions, catIndex, setCatIndex, focusRequest, onDone, onGoPlayers, onConfirm,
}) {
  const category = game.categories[catIndex];
  const fields = useRef([]);

  /* jumping in from the Sheet puts the cursor on that player's field */
  useEffect(() => {
    if (!focusRequest) return;
    const i = game.players.findIndex((p) => p.id === focusRequest.playerId);
    if (i >= 0) fields.current[i]?.focus();
  }, [focusRequest, game.players]);

  const goTo = (index) => {
    if (index > game.categories.length - 1) actions.addCategory();
    setCatIndex(Math.max(0, index));
    requestAnimationFrame(() => fields.current[0]?.focus());
  };

  if (!game.players.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8">
        <PrimaryButton onClick={onGoPlayers}>Add players</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* category switcher */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5">
        <button
          aria-label="Previous category"
          disabled={catIndex === 0}
          onClick={() => goTo(catIndex - 1)}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface2 text-ink2 transition active:bg-accent/10 disabled:opacity-30"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <input
            value={category?.name ?? ''}
            placeholder={categoryLabel(catIndex)}
            onChange={(e) => actions.renameCategory(category.id, e.target.value)}
            className="w-full bg-transparent text-center text-[19px] font-bold outline-none placeholder:font-semibold placeholder:text-ink3"
            aria-label="Category name"
          />
          <span className="mt-0.5 block text-[11px] tracking-wide text-ink3">
            Category {catIndex + 1} of {game.categories.length}
          </span>
        </div>

        <button
          aria-label="Next category"
          onClick={() => goTo(catIndex + 1)}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface2 text-ink2 transition active:bg-accent/10"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* one row per player */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {game.players.map((p, i) => (
          <div
            key={p.id}
            className="mb-2 flex items-center gap-2.5 overflow-hidden rounded-2xl border border-line bg-surface py-2.5 pr-3.5"
          >
            <span className="h-11 w-1.5 shrink-0 rounded-r-full" style={{ backgroundColor: meepleColor(i) }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[17px] font-semibold">{p.name || `Player ${i + 1}`}</div>
              <div className="tnum mt-0.5 text-[12px] font-medium text-ink3">Σ {fmt(totalFor(game, p.id))}</div>
            </div>

            <button
              aria-label="Make negative or positive"
              onClick={() => fields.current[i]?.toggleSign()}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface2 text-lg font-bold text-ink2 transition active:bg-accent/10"
            >
              ±
            </button>

            <ScoreField
              ref={(el) => { fields.current[i] = el; }}
              value={getScore(game, category.id, p.id)}
              onChange={(v) => actions.setScore(category.id, p.id, v)}
              onEnter={() => (i + 1 < game.players.length ? fields.current[i + 1]?.focus() : goTo(catIndex + 1))}
            />
          </div>
        ))}
      </div>

      {/* footer: stop whenever the game is done, however many categories it had */}
      <div className="flex items-center gap-2 px-3 pb-2 pt-1">
        <button
          aria-label="Delete this category"
          disabled={game.categories.length <= 1}
          onClick={() =>
            onConfirm({
              title: `Delete "${category.name || 'this category'}"?`,
              text: 'Every score in it is removed.',
              confirmLabel: 'Delete category',
              onConfirm: () => {
                actions.removeCategory(category.id);
                setCatIndex(Math.max(0, Math.min(catIndex, game.categories.length - 2)));
              },
            })
          }
          className="grid size-11 shrink-0 place-items-center rounded-2xl text-ink3 transition active:bg-danger/10 active:text-danger disabled:opacity-30"
        >
          <Trash2 size={19} />
        </button>

        <button
          onClick={onDone}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line
            bg-surface py-3 text-[15px] font-semibold text-ink transition active:bg-accent/10"
        >
          <Flag size={16} /> Finish
        </button>

        <PrimaryButton className="flex-1 px-3 py-3 text-[15px]" onClick={() => goTo(catIndex + 1)}>
          Next category →
        </PrimaryButton>
      </div>
    </div>
  );
}
