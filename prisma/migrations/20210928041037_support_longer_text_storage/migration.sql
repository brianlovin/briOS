/*
  Warnings:

  - Made the column `description` on table `Bookmark` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Bookmark` MODIFY `title` VARCHAR(280) NOT NULL,
    MODIFY `description` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `text` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `title` VARCHAR(280) NOT NULL,
    MODIFY `text` TEXT NOT NULL,
    MODIFY `excerpt` VARCHAR(280) NOT NULL;

-- AlterTable
ALTER TABLE `PostEdit` MODIFY `text` TEXT NOT NULL,
    MODIFY `title` VARCHAR(280) NOT NULL,
    MODIFY `excerpt` VARCHAR(280) NOT NULL;

-- AlterTable
ALTER TABLE `Question` MODIFY `text` VARCHAR(280) NOT NULL;

-- AlterTable
ALTER TABLE `Stack` MODIFY `description` VARCHAR(280) NOT NULL;
