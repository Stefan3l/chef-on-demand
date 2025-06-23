-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromName` VARCHAR(191) NOT NULL,
    `fromEmail` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `fromChef` BOOLEAN NOT NULL DEFAULT false,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chefId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `Chef`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
