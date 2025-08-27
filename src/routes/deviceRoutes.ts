import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import { getDevice, registerDevice } from '../controllers/deviceController';
import { isGuest } from '../middleware/canUserRegisterDevice';
import { checkUserHouseholdId } from '../middleware/checkUserHouseholdId';

const router = Router();

router.use(authenticateUser);
router.post('/', checkUserHouseholdId, isGuest, registerDevice);
router.get('/:id', getDevice);

export default router;
