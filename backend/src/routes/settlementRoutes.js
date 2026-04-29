import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createSettlement,
  getSettlementsByGroup,
  getRecentSettlements,
} from '../controllers/settlementController.js';

const router = express.Router();

router.post('/', protect, createSettlement);
router.get('/recent', protect, getRecentSettlements);
router.get('/:groupId', protect, getSettlementsByGroup);

export default router;
