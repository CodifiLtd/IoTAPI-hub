import { Router } from 'express';
import userRoutes from '../routes/userRoutes';
import authRoutes from '../routes/authRoutes';

import type { Router as IRouter } from 'express';

const router: IRouter = Router();

router.use('/users', userRoutes);
router.use('/login', authRoutes);

export default router;
