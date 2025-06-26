/*
  Warnings:

  - You are about to drop the column `caption` on the `dish` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `dish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dish` DROP COLUMN `caption`,
    DROP COLUMN `price`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `url` VARCHAR(191) NULL;
