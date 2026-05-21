import { useState } from 'react';
import Modal from './Modal.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import { useActions, useStore } from '../store/hooks.js';
import { categoryMeta } from '../data/categories.js';
import { CloseIcon } from './Glyphs.jsx';

function resolveIngredients(initialIngredients, items) {
  return (initialIngredients || []).map((ing) => {
    const item = items.find((it) => it.id === ing.itemId);
    const meta = item ? categoryMeta(item.category) : null;
    return {
      itemId: ing.itemId,
      name: item?.name || ing.name || 'Unknown',
      emoji: item?.emoji || ing.emoji || meta?.emoji || '•',
      amount: ing.amount,
      unit: ing.unit || item?.unit || '',
    };
  });
}

function RecipeEditorBody({ initialIngredients, recipe, onClose, onSaved }) {
  const { state } = useStore();
  const actions = useActions();
  const isEdit = Boolean(recipe);

  const [title, setTitle] = useState(recipe?.title || '');
  const [intention, setIntention] = useState(recipe?.intention || '');
  const [steps, setSteps] = useState(recipe?.steps || '');
  const [ingredients, setIngredients] = useState(() =>
    resolveIngredients(recipe?.ingredients || initialIngredients, state.items),
  );

  const canSave = title.trim().length > 0 && ingredients.length > 0;

  const updateAmount = (itemId, amount) =>
    setIngredients((list) => list.map((i) => (i.itemId === itemId ? { ...i, amount } : i)));

  const removeRow = (itemId) =>
    setIngredients((list) => list.filter((i) => i.itemId !== itemId));

  const handleSave = () => {
    if (!canSave) return;
    const payload = {
      title: title.trim(),
      intention: intention.trim(),
      steps: steps.trim(),
      ingredients,
    };
    if (isEdit) {
      actions.updateRecipe(recipe.id, payload);
    } else {
      actions.saveRecipe(payload);
    }
    onSaved?.();
    onClose?.();
  };

  return (
    <>
      <div className="field">
        <label>Name</label>
        <input
          className="input"
          placeholder="e.g. Dream sachet, Hearth salt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      <div className="field">
        <label>Use / Intention</label>
        <textarea
          className="textarea"
          placeholder="What this brew is for, when to reach for it…"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Ingredients</label>
        {ingredients.length === 0 ? (
          <div className="small-hint hint-block">
            Drop ingredients into the cauldron first.
          </div>
        ) : (
          ingredients.map((ing) => (
            <div className="ing-row" key={ing.itemId}>
              <span className="e" aria-hidden>{ing.emoji}</span>
              <span className="nm">
                {ing.name}
                <small>{ing.unit}</small>
              </span>
              <QuantityStepper
                value={ing.amount}
                onChange={(v) => updateAmount(ing.itemId, v)}
                compact
              />
              <button
                className="icon-btn danger"
                onClick={() => removeRow(ing.itemId)}
                aria-label={`Remove ${ing.name}`}
                title="Remove"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="field">
        <label>Preparation</label>
        <textarea
          className="textarea"
          placeholder="How to prepare, how to use, any notes for next time…"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
      </div>

      <div className="modal-footer">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn primary" disabled={!canSave} onClick={handleSave}>
          {isEdit ? 'Save changes' : 'Scribe to Grimoire'}
        </button>
      </div>
    </>
  );
}

export default function RecipeEditor({ open, onClose, initialIngredients, recipe, onSaved }) {
  const isEdit = Boolean(recipe);
  return (
    <Modal
      open={open}
      onClose={onClose}
      elevated
      title={isEdit ? 'Edit recipe' : 'Scribe a new recipe'}
      subtitle={
        isEdit
          ? 'Adjust the name, intention, ingredients, or preparation.'
          : 'Name it, note your intention, and commit it to the Grimoire.'
      }
    >
      {open ? (
        <RecipeEditorBody
          key={recipe?.id || 'new'}
          initialIngredients={initialIngredients}
          recipe={recipe}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : null}
    </Modal>
  );
}
