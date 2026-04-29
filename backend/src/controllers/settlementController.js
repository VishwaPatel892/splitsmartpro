import asyncHandler from 'express-async-handler';
import Settlement from '../models/Settlement.js';
import Group from '../models/Group.js';

/**
 * POST /api/settlements
 * Create a new settlement (mark as paid)
 */
export const createSettlement = asyncHandler(async (req, res) => {
  const { fromUser, toUser, groupId, amount } = req.body;

  if (!fromUser || !toUser || !groupId || !amount) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // Verify that both users are in the group
  const isFromMember = group.members.some(m => m.toString() === fromUser);
  const isToMember = group.members.some(m => m.toString() === toUser);

  if (!isFromMember || !isToMember) {
    res.status(400);
    throw new Error('One or both users are not members of this group');
  }

  // Create settlement
  const settlement = await Settlement.create({
    fromUser,
    toUser,
    groupId,
    amount,
    status: 'completed' // In a real app, you might have a pending state for approval
  });

  const populated = await settlement.populate([
    { path: 'fromUser', select: 'name email' },
    { path: 'toUser', select: 'name email' }
  ]);

  res.status(201).json(populated);
});

/**
 * GET /api/settlements/:groupId
 * Get all settlements for a group
 */
export const getSettlementsByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  const isMember = group.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const settlements = await Settlement.find({ groupId })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .sort({ createdAt: -1 });

  res.json(settlements);
});

/**
 * GET /api/settlements/recent
 * Returns the 10 most recent settlements across all groups the user belongs to.
 */
export const getRecentSettlements = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find groups user is member of
  const groups = await Group.find({ members: userId });
  const groupIds = groups.map(g => g._id);

  const settlements = await Settlement.find({ 
    groupId: { $in: groupIds },
    status: 'completed'
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('fromUser', 'name')
    .populate('toUser', 'name')
    .populate('groupId', 'name');

  res.json(settlements);
});
