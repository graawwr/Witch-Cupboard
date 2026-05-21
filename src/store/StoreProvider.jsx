import { useEffect, useMemo, useReducer, useState } from 'react';
import { Actions } from './actions.js';
import { StoreCtx } from './context.js';
import { uid } from '../lib/id.js';
import { categoryMeta, migrateStoredItems } from '../data/categories.js';

const STORAGE_KEY = 'witch-cupboard:v1';

const initialState = {
  items: [],
  cauldron: [],
  recipes: [],
};

function now() {
  return Date.now();
}

function seedItems() {
  const t = now();
  const mk = (name, categoryId, quantity, notes, iconKey) => {
    const c = categoryMeta(categoryId);
    return {
      id: uid(),
      name,
      category: categoryId,
      quantity,
      unit: c.unit,
      emoji: c.emoji,
      iconKey: iconKey || '',
      notes: notes || '',
      createdAt: t,
      updatedAt: t,
    };
  };
  return [
    mk('Lavender', 'wood', 24, 'Calming, sleep, dreams', 'lavender'),
    mk('Rosemary', 'wood', 18, 'Protection, memory', 'rosemary'),
    mk('Sage', 'wood', 12, 'Cleansing', 'sage'),
    mk('White Candle', 'fire', 6, 'All-purpose', 'white-candle'),
    mk('Black Candle', 'fire', 3, 'Banishing, protection', 'black-candle'),
    mk('Amethyst', 'earth', 2, 'Intuition, calm', 'amethyst'),
    mk('Rose Quartz', 'earth', 1, 'Love, compassion', 'rose-quartz'),
    mk('Sea Salt', 'earth', 300, 'Cleansing, circles', 'sea-salt'),
    mk('Frankincense', 'fire', 15, 'Elevation, blessings', 'frankincense'),
    mk('Small Glass Jar', 'metal', 4, '', 'small-glass-jar'),
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case Actions.HYDRATE:
      return { ...initialState, ...action.payload };

    case Actions.ADD_ITEM: {
      const t = now();
      const c = categoryMeta(action.payload.category);
      const item = {
        id: uid(),
        name: action.payload.name.trim(),
        category: action.payload.category,
        quantity: Number(action.payload.quantity) || 0,
        unit: action.payload.unit || c.unit,
        emoji: action.payload.emoji || c.emoji,
        iconKey: action.payload.iconKey || '',
        notes: action.payload.notes || '',
        createdAt: t,
        updatedAt: t,
      };
      return { ...state, items: [item, ...state.items] };
    }

    case Actions.UPDATE_ITEM: {
      const t = now();
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id
            ? { ...it, ...action.payload.changes, updatedAt: t }
            : it,
        ),
      };
    }

    case Actions.DELETE_ITEM: {
      return {
        ...state,
        items: state.items.filter((it) => it.id !== action.payload.id),
        cauldron: state.cauldron.filter((c) => c.itemId !== action.payload.id),
      };
    }

    case Actions.SET_QUANTITY: {
      const t = now();
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id
            ? { ...it, quantity: Math.max(0, Number(action.payload.quantity) || 0), updatedAt: t }
            : it,
        ),
      };
    }

    case Actions.ADJUST_QUANTITY: {
      const t = now();
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id
            ? {
                ...it,
                quantity: Math.max(0, (Number(it.quantity) || 0) + action.payload.delta),
                updatedAt: t,
              }
            : it,
        ),
      };
    }

    case Actions.ADD_TO_CAULDRON: {
      const { itemId, amount, unit } = action.payload;
      const existing = state.cauldron.find((c) => c.itemId === itemId);
      if (existing) {
        return {
          ...state,
          cauldron: state.cauldron.map((c) =>
            c.itemId === itemId ? { ...c, amount: (Number(c.amount) || 0) + Number(amount) } : c,
          ),
        };
      }
      return {
        ...state,
        cauldron: [...state.cauldron, { itemId, amount: Number(amount) || 0, unit }],
      };
    }

    case Actions.UPDATE_CAULDRON_AMOUNT: {
      return {
        ...state,
        cauldron: state.cauldron.map((c) =>
          c.itemId === action.payload.itemId
            ? { ...c, amount: Math.max(0, Number(action.payload.amount) || 0) }
            : c,
        ),
      };
    }

    case Actions.REMOVE_FROM_CAULDRON: {
      return {
        ...state,
        cauldron: state.cauldron.filter((c) => c.itemId !== action.payload.itemId),
      };
    }

    case Actions.CLEAR_CAULDRON: {
      return { ...state, cauldron: [] };
    }

    case Actions.SAVE_RECIPE: {
      const t = now();
      const recipe = {
        id: uid(),
        title: (action.payload.title || 'Untitled recipe').trim(),
        intention: action.payload.intention || '',
        steps: action.payload.steps || '',
        ingredients: (action.payload.ingredients || []).map((i) => ({
          itemId: i.itemId,
          amount: Number(i.amount) || 0,
          unit: i.unit || '',
          name: i.name,
          emoji: i.emoji,
        })),
        createdAt: t,
      };
      return { ...state, recipes: [recipe, ...state.recipes] };
    }

    case Actions.UPDATE_RECIPE: {
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload.changes } : r,
        ),
      };
    }

    case Actions.DELETE_RECIPE: {
      return { ...state, recipes: state.recipes.filter((r) => r.id !== action.payload.id) };
    }

    default:
      return state;
  }
}

export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const items = migrateStoredItems(parsed.items);
        dispatch({
          type: Actions.HYDRATE,
          payload: {
            items,
            cauldron: Array.isArray(parsed.cauldron) ? parsed.cauldron : [],
            recipes: Array.isArray(parsed.recipes) ? parsed.recipes : [],
          },
        });
      } else {
        dispatch({
          type: Actions.HYDRATE,
          payload: { items: seedItems(), cauldron: [], recipes: [] },
        });
      }
    } catch (err) {
      console.warn('Failed to hydrate store:', err);
      dispatch({
        type: Actions.HYDRATE,
        payload: { items: seedItems(), cauldron: [], recipes: [] },
      });
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to persist store:', err);
    }
  }, [state, ready]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
