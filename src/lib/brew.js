export function formatAmt(n) {
  const v = Number(n) || 0;
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(2).replace(/\.?0+$/, '');
}

/** Normalize cauldron entries or recipe ingredients into brew rows. */
export function resolveBrewRows(ingredients, items) {
  return (ingredients || []).map((ing) => {
    const item = items.find((it) => it.id === ing.itemId);
    return {
      itemId: ing.itemId,
      amount: Number(ing.amount) || 0,
      unit: ing.unit || item?.unit || '',
      name: ing.name || item?.name || '(no longer on shelf)',
      emoji: ing.emoji || item?.emoji || '·',
      missing: !item,
      stocked: item ? Number(item.quantity) || 0 : 0,
    };
  });
}

export function brewShortfalls(rows, times = 1) {
  return rows.flatMap((row) => {
    const perBatch = Number(row.amount) || 0;
    const needed = perBatch * times;
    if (perBatch <= 0) {
      return [{ name: row.name, needed, stocked: 0, zeroAmount: true }];
    }
    if (row.missing) {
      return [{ name: row.name, needed, stocked: 0, missing: true }];
    }
    if (needed > row.stocked) {
      return [{ name: row.name, needed, stocked: row.stocked, missing: false }];
    }
    return [];
  });
}

export function maxAffordableBrews(rows) {
  if (rows.length === 0) return 0;
  let max = Infinity;
  for (const row of rows) {
    const perBatch = Number(row.amount) || 0;
    if (row.missing || perBatch <= 0) return 0;
    max = Math.min(max, Math.floor(row.stocked / perBatch));
  }
  return max === Infinity ? 0 : max;
}
