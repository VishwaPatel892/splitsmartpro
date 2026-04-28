import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getGroupBalance } from '../controllers/balanceController.js';

const router = express.Router();

router.get('/:groupId', protect, getGroupBalance);

export default router;
