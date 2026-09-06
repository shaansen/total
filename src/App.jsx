import { useRef, useState } from 'react';
import {
  IonAlert, IonApp, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonLabel,
  IonPage, IonTabBar, IonTabButton, IonTitle, IonToolbar,
} from '@ionic/react';
import { BarChart3, ClipboardList, MoreHorizontal, Table2, Users } from 'lucide-react';
import { useGame } from './lib/useGame';
import { findTemplate } from './lib/templates';
import PlayersScreen from './components/PlayersScreen';
import { CategoryBar, ScoreActions, ScoreList } from './components/ScoreScreen';
import SheetScreen from './components/SheetScreen';
import RanksScreen from './components/RanksScreen';
import TemplatePicker from './components/TemplatePicker';
import OptionsModal from './components/OptionsModal';
import { PrimaryButton } from './components/ui';

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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const fieldsRef = useRef([]);

  const safeCatIndex = Math.min(catIndex, Math.max(0, game.categories.length - 1));
  const activeTemplate = findTemplate(game.template);
  const hasScores = Object.values(game.scores).some((row) => Object.keys(row).length > 0);
  const scoring = tab === 'score' && game.players.length > 0;

  const goToCategory = (index) => {
    if (index > game.categories.length - 1) actions.addCategory();
    setCatIndex(Math.max(0, index));
    requestAnimationFrame(() => fieldsRef.current[0]?.focus());
  };

  /* Applying a template rebuilds the categories, so warn if scores exist. */
  const chooseTemplate = (template) => {
    setPickerOpen(false);
    const apply = () => { actions.applyTemplate(template); setCatIndex(0); };
    if (!hasScores) return apply();
    setConfirm({
      header: template ? `Use the ${template.name} template?` : 'Clear the template?',
      message: 'The current categories and every score entered are replaced.',
      confirmLabel: 'Replace',
      onConfirm: apply,
    });
  };

  const subtitle = {
    players: `${game.players.length} ${game.players.length === 1 ? 'player' : 'players'}`,
    score: `${game.players.length} ${game.players.length === 1 ? 'player' : 'players'} · ${game.categories.length} ${game.categories.length === 1 ? 'category' : 'categories'}`,
    sheet: `${game.players.length} × ${game.categories.length}`,
    ranks: game.order === 'low' ? 'lowest total wins' : 'highest total wins',
  }[tab];

  const body = {
    players: (
      <PlayersScreen
        game={game}
        actions={actions}
        onConfirm={(r) => setConfirm({ header: r.title, message: r.text, confirmLabel: r.confirmLabel, onConfirm: r.onConfirm })}
        onStart={() => setTab('score')}
        templateName={activeTemplate?.name}
        onOpenTemplates={() => setPickerOpen(true)}
      />
    ),
    score: game.players.length ? (
      <ScoreList
        game={game}
        actions={actions}
        catIndex={safeCatIndex}
        fieldsRef={fieldsRef}
        onAdvance={() => goToCategory(safeCatIndex + 1)}
      />
    ) : (
      <div className="flex flex-col items-center gap-3 px-8 py-16">
        <PrimaryButton onClick={() => setTab('players')}>Add players</PrimaryButton>
      </div>
    ),
    sheet: <SheetScreen game={game} onEditCell={(ci, playerId) => {
      setCatIndex(ci);
      setTab('score');
      const i = game.players.findIndex((p) => p.id === playerId);
      requestAnimationFrame(() => fieldsRef.current[i]?.focus());
    }} />,
    ranks: <RanksScreen game={game} />,
  }[tab];

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <span className="display text-[19px]">{TABS.find((t) => t.id === tab).label}</span>
              <span className="ml-2 text-[11px] font-medium text-ink3">{subtitle}</span>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton aria-label="Options" onClick={() => setMenuOpen(true)}>
                <MoreHorizontal size={22} />
              </IonButton>
            </IonButtons>
          </IonToolbar>

          {scoring && (
            <IonToolbar>
              <CategoryBar
                game={game}
                actions={actions}
                catIndex={safeCatIndex}
                onPrev={() => goToCategory(safeCatIndex - 1)}
                onNext={() => goToCategory(safeCatIndex + 1)}
              />
            </IonToolbar>
          )}
        </IonHeader>

        <IonContent>{body}</IonContent>

        <IonFooter>
          {scoring && (
            <IonToolbar>
              <ScoreActions
                canDelete={game.categories.length > 1}
                onDelete={() => setConfirm({
                  header: `Delete "${game.categories[safeCatIndex].name || 'this category'}"?`,
                  message: 'Every score in it is removed.',
                  confirmLabel: 'Delete',
                  onConfirm: () => {
                    actions.removeCategory(game.categories[safeCatIndex].id);
                    setCatIndex(Math.max(0, Math.min(safeCatIndex, game.categories.length - 2)));
                  },
                })}
                onFinish={() => { actions.pruneEmpty(); setTab('ranks'); }}
                onNext={() => goToCategory(safeCatIndex + 1)}
              />
            </IonToolbar>
          )}

          <IonTabBar>
            {TABS.map(({ id, label, icon: Icon }) => (
              <IonTabButton key={id} tab={id} selected={tab === id} onClick={() => setTab(id)}>
                <Icon size={21} strokeWidth={tab === id ? 2.3 : 1.9} />
                <IonLabel>{label}</IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonFooter>
      </IonPage>

      <TemplatePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        current={game.template}
        onPick={chooseTemplate}
      />

      <OptionsModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        order={game.order}
        onOrder={actions.setOrder}
        onClearScores={() => {
          setMenuOpen(false);
          setConfirm({
            header: 'Clear all scores?',
            message: 'Every number goes back to 0.',
            confirmLabel: 'Clear',
            onConfirm: actions.clearScores,
          });
        }}
        onNewGame={() => {
          setMenuOpen(false);
          setConfirm({
            header: 'Start a new game?',
            message: 'Players, categories and scores are all removed.',
            confirmLabel: 'Start new',
            onConfirm: () => { actions.newGame(); setCatIndex(0); setTab('players'); },
          });
        }}
      />

      <IonAlert
        isOpen={!!confirm}
        header={confirm?.header}
        message={confirm?.message}
        onDidDismiss={() => setConfirm(null)}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: confirm?.confirmLabel || 'OK', role: 'destructive', handler: () => confirm?.onConfirm?.() },
        ]}
      />
    </IonApp>
  );
}
