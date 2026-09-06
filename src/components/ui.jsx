import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

/* How much of the layout viewport the on-screen keyboard is covering. */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const update = () => setInset(Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)));
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
  return inset;
}

export function Card({ className = '', children }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-surface ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({ className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded-2xl bg-accent px-5 py-3.5 text-base font-bold text-white transition
        active:brightness-95 disabled:opacity-40 dark:text-[#06231d] ${className}`}
    />
  );
}

export function GhostButton({ className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded-2xl px-4 py-3 text-base font-semibold text-accent transition
        active:bg-accent/10 disabled:opacity-40 ${className}`}
    />
  );
}

export function Sheet({ open, onOpenChange, title, children }) {
  const keyboard = useKeyboardInset();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed inset-x-2 z-50 mx-auto flex max-w-[520px] flex-col overflow-hidden
            rounded-3xl border border-line bg-surface p-4 shadow-2xl outline-none"
          style={{
            /* ride above the keyboard, and never grow past what is visible */
            bottom: `calc(env(safe-area-inset-bottom) + 8px + ${keyboard}px)`,
            maxHeight: `calc(100dvh - ${keyboard}px - 24px)`,
          }}
        >
          <Dialog.Title className="shrink-0 px-1 pb-3 text-[17px] font-bold">{title}</Dialog.Title>
          <div className="flex min-h-0 flex-col">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function SheetRow({ danger, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`mb-2 block w-full rounded-2xl bg-surface2 p-3.5 text-left text-base font-semibold
        transition active:bg-accent/10 ${danger ? 'text-danger' : 'text-ink'}`}
    >
      {title}
      {subtitle && <span className="mt-0.5 block text-xs font-medium text-ink3">{subtitle}</span>}
    </button>
  );
}

export function Segmented({ value, onChange, options }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-surface2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-xl py-2.5 text-sm font-semibold transition ${
            value === o.value ? 'bg-surface text-ink shadow' : 'text-ink2'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ConfirmDialog({ request, onClose }) {
  return (
    <Sheet open={!!request} onOpenChange={(o) => !o && onClose()} title={request?.title || ''}>
      {request?.text && <p className="px-1 pb-3 text-sm text-ink2">{request.text}</p>}
      <SheetRow
        danger
        title={request?.confirmLabel || 'Delete'}
        onClick={() => { request?.onConfirm?.(); onClose(); }}
      />
      <button
        onClick={onClose}
        className="block w-full rounded-2xl py-3.5 text-center text-base font-semibold text-accent"
      >
        Cancel
      </button>
    </Sheet>
  );
}
