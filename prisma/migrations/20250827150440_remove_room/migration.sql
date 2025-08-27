/*
  Warnings:

  - You are about to drop the column `roomId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Device] DROP CONSTRAINT [Device_roomId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Room] DROP CONSTRAINT [Room_householdId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Device] DROP COLUMN [roomId];

-- DropTable
DROP TABLE [dbo].[Room];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
