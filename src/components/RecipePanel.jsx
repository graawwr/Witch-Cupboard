import { useMemo, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import BrewConfirmDialog from './BrewConfirmDialog.jsx';
import ItemForm from './ItemForm.jsx';
import RecipeEditor from './RecipeEditor.jsx';
import RecipeCard from './RecipeCard.jsx';
import ReferenceSection from './ReferenceSection.jsx';
import { textToLines } from '../lib/textLines.js';
import { maxAffordableBrews, resolveBrewRows } from '../lib/brew.js';
import { useActions, useStore } from '../store/hooks.js';
import { exportNodeAsPng } from '../lib/exportImage.js';

function slugify(str) {
  return (str || 'recipe')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'recipe';
}

function formatGathered(ingredients) {
  return (ingredients || []).map((ing) => {
    const amt = Number(ing.amount) || 0;
    const unit = ing.unit ? `\u00A0${ing.unit}` : '';
    return `${ing.emoji || '·'} ${ing.name} — ${amt}${unit}`;
  });
}

function RecipeBody({ recipe }) {
  const date = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  const gathered = formatGathered(recipe.ingredients);
  const intentionLines = textToLines(recipe.intention);
  const preparationLines = textToLines(recipe.steps);
  const leadEmoji = recipe.ingredients?.[0]?.emoji || '📜';

  return (
    <div className="reference-panel-body">
      <div className="reference-header">
        <span className="reference-emoji" aria-hidden>{leadEmoji}</span>
        <div className="reference-header-text">
          {date ? <p className="reference-latin">Scribed · {date}</p> : null}
          <p className="reference-category">
            {gathered.length} {gathered.length === 1 ? 'ingredient' : 'ingredients'} gathered
          </p>
        </div>
      </div>

      <ReferenceSection label="Gathered" items={gathered} />
      <ReferenceSection label="Use / Intention" items={intentionLines} />
      <ReferenceSection label="Preparation" items={preparationLines} />
    </div>
  );
}

export default function RecipePanel({ open, recipeId, onClose, onToast }) {
  const { state } = useStore();
  const actions = useActions();
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [brewOpen, setBrewOpen] = useState(false);

  const recipe = useMemo(
    () => state.recipes.find((r) => r.id === recipeId) ?? null,
    [state.recipes, recipeId],
  );

  const canBrew = useMemo(() => {
    if (!recipe?.ingredients?.length) return false;
    const rows = resolveBrewRows(recipe.ingredients, state.items);
    if (rows.some((r) => (Number(r.amount) || 0) <= 0)) return false;
    return maxAffordableBrews(rows) >= 1;
  }, [recipe, state.items]);

  const stockDraft = useMemo(() => {
    if (!recipe) return null;
    const notes = [
      'Brewed from a grimoire recipe.',
      recipe.intention?.trim(),
      recipe.steps?.trim(),
    ].filter(Boolean).join('\n\n');
    return {
      name: recipe.title,
      category: 'water',
      quantity: 1,
      unit: 'jar',
      emoji: recipe.ingredients?.[0]?.emoji || '🧴',
      notes,
    };
  }, [recipe]);

  if (!open || !recipe) return null;

  const handleExport = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      setErrorMsg('');
      await exportNodeAsPng(cardRef.current, `${slugify(recipe.title)}.png`);
      onToast?.('Recipe saved as image');
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not export image: ' + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const handleBrew = (times) => {
    actions.brewRecipe(recipe.id, times);
    onToast?.(
      times === 1
        ? 'Brewed — drawn from the cupboard'
        : `Brewed ${times} times — drawn from the cupboard`,
    );
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        elevated
        modalClass="modal--recipe"
        backdropClass="modal-backdrop--recipe"
        title={recipe.title}
        subtitle="A recipe scribed in your grimoire."
        footer={
          <div className="recipe-panel-footer">
            <button
              type="button"
              className="btn accent"
              disabled={!canBrew}
              onClick={() => setBrewOpen(true)}
            >
              Brew
            </button>
            <button type="button" className="btn" onClick={() => setStockOpen(true)}>
              Stock to cupboard
            </button>
            <button type="button" className="btn primary" onClick={handleExport} disabled={busy}>
              {busy ? 'Preparing…' : 'Save as image'}
            </button>
            <button type="button" className="btn ghost" onClick={() => setEditOpen(true)}>
              Edit recipe
            </button>
            <button type="button" className="btn danger" onClick={() => setConfirmDeleteOpen(true)}>
              Remove
            </button>
          </div>
        }
      >
        <div className="recipe-modal-content">
          <RecipeBody recipe={recipe} />
          {errorMsg ? (
            <p className="small-hint" role="status" aria-live="polite">{errorMsg}</p>
          ) : null}
        </div>
      </Modal>

      <div className="recipe-export-host" aria-hidden>
        <RecipeCard ref={cardRef} recipe={recipe} />
      </div>

      <BrewConfirmDialog
        open={brewOpen}
        onClose={() => setBrewOpen(false)}
        ingredients={recipe.ingredients}
        title={`Brew ${recipe.title}?`}
        subtitle="The recipe amounts will be drawn from your cupboard stock."
        onConfirm={handleBrew}
      />

      <ItemForm
        open={stockOpen}
        onClose={() => setStockOpen(false)}
        initialItem={stockDraft}
        key={stockOpen ? `stock-${recipe.id}` : 'stock-closed'}
        title="Stock to cupboard"
        subtitle="Save this finished brew — salve, tincture, or jar — as a new curio on the shelf."
        onSaved={(name) => {
          setStockOpen(false);
          onToast?.(`${name} stocked on the shelf`);
        }}
      />

      <RecipeEditor
        key={recipe.id}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        recipe={recipe}
        onSaved={() => {
          setEditOpen(false);
          onToast?.('Recipe updated');
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Remove recipe?"
        subtitle={`Remove "${recipe.title}" from the Grimoire.`}
        confirmLabel="Remove"
        danger
        onConfirm={() => {
          actions.deleteRecipe(recipe.id);
          setConfirmDeleteOpen(false);
          onClose?.();
        }}
      />
    </>
  );
}
