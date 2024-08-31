/*
  Warnings:

  - Added the required column `timesCheckedIn` to the `PhysicalTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `physicalticket` ADD COLUMN `timesCheckedIn` INTEGER NOT NULL;
