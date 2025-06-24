/*
  Warnings:

  - You are about to drop the column `radius_km` on the `chef` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chef` DROP COLUMN `radius_km`,
    ADD COLUMN `radiusKm` INTEGER NULL;

-- AlterTable
ALTER TABLE `dish` MODIFY `category` VARCHAR(191) NULL,
    MODIFY `price` DOUBLE NULL;
