import { Router } from 'express';
import userRoutes from '../routes/userRoutes';
import authRoutes from '../routes/authRoutes';
import householdRoutes from '../routes/householdRoutes';

import type { Router as IRouter } from 'express';

const router: IRouter = Router();

router.use('/users', userRoutes);
router.use('/login', authRoutes);
router.use('/households', householdRoutes);

export default router;
