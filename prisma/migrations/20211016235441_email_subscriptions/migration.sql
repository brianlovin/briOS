-- CreateTable
CREATE TABLE `EmailSubscription` (
    `email` VARCHAR(191) NOT NULL,
    `type` ENUM('HACKER_NEWS') NOT NULL,

    UNIQUE INDEX `EmailSubscription_email_key`(`email`),
    INDEX `EmailSubscription_email_type_idx`(`email`, `type`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
