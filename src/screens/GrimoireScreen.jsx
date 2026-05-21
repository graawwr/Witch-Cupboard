import { useMemo, useState } from 'react';
import { useStore } from '../store/hooks.js';
import EmptyState from '../components/EmptyState.jsx';
import { SearchIcon, BookIcon } from '../components/Glyphs.jsx';

export default function GrimoireScreen({ onOpenRecipe, onGoToCauldron }) {
  const { state } = useStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...state.recipes].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!q) return list;
    return list.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      (r.intention || '').toLowerCase().includes(q) ||
      (r.ingredients || []).some((i) => (i.name || '').toLowerCase().includes(q)),
    );
  }, [state.recipes, query]);

  return (
    <div>
      <h1 className="screen-title">The Grimoire</h1>
      <p className="screen-sub">
        {state.recipes.length} {state.recipes.length === 1 ? 'recipe' : 'recipes'} scribed.
      </p>

      {state.recipes.length > 0 && (
        <div className="toolbar">
          <div className="search">
            <label htmlFor="grimoire-search" className="sr-only">Search grimoire recipes</label>
            <span className="search-icon" aria-hidden><SearchIcon size={18} /></span>
            <input
              id="grimoire-search"
              className="input"
              placeholder="Search recipes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {state.recipes.length === 0 ? (
        <EmptyState
          glyphComponent={<BookIcon size={48} />}
          title="No recipes yet"
          action={
            onGoToCauldron ? (
              <button className="btn primary" onClick={onGoToCauldron}>
                Open the Cauldron
              </button>
            ) : null
          }
        >
          Bring ingredients into the Cauldron, then scribe them here.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState glyphComponent={<SearchIcon size={44} />} title="No matches">
          Try a different word.
        </EmptyState>
      ) : (
        <div className="recipe-grid">
          {filtered.map((r) => (
            <button
              key={r.id}
              className="recipe-tile"
              onClick={() => onOpenRecipe?.(r.id)}
            >
              <div className="sigil" aria-hidden>
                {r.ingredients?.[0]?.emoji || '·'}
              </div>
              <div className="body">
                <h3>{r.title}</h3>
                {r.intention ? <div className="desc">{r.intention}</div> : null}
              </div>
              <div className="count">
                {r.ingredients?.length || 0}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
