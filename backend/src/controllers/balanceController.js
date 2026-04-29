import asyncHandler from 'express-async-handler';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
import Settlement from '../models/Settlement.js';
import { computeNetBalances, simplifyDebts } from '../utils/simplifyDebts.js';

/**
 * GET /api/balance/:groupId
 * Returns net balances for each member + simplified settlement transactions.
 */
export const getGroupBalance = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Verify group exists and caller is a member
  const group = await Group.findById(groupId).populate('members', 'name email');
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  const isMember = group.members.some(
    (m) => m._id.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(403);
    throw new Error('Not a member of this group');
  }

  // Fetch all expenses and settlements for this group
  const [expenses, settlements] = await Promise.all([
    Expense.find({ groupId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email'),
    Settlement.find({ groupId, status: 'completed' })
  ]);

  // Compute net balances
  const balanceMap = computeNetBalances(expenses, settlements);

  // Build per-user balance objects (include members with 0 balance too)
  const balances = group.members.map((member) => {
    const id = member._id.toString();
    return {
      user: {
        _id:   id,
        name:  member.name,
        email: member.email,
      },
      netBalance: balanceMap.get(id) || 0,
    };
  });

  // Simplify debts
  const rawDebts = simplifyDebts(balanceMap);

  // Enrich simplified debts with user names
  const memberMap = {};
  group.members.forEach((m) => { memberMap[m._id.toString()] = m; });

  const simplifiedDebts = rawDebts.map((t) => ({
    from:   { _id: t.from,  name: memberMap[t.from]?.name  || t.from  },
    to:     { _id: t.to,    name: memberMap[t.to]?.name    || t.to    },
    amount: t.amount,
  }));

  res.json({ balances, simplifiedDebts });
});

/**
 * GET /api/balance/summary
 * Returns total owed to user and total user owes across ALL groups.
 */
export const getUserSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  
  // Find all groups user belongs to
  const groups = await Group.find({ members: userId });
  const groupIds = groups.map(g => g._id);

  // Fetch all expenses and settlements for these groups
  const [expenses, settlements] = await Promise.all([
    Expense.find({ groupId: { $in: groupIds } }),
    Settlement.find({ groupId: { $in: groupIds }, status: 'completed' })
  ]);

  // Aggregate by group to compute net balances
  let totalOwedToUser = 0;
  let totalUserOwes = 0;

  for (const groupId of groupIds) {
    const groupExpenses = expenses.filter(e => e.groupId.toString() === groupId.toString());
    const groupSettlements = settlements.filter(s => s.groupId.toString() === groupId.toString());
    
    const balanceMap = computeNetBalances(groupExpenses, groupSettlements);
    const userBalance = balanceMap.get(userId) || 0;

    if (userBalance > 0) totalOwedToUser += userBalance;
    if (userBalance < 0) totalUserOwes += Math.abs(userBalance);
  }

  res.json({
    totalOwedToUser: Math.round(totalOwedToUser * 100) / 100,
    totalUserOwes: Math.round(totalUserOwes * 100) / 100,
    netBalance: Math.round((totalOwedToUser - totalUserOwes) * 100) / 100,
    groupCount: groups.length
  });
});

/**
 * GET /api/balance/activity
 * Returns recent activity (expenses and settlements) for the user.
 */
export const getActivityFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all groups user belongs to
  const groups = await Group.find({ members: userId });
  const groupIds = groups.map(g => g._id);

  // Fetch recent expenses
  const expenses = await Expense.find({ groupId: { $in: groupIds } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('paidBy', 'name')
    .populate('groupId', 'name');

  // Fetch recent settlements
  const settlements = await Settlement.find({ groupId: { $in: groupIds }, status: 'completed' })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('fromUser', 'name')
    .populate('toUser', 'name')
    .populate('groupId', 'name');

  // Format and combine
  const activity = [
    ...expenses.map(e => ({
      id: e._id,
      type: 'expense',
      user: e.paidBy.name,
      action: `added "₹${e.amount.toFixed(2)}" in "${e.groupId.name}"`,
      title: e.title,
      amount: e.amount,
      createdAt: e.createdAt,
    })),
    ...settlements.map(s => ({
      id: s._id,
      type: 'settlement',
      user: s.fromUser.name,
      action: `settled "₹${s.amount.toFixed(2)}" with ${s.toUser.name} in "${s.groupId.name}"`,
      amount: s.amount,
      createdAt: s.createdAt,
    }))
  ];

  // Sort combined activity by date
  activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(activity.slice(0, 15));
});
