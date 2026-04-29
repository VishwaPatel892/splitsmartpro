import api from './api.js';

/**
 * Fetch net balances + simplified debts for a group.
 * @param {string} groupId
 */
export const getGroupBalance = async (groupId) => {
  const res = await api.get(`/balance/${groupId}`);
  return res.data;
};

/**
 * Get total owed/owes summary for the user across all groups
 */
export const getUserSummary = async () => {
  const res = await api.get('/balance/summary');
  return res.data;
};

/**
 * Get recent activity feed (global)
 */
export const getActivityFeed = async () => {
  const res = await api.get('/balance/activity');
  return res.data;
};
