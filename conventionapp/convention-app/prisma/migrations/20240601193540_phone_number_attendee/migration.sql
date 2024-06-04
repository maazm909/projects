/*
  Warnings:

  - Added the required column `phoneNumber` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendee` ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `bazaarsponsorgroup` MODIFY `firstCheckedIn` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `onlinegroup` MODIFY `firstCheckedIn` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `speakerandgroup` MODIFY `firstCheckedIn` DATETIME(3) NULL;
