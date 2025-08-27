import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import { registerDevice } from '../controllers/deviceController';
import { isGuest } from '../middleware/canUserRegisterDevice';
import { checkUserHouseholdId } from '../middleware/checkUserHouseholdId';

const router = Router();

router.use(authenticateUser);
router.post('/', checkUserHouseholdId, isGuest, registerDevice);

export default router;
