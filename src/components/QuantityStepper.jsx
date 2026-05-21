import { useEffect, useRef, useState } from 'react';

export default function QuantityStepper({
  value,
  onChange,
  onDecrement,
  onIncrement,
  step = 1,
  min = 0,
  max,
  compact = false,
  unit,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const dec = () => {
    if (onDecrement) return onDecrement();
    const next = Math.max(min, (Number(value) || 0) - step);
    onChange?.(next);
  };

  const inc = () => {
    if (onIncrement) return onIncrement();
    let next = (Number(value) || 0) + step;
    if (typeof max === 'number') next = Math.min(max, next);
    onChange?.(next);
  };

  const startEditing = () => {
    setDraft(String(value ?? 0));
    setEditing(true);
  };

  const commit = () => {
    const n = Number(draft.replace(',', '.'));
    if (Number.isFinite(n)) {
      let clamped = Math.max(min, n);
      if (typeof max === 'number') clamped = Math.min(max, clamped);
      onChange?.(clamped);
    }
    setEditing(false);
  };

  const cancelEdit = () => setEditing(false);

  const formatted = (() => {
    const n = Number(value) || 0;
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(2).replace(/\.?0+$/, '');
  })();

  return (
    <div className="stepper-wrap">
      <div className={'stepper' + (compact ? ' compact' : '')}>
        <button
          type="button"
          onClick={dec}
          aria-label="Decrease"
          disabled={typeof min === 'number' && Number(value) <= min}
        >
          −
        </button>
        {editing ? (
          <input
            ref={inputRef}
            className="qty"
            type="number"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') cancelEdit();
            }}
          />
        ) : (
          <button
            type="button"
            className="qty"
            onClick={startEditing}
            aria-label="Edit quantity"
          >
            {formatted}
          </button>
        )}
        <button type="button" onClick={inc} aria-label="Increase">+</button>
      </div>
      {unit ? <span className="unit-tag">{unit}</span> : null}
    </div>
  );
}
