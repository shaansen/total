import {
  IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar,
} from '@ionic/react';

export default function OptionsModal({ open, onClose, order, onOrder, onClearScores, onNewGame }) {
  return (
    <IonModal isOpen={open} onDidDismiss={onClose} initialBreakpoint={0.45} breakpoints={[0, 0.45]}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Options</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="px-4 py-4">
          <span className="mb-2 block text-[13px] text-ink2">Winner is</span>
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-surface2 p-1">
            {[
              { value: 'high', label: 'Highest total' },
              { value: 'low', label: 'Lowest total' },
            ].map((o) => (
              <button
                key={o.value}
                onClick={() => onOrder(o.value)}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  order === o.value ? 'bg-surface text-ink shadow' : 'text-ink2'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <button
            onClick={onClearScores}
            className="mb-2 block w-full rounded-2xl bg-surface2 p-3.5 text-left text-base font-semibold transition active:bg-accent/10"
          >
            Clear all scores
          </button>
          <button
            onClick={onNewGame}
            className="block w-full rounded-2xl bg-surface2 p-3.5 text-left text-base font-semibold text-danger transition active:bg-danger/10"
          >
            New game
          </button>
        </div>
      </IonContent>
    </IonModal>
  );
}
