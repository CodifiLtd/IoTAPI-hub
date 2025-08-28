import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import {
  deleteDevice,
  getDevice,
  registerDevice
} from '../controllers/deviceController';
import { upsertConfig, getConfig } from '../controllers/deviceConfigController';
import { isGuest } from '../middleware/canUserRegisterDevice';
import { checkUserHouseholdId } from '../middleware/checkUserHouseholdId';
import type { DeviceIdParams } from '../schemas/device';
import type { DeviceConfigRequest } from '../schemas/deviceConfig';

const router = Router();

router.use(authenticateUser);
router.post('/', checkUserHouseholdId, isGuest, registerDevice);
router.get('/:id', getDevice);
router.delete('/:id', checkUserHouseholdId, isGuest, deleteDevice);
router.put<DeviceIdParams, unknown, DeviceConfigRequest>(
  '/:id/config',
  upsertConfig
);
router.get('/:id/config', getConfig);

export default router;
