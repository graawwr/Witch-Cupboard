import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useStore } from '../store/hooks.js';

import { CATEGORIES } from '../data/categories.js';

import ItemCard from '../components/ItemCard.jsx';

import ItemForm from '../components/ItemForm.jsx';

import AestheticCupboard from '../components/AestheticCupboard.jsx';

import EmptyState from '../components/EmptyState.jsx';

import { SearchIcon, PlusIcon, CloseIcon, HeaderMark } from '../components/Glyphs.jsx';

const SORTS = [
  { id: 'name-asc',    label: 'A → Z' },
  { id: 'name-desc',   label: 'Z → A' },
  { id: 'qty-desc',    label: 'Most stocked' },
  { id: 'qty-asc',     label: 'Least stocked' },
  { id: 'updated',     label: 'Recently touched' },
  { id: 'created',     label: 'Recently added' },
  { id: 'category',    label: 'By element' },
];

export default function CupboardScreen({ onToast }) {
  const { state } = useStore();

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [sort, setSort] = useState('updated');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [bannerH, setBannerH] = useState(112);
  const bannerRef = useRef(null);
  const searchRef = useRef(null);

  useLayoutEffect(() => {
    const el = bannerRef.current;
    if (!el) return undefined;
    const update = () => setBannerH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const showLedger = searchActive || Boolean(query.trim());
  const showForm = formOpen;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = state.items.filter((it) => {
      if (categoryId !== 'all' && it.category !== categoryId) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        (it.notes || '').toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name-asc':  return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'qty-desc':  return (b.quantity || 0) - (a.quantity || 0);
        case 'qty-asc':   return (a.quantity || 0) - (b.quantity || 0);
        case 'created':   return (b.createdAt || 0) - (a.createdAt || 0);
        case 'category':  return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        default:          return (b.updatedAt || 0) - (a.updatedAt || 0);
      }
    });

    return list;
  }, [state.items, query, categoryId, sort]);

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const closeLedger = () => {
    setQuery('');
    setCategoryId('all');
    setSearchActive(false);
    setFormOpen(false);
    setEditing(null);
    searchRef.current?.blur();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleItemSaved = (name) => {
    onToast?.(`${name} stocked on the shelf`);
  };

  const handleSearchFocus = () => {
    setSearchActive(true);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setSearchActive(true);
  };

  return (
    <div className="cupboard-experience">
      <header className="cupboard-banner" ref={bannerRef}>
        <div className="cupboard-banner-title">
          <HeaderMark className="mark" size={16} />
          <span>Witch Cupboard</span>
        </div>
        <div className="search cupboard-banner-search">
          <label htmlFor="cupboard-search" className="sr-only">Search cupboard ingredients</label>
          <span className="search-icon" aria-hidden><SearchIcon size={18} /></span>
          <input
            ref={searchRef}
            id="cupboard-search"
            className="input"
            placeholder="Search wood, fire, earth, metal, water…"
            value={query}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          {query ? (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          ) : null}
        </div>
      </header>

      <div className="cupboard-art-viewport" aria-hidden={showLedger}>
        <AestheticCupboard items={state.items} viewport />
      </div>

      {!showLedger && !showForm ? (
        <button
          type="button"
          className="cupboard-stock-btn btn primary"
          onClick={openCreate}
        >
          <PlusIcon size={18} />
          <span>{state.items.length === 0 ? 'Stock the first curio' : 'Stock a curio'}</span>
        </button>
      ) : null}

      {showLedger ? (
        <div
          className="cupboard-ledger"
          role="dialog"
          aria-label="Inventory ledger"
          style={{ '--ledger-top': `${bannerH}px` }}
        >
          <button
            type="button"
            className="cupboard-ledger-scrim"
            onClick={closeLedger}
            aria-label="Return to cupboard"
          />
          <div className="cupboard-ledger-panel">
            <div className="cupboard-ledger-head">
              <div>
                <h2 className="cupboard-ledger-title">Upon the shelf</h2>
                <p className="cupboard-ledger-sub">
                  {state.items.length} {state.items.length === 1 ? 'curio' : 'curios'} kept
                </p>
              </div>
              <button
                type="button"
                className="btn ghost cupboard-ledger-close"
                onClick={closeLedger}
              >
                <CloseIcon size={18} />
                <span>Close</span>
              </button>
            </div>

            <div className="chips chips-inline">
              <button
                type="button"
                className={'chip' + (categoryId === 'all' ? ' active' : '')}
                onClick={() => setCategoryId('all')}
              >
                <span>All</span>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={'chip' + (categoryId === c.id ? ' active' : '')}
                  onClick={() => setCategoryId(c.id)}
                >
                  <span>{c.emoji}</span><span>{c.label}</span>
                </button>
              ))}
            </div>

            <div className="cupboard-ledger-toolbar">
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <button type="button" className="btn primary" onClick={openCreate}>
                <PlusIcon size={16} />
                <span>Stock a curio</span>
              </button>
            </div>

            {filtered.length === 0 ? (
              state.items.length === 0 ? (
                <EmptyState title="An empty shelf">
                  Add herbs, stones, candles, oils, and the tools you keep on hand.
                </EmptyState>
              ) : (
                <EmptyState
                  glyphComponent={<SearchIcon size={44} />}
                  title="Nothing matches"
                >
                  Try a different word or clear the filter.
                </EmptyState>
              )
            ) : (
              <div className="item-list cupboard-ledger-list">
                {filtered.map((it) => (
                  <ItemCard key={it.id} item={it} onEdit={openEdit} onToast={onToast} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <ItemForm
        open={showForm}
        onClose={handleFormClose}
        onSaved={handleItemSaved}
        initialItem={editing}
      />
    </div>
  );
}
