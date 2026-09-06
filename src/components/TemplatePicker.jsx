import { Check, Settings2 } from 'lucide-react';
import { Sheet } from './ui';

export default function TemplatePicker({ open, onOpenChange, custom, all, current, onPick, onManage }) {
  const row = (label, sub, selected, onClick) => (
    <button
      key={label + (sub || '')}
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
    <Sheet open={open} onOpenChange={onOpenChange} title="Template">
      <div className="max-h-[55dvh] overflow-y-auto rounded-2xl bg-surface2 p-1">
        {row('No template', 'Start with an empty category', !current, () => onPick(null))}

        {custom.length > 0 && (
          <div className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-ink3">Yours</div>
        )}
        {custom.map((t) =>
          row(t.name, `${t.categories.length} categories`, current === t.id, () => onPick(t)))}

        <div className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-widest text-ink3">Built in</div>
        {all
          .filter((t) => !custom.some((c) => c.id === t.id))
          .map((t) => row(t.name, t.note || `${t.categories.length} categories`, current === t.id, () => onPick(t)))}
      </div>

      <button
        onClick={onManage}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold text-accent transition active:bg-accent/10"
      >
        <Settings2 size={18} /> Manage templates
      </button>
    </Sheet>
  );
}
