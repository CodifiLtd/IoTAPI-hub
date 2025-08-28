/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `DeviceConfig` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[DeviceConfig] ADD CONSTRAINT [DeviceConfig_deviceId_key] UNIQUE NONCLUSTERED ([deviceId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
