import { useMemo, useContext } from 'react';
import { StoreCtx } from './context.js';
import { Actions } from './actions.js';

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

export function useActions() {
  const { dispatch } = useStore();
  return useMemo(
    () => ({
      addItem: (payload) => dispatch({ type: Actions.ADD_ITEM, payload }),
      updateItem: (id, changes) => dispatch({ type: Actions.UPDATE_ITEM, payload: { id, changes } }),
      deleteItem: (id) => dispatch({ type: Actions.DELETE_ITEM, payload: { id } }),
      setQuantity: (id, quantity) => dispatch({ type: Actions.SET_QUANTITY, payload: { id, quantity } }),
      adjustQuantity: (id, delta) => dispatch({ type: Actions.ADJUST_QUANTITY, payload: { id, delta } }),

      addToCauldron: (itemId, amount, unit) =>
        dispatch({ type: Actions.ADD_TO_CAULDRON, payload: { itemId, amount, unit } }),
      updateCauldronAmount: (itemId, amount) =>
        dispatch({ type: Actions.UPDATE_CAULDRON_AMOUNT, payload: { itemId, amount } }),
      removeFromCauldron: (itemId) =>
        dispatch({ type: Actions.REMOVE_FROM_CAULDRON, payload: { itemId } }),
      clearCauldron: () => dispatch({ type: Actions.CLEAR_CAULDRON }),
      brewCauldron: (times = 1) => dispatch({ type: Actions.BREW_CAULDRON, payload: { times } }),
      restockFromCauldron: (entries) =>
        dispatch({ type: Actions.RESTOCK_FROM_CAULDRON, payload: { entries } }),

      saveRecipe: (payload) => dispatch({ type: Actions.SAVE_RECIPE, payload }),
      updateRecipe: (id, changes) => dispatch({ type: Actions.UPDATE_RECIPE, payload: { id, changes } }),
      deleteRecipe: (id) => dispatch({ type: Actions.DELETE_RECIPE, payload: { id } }),
      brewRecipe: (recipeId, times = 1) =>
        dispatch({ type: Actions.BREW_RECIPE, payload: { recipeId, times } }),
    }),
    [dispatch],
  );
}
