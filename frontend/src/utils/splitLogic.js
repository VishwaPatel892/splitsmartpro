/**
 * Split logic utilities — used server-side and can be imported client-side.
 * All amounts are rounded to 2 decimal places to avoid floating-point drift.
 */

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Equal split: divide total evenly; last member absorbs rounding remainder.
 * @param {number} total
 * @param {string[]} memberIds
 * @returns {{ user: string, amount: number }[]}
 */
export function equalSplit(total, memberIds) {
  if (!memberIds.length) throw new Error('No members to split between');
  const base = round2(Math.floor((total / memberIds.length) * 100) / 100);
  const remainder = round2(total - base * memberIds.length);
  return memberIds.map((id, i) => ({
    user: id,
    amount: i === memberIds.length - 1 ? round2(base + remainder) : base,
  }));
}

/**
 * Custom split: user-defined exact amounts.
 * Validates that split amounts sum to total (±0.01 tolerance).
 * @param {number} total
 * @param {{ user: string, amount: number }[]} splits
 * @returns {{ user: string, amount: number }[]}
 */
export function customSplit(total, splits) {
  const sum = round2(splits.reduce((acc, s) => acc + Number(s.amount), 0));
  if (Math.abs(sum - total) > 0.01) {
    throw new Error(`Custom split amounts (${sum}) must equal total (${total})`);
  }
  return splits.map((s) => ({ user: s.user, amount: round2(Number(s.amount)) }));
}

/**
 * Percentage split: calculate amounts from percentages.
 * Validates percentages sum to 100 (±0.01 tolerance).
 * @param {number} total
 * @param {{ user: string, percentage: number }[]} splits
 * @returns {{ user: string, amount: number }[]}
 */
export function percentageSplit(total, splits) {
  const sumPct = round2(splits.reduce((acc, s) => acc + Number(s.percentage), 0));
  if (Math.abs(sumPct - 100) > 0.01) {
    throw new Error(`Percentages must sum to 100, got ${sumPct}`);
  }
  const result = splits.map((s) => ({
    user: s.user,
    amount: round2((Number(s.percentage) / 100) * total),
  }));
  // Fix rounding: assign remainder to last entry
  const computedSum = round2(result.reduce((a, s) => a + s.amount, 0));
  result[result.length - 1].amount = round2(
    result[result.length - 1].amount + (total - computedSum)
  );
  return result;
}

/**
 * Dispatcher: pick the right split function by type.
 */
export function computeSplits({ splitType, total, members, splits }) {
  switch (splitType) {
    case 'equal':
      return equalSplit(total, members);
    case 'custom':
      return customSplit(total, splits);
    case 'percentage':
      return percentageSplit(total, splits);
    default:
      throw new Error(`Unknown split type: ${splitType}`);
  }
}
