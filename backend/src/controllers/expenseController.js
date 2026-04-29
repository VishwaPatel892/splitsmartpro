import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

const round2 = (n) => Math.round(n * 100) / 100;

/* ─── helpers ─────────────────────────────────────── */
function equalSplit(total, memberIds) {
  const base = round2(Math.floor((total / memberIds.length) * 100) / 100);
  const remainder = round2(total - base * memberIds.length);
  return memberIds.map((id, i) => ({
    user: id,
    amount: i === memberIds.length - 1 ? round2(base + remainder) : base,
  }));
}

function customSplit(total, splits) {
  const sum = round2(splits.reduce((a, s) => a + Number(s.amount), 0));
  if (Math.abs(sum - total) > 0.01)
    throw new Error(`Split amounts (${sum}) must equal total (${total})`);
  return splits.map((s) => ({ user: s.user, amount: round2(Number(s.amount)) }));
}

function percentageSplit(total, splits) {
  const sumPct = round2(splits.reduce((a, s) => a + Number(s.percentage), 0));
  if (Math.abs(sumPct - 100) > 0.01)
    throw new Error(`Percentages must sum to 100 (got ${sumPct})`);
  const result = splits.map((s) => ({
    user: s.user,
    amount: round2((Number(s.percentage) / 100) * total),
  }));
  const computedSum = round2(result.reduce((a, s) => a + s.amount, 0));
  result[result.length - 1].amount = round2(
    result[result.length - 1].amount + (total - computedSum)
  );
  return result;
}

/* ─── POST /api/expenses ───────────────────────────── */
export const createExpense = asyncHandler(async (req, res) => {
  const { groupId, title, amount, paidBy, splitType = 'equal', splits } = req.body;

  if (!groupId || !title || !amount || !paidBy)
    return res.status(400).json({ message: 'groupId, title, amount and paidBy are required' });

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const isMember = group.members.some((m) => m.toString() === req.user._id.toString());
  if (!isMember) return res.status(403).json({ message: 'Not a member of this group' });

  const memberIds = group.members.map((m) => m.toString());
  let computedSplits;

  switch (splitType) {
    case 'equal':
      computedSplits = equalSplit(Number(amount), memberIds);
      break;
    case 'custom':
      computedSplits = customSplit(Number(amount), splits);
      break;
    case 'percentage':
      computedSplits = percentageSplit(Number(amount), splits);
      break;
    default:
      return res.status(400).json({ message: 'Invalid splitType' });
  }

  const expense = await Expense.create({
    groupId,
    title: title.trim(),
    amount: Number(amount),
    paidBy,
    splitType,
    splits: computedSplits,
  });

  const populated = await expense.populate([
    { path: 'paidBy', select: 'name email' },
    { path: 'splits.user', select: 'name email' },
  ]);

  res.status(201).json(populated);
});

/* ─── GET /api/expenses/:groupId ───────────────────── */
export const getExpensesByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const isMember = group.members.some((m) => m.toString() === req.user._id.toString());
  if (!isMember) return res.status(403).json({ message: 'Not a member of this group' });

  const expenses = await Expense.find({ groupId })
    .populate('paidBy', 'name email')
    .populate('splits.user', 'name email')
    .sort({ createdAt: -1 });

  res.json(expenses);
});

/* ─── DELETE /api/expenses/:id ─────────────────────── */
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });

  // Only group members can delete
  const group = await Group.findById(expense.groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const isMember = group.members.some((m) => m.toString() === req.user._id.toString());
  if (!isMember) return res.status(403).json({ message: 'Not authorized' });

  await expense.deleteOne();
  res.json({ message: 'Expense deleted' });
});

/**
 * GET /api/expenses/recent
 * Returns the 10 most recent expenses across all groups the user belongs to.
 */
export const getRecentExpenses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find groups user is member of
  const groups = await Group.find({ members: userId });
  const groupIds = groups.map(g => g._id);

  const expenses = await Expense.find({ groupId: { $in: groupIds } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('paidBy', 'name')
    .populate('groupId', 'name');

  res.json(expenses);
});
