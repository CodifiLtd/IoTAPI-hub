/*
  Warnings:

  - You are about to drop the column `operatingStatusId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the `OperatingStatus` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_operatingStatusId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Device] DROP COLUMN [operatingStatusId];

-- DropTable
DROP TABLE [dbo].[OperatingStatus];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
