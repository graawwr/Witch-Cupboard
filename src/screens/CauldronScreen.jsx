import { useMemo, useState } from 'react';
import { useActions, useStore } from '../store/hooks.js';
import { categoryMeta } from '../data/categories.js';
import { brewShortfalls, maxAffordableBrews, resolveBrewRows } from '../lib/brew.js';
import QuantityStepper from '../components/QuantityStepper.jsx';
import EmptyState from '../components/EmptyState.jsx';
import RecipeEditor from '../components/RecipeEditor.jsx';
import RestockModal from '../components/RestockModal.jsx';
import BrewConfirmDialog from '../components/BrewConfirmDialog.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { CloseIcon } from '../components/Glyphs.jsx';
import cupboardHero from '../assets/cupboard-hero.jpg';

export default function CauldronScreen({ onRecipeSaved, onGoToCupboard, onToast }) {
  const { state } = useStore();
  const actions = useActions();
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmBrewOpen, setConfirmBrewOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  const brewRows = useMemo(
    () => resolveBrewRows(state.cauldron, state.items),
    [state.cauldron, state.items],
  );

  const rows = useMemo(() => {
    return brewRows.map((r) => {
      const item = state.items.find((it) => it.id === r.itemId);
      const meta = item ? categoryMeta(item.category) : null;
      return {
        ...r,
        category: meta?.label || '—',
      };
    });
  }, [brewRows, state.items]);

  const shortfalls = useMemo(
    () => brewShortfalls(brewRows),
    [brewRows],
  );

  const maxBrewTimes = useMemo(
    () => maxAffordableBrews(brewRows),
    [brewRows],
  );

  const totalCount = rows.length;
  const canBrew = totalCount > 0 && shortfalls.length === 0 && maxBrewTimes >= 1;

  const handleBrew = (times) => {
    actions.brewCauldron(times);
    onToast?.(
      times === 1
        ? 'Brewed — drawn from the cupboard'
        : `Brewed ${times} times — drawn from the cupboard`,
    );
  };

  const handleRestock = (entries) => {
    actions.restockFromCauldron(entries);
    onToast?.('Restocked on the shelf');
  };

  return (
    <div>
      <div className="cauldron-hero">
        <span className="sigil" aria-hidden>
          <img src={cupboardHero} alt="" className="cauldron-hero-art" decoding="async" />
        </span>
        <div>
          <h2>The Cauldron</h2>
          <p>A quiet place to gather ingredients before scribing them into a recipe.</p>
        </div>
      </div>

      <div className="cauldron-actions">
        <button
          className="btn ghost"
          disabled={totalCount === 0}
          onClick={() => {
            if (totalCount === 0) return;
            setConfirmClearOpen(true);
          }}
        >
          Empty
        </button>
        <button
          className="btn gather-restock-btn"
          disabled={totalCount === 0}
          onClick={() => setRestockOpen(true)}
        >
          Gather/Restock
        </button>
        <button
          className="btn accent"
          disabled={!canBrew}
          onClick={() => setConfirmBrewOpen(true)}
        >
          Brew
        </button>
        <button
          className="btn primary"
          disabled={totalCount === 0}
          onClick={() => setEditorOpen(true)}
        >
          Scribe as recipe
        </button>
      </div>

      {totalCount > 0 && shortfalls.length > 0 ? (
        <p className="small-hint hint-block cauldron-shortfall" role="status">
          {shortfalls.some((s) => s.zeroAmount)
            ? 'Set an amount for each gathered ingredient before brewing.'
            : shortfalls.map((s) => (
              s.missing
                ? `${s.name} is no longer on the shelf.`
                : `Only ${s.stocked} of ${s.name} stocked — reduce the amount or restock first.`
            )).join(' ')}
        </p>
      ) : null}

      {totalCount === 0 ? (
        <EmptyState
          glyphComponent={<img src={cupboardHero} alt="" className="empty-illustration cauldron" loading="lazy" decoding="async" />}
          title="Nothing gathered yet"
          action={
            onGoToCupboard ? (
              <button className="btn" onClick={onGoToCupboard}>
                Open the Cupboard
              </button>
            ) : null
          }
        >
          From the Cupboard, tap the basket on any ingredient to bring it here.
        </EmptyState>
      ) : (
        <>
          <div className="section-label">
            Gathered · {totalCount} {totalCount === 1 ? 'ingredient' : 'ingredients'}
          </div>
          <div className="item-list">
            {rows.map((r) => (
              <div className="item-card" key={r.itemId}>
                <div className="emoji" aria-hidden>{r.emoji}</div>
                <div className="info">
                  <div className="name">{r.name}</div>
                  <div className="meta">
                    <span>{r.category}</span>
                    {r.unit ? <><span>·</span><span>{r.unit}</span></> : null}
                    {!r.missing ? (
                      <><span>·</span><span>{r.stocked}{r.unit ? `\u00A0${r.unit}` : ''} on shelf</span></>
                    ) : null}
                    {r.missing ? <span className="tag">no longer stocked</span> : null}
                  </div>
                </div>
                <div className="actions">
                  <QuantityStepper
                    value={r.amount}
                    onChange={(v) => actions.updateCauldronAmount(r.itemId, v)}
                    compact
                    unit={r.unit}
                  />
                  <button
                    className="icon-btn danger"
                    onClick={() => actions.removeFromCauldron(r.itemId)}
                    aria-label={`Remove ${r.name}`}
                    title="Remove"
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <RecipeEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initialIngredients={state.cauldron}
        onSaved={() => {
          actions.clearCauldron();
          onRecipeSaved?.();
        }}
      />

      <RestockModal
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
        onRestock={handleRestock}
        onToast={onToast}
      />

      <ConfirmDialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Empty the cauldron?"
        subtitle="This removes all gathered ingredients from the current brew."
        confirmLabel="Empty"
        danger
        onConfirm={() => {
          actions.clearCauldron();
          setConfirmClearOpen(false);
        }}
      />

      <BrewConfirmDialog
        open={confirmBrewOpen}
        onClose={() => setConfirmBrewOpen(false)}
        ingredients={state.cauldron}
        onConfirm={handleBrew}
      />
    </div>
  );
}
