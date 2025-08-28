import type { Device, DeviceConfig } from '@prisma/client';

/**
 * Type for successful device registration response, omitting createdAt and updatedAt.
 */
export type registerDeviceSuccess = Omit<Device, 'createdAt' | 'updatedAt'>;

/**
 * Interface for successful device deletion response.
 * Contains message, id, and deleted flag.
 */
export interface DeleteDeviceSuccess {
  message: string;
  id: number;
  deleted: boolean;
}

/**
 * Type for device object with optional config property.
 */
export interface DeviceWithConfig extends Device {
  config?: DeviceConfig;
}
