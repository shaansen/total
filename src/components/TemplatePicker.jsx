import { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { Sheet } from './ui';
import { TEMPLATES } from '../lib/templates';

/* Search matches the game name and its categories, so "eggs" finds Wingspan. */
function match(template, query) {
  if (!query) return { hit: true, via: null };
  const q = query.toLowerCase();
  if (template.name.toLowerCase().includes(q)) return { hit: true, via: null };
  const category = template.categories.find((c) => c.toLowerCase().includes(q));
  if (category) return { hit: true, via: category };
  if (template.note?.toLowerCase().includes(q)) return { hit: true, via: null };
  return { hit: false, via: null };
}

export default function TemplatePicker({ open, onOpenChange, current, onPick }) {
  const [query, setQuery] = useState('');

  const results = useMemo(
    () =>
      TEMPLATES.map((t) => ({ template: t, ...match(t, query.trim()) })).filter((r) => r.hit),
    [query]
  );

  const close = (next) => { if (!next) setQuery(''); onOpenChange(next); };

  const row = (key, label, sub, selected, onClick) => (
    <button
      key={key}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition active:bg-accent/10"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold">{label}</span>
        {sub && <span className="mt-0.5 block truncate text-xs text-ink3">{sub}</span>}
      </span>
      {selected && <Check size={18} className="shrink-0 text-accent" />}
    </button>
  );

  return (
    <Sheet open={open} onOpenChange={close} title="Template">
      <div className="relative mb-2">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games or categories"
          autoComplete="off"
          autoCorrect="off"
          className="w-full rounded-2xl border border-line bg-surface py-3 pl-10 pr-10 text-[15px]
            outline-none placeholder:text-ink3 focus:border-accent"
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink3"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="max-h-[52dvh] overflow-y-auto rounded-2xl bg-surface2 p-1">
        {!query && row('none', 'No template', 'Start with an empty category', !current, () => onPick(null))}

        {results.map(({ template, via }) =>
          row(
            template.id,
            template.name,
            via || template.note || `${template.categories.length} categories`,
            current === template.id,
            () => onPick(template)
          ))}

        {query && results.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-ink3">No matches</div>
        )}
      </div>
    </Sheet>
  );
}
