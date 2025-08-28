import { Router } from 'express';
import {
  registerUser,
  getUser,
  getUserDevices
} from '../controllers/userController';
import { authenticateUser } from '../middleware/authenticateUser';
import { checkUserId } from '../middleware/checkUserId';

/**
 * Express router for user-related endpoints (register, get, devices).
 */
const router = Router();

// Public route
router.post('/', registerUser);

// Protected routes
router.use(authenticateUser);
router.get('/:id', getUser);
router.get('/:id/devices', checkUserId, getUserDevices);
// Add more protected routes below

export default router;
