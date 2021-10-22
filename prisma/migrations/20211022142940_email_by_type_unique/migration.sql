/*
  Warnings:

  - The primary key for the `EmailSubscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email,type]` on the table `EmailSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `EmailSubscription_email_key` ON `EmailSubscription`;

-- DropIndex
DROP INDEX `EmailSubscription_email_type_idx` ON `EmailSubscription`;

-- AlterTable
ALTER TABLE `EmailSubscription` DROP PRIMARY KEY;

-- CreateIndex
CREATE UNIQUE INDEX `EmailSubscription_email_type_key` ON `EmailSubscription`(`email`, `type`);
