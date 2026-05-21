import { useState } from 'react';

import QuantityStepper from './QuantityStepper.jsx';
import ItemIcon from './ItemIcon.jsx';
import { categoryMeta } from '../data/categories.js';

import { useActions } from '../store/hooks.js';

import Modal from './Modal.jsx';

import ConfirmDialog from './ConfirmDialog.jsx';

import ReferencePanel from './ReferencePanel.jsx';

import { BasketIcon, BookIcon, PencilIcon, TrashIcon } from './Glyphs.jsx';



export default function ItemCard({ item, onEdit, onToast }) {

  const actions = useActions();

  const cat = categoryMeta(item.category);

  const [addOpen, setAddOpen] = useState(false);

  const [refOpen, setRefOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [addAmount, setAddAmount] = useState(1);



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

    onToast?.(`${item.name} removed from the cupboard`);

  };



  return (

    <>

      <div className="item-card">

        <div className="item-card-icon" aria-hidden>
          <ItemIcon item={item} size="sm" />
        </div>

        <div className="info">

          <button

            type="button"

            className="item-name-btn"

            onClick={() => setRefOpen(true)}

          >

            <span className="name">{item.name}</span>

          </button>

          <div className="meta">

            <span>{cat.label}</span>

            {item.unit ? <span>·</span> : null}

            {item.unit ? <span>{item.unit}</span> : null}

          </div>

          {item.notes ? <div className="notes">{item.notes}</div> : null}

        </div>

        <div className="actions">

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

              className="icon-btn"

              onClick={() => setRefOpen(true)}

              title="Open grimoire note"

              aria-label="Open grimoire note"

            >

              <BookIcon size={17} />

            </button>

            <button

              className="icon-btn"

              onClick={() => { setAddAmount(1); setAddOpen(true); }}

              title="Drop into the cauldron"

              aria-label="Drop into the cauldron"

            >

              <BasketIcon size={18} />

            </button>

            <button

              className="icon-btn"

              onClick={() => onEdit?.(item)}

              title="Edit ingredient"

              aria-label="Edit ingredient"

            >

              <PencilIcon size={16} />

            </button>

            <button

              className="icon-btn danger"

              onClick={requestDelete}

              title="Remove from the cupboard"

              aria-label="Remove from the cupboard"

            >

              <TrashIcon size={16} />

            </button>

          </div>

        </div>

      </div>



      <Modal

        open={addOpen}

        onClose={() => setAddOpen(false)}

        title={`Drop ${item.name} into the cauldron`}

        subtitle={`On the shelf: ${item.quantity}${item.unit ? ' ' + item.unit : ''}`}

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

              step={item.unit === 'g' || item.unit === 'ml' ? 1 : 1}

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


