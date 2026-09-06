import { useState } from 'react';
import { Copy, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Card, PrimaryButton } from './ui';
import { TEMPLATES } from '../lib/templates';

const blankDraft = () => ({ id: null, name: '', categories: [''] });

export default function SettingsScreen({ custom, actions, onClose, onConfirm }) {
  const [draft, setDraft] = useState(null);

  if (draft) {
    return <Editor draft={draft} setDraft={setDraft} onSave={(d) => { actions.save(d); setDraft(null); }} />;
  }

  return (
    <div className="h-full overflow-y-auto px-4 pb-8 pt-4">
      <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-ink3">Your templates</div>
      <Card>
        {custom.length === 0 && <div className="px-4 py-6 text-center text-sm text-ink3">None yet</div>}
        {custom.map((t) => (
          <div key={t.id} className="flex items-center gap-2 border-b border-line px-3 py-3 last:border-b-0">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold">{t.name}</div>
              <div className="truncate text-xs text-ink3">{t.categories.join(' · ')}</div>
            </div>
            <button
              aria-label={`Edit ${t.name}`}
              onClick={() => setDraft({ id: t.id, name: t.name, categories: [...t.categories] })}
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink2 transition active:bg-accent/10"
            >
              <Pencil size={17} />
            </button>
            <button
              aria-label={`Delete ${t.name}`}
              onClick={() => onConfirm({
                title: `Delete "${t.name}"?`,
                confirmLabel: 'Delete template',
                onConfirm: () => actions.remove(t.id),
              })}
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink3 transition active:bg-danger/10 active:text-danger"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </Card>

      <button
        onClick={() => setDraft(blankDraft())}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line
          bg-surface py-3.5 text-base font-semibold text-accent transition active:bg-accent/10"
      >
        <Plus size={18} /> New template
      </button>

      <div className="mb-2 mt-6 px-1 text-[11px] font-bold uppercase tracking-widest text-ink3">Built in</div>
      <Card>
        {TEMPLATES.map((t) => (
          <div key={t.id} className="flex items-center gap-2 border-b border-line px-3 py-3 last:border-b-0">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold">{t.name}</div>
              <div className="truncate text-xs text-ink3">{t.categories.join(' · ')}</div>
            </div>
            <button
              aria-label={`Copy ${t.name}`}
              onClick={() => setDraft({ id: null, name: `${t.name} (mine)`, categories: [...t.categories] })}
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink2 transition active:bg-accent/10"
            >
              <Copy size={17} />
            </button>
          </div>
        ))}
      </Card>

      <button onClick={onClose} className="mt-6 block w-full rounded-2xl py-3.5 text-center text-base font-semibold text-accent">
        Done
      </button>
    </div>
  );
}

function Editor({ draft, setDraft, onSave }) {
  const setCategory = (i, value) =>
    setDraft((d) => ({ ...d, categories: d.categories.map((c, j) => (j === i ? value : c)) }));

  const addCategory = () => setDraft((d) => ({ ...d, categories: [...d.categories, ''] }));
  const removeCategory = (i) =>
    setDraft((d) => ({ ...d, categories: d.categories.filter((_, j) => j !== i) }));

  const usable = draft.categories.some((c) => c.trim());

  return (
    <div className="h-full overflow-y-auto px-4 pb-8 pt-4">
      <input
        value={draft.name}
        placeholder="Game name"
        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        className="mb-3 w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[17px] font-semibold
          outline-none placeholder:font-medium placeholder:text-ink3 focus:border-accent"
      />

      <Card>
        {draft.categories.map((c, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-line px-3 py-2 last:border-b-0">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface2 text-[12px] font-bold text-ink2">
              {i + 1}
            </span>
            <input
              value={c}
              placeholder={`Category ${i + 1}`}
              onChange={(e) => setCategory(i, e.target.value)}
              onFocus={(e) => setTimeout(() => e.target?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300)}
              className="min-w-0 flex-1 bg-transparent py-2 text-[15px] font-medium outline-none placeholder:text-ink3"
            />
            <button
              aria-label="Remove category"
              onClick={() => removeCategory(i)}
              className="grid size-9 shrink-0 place-items-center rounded-full text-ink3 transition active:bg-danger/10 active:text-danger"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </Card>

      <button
        onClick={addCategory}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line
          bg-surface py-3 text-[15px] font-semibold text-accent transition active:bg-accent/10"
      >
        <Plus size={17} /> Add category
      </button>

      <PrimaryButton className="mt-4 w-full" disabled={!usable} onClick={() => onSave(draft)}>
        Save template
      </PrimaryButton>
      <button onClick={() => setDraft(null)} className="mt-1 block w-full rounded-2xl py-3.5 text-center text-base font-semibold text-accent">
        Cancel
      </button>
    </div>
  );
}
