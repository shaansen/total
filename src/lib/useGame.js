import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uid, isBlankCategory } from './score';

const STORE = 'total.state.v3';

const seed = () => ({
  players: [],
  categories: [{ id: uid(), name: '' }],
  scores: {},
  order: 'high',
});

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (!s || !Array.isArray(s.players) || !Array.isArray(s.categories)) return null;
    return {
      players: s.players,
      categories: s.categories.length ? s.categories : [{ id: uid(), name: '' }],
      scores: s.scores && typeof s.scores === 'object' ? s.scores : {},
      order: s.order === 'low' ? 'low' : 'high',
    };
  } catch {
    return null;
  }
}

export function useGame() {
  const [game, setGame] = useState(() => load() || seed());
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(STORE, JSON.stringify(game)); } catch { /* private mode */ }
  }, [game]);

  const actions = useMemo(() => ({
    addPlayer: () => {
      const id = uid();
      setGame((g) => ({ ...g, players: [...g.players, { id, name: '' }] }));
      return id;
    },
    renamePlayer: (id, name) =>
      setGame((g) => ({ ...g, players: g.players.map((p) => (p.id === id ? { ...p, name } : p)) })),
    removePlayer: (id) =>
      setGame((g) => {
        const scores = {};
        for (const [catId, row] of Object.entries(g.scores)) {
          const { [id]: _drop, ...rest } = row;
          scores[catId] = rest;
        }
        return { ...g, players: g.players.filter((p) => p.id !== id), scores };
      }),

    addCategory: () => {
      const id = uid();
      setGame((g) => ({ ...g, categories: [...g.categories, { id, name: '' }] }));
      return id;
    },
    renameCategory: (id, name) =>
      setGame((g) => ({ ...g, categories: g.categories.map((c) => (c.id === id ? { ...c, name } : c)) })),
    removeCategory: (id) =>
      setGame((g) => {
        if (g.categories.length <= 1) return g;
        const { [id]: _drop, ...scores } = g.scores;
        return { ...g, categories: g.categories.filter((c) => c.id !== id), scores };
      }),

    setScore: (categoryId, playerId, value) =>
      setGame((g) => {
        const row = { ...(g.scores[categoryId] || {}) };
        if (value === null) delete row[playerId];
        else row[playerId] = value;
        return { ...g, scores: { ...g.scores, [categoryId]: row } };
      }),

    setOrder: (order) => setGame((g) => ({ ...g, order })),
    clearScores: () => setGame((g) => ({ ...g, scores: {} })),
    newGame: () => setGame(seed()),

    /** Drop unnamed, unscored categories at the end (keeping at least one). */
    pruneEmpty: () =>
      setGame((g) => {
        const cats = [...g.categories];
        while (cats.length > 1 && isBlankCategory(g, cats[cats.length - 1])) cats.pop();
        return cats.length === g.categories.length ? g : { ...g, categories: cats };
      }),
  }), []);

  return [game, actions];
}
