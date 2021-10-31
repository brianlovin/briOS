/*
  Warnings:

  - You are about to drop the column `siteName` on the `Bookmark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Bookmark` DROP COLUMN `siteName`,
    MODIFY `title` VARCHAR(280) NULL,
    MODIFY `host` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(2048) NULL;
