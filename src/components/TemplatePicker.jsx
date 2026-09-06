import { useMemo, useState } from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonModal, IonSearchbar, IonTitle, IonToolbar,
} from '@ionic/react';
import { Check } from 'lucide-react';
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

export default function TemplatePicker({ open, onClose, current, onPick }) {
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => TEMPLATES.map((t) => ({ template: t, ...match(t, query.trim()) })).filter((r) => r.hit),
    [query]
  );

  const Row = ({ label, sub, selected, onClick }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left transition last:border-b-0 active:bg-accent/10"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold">{label}</span>
        {sub && <span className="mt-0.5 block truncate text-xs text-ink3">{sub}</span>}
      </span>
      {selected && <Check size={18} className="shrink-0 text-accent" />}
    </button>
  );

  return (
    <IonModal
      isOpen={open}
      onDidDismiss={() => { setQuery(''); onClose(); }}
      initialBreakpoint={0.9}
      breakpoints={[0, 0.9, 1]}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Template</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={query}
            onIonInput={(e) => setQuery(e.detail.value ?? '')}
            placeholder="Search games or categories"
            showClearButton="focus"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="px-3 py-3">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            {!query && (
              <Row
                label="No template"
                sub="Start with an empty category"
                selected={!current}
                onClick={() => onPick(null)}
              />
            )}
            {results.map(({ template, via }) => (
              <Row
                key={template.id}
                label={template.name}
                sub={via || template.note || `${template.categories.length} categories`}
                selected={current === template.id}
                onClick={() => onPick(template)}
              />
            ))}
            {query && results.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-ink3">No matches</div>
            )}
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
