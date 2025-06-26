/*
  Warnings:

  - You are about to drop the `menucategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menucategorydish` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menudish` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `menucategory` DROP FOREIGN KEY `MenuCategory_menuId_fkey`;

-- DropForeignKey
ALTER TABLE `menucategorydish` DROP FOREIGN KEY `MenuCategoryDish_dishId_fkey`;

-- DropForeignKey
ALTER TABLE `menucategorydish` DROP FOREIGN KEY `MenuCategoryDish_menuCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `menudish` DROP FOREIGN KEY `MenuDish_dishId_fkey`;

-- DropForeignKey
ALTER TABLE `menudish` DROP FOREIGN KEY `MenuDish_menuId_fkey`;

-- DropTable
DROP TABLE `menucategory`;

-- DropTable
DROP TABLE `menucategorydish`;

-- DropTable
DROP TABLE `menudish`;

-- CreateTable
CREATE TABLE `MenuItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `menuId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
