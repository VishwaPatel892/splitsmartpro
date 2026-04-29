import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getGroupBalance, getUserSummary, getActivityFeed } from '../controllers/balanceController.js';

const router = express.Router();

router.get('/summary', protect, getUserSummary);
router.get('/activity', protect, getActivityFeed);
router.get('/:groupId', protect, getGroupBalance);

export default router;
