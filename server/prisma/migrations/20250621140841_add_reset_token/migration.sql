/*
  Warnings:

  - Made the column `category` on table `dishimage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `dishimage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dishimage` MODIFY `category` VARCHAR(191) NOT NULL,
    MODIFY `price` DOUBLE NOT NULL;
