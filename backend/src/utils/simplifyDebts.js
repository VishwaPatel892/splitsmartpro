const round2 = (n) => Math.round(n * 100) / 100;

/**
 * STEP 1: Compute net balance per user across all expenses.
 * Positive balance  → user is owed money (creditor)
 * Negative balance  → user owes money   (debtor)
 *
 * @param {Array} expenses  - populated expense documents
 * @returns {Map<string, number>}  userId → netBalance
 */
export function computeNetBalances(expenses) {
  const balanceMap = new Map();

  const add = (id, amount) => {
    balanceMap.set(id, round2((balanceMap.get(id) || 0) + amount));
  };

  for (const expense of expenses) {
    const paidById = expense.paidBy?._id?.toString() || expense.paidBy?.toString();

    // payer gains credit for the full amount
    add(paidById, expense.amount);

    // each member in splits owes their share
    for (const split of expense.splits) {
      const userId = split.user?._id?.toString() || split.user?.toString();
      add(userId, -split.amount);
    }
  }

  return balanceMap;
}

/**
 * STEP 2 + 3: Greedy debt-simplification algorithm.
 * Splits balances into creditors (positive) and debtors (negative),
 * then repeatedly matches the largest creditor with the largest debtor.
 *
 * @param {Map<string, number>} balanceMap
 * @returns {{ from: string, to: string, amount: number }[]}
 */
export function simplifyDebts(balanceMap) {
  // Build mutable arrays, filtering out zeroes
  const creditors = []; // { id, amount } — positive
  const debtors   = []; // { id, amount } — positive (absolute value)

  for (const [id, bal] of balanceMap) {
    const b = round2(bal);
    if (b > 0.01)  creditors.push({ id, amount: b });
    if (b < -0.01) debtors.push({ id, amount: round2(-b) });
  }

  // Sort descending by amount for greedy matching
  const sortDesc = (arr) => arr.sort((a, b) => b.amount - a.amount);

  sortDesc(creditors);
  sortDesc(debtors);

  const transactions = [];

  let ci = 0; // creditor pointer
  let di = 0; // debtor pointer

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor   = debtors[di];

    const settled = round2(Math.min(creditor.amount, debtor.amount));

    transactions.push({
      from:   debtor.id,
      to:     creditor.id,
      amount: settled,
    });

    creditor.amount = round2(creditor.amount - settled);
    debtor.amount   = round2(debtor.amount   - settled);

    if (creditor.amount <= 0.01) ci++;
    if (debtor.amount   <= 0.01) di++;
  }

  return transactions;
}
