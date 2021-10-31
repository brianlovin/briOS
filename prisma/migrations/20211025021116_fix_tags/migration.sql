/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `Tag` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Tag` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `_PostToTag`;
