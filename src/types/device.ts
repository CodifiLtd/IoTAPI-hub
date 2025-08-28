import type { Device, DeviceConfig } from '@prisma/client';

export type registerDeviceSuccess = Omit<Device, 'createdAt' | 'updatedAt'>;

export interface DeleteDeviceSuccess {
  message: string;
  id: number;
  deleted: boolean;
}

export interface DeviceWithConfig extends Device {
  config?: DeviceConfig;
}
