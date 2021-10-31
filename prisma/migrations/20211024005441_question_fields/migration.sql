/*
  Warnings:

  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - Added the required column `description` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Question` DROP COLUMN `text`,
    ADD COLUMN `description` VARCHAR(1024) NOT NULL,
    ADD COLUMN `title` VARCHAR(64) NOT NULL;
