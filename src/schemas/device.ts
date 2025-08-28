import { z } from 'zod';

export const deviceSchema = z.object({
  serialNumber: z.string('Serial number is required'),
  name: z.string('Name is required'),
  description: z.string().optional(),
  firmwareVersion: z.string().optional(),
  householdId: z.number('Household ID is required'),
  deviceTypeId: z.number('Device Type ID is required')
});

export const deviceIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Device ID must be a number').transform(Number)
});

export const deleteDeviceRequestBodySchema = z.object({
  householdId: z.number('Device ID must be a number')
});

export type DeviceRequest = z.infer<typeof deviceSchema>;
export type DeviceIdParams = z.infer<typeof deviceIdParamsSchema>;
export type DeleteDeviceRequest = z.infer<typeof deleteDeviceRequestBodySchema>;
