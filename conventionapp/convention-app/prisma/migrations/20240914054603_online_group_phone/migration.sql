/*
  Warnings:

  - You are about to drop the column `email` on the `onlinegroup` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `OnlineGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onlinegroup` DROP COLUMN `email`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
