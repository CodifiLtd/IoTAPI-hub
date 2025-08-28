import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import {
  deleteDevice,
  getDevice,
  registerDevice
} from '../controllers/deviceController';
import { isGuest } from '../middleware/canUserRegisterDevice';
import { checkUserHouseholdId } from '../middleware/checkUserHouseholdId';

const router = Router();

router.use(authenticateUser);
router.post('/', checkUserHouseholdId, isGuest, registerDevice);
router.get('/:id', getDevice);
router.delete('/:id', checkUserHouseholdId, isGuest, deleteDevice);

export default router;
