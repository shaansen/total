import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, ClipboardList, MoreHorizontal, Table2, Users } from 'lucide-react';
import { useGame } from './lib/useGame';
import PlayersScreen from './components/PlayersScreen';
import ScoreScreen from './components/ScoreScreen';
import SheetScreen from './components/SheetScreen';
import RanksScreen from './components/RanksScreen';
import { ConfirmDialog, Segmented, Sheet, SheetRow } from './components/ui';

const TABS = [
  { id: 'players', label: 'Players', icon: Users },
  { id: 'score', label: 'Score', icon: ClipboardList },
  { id: 'sheet', label: 'Sheet', icon: Table2 },
  { id: 'ranks', label: 'Ranks', icon: BarChart3 },
];

export default function App() {
  const [game, actions] = useGame();
  const [tab, setTab] = useState(() => (game.players.length ? 'score' : 'players'));
  const [catIndex, setCatIndex] = useState(0);
  const [focusRequest, setFocusRequest] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const safeCatIndex = Math.min(catIndex, Math.max(0, game.categories.length - 1));

  const subtitle = {
    players: `${game.players.length} ${game.players.length === 1 ? 'player' : 'players'}`,
    score: `${game.players.length} players · category ${safeCatIndex + 1} of ${game.categories.length}`,
    sheet: `${game.players.length} × ${game.categories.length}`,
    ranks: game.order === 'low' ? 'lowest total wins' : 'highest total wins',
  }[tab];

  const finish = () => {
    actions.pruneEmpty();
    setTab('ranks');
  };

  const screens = {
    players: (
      <PlayersScreen
        game={game}
        actions={actions}
        onConfirm={setConfirm}
        onStart={() => setTab('score')}
      />
    ),
    score: (
      <ScoreScreen
        game={game}
        actions={actions}
        catIndex={safeCatIndex}
        setCatIndex={setCatIndex}
        focusRequest={focusRequest}
        onDone={finish}
        onGoPlayers={() => setTab('players')}
        onConfirm={setConfirm}
      />
    ),
    sheet: (
      <SheetScreen
        game={game}
        onEditCell={(ci, playerId) => {
          setCatIndex(ci);
          setFocusRequest({ playerId, at: Date.now() });
          setTab('score');
        }}
      />
    ),
    ranks: <RanksScreen game={game} />,
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <header
        className="flex items-end justify-between gap-3 border-b border-line px-4 pb-2.5"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}
      >
        <div>
          <h1 className="display text-[22px] leading-tight text-ink">
            {TABS.find((t) => t.id === tab).label}
          </h1>
          <span className="mt-0.5 block text-xs text-ink3">{subtitle}</span>
        </div>
        <button
          aria-label="Options"
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center rounded-full text-ink2 transition active:bg-accent/10"
        >
          <MoreHorizontal size={22} />
        </button>
      </header>

      <main className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-0"
          >
            {screens[tab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav
        className="grid grid-cols-4 border-t border-line bg-surface"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-col items-center gap-1 py-2 text-[10.5px] font-semibold transition ${
              tab === id ? 'text-accent' : 'text-ink3'
            }`}
          >
            <Icon size={21} strokeWidth={tab === id ? 2.3 : 1.9} />
            {label}
          </button>
        ))}
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen} title="Options">
        <div className="px-1 pb-3">
          <span className="mb-2 block text-[13px] text-ink2">Winner is</span>
          <Segmented
            value={game.order}
            onChange={actions.setOrder}
            options={[
              { value: 'high', label: 'Highest total' },
              { value: 'low', label: 'Lowest total' },
            ]}
          />
        </div>
        <SheetRow
          title="Clear all scores"
          onClick={() => {
            setMenuOpen(false);
            setConfirm({
              title: 'Clear all scores?',
              text: 'Every number goes back to 0.',
              confirmLabel: 'Clear scores',
              onConfirm: actions.clearScores,
            });
          }}
        />
        <SheetRow
          danger
          title="New game"
          onClick={() => {
            setMenuOpen(false);
            setConfirm({
              title: 'Start a new game?',
              text: 'Players, categories and scores are all removed.',
              confirmLabel: 'Start new game',
              onConfirm: () => { actions.newGame(); setCatIndex(0); setTab('players'); },
            });
          }}
        />
        <button
          onClick={() => setMenuOpen(false)}
          className="block w-full rounded-2xl py-3.5 text-center text-base font-semibold text-accent"
        >
          Close
        </button>
      </Sheet>

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </div>
  );
}
