import asyncHandler from 'express-async-handler';
import Group from '../models/Group.js';

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
export const createGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Group name is required');
  }

  const group = await Group.create({
    name,
    description,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  const populated = await group.populate('members', 'name email');

  res.status(201).json(populated);
});

// @desc    Get all groups for the logged-in user
// @route   GET /api/groups
// @access  Private
export const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
    .populate('members', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(groups);
});

// @desc    Get single group by ID
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate('members', 'name email')
    .populate('createdBy', 'name email');

  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  // Only members can view
  const isMember = group.members.some(
    (m) => m._id.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(403);
    throw new Error('Not authorized to view this group');
  }

  res.json(group);
});

// @desc    Join a group via invite code
// @route   POST /api/groups/join
// @access  Private
export const joinGroup = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    res.status(400);
    throw new Error('Invite code is required');
  }

  const group = await Group.findOne({ inviteCode });

  if (!group) {
    res.status(404);
    throw new Error('Invalid invite code — group not found');
  }

  const alreadyMember = group.members.some(
    (m) => m.toString() === req.user._id.toString()
  );
  if (alreadyMember) {
    res.status(400);
    throw new Error('You are already a member of this group');
  }

  group.members.push(req.user._id);
  await group.save();

  const populated = await group.populate('members', 'name email');
  res.json(populated);
});

// @desc    Delete a group (creator only)
// @route   DELETE /api/groups/:id
// @access  Private
export const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  if (group.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the group creator can delete this group');
  }

  await group.deleteOne();
  res.json({ message: 'Group deleted successfully' });
});
