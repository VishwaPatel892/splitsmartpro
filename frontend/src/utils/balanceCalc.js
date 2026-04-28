const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Client-side net balance computation (mirrors backend logic).
 * Useful for optimistic UI updates without hitting the API.
 *
 * @param {Array} expenses  - populated expense documents
 * @returns {Map<string, number>}  userId → netBalance
 */
export function computeNetBalances(expenses) {
  const map = new Map();
  const add = (id, amount) => map.set(id, round2((map.get(id) || 0) + amount));

  for (const exp of expenses) {
    const paidById = exp.paidBy?._id || exp.paidBy;
    add(String(paidById), exp.amount);
    for (const split of exp.splits) {
      const uid = split.user?._id || split.user;
      add(String(uid), -split.amount);
    }
  }
  return map;
}

/**
 * Greedy debt simplification (mirrors backend logic).
 * @param {Map<string, number>} balanceMap
 * @returns {{ from: string, to: string, amount: number }[]}
 */
export function simplifyDebts(balanceMap) {
  const creditors = [];
  const debtors   = [];

  for (const [id, bal] of balanceMap) {
    const b = round2(bal);
    if (b >  0.01) creditors.push({ id, amount:  b });
    if (b < -0.01) debtors.push({   id, amount: round2(-b) });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b)   => b.amount - a.amount);

  const txns = [];
  let ci = 0, di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const cr = creditors[ci];
    const db = debtors[di];
    const settled = round2(Math.min(cr.amount, db.amount));
    txns.push({ from: db.id, to: cr.id, amount: settled });
    cr.amount = round2(cr.amount - settled);
    db.amount = round2(db.amount - settled);
    if (cr.amount <= 0.01) ci++;
    if (db.amount <= 0.01) di++;
  }
  return txns;
}

/**
 * Returns the current user's net position across all provided balances.
 * Positive → user is owed; Negative → user owes.
 * @param {Array} balances   - API balance array
 * @param {string} userId
 */
export function myNetBalance(balances, userId) {
  const entry = balances.find((b) => b.user._id === userId);
  return entry ? round2(entry.netBalance) : 0;
}
