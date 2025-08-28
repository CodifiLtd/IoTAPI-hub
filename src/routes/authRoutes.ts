import { Router } from 'express';
import { login } from '../controllers/authController';

/**
 * Express router for authentication endpoints (login).
 */
const router = Router();

router.post('/', login);

export default router;
