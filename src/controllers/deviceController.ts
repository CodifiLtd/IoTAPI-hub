import { handleApiError } from '../utils/errorHandler';
import { logger } from '../logger/index';

import type { Response } from 'express';
import type { ApiResponse } from '../types/api';
import type { Device } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth';
import type { DeviceRequest } from '../schemas/device';
import { deviceSchema } from '../schemas/device';
import type { registerDeviceSuccess } from '../types/device';
import { createDevice } from '../services/deviceService';

export async function registerDevice(
  req: AuthenticatedRequest<unknown, unknown, DeviceRequest>,
  res: Response<ApiResponse<registerDeviceSuccess>>
): Promise<Response<ApiResponse<registerDeviceSuccess>>> {
  try {
    logger.info('Device registration request');

    const validatedData: DeviceRequest = deviceSchema.parse(req.body);

    logger.info('Creating device');
    const device: Device = await createDevice(validatedData);

    logger.info(`Device created: ${device.name} (ID: ${device.id})`);

    const {
      id,
      name,
      serialNumber,
      description,
      firmwareVersion,
      householdId,
      deviceTypeId
    } = device;

    return res.status(201).json({
      id,
      name,
      serialNumber,
      description,
      firmwareVersion,
      householdId,
      deviceTypeId
    });
  } catch (err) {
    return handleApiError(err, res);
  }
}
