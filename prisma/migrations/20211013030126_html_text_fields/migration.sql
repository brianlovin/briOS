/*
  Warnings:

  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(16)`.
  - You are about to alter the column `location` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE `Bookmark` MODIFY `description` VARCHAR(2048) NOT NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `text` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `username` VARCHAR(16) NOT NULL,
    MODIFY `description` VARCHAR(256),
    MODIFY `location` VARCHAR(32);

-- RenameIndex
ALTER TABLE `Audio` RENAME INDEX `Audio_commentId_unique` TO `Audio_commentId_key`;
