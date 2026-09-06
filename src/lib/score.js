/* Pure scoring logic. Whole numbers only; an untouched cell counts as 0, so
   every total is an integer sum and there is nothing to round. */

export const uid = () => Math.random().toString(36).slice(2, 9);

/** What an unnamed category is called, by position. */
export const categoryLabel = (index) => `Category ${index + 1}`;

const nf = new Intl.NumberFormat();
export const fmt = (n) => nf.format(n);

/** Text typed by a person -> a whole number, or null for "nothing entered". */
export function sanitize(text) {
  const raw = String(text ?? '');
  const neg = /^\s*-/.test(raw);
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return { text: neg ? '-' : '', value: null };
  let n = parseInt(digits, 10);
  if (!Number.isFinite(n)) return { text: '', value: null };
  if (n > 999999999) n = 999999999;
  if (neg && n === 0) return { text: '-', value: null };
  return { text: (neg ? '-' : '') + String(n), value: neg ? -n : n };
}

export function getScore(game, categoryId, playerId) {
  const v = game.scores?.[categoryId]?.[playerId];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

export function totalFor(game, playerId) {
  let sum = 0;
  for (const cat of game.categories) {
    const v = getScore(game, cat.id, playerId);
    if (v !== null) sum += v;
  }
  return sum;
}

export function totals(game) {
  return game.players.map((p) => ({ ...p, total: totalFor(game, p.id) }));
}

/** Standard competition ranking: equal totals share a rank (1, 1, 3). */
export function rankPlayers(game) {
  const rows = totals(game);
  const dir = game.order === 'low' ? 1 : -1;
  rows.sort((a, b) => (a.total !== b.total ? (a.total - b.total) * dir : a.name.localeCompare(b.name)));

  let rank = 0, seen = 0, prev = null;
  for (const r of rows) {
    seen += 1;
    if (prev === null || r.total !== prev) { rank = seen; prev = r.total; }
    r.rank = rank;
  }
  const counts = {};
  rows.forEach((r) => { counts[r.rank] = (counts[r.rank] || 0) + 1; });
  rows.forEach((r) => { r.tied = counts[r.rank] > 1; });
  return rows;
}

export function bestTotal(game) {
  if (!game.players.length) return null;
  const list = totals(game).map((r) => r.total);
  return game.order === 'low' ? Math.min(...list) : Math.max(...list);
}

/** A category nobody named and nobody scored in. */
export function isBlankCategory(game, cat) {
  if (!cat) return false;
  if (String(cat.name || '').trim()) return false;
  const row = game.scores?.[cat.id];
  if (!row) return true;
  return !game.players.some((p) => typeof row[p.id] === 'number');
}
