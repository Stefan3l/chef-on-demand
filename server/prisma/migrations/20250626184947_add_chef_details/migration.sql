-- CreateTable
CREATE TABLE `ChefDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `story` VARCHAR(191) NULL,
    `startCooking` VARCHAR(191) NULL,
    `secret` VARCHAR(191) NULL,
    `chefId` INTEGER NOT NULL,

    UNIQUE INDEX `ChefDetails_chefId_key`(`chefId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChefDetails` ADD CONSTRAINT `ChefDetails_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `Chef`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
