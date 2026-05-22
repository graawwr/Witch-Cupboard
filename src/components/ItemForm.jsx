import { useState } from 'react';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { CATEGORIES, EMOJI_PALETTE, categoryMeta } from '../data/categories.js';
import { DEFAULT_UNITS } from '../data/units.js';
import { useActions } from '../store/hooks.js';

export default function ItemForm({ open, onClose, onSaved, initialItem, title, subtitle }) {
  const actions = useActions();
  const isEdit = Boolean(initialItem?.id);

  const defaults = {
    name: initialItem?.name || '',
    category: initialItem?.category || 'wood',
    quantity: initialItem?.quantity ?? 0,
    unit: initialItem?.unit || categoryMeta(initialItem?.category || 'wood').unit,
    emoji: initialItem?.emoji || categoryMeta(initialItem?.category || 'wood').emoji,
    notes: initialItem?.notes || '',
  };

  const [name, setName] = useState(defaults.name);
  const [category, setCategory] = useState(defaults.category);
  const [quantity, setQuantity] = useState(defaults.quantity);
  const [unit, setUnit] = useState(defaults.unit);
  const [emoji, setEmoji] = useState(defaults.emoji);
  const [notes, setNotes] = useState(defaults.notes);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const onCategoryChange = (id) => {
    const meta = categoryMeta(id);
    setCategory(id);
    if (!isEdit || emoji === categoryMeta(category).emoji) setEmoji(meta.emoji);
    if (!isEdit || unit === categoryMeta(category).unit) setUnit(meta.unit);
  };

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const payload = {
      name: name.trim(),
      category,
      quantity: Number(quantity) || 0,
      unit,
      emoji,
      notes: notes.trim(),
    };
    if (isEdit) actions.updateItem(initialItem.id, payload);
    else {
      actions.addItem(payload);
      onSaved?.(payload.name);
    }
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <Modal
        open
        onClose={onClose}
        elevated
        title={title || (isEdit ? 'Edit ingredient' : 'Stock the cupboard')}
        subtitle={
          subtitle
          || (isEdit
            ? 'Adjust the details of this ingredient.'
            : 'Sort it by element — wood, fire, earth, metal, or water.')
        }
        footer={
          <>
            {isEdit ? (
              <button type="button" className="btn danger" onClick={() => setConfirmDeleteOpen(true)}>
                Remove
              </button>
            ) : (
              <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            )}
            <button type="button" className="btn primary" disabled={!canSave} onClick={handleSave}>
              {isEdit ? 'Save' : 'Stock it'}
            </button>
          </>
        }
      >
        <div className="field">
          <label>Name</label>
          <input
            className="input"
            placeholder="e.g. Mugwort"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="field">
          <label>Category</label>
          <div className="chips chips-inline">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={'chip' + (category === c.id ? ' active' : '')}
                onClick={() => onCategoryChange(c.id)}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label>Quantity</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Unit</label>
            <select className="select" value={unit} onChange={(e) => setUnit(e.target.value)}>
              {DEFAULT_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Emoji</label>
          <div className="emoji-grid">
            {EMOJI_PALETTE.map((e) => (
              <button
                key={e}
                type="button"
                className={emoji === e ? 'active' : ''}
                onClick={() => setEmoji(e)}
                aria-label={`Choose ${e}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea
            className="textarea"
            placeholder="Where it came from, how you use it, anything to remember…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Remove from the shelf?"
        subtitle={initialItem ? `Take ${initialItem.name} out of your cupboard. This cannot be undone.` : ''}
        confirmLabel="Remove"
        danger
        onConfirm={() => {
          if (!initialItem) return;
          actions.deleteItem(initialItem.id);
          setConfirmDeleteOpen(false);
          onClose?.();
        }}
      />
    </>
  );
}
