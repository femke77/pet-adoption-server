import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { apiGuard } from '../middleware/authGuard.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', apiGuard, apiRoutes);

export default router;
