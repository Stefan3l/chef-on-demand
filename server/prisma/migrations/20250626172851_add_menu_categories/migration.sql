-- CreateTable
CREATE TABLE `MenuCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `menuId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuCategoryDish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menuCategoryId` INTEGER NOT NULL,
    `dishId` INTEGER NOT NULL,

    UNIQUE INDEX `MenuCategoryDish_menuCategoryId_dishId_key`(`menuCategoryId`, `dishId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuCategory` ADD CONSTRAINT `MenuCategory_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryDish` ADD CONSTRAINT `MenuCategoryDish_menuCategoryId_fkey` FOREIGN KEY (`menuCategoryId`) REFERENCES `MenuCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryDish` ADD CONSTRAINT `MenuCategoryDish_dishId_fkey` FOREIGN KEY (`dishId`) REFERENCES `Dish`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
