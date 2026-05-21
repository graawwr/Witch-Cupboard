import { useState } from 'react';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import ReferencePanel from './ReferencePanel.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import ItemIcon from './ItemIcon.jsx';
import { categoryMeta } from '../data/categories.js';
import { useActions } from '../store/hooks.js';
import { BasketIcon, BookIcon, PencilIcon, TrashIcon } from './Glyphs.jsx';

export default function ItemDetailSheet({ item, open, onClose, onEdit, onToast }) {
  const actions = useActions();
  const [addOpen, setAddOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addAmount, setAddAmount] = useState(1);

  if (!item) return null;

  const cat = categoryMeta(item.category);

  const handleAddToCauldron = () => {
    const amt = Number(addAmount) || 0;
    if (amt <= 0) { setAddOpen(false); return; }
    actions.addToCauldron(item.id, amt, item.unit);
    setAddOpen(false);
    onToast?.(`${amt}${item.unit ? ' ' + item.unit : ''} of ${item.name} into the cauldron`);
  };

  const requestDelete = () => {
    setRefOpen(false);
    setAddOpen(false);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    actions.deleteItem(item.id);
    setDeleteOpen(false);
    onClose?.();
    onToast?.(`${item.name} removed from the cupboard`);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={item.name}
        subtitle={`${cat.label}${item.unit ? ` · ${item.unit}` : ''}`}
      >
        <div className="item-detail-sheet">
          <div className="item-detail-hero">
            <ItemIcon item={item} size="lg" />
          </div>

          {item.notes ? <p className="item-detail-notes">{item.notes}</p> : null}

          <div className="item-detail-qty">
            <span className="item-detail-qty-label">On the shelf</span>
            <QuantityStepper
              value={item.quantity}
              onChange={(v) => actions.setQuantity(item.id, v)}
              onDecrement={() => actions.adjustQuantity(item.id, -1)}
              onIncrement={() => actions.adjustQuantity(item.id, 1)}
              unit={item.unit}
            />
          </div>

          <div className="item-detail-actions">
            <button type="button" className="detail-action" onClick={() => setRefOpen(true)}>
              <BookIcon size={20} />
              <span>Grimoire</span>
            </button>
            <button
              type="button"
              className="detail-action"
              onClick={() => { setAddAmount(1); setAddOpen(true); }}
            >
              <BasketIcon size={20} />
              <span>Cauldron</span>
            </button>
            <button type="button" className="detail-action" onClick={() => { onClose?.(); onEdit?.(item); }}>
              <PencilIcon size={18} />
              <span>Edit</span>
            </button>
            <button type="button" className="detail-action danger" onClick={requestDelete}>
              <TrashIcon size={18} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={`Drop ${item.name} into the cauldron`}
        subtitle={`On the shelf: ${item.quantity}${item.unit ? ' ' + item.unit : ''}`}
        elevated
        footer={
          <>
            <button className="btn ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn primary" onClick={handleAddToCauldron}>Drop in</button>
          </>
        }
      >
        <div className="field">
          <label>How much for the recipe?</label>
          <div className="centered-stepper-wrap">
            <QuantityStepper
              value={addAmount}
              onChange={setAddAmount}
              unit={item.unit}
            />
          </div>
        </div>
      </Modal>

      <ReferencePanel
        open={refOpen}
        onClose={() => setRefOpen(false)}
        item={item}
        onRemove={requestDelete}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove from the shelf?"
        subtitle={`Take ${item.name} out of your cupboard. This cannot be undone.`}
        confirmLabel="Remove"
        danger
        onConfirm={confirmDelete}
      />
    </>
  );
}
