import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import GatheringListCard from './GatheringListCard.jsx';
import { useStore } from '../store/hooks.js';
import { categoryMeta } from '../data/categories.js';
import { exportNodeAsPng } from '../lib/exportImage.js';

function resolveRows(cauldron, items) {
  return cauldron.map((entry) => {
    const item = items.find((it) => it.id === entry.itemId);
    const meta = item ? categoryMeta(item.category) : null;
    const stocked = item ? Number(item.quantity) || 0 : 0;
    return {
      itemId: entry.itemId,
      name: item?.name || entry.name || '(no longer on the shelf)',
      emoji: item?.emoji || entry.emoji || meta?.emoji || '·',
      unit: entry.unit || item?.unit || '',
      category: item?.category || entry.category,
      onShelf: Boolean(item),
      outOfStock: Boolean(item) && stocked <= 0,
      stocked,
    };
  });
}

export default function RestockModal({ open, onClose, onRestock, onToast }) {
  const { state } = useStore();
  const [amounts, setAmounts] = useState({});
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const cardRef = useRef(null);

  const rows = useMemo(
    () => resolveRows(state.cauldron, state.items),
    [state.cauldron, state.items],
  );

  useEffect(() => {
    if (!open) return;
    const next = {};
    state.cauldron.forEach((entry) => {
      next[entry.itemId] = Number(entry.amount) || 1;
    });
    setAmounts(next);
    setErrorMsg('');
  }, [open, state.cauldron]);

  const exportItems = useMemo(() => {
    return rows
      .map((row) => ({
        itemId: row.itemId,
        name: row.name,
        emoji: row.emoji,
        unit: row.unit,
        amount: Number(amounts[row.itemId]) || 0,
      }))
      .filter((item) => item.amount > 0);
  }, [rows, amounts]);

  const canRestock = useMemo(() => {
    return rows.some((row) => {
      if (!row.onShelf) return false;
      return (Number(amounts[row.itemId]) || 0) > 0;
    });
  }, [rows, amounts]);

  const canGather = exportItems.length > 0;

  const updateAmount = (itemId, amount) => {
    setAmounts((prev) => ({ ...prev, [itemId]: amount }));
  };

  const handleRestock = () => {
    if (!canRestock) return;
    const entries = rows
      .filter((row) => row.onShelf)
      .map((row) => ({
        itemId: row.itemId,
        amount: Number(amounts[row.itemId]) || 0,
      }))
      .filter((entry) => entry.amount > 0);
    onRestock?.(entries);
    onClose?.();
  };

  const handleGatheringList = async () => {
    if (!canGather || !cardRef.current) return;
    setBusy(true);
    try {
      setErrorMsg('');
      await exportNodeAsPng(cardRef.current, 'gathering-list.png');
      onToast?.('Gathering list saved as image');
      onClose?.();
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not export image: ' + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        elevated
        title="Gather or restock"
        subtitle="Save a shareable shopping list, or add these amounts to the cupboard—including curios that are out of stock."
        footer={
          <div className="gather-restock-footer">
            <button type="button" className="btn ghost" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button
              type="button"
              className="btn accent"
              disabled={!canGather || busy}
              onClick={handleGatheringList}
            >
              {busy ? 'Preparing…' : 'Gathering list'}
            </button>
            <button
              type="button"
              className="btn primary"
              disabled={!canRestock || busy}
              onClick={handleRestock}
            >
              Restock cupboard
            </button>
          </div>
        }
      >
        {rows.length === 0 ? (
          <p className="small-hint hint-block">Nothing gathered in the cauldron.</p>
        ) : (
          <ul className="restock-list">
            {rows.map((row) => (
              <li className="restock-row" key={row.itemId}>
                <span className="restock-row-name">
                  <span className="restock-row-emoji" aria-hidden>{row.emoji}</span>
                  <span className="restock-row-text">
                    {row.name}
                    {!row.onShelf ? (
                      <small className="restock-row-missing">No longer on the shelf</small>
                    ) : row.outOfStock ? (
                      <small className="restock-row-out">Out of stock — adds to shelf</small>
                    ) : (
                      <small>{row.stocked}{row.unit ? `\u00A0${row.unit}` : ''} on shelf now</small>
                    )}
                  </span>
                </span>
                {row.onShelf ? (
                  <QuantityStepper
                    value={amounts[row.itemId] ?? 0}
                    onChange={(v) => updateAmount(row.itemId, v)}
                    compact
                    unit={row.unit}
                    min={0}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {errorMsg ? (
          <p className="small-hint hint-block cauldron-shortfall" role="status">{errorMsg}</p>
        ) : null}
      </Modal>

      <div className="recipe-export-host" aria-hidden>
        <GatheringListCard ref={cardRef} items={exportItems} />
      </div>
    </>
  );
}
