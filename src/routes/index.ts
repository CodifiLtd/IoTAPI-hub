import { Router } from 'express';
import userRoutes from '../routes/userRoutes';
import authRoutes from '../routes/authRoutes';
import householdRoutes from '../routes/householdRoutes';
import deviceRoutes from '../routes/deviceRoutes';

import type { Router as IRouter } from 'express';

/**
 * Main Express router combining all API route modules.
 */
const router: IRouter = Router();

router.use('/users', userRoutes);
router.use('/login', authRoutes);
router.use('/households', householdRoutes);
router.use('/devices', deviceRoutes);

export default router;
