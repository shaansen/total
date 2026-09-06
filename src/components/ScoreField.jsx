import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { sanitize } from '../lib/score';

/* A points field. The iPhone shows its digits-only keypad thanks to
   inputMode="numeric" plus the legacy pattern trigger; the ± button beside it
   supplies the minus sign that keypad lacks. */
const ScoreField = forwardRef(function ScoreField({ value, onChange, onEnter, className = '' }, ref) {
  /* An unscored field is left empty with a grey 0 placeholder: selecting real
     text on focus made iOS pop its cut/copy/paste menu on every tap. */
  const [text, setText] = useState(value === null ? '' : String(value));
  const inputRef = useRef(null);

  useEffect(() => {
    if (document.activeElement === inputRef.current) return;
    setText(value === null ? '' : String(value));
  }, [value]);

  const write = (next) => {
    const r = sanitize(next);
    setText(r.text);
    onChange(r.value);
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    },
    toggleSign: () => {
      write(/^-/.test(text) ? text.slice(1) : `-${text}`);
      inputRef.current?.focus();
    },
  }));

  const unset = sanitize(text).value === null;

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      value={text}
      onChange={(e) => write(e.target.value)}
      placeholder="0"
      onFocus={(e) => {
        /* caret to the end, never a selection, so no edit menu appears */
        const end = e.target.value.length;
        e.target.setSelectionRange(end, end);
        /* iOS raises the keyboard after focus, so scroll once it is up */
        setTimeout(() => e.target?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
      }}
      onBlur={() => setText(sanitize(text).text)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onEnter?.(); } }}
      className={`tnum w-[86px] shrink-0 rounded-xl border border-line bg-surface2 px-1 py-2.5
        text-center text-2xl font-bold outline-none transition
        focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent
        placeholder:font-medium placeholder:text-ink3
        ${unset ? 'font-medium text-ink3' : 'text-ink'} ${className}`}
    />
  );
});

export default ScoreField;
