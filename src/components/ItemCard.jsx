import { useState } from 'react';
import QuantityStepper from './QuantityStepper.jsx';
import ItemIcon from './ItemIcon.jsx';
import { categoryMeta } from '../data/categories.js';
import { useActions } from '../store/hooks.js';
import ConfirmDialog from './ConfirmDialog.jsx';
import ReferencePanel from './ReferencePanel.jsx';
import { BasketIcon, BookIcon, PencilIcon, TrashIcon } from './Glyphs.jsx';

export default function ItemCard({ item, selected = false, onSelect, onEdit, onToast }) {
  const actions = useActions();
  const cat = categoryMeta(item.category);
  const [refOpen, setRefOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const requestDelete = () => {
    setRefOpen(false);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    actions.deleteItem(item.id);
    setDeleteOpen(false);
    onToast?.(`${item.name} removed from the cupboard`);
  };

  const handleMainClick = () => {
    onSelect?.(item.id);
  };

  const handleQuickAddToCauldron = (e) => {
    e.stopPropagation();
    actions.addToCauldron(item.id, 1, item.unit);
    onToast?.(`1${item.unit ? ` ${item.unit}` : ''} of ${item.name} into the cauldron`);
  };

  const depleted = (Number(item.quantity) || 0) <= 0;

  return (
    <>
      <div
        className={
          'item-card item-card-ledger'
          + (selected ? ' item-card-ledger--selected' : '')
          + (depleted ? ' item-card-ledger--depleted' : '')
        }
      >
        <div className="item-card-row">
          <button
            type="button"
            className="item-card-main"
            onClick={handleMainClick}
            aria-expanded={selected}
          >
            <div className="item-card-icon" aria-hidden>
              <ItemIcon item={item} size="sm" />
            </div>
            <div className="info">
              <span className="name">{item.name}</span>
              <div className="meta">
                <span>{cat.label}</span>
                {item.unit ? <span>·</span> : null}
                {item.unit ? <span>{item.unit}</span> : null}
                {item.quantity != null ? (
                  <>
                    <span>·</span>
                    <span className="stock-amt">
                      {item.quantity}{item.unit ? `\u00A0${item.unit}` : ''} stocked
                    </span>
                  </>
                ) : null}
              </div>
              {item.notes ? <div className="notes">{item.notes}</div> : null}
            </div>
          </button>

          <button
            type="button"
            className="icon-btn icon-btn-cauldron"
            onClick={handleQuickAddToCauldron}
            title="Drop 1 into the cauldron"
            aria-label={`Drop 1${item.unit ? ` ${item.unit}` : ''} of ${item.name} into the cauldron`}
          >
            <BasketIcon size={22} />
          </button>
        </div>

        {selected ? (
          <div className="item-card-actions">
            <QuantityStepper
              value={item.quantity}
              onChange={(v) => actions.setQuantity(item.id, v)}
              onDecrement={() => actions.adjustQuantity(item.id, -1)}
              onIncrement={() => actions.adjustQuantity(item.id, 1)}
              compact
              unit={item.unit}
            />
            <div className="inline-actions-tight">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setRefOpen(true)}
                title="Open grimoire note"
                aria-label="Open grimoire note"
              >
                <BookIcon size={17} />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onEdit?.(item)}
                title="Edit ingredient"
                aria-label="Edit ingredient"
              >
                <PencilIcon size={16} />
              </button>
              <button
                type="button"
                className="icon-btn danger"
                onClick={requestDelete}
                title="Remove from the cupboard"
                aria-label="Remove from the cupboard"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

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
