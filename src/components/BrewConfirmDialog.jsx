import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from './ConfirmDialog.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import { useStore } from '../store/hooks.js';
import {
  brewShortfalls,
  formatAmt,
  maxAffordableBrews,
  resolveBrewRows,
} from '../lib/brew.js';

export default function BrewConfirmDialog({
  open,
  onClose,
  onConfirm,
  ingredients,
  title = 'Brew this gathering?',
  subtitle = 'The amounts will be drawn from your cupboard stock.',
}) {
  const { state } = useStore();
  const [brewTimes, setBrewTimes] = useState(1);

  const rows = useMemo(
    () => resolveBrewRows(ingredients, state.items),
    [ingredients, state.items],
  );

  const maxBrewTimes = useMemo(() => maxAffordableBrews(rows), [rows]);

  const shortfalls = useMemo(
    () => brewShortfalls(rows, brewTimes),
    [rows, brewTimes],
  );

  const canConfirm = shortfalls.length === 0 && brewTimes >= 1 && rows.length > 0;

  useEffect(() => {
    if (open) setBrewTimes(1);
  }, [open, ingredients]);

  useEffect(() => {
    if (brewTimes > maxBrewTimes && maxBrewTimes >= 1) {
      setBrewTimes(maxBrewTimes);
    }
  }, [brewTimes, maxBrewTimes]);

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm?.(brewTimes);
    onClose?.();
  };

  const handleClose = () => {
    setBrewTimes(1);
    onClose?.();
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title={title}
      subtitle={subtitle}
      confirmLabel={brewTimes === 1 ? 'Brew' : `Brew ${brewTimes} times`}
      confirmDisabled={!canConfirm}
      onConfirm={handleConfirm}
    >
      <div className="field brew-batch-field">
        <label htmlFor="brew-times">How many times?</label>
        <div className="centered-stepper-wrap">
          <QuantityStepper
            value={brewTimes}
            onChange={setBrewTimes}
            min={1}
            max={Math.max(1, maxBrewTimes)}
            step={1}
          />
        </div>
        {maxBrewTimes > 0 ? (
          <p className="small-hint">
            Up to {maxBrewTimes} {maxBrewTimes === 1 ? 'batch' : 'batches'} with current stock.
          </p>
        ) : null}
      </div>

      {rows.length > 0 ? (
        <ul className="brew-deduct-list">
          {rows.map((r) => {
            const total = (Number(r.amount) || 0) * brewTimes;
            const unit = r.unit ? `\u00A0${r.unit}` : '';
            return (
              <li key={r.itemId}>
                <span className="brew-deduct-name">{r.emoji} {r.name}</span>
                <span className="brew-deduct-amt">
                  {brewTimes > 1 ? (
                    <>{formatAmt(total)}{unit} ({brewTimes} × {formatAmt(r.amount)}{unit})</>
                  ) : (
                    <>{formatAmt(total)}{unit}</>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      {shortfalls.length > 0 ? (
        <p className="small-hint hint-block cauldron-shortfall" role="status">
          {shortfalls.some((s) => s.zeroAmount)
            ? 'Each ingredient needs an amount before brewing.'
            : shortfalls.map((s) => (
              s.missing
                ? `${s.name} is no longer on the shelf.`
                : `Need ${formatAmt(s.needed)} of ${s.name} — only ${formatAmt(s.stocked)} on shelf.`
            )).join(' ')}
        </p>
      ) : null}
    </ConfirmDialog>
  );
}
