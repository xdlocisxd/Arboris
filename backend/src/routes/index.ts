import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { syncTrees, getTrees } from '../controllers/tree.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Passwords & Tokens
router.post('/auth/register', register);
router.post('/auth/login', login);

// Trees
router.post('/trees/sync', authMiddleware, syncTrees);
router.get('/trees', authMiddleware, getTrees);

export default router;
