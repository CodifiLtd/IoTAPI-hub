import { handleApiError } from '../utils/errorHandler';
import { logger } from '../logger/index';

import type { Response } from 'express';
import type { ApiResponse } from '../types/api';
import type { Device } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth';
import type { DeviceIdParams, DeviceRequest } from '../schemas/device';
import { deviceIdParamsSchema, deviceSchema } from '../schemas/device';
import type { registerDeviceSuccess } from '../types/device';
import { createDevice, getDeviceById } from '../services/deviceService';

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

export async function getDevice(
  req: AuthenticatedRequest<DeviceIdParams>,
  res: Response<ApiResponse<Device>>
): Promise<Response<ApiResponse<Device>>> {
  try {
    logger.info('Get device by ID request');

    const parsed = deviceIdParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return handleApiError(parsed.error, res);
    }

    const { id } = parsed.data;

    logger.info('Retrieving device');

    const device: Device | null = await getDeviceById(id);

    if (!device) {
      logger.error('Device not found');

      return res.status(404).json({ error: 'Device not found' });
    }

    if (
      !req.households?.some(household => household.id == device.householdId)
    ) {
      logger.error('User not authorised');

      return res.status(403).json({ error: 'User not authorised' });
    }

    return res.json(device);
  } catch (err) {
    return handleApiError(err, res);
  }
}
