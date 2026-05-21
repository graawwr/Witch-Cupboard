import { useMemo, useState } from 'react';
import { useActions, useStore } from '../store/hooks.js';
import { categoryMeta } from '../data/categories.js';
import QuantityStepper from '../components/QuantityStepper.jsx';
import EmptyState from '../components/EmptyState.jsx';
import RecipeEditor from '../components/RecipeEditor.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { CloseIcon } from '../components/Glyphs.jsx';
import cupboardHero from '../assets/cupboard-hero.jpg';

export default function CauldronScreen({ onRecipeSaved, onGoToCupboard }) {
  const { state } = useStore();
  const actions = useActions();
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const rows = useMemo(() => {
    return state.cauldron.map((c) => {
      const item = state.items.find((it) => it.id === c.itemId);
      const meta = item ? categoryMeta(item.category) : null;
      return {
        itemId: c.itemId,
        amount: c.amount,
        unit: c.unit || item?.unit || '',
        name: item?.name || '(no longer stocked)',
        emoji: item?.emoji || meta?.emoji || '·',
        category: meta?.label || '—',
        missing: !item,
      };
    });
  }, [state.cauldron, state.items]);

  const totalCount = rows.length;

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
          className="btn primary"
          disabled={totalCount === 0}
          onClick={() => setEditorOpen(true)}
        >
          Scribe as recipe
        </button>
      </div>

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
    </div>
  );
}
