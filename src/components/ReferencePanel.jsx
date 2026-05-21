import { useMemo } from 'react';
import Modal from './Modal.jsx';
import { categoryMeta } from '../data/categories.js';
import { matchByName, HERBARIUM_DISCLAIMER } from '../lib/herbarium.js';
import ReferenceSection from './ReferenceSection.jsx';

const TAG_LABELS = {
  officinal: 'Of the apothecary',
  monastic: 'Monastic herbal',
};

function ReferenceBody({ entry: enriched }) {
  const cat = categoryMeta(enriched.category);
  const badges = (enriched.tags || [])
    .filter((t) => TAG_LABELS[t])
    .map((t) => ({ id: t, label: TAG_LABELS[t] }));

  return (
    <div className="reference-panel-body">
      <div className="reference-header">
        <span className="reference-emoji" aria-hidden>{enriched.emoji || cat.emoji}</span>
        <div className="reference-header-text">
          {enriched.latinName ? (
            <p className="reference-latin">{enriched.latinName}</p>
          ) : null}
          <p className="reference-category">{cat.label}</p>
        </div>
      </div>

      {badges.length > 0 ? (
        <div className="reference-tags">
          {badges.map((b) => (
            <span key={b.id} className="reference-tag">{b.label}</span>
          ))}
        </div>
      ) : null}

      {enriched.monasticSources?.length > 0 ? (
        <p className="reference-source">
          Recorded in {enriched.monasticSources.join(', ')}
        </p>
      ) : null}

      <ReferenceSection label="Folk tradition" items={enriched.folkTradition} />
      <ReferenceSection label="Parts commonly used" items={enriched.partsUsed} />
      <ReferenceSection label="Worth heeding" items={enriched.cautions} variant="caution" />

      {enriched.officinalNote ? (
        <p className="reference-aside">{enriched.officinalNote}</p>
      ) : null}

      <p className="reference-disclaimer">{HERBARIUM_DISCLAIMER}</p>
    </div>
  );
}

/**
 * Grimoire reference sheet for a cupboard item or catalog entry.
 * @param {{ open: boolean, onClose: () => void, item?: object, entry?: object }} props
 */
export default function ReferencePanel({ open, onClose, item, entry: entryProp, onRemove }) {
  const entry = useMemo(() => {
    if (entryProp) return entryProp;
    if (item?.name) return matchByName(item.name);
    return null;
  }, [entryProp, item]);

  const title = entry?.commonNames?.[0] || item?.name || 'Grimoire note';
  const subtitle = entry
    ? 'Gathered from old herbals and folk practice.'
    : 'No matching leaf in the grimoire yet.';

  return (
    <Modal
      open={open}
      onClose={onClose}
      elevated
      title={title}
      subtitle={subtitle}
      footer={
        <>
          {onRemove ? (
            <button type="button" className="btn danger" onClick={onRemove}>
              Remove from shelf
            </button>
          ) : null}
          <button type="button" className="btn primary" onClick={onClose}>
            Close
          </button>
        </>
      }
    >
      {entry ? (
        <ReferenceBody entry={entry} />
      ) : (
        <div className="reference-empty">
          <p>
            There is no reference entry for <strong>{item?.name}</strong> yet.
            Your personal notes on the shelf still hold what matters.
          </p>
        </div>
      )}
    </Modal>
  );
}
