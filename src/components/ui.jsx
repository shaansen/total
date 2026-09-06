import * as Dialog from '@radix-ui/react-dialog';

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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+8px)] z-50 mx-auto
            max-w-[520px] rounded-3xl border border-line bg-surface p-4 shadow-2xl outline-none"
        >
          <Dialog.Title className="px-1 pb-3 text-[17px] font-bold">{title}</Dialog.Title>
          {children}
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
