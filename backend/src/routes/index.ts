import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { syncTrees, getTrees, getTreeById } from '../controllers/tree.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Passwords & Tokens
router.post('/auth/register', register);
router.post('/auth/login', login);

// Trees
router.post('/trees/sync', authMiddleware, syncTrees);
router.get('/trees', authMiddleware, getTrees);
router.get('/trees/:id', authMiddleware, getTreeById);

export default router;
