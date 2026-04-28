import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createExpense,
  getExpensesByGroup,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', protect, createExpense);
router.get('/:groupId', protect, getExpensesByGroup);
router.delete('/:id', protect, deleteExpense);

export default router;
