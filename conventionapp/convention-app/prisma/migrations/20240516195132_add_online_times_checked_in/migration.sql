/*
  Warnings:

  - Added the required column `timesCheckedIn` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendee` ADD COLUMN `timesCheckedIn` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `OnlineGroup` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `totalTickets` INTEGER NOT NULL,
    `timesCheckedIn` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
