import { handleApiError } from '../utils/errorHandler';
import { logger } from '../logger/index';

import type { Response } from 'express';
import type { ApiResponse } from '../types/api';
import type { Device } from '@prisma/client';
import type { AuthenticatedRequest } from '../types/auth';
import { deleteDeviceRequestBodySchema } from '../schemas/device';
import type {
  DeleteDeviceRequest,
  DeviceIdParams,
  DeviceRequest
} from '../schemas/device';
import { deviceIdParamsSchema, deviceSchema } from '../schemas/device';
import type {
  DeleteDeviceSuccess,
  DeviceWithConfig,
  registerDeviceSuccess
} from '../types/device';
import {
  createDevice,
  deleteDeviceById,
  getDeviceById
} from '../services/deviceService';

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
  res: Response<ApiResponse<DeviceWithConfig>>
): Promise<Response<ApiResponse<DeviceWithConfig>>> {
  try {
    logger.info('Get device by ID request');

    const parsed = deviceIdParamsSchema.safeParse(req.params);

    if (!parsed.success) {
      return handleApiError(parsed.error, res);
    }

    const { id } = parsed.data;

    logger.info('Retrieving device');

    const device: DeviceWithConfig | null = await getDeviceById(id);

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

    return res.json({
      ...device,
      ...(device.config?.config && { config: JSON.parse(device.config.config) })
    });
  } catch (err) {
    return handleApiError(err, res);
  }
}

export async function deleteDevice(
  req: AuthenticatedRequest<DeviceIdParams, unknown, DeleteDeviceRequest>,
  res: Response<ApiResponse<DeleteDeviceSuccess>>
): Promise<Response<ApiResponse<DeleteDeviceSuccess>>> {
  logger.info('Delete device request');

  const parsed = deviceIdParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return handleApiError(parsed.error, res);
  }

  const validatedData: DeleteDeviceRequest =
    deleteDeviceRequestBodySchema.parse(req.body);

  try {
    const deleted = await deleteDeviceById(
      parsed.data.id,
      validatedData.householdId
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ error: 'Device not found or not part of household' });
    }

    return res.status(200).json({
      message: 'Device deleted successfully',
      id: deleted.id,
      deleted: true
    });
  } catch (err: unknown) {
    return handleApiError(err, res);
  }
}
