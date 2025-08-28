import { prisma } from '../database/index';

import type { Device } from '@prisma/client';
import type { DeviceRequest } from '../schemas/device';

/**
 * Creates a new device in the database.
 * @param data Device registration data
 * @returns Created device
 */
export async function createDevice(data: DeviceRequest): Promise<Device> {
  const {
    serialNumber,
    name,
    description,
    firmwareVersion,
    householdId,
    deviceTypeId
  } = data;
  return await prisma.device.create({
    data: {
      serialNumber,
      name,
      description,
      firmwareVersion,
      householdId,
      deviceTypeId
    }
  });
}

/**
 * Retrieves a device by its ID, including config.
 * @param id Device ID
 * @returns Device with config or null
 */
export async function getDeviceById(id: number): Promise<Device | null> {
  return await prisma.device.findUnique({
    where: { id },
    include: { config: true }
  });
}

/**
 * Deletes a device by its ID if it belongs to the specified household.
 * @param deviceId Device ID
 * @param householdId Household ID
 * @returns Deleted device or null
 */
export async function deleteDeviceById(
  deviceId: number,
  householdId: number
): Promise<Device | null> {
  // verify that the device belongs to the household
  const device = await prisma.device.findFirst({
    where: { id: deviceId, householdId }
  });

  if (!device) {
    return null;
  }

  // Delete the device
  return await prisma.device.delete({ where: { id: deviceId } });
}
