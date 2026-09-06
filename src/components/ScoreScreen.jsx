import { ChevronLeft, ChevronRight, Flag, Trash2 } from 'lucide-react';
import ScoreField from './ScoreField';
import { categoryLabel, fmt, getScore, totalFor } from '../lib/score';
import { meepleColor } from '../lib/colors';

/* The score view is split into three pieces so Ionic can own the layout:
   the category switcher rides in the header, the players scroll in the
   content, and the actions sit in the footer above the tab bar. */

export function CategoryBar({ game, actions, catIndex, onPrev, onNext }) {
  const category = game.categories[catIndex];
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <button
        aria-label="Previous category"
        disabled={catIndex === 0}
        onClick={onPrev}
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface2 text-ink2 transition active:bg-accent/10 disabled:opacity-30"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <input
          value={category?.name ?? ''}
          placeholder={categoryLabel(catIndex)}
          onChange={(e) => actions.renameCategory(category.id, e.target.value)}
          className="w-full bg-transparent text-center text-[18px] font-bold outline-none placeholder:font-semibold placeholder:text-ink3"
          aria-label="Category name"
        />
        <span className="block text-[11px] text-ink3">
          Category {catIndex + 1} of {game.categories.length}
        </span>
      </div>

      <button
        aria-label="Next category"
        onClick={onNext}
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface2 text-ink2 transition active:bg-accent/10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export function ScoreList({ game, actions, catIndex, fieldsRef, onAdvance }) {
  const category = game.categories[catIndex];

  return (
    <div className="px-3 py-3">
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
            onClick={() => fieldsRef.current[i]?.toggleSign()}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface2 text-lg font-bold text-ink2 transition active:bg-accent/10"
          >
            ±
          </button>

          <ScoreField
            ref={(el) => { fieldsRef.current[i] = el; }}
            value={getScore(game, category.id, p.id)}
            onChange={(v) => actions.setScore(category.id, p.id, v)}
            onEnter={() => (i + 1 < game.players.length ? fieldsRef.current[i + 1]?.focus() : onAdvance())}
          />
        </div>
      ))}
    </div>
  );
}

export function ScoreActions({ canDelete, onDelete, onFinish, onNext }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <button
        aria-label="Delete this category"
        disabled={!canDelete}
        onClick={onDelete}
        className="grid size-11 shrink-0 place-items-center rounded-2xl text-ink3 transition active:bg-danger/10 active:text-danger disabled:opacity-30"
      >
        <Trash2 size={19} />
      </button>

      <button
        onClick={onFinish}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface
          py-2.5 text-[15px] font-semibold text-ink transition active:bg-accent/10"
      >
        <Flag size={16} /> Finish
      </button>

      <button
        onClick={onNext}
        className="flex-1 rounded-2xl bg-accent px-3 py-2.5 text-[15px] font-bold text-white transition active:brightness-95"
      >
        Next category →
      </button>
    </div>
  );
}
