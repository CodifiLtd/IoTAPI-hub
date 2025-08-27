import { Router } from 'express';
import { registerUser, getUser } from '../controllers/userController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = Router();

// Public route
router.post('/', registerUser);

// Protected routes
router.use(authenticateUser);
router.get('/:id', getUser);
// Add more protected routes below

export default router;
