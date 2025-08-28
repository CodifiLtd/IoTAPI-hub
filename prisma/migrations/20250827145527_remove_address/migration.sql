/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Address] DROP CONSTRAINT [Address_householdId_fkey];

-- DropTable
DROP TABLE [dbo].[Address];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
