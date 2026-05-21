import { useMemo } from 'react';
import {
  buildDecorations,
  chunkDecorRows,
  decorPlacement,
} from '../lib/cupboardDecor.js';
import DecorSprite from './DecorSprite.jsx';

export default function AestheticCupboard({ items, viewport = false }) {
  const shelves = useMemo(() => {
    const decorations = buildDecorations(items);
    return chunkDecorRows(decorations);
  }, [items]);

  const isEmpty = items.length === 0;

  return (
    <div
      className={'cupboard-stage' + (viewport ? ' cupboard-stage-viewport' : '')}
      aria-label="Illustrated witch cupboard"
    >
      <div className={'cupboard-frame cupboard-frame-aesthetic' + (viewport ? ' cupboard-frame-viewport' : '')}>
        {shelves.map((row, rowIndex) => (
          <div key={rowIndex} className="cupboard-shelf cupboard-shelf-aesthetic">
            <div className="shelf-board" aria-hidden />
            <div className="shelf-decor-layer">
              {row.length === 0 ? (
                rowIndex === 1 && isEmpty ? (
                  <p className="shelf-empty-hint">Empty shelves await your first curio…</p>
                ) : null
              ) : (
                row.map((decor, indexInRow) => {
                  const pos = decorPlacement(decor, indexInRow, row.length);
                  return (
                    <div
                      key={decor.id}
                      className="decor-sprite"
                      style={{
                        left: pos.left,
                        bottom: pos.bottom,
                        zIndex: pos.zIndex,
                        transform: `scale(${pos.scale}) rotate(${pos.rotate}deg)`,
                      }}
                      aria-hidden
                    >
                      <DecorSprite decor={decor} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
