import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import { registerDevice } from '../controllers/deviceController';
import { canUserRegisterDevice } from '../middleware/canUserRegisterDevice';

const router = Router();

router.use(authenticateUser);
router.post('/', canUserRegisterDevice, registerDevice);

export default router;
