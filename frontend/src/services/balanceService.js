import api from './api.js';

/**
 * Fetch net balances + simplified debts for a group.
 * @param {string} groupId
 */
export const getGroupBalance = async (groupId) => {
  const res = await api.get(`/balance/${groupId}`);
  return res.data;
};
