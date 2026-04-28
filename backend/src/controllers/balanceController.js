import asyncHandler from 'express-async-handler';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
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

  // Fetch all expenses for this group (populated)
  const expenses = await Expense.find({ groupId })
    .populate('paidBy', 'name email')
    .populate('splits.user', 'name email');

  // Compute net balances
  const balanceMap = computeNetBalances(expenses);

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
