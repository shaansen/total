/* Templates live in /templates as one JSON file per game and are bundled at
   build time, so adding or editing a file and pushing to main is all it takes
   to publish a new one.

   File shape:
     {
       "id": "catan",              // unique, kebab-case; the filename usually matches
       "name": "Catan",            // shown in the picker
       "note": "optional blurb",   // optional; falls back to the category count
       "order": 0,                 // optional; lower sorts first, default 100
       "categories": ["Settlements & cities", "Longest road"]
     }
*/
const files = import.meta.glob('../../templates/*.json', { eager: true });

function normalise(raw, path) {
  const fallbackId = path.split('/').pop().replace(/\.json$/, '');
  const categories = Array.isArray(raw?.categories)
    ? raw.categories.map((c) => String(c).trim()).filter(Boolean)
    : [];
  if (!categories.length) return null;
  return {
    id: String(raw.id || fallbackId),
    name: String(raw.name || fallbackId),
    note: raw.note ? String(raw.note) : '',
    order: Number.isFinite(raw.order) ? raw.order : 100,
    categories,
  };
}

export const TEMPLATES = Object.entries(files)
  .map(([path, mod]) => normalise(mod.default ?? mod, path))
  .filter(Boolean)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export const findTemplate = (id) => TEMPLATES.find((t) => t.id === id) || null;
