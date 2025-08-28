import { z } from 'zod';

/**
 * Zod schema for device registration validation.
 * Requires serialNumber, name, householdId, deviceTypeId, and optional description/firmwareVersion.
 */
export const deviceSchema = z.object({
  serialNumber: z.string('Serial number is required'),
  name: z.string('Name is required'),
  description: z.string().optional(),
  firmwareVersion: z.string().optional(),
  householdId: z.number('Household ID is required'),
  deviceTypeId: z.number('Device Type ID is required')
});

/**
 * Zod schema for device ID parameter validation.
 * Requires numeric string ID.
 */
export const deviceIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Device ID must be a number').transform(Number)
});

/**
 * Zod schema for delete device request body validation.
 * Requires householdId as a number.
 */
export const deleteDeviceRequestBodySchema = z.object({
  householdId: z.number('Device ID must be a number')
});

/**
 * Type for device request inferred from deviceSchema.
 */
export type DeviceRequest = z.infer<typeof deviceSchema>;
/**
 * Type for device ID params inferred from deviceIdParamsSchema.
 */
export type DeviceIdParams = z.infer<typeof deviceIdParamsSchema>;
/**
 * Type for delete device request inferred from deleteDeviceRequestBodySchema.
 */
export type DeleteDeviceRequest = z.infer<typeof deleteDeviceRequestBodySchema>;
