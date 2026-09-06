import { useEffect, useMemo, useRef, useState } from 'react';
import { uid } from './score';
import { TEMPLATES } from './templates';

const STORE = 'total.templates.v1';

function load() {
  try {
    const list = JSON.parse(localStorage.getItem(STORE) || '[]');
    return Array.isArray(list) ? list.filter((t) => t && t.id && Array.isArray(t.categories)) : [];
  } catch {
    return [];
  }
}

/** The user's own templates, kept beside the built-in ones. */
export function useTemplates() {
  const [custom, setCustom] = useState(load);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(STORE, JSON.stringify(custom)); } catch { /* private mode */ }
  }, [custom]);

  const actions = useMemo(() => ({
    save: (draft) => {
      const clean = {
        id: draft.id || uid(),
        name: draft.name.trim() || 'Untitled game',
        categories: draft.categories.map((c) => c.trim()).filter(Boolean),
      };
      setCustom((list) => (list.some((t) => t.id === clean.id)
        ? list.map((t) => (t.id === clean.id ? clean : t))
        : [...list, clean]));
      return clean;
    },
    remove: (id) => setCustom((list) => list.filter((t) => t.id !== id)),
  }), []);

  const all = useMemo(() => [...custom, ...TEMPLATES], [custom]);

  return [custom, all, actions];
}
