-- AlterTable
ALTER TABLE `chef` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `language` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `radius_km` INTEGER NULL;
