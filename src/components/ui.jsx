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
        active:brightness-95 disabled:opacity-40 ${className}`}
    />
  );
}
