import { useEffect, useMemo, useRef, useState } from 'react';

import { useStore } from '../store/hooks.js';

import { ELEMENT_ORDER, ORDERED_CATEGORIES, categoryMeta } from '../data/categories.js';

import ItemCard from '../components/ItemCard.jsx';

import ItemForm from '../components/ItemForm.jsx';

import AestheticCupboard from '../components/AestheticCupboard.jsx';

import EmptyState from '../components/EmptyState.jsx';

import { SearchIcon, PlusIcon, CloseIcon, HeaderMark, ChevronDown } from '../components/Glyphs.jsx';

const SORTS = [
  { id: 'name-asc',    label: 'A → Z' },
  { id: 'name-desc',   label: 'Z → A' },
  { id: 'qty-desc',    label: 'Most stocked' },
  { id: 'qty-asc',     label: 'Least stocked' },
  { id: 'updated',     label: 'Recently touched' },
  { id: 'created',     label: 'Recently added' },
];

function compareItems(a, b, sort) {
  switch (sort) {
    case 'name-asc':  return a.name.localeCompare(b.name);
    case 'name-desc': return b.name.localeCompare(a.name);
    case 'qty-desc':  return (b.quantity || 0) - (a.quantity || 0);
    case 'qty-asc':   return (a.quantity || 0) - (b.quantity || 0);
    case 'created':   return (b.createdAt || 0) - (a.createdAt || 0);
    default:          return (b.updatedAt || 0) - (a.updatedAt || 0);
  }
}

function groupByElement(items, sort) {
  const sorted = [...items].sort((a, b) => compareItems(a, b, sort));
  const known = new Set(ELEMENT_ORDER);

  const groups = ELEMENT_ORDER.map((id) => ({
    id,
    meta: categoryMeta(id),
    items: sorted.filter((it) => it.category === id),
  })).filter((g) => g.items.length > 0);

  const unknown = sorted.filter((it) => !known.has(it.category));
  if (unknown.length > 0) {
    groups.push({
      id: 'other',
      meta: { id: 'other', label: 'Other', emoji: '•' },
      items: unknown,
    });
  }

  return groups;
}

function ElementItemGroups({
  groups,
  collapsedElements,
  onToggleElement,
  isSearching,
  selectedItemId,
  onSelect,
  onEdit,
  onToast,
}) {
  if (groups.length === 0) return null;

  return groups.map((group) => {
    const expanded = isSearching || !collapsedElements.has(group.id);

    return (
      <section key={group.id} className="inventory-element-group">
        <button
          type="button"
          className={'inventory-section-toggle inventory-element-toggle' + (expanded ? ' is-open' : '')}
          onClick={() => onToggleElement(group.id)}
          aria-expanded={expanded}
        >
          <ChevronDown size={16} className="inventory-section-chevron" aria-hidden />
          <span className="inventory-element-emoji" aria-hidden>{group.meta.emoji}</span>
          <span className="inventory-section-toggle-label">{group.meta.label}</span>
          <span className="inventory-section-count">
            {group.items.length} {group.items.length === 1 ? 'curio' : 'curios'}
          </span>
        </button>
        {expanded ? (
          <div className="item-list cupboard-inventory-list">
            {group.items.map((it) => (
              <ItemCard
                key={it.id}
                item={it}
                selected={selectedItemId === it.id}
                onSelect={onSelect}
                onEdit={onEdit}
                onToast={onToast}
              />
            ))}
          </div>
        ) : null}
      </section>
    );
  });
}

export default function CupboardScreen({ onToast }) {
  const { state } = useStore();

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [sort, setSort] = useState('updated');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [depletedExpanded, setDepletedExpanded] = useState(false);
  const [collapsedElements, setCollapsedElements] = useState(() => new Set());
  const searchRef = useRef(null);

  const showForm = formOpen;
  const isSearching = query.trim().length > 0;

  const { inStock, depleted, inStockGroups, depletedGroups } = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = state.items.filter((it) => {
      if (categoryId !== 'all' && it.category !== categoryId) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        (it.notes || '').toLowerCase().includes(q)
      );
    });

    const stocked = list.filter((it) => (Number(it.quantity) || 0) > 0);
    const empty = list.filter((it) => (Number(it.quantity) || 0) <= 0);

    return {
      inStock: stocked,
      depleted: empty,
      inStockGroups: groupByElement(stocked, sort),
      depletedGroups: groupByElement(empty, sort),
    };
  }, [state.items, query, categoryId, sort]);

  const showDepleted = !isSearching && depletedExpanded && depleted.length > 0;
  const hasDepletedSection = depleted.length > 0 && !isSearching;
  const totalFiltered = inStock.length + (isSearching ? 0 : depleted.length);
  const showInStockDivider = inStock.length > 0 && hasDepletedSection;

  useEffect(() => {
    if (!inventoryOpen) return undefined;
    const t = window.setTimeout(() => searchRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [inventoryOpen]);

  useEffect(() => {
    if (!selectedItemId) return;
    const item = state.items.find((it) => it.id === selectedItemId);
    if (!item) return;

    const isDepleted = (Number(item.quantity) || 0) <= 0;
    if (isDepleted && (isSearching || !depletedExpanded)) {
      setSelectedItemId(null);
      return;
    }

    const groupId = ELEMENT_ORDER.includes(item.category) ? item.category : 'other';
    if (!isSearching && collapsedElements.has(groupId)) {
      setSelectedItemId(null);
    }
  }, [isSearching, depletedExpanded, collapsedElements, selectedItemId, state.items]);

  const toggleElement = (id) => {
    setCollapsedElements((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const group = [...inStockGroups, ...depletedGroups].find((g) => g.id === id);
        if (group?.items.some((it) => it.id === selectedItemId)) {
          setSelectedItemId(null);
        }
      }
      return next;
    });
  };

  const toggleDepleted = () => {
    setDepletedExpanded((open) => {
      if (open) setSelectedItemId(null);
      return !open;
    });
  };

  const openEdit = (item) => {
    setSelectedItemId(null);
    setEditing(item);
    setFormOpen(true);
  };

  const openCreate = () => {
    setSelectedItemId(null);
    setEditing(null);
    setFormOpen(true);
  };

  const toggleInventory = () => {
    setInventoryOpen((open) => {
      if (open) {
        setQuery('');
        setCategoryId('all');
        setSelectedItemId(null);
      }
      return !open;
    });
  };

  const handleSelectItem = (id) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleItemSaved = (name) => {
    onToast?.(`${name} stocked on the shelf`);
  };

  const itemCount = state.items.length;

  return (
    <div className="cupboard-experience">
      <header className="cupboard-banner">
        <div className="cupboard-banner-title">
          <HeaderMark className="mark" size={16} />
          <span>Witch Cupboard</span>
        </div>

        <button
          type="button"
          className={'cupboard-inventory-trigger' + (inventoryOpen ? ' is-open' : '')}
          onClick={toggleInventory}
          aria-expanded={inventoryOpen}
          aria-controls="cupboard-inventory-panel"
        >
          <span className="cupboard-inventory-trigger-text">
            <span className="cupboard-inventory-trigger-label">Upon the shelf</span>
            <span className="cupboard-inventory-trigger-count">
              {itemCount} {itemCount === 1 ? 'curio' : 'curios'}
            </span>
          </span>
          <ChevronDown size={18} className="cupboard-inventory-chevron" aria-hidden />
        </button>

        {inventoryOpen ? (
          <div id="cupboard-inventory-panel" className="cupboard-inventory-dropdown">
            <div className="search cupboard-inventory-search">
              <label htmlFor="cupboard-search" className="sr-only">Search cupboard ingredients</label>
              <span className="search-icon" aria-hidden><SearchIcon size={18} /></span>
              <input
                ref={searchRef}
                id="cupboard-search"
                className="input"
                placeholder="Search wood, fire, earth, metal, water…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

            <div className="cupboard-inventory-scroll">
              <div className="chips chips-inline">
                <button
                  type="button"
                  className={'chip' + (categoryId === 'all' ? ' active' : '')}
                  onClick={() => setCategoryId('all')}
                >
                  <span>All</span>
                </button>
                {ORDERED_CATEGORIES.map((c) => (
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

              <div className="cupboard-inventory-toolbar">
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

              {totalFiltered === 0 && !hasDepletedSection ? (
                itemCount === 0 ? (
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
                <>
                  {showInStockDivider ? (
                    <div className="inventory-section-label">In stock</div>
                  ) : null}

                  {inStock.length > 0 ? (
                    <ElementItemGroups
                      groups={inStockGroups}
                      collapsedElements={collapsedElements}
                      onToggleElement={toggleElement}
                      isSearching={isSearching}
                      selectedItemId={selectedItemId}
                      onSelect={handleSelectItem}
                      onEdit={openEdit}
                      onToast={onToast}
                    />
                  ) : null}

                  {depleted.length > 0 && !isSearching ? (
                    <div className="inventory-section inventory-section--depleted">
                      <button
                        type="button"
                        className={'inventory-section-toggle' + (depletedExpanded ? ' is-open' : '')}
                        onClick={toggleDepleted}
                        aria-expanded={depletedExpanded}
                      >
                        <ChevronDown size={16} className="inventory-section-chevron" aria-hidden />
                        <span className="inventory-section-toggle-label">Out of stock</span>
                        <span className="inventory-section-count">
                          {depleted.length} {depleted.length === 1 ? 'curio' : 'curios'}
                        </span>
                      </button>
                      {showDepleted ? (
                        <ElementItemGroups
                          groups={depletedGroups}
                          collapsedElements={collapsedElements}
                          onToggleElement={toggleElement}
                          isSearching={isSearching}
                          selectedItemId={selectedItemId}
                          onSelect={handleSelectItem}
                          onEdit={openEdit}
                          onToast={onToast}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <div className="cupboard-art-viewport">
        <AestheticCupboard items={state.items} viewport />
      </div>

      {!inventoryOpen && !showForm ? (
        <button
          type="button"
          className="cupboard-stock-btn btn primary"
          onClick={openCreate}
        >
          <PlusIcon size={18} />
          <span>{itemCount === 0 ? 'Stock the first curio' : 'Stock a curio'}</span>
        </button>
      ) : null}

      {showForm ? (
        <ItemForm
          key={editing?.id ?? 'new'}
          open={showForm}
          onClose={handleFormClose}
          onSaved={handleItemSaved}
          initialItem={editing}
        />
      ) : null}
    </div>
  );
}
