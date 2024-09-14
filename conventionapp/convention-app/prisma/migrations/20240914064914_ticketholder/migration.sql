/*
  Warnings:

  - You are about to drop the column `timesCheckedIn` on the `physicalticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `physicalticket` DROP COLUMN `timesCheckedIn`;

-- CreateTable
CREATE TABLE `TicketHolder` (
    `id` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `totalTickets` INTEGER NOT NULL,
    `timesCheckedIn` INTEGER NOT NULL,
    `extraLanyards` INTEGER NOT NULL,
    `firstCheckedIn` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
