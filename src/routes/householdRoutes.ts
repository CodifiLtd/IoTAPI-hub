import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import { registerHousehold } from '../controllers/householdController';

/**
 * Express router for household-related endpoints (register).
 */
const router = Router();

router.use(authenticateUser);
router.post('/', registerHousehold);

export default router;
