import api from './api.js';

/**
 * Create a new group
 * @param {{ name: string, description?: string }} data
 */
export const createGroup = async (data) => {
  const res = await api.post('/groups', data);
  return res.data;
};

/**
 * Fetch all groups the logged-in user belongs to
 */
export const getGroups = async () => {
  const res = await api.get('/groups');
  return res.data;
};

/**
 * Fetch a single group by its ID
 * @param {string} id
 */
export const getGroupById = async (id) => {
  const res = await api.get(`/groups/${id}`);
  return res.data;
};

/**
 * Join a group using an invite code
 * @param {string} inviteCode
 */
export const joinGroup = async (inviteCode) => {
  const res = await api.post('/groups/join', { inviteCode });
  return res.data;
};

/**
 * Delete a group (creator only)
 * @param {string} id
 */
export const deleteGroup = async (id) => {
  const res = await api.delete(`/groups/${id}`);
  return res.data;
};
