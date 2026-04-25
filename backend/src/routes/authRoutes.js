import express from 'express';
import { signupUser, loginUser, googleAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);

export default router;
