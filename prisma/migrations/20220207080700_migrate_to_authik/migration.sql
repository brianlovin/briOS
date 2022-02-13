/*
  Warnings:

  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authikId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `nickname`,
    ADD COLUMN `authikId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_authikId_key` ON `User`(`authikId`);
