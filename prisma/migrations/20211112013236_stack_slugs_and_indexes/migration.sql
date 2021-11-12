/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Stack` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Stack` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Bookmark_host_idx` ON `Bookmark`(`host`);

-- CreateIndex
CREATE INDEX `Post_publishedAt_idx` ON `Post`(`publishedAt`);

-- CreateIndex
CREATE UNIQUE INDEX `Stack_slug_key` ON `Stack`(`slug`);
