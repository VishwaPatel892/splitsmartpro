import api from './api.js';

/** Create a new expense */
export const createExpense = async (data) => {
  const res = await api.post('/expenses', data);
  return res.data;
};

/** Get all expenses for a group */
export const getExpensesByGroup = async (groupId) => {
  const res = await api.get(`/expenses/${groupId}`);
  return res.data;
};

/** Delete an expense by ID */
export const deleteExpense = async (id) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};
