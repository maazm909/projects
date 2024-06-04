/*
  Warnings:

  - You are about to drop the column `createdAt` on the `attendee` table. All the data in the column will be lost.
  - Added the required column `firstCheckedIn` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstCheckedIn` to the `BazaarSponsorGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstCheckedIn` to the `OnlineGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstCheckedIn` to the `SpeakerAndGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendee` DROP COLUMN `createdAt`,
    ADD COLUMN `firstCheckedIn` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `bazaarsponsorgroup` ADD COLUMN `firstCheckedIn` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `onlinegroup` ADD COLUMN `firstCheckedIn` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `speakerandgroup` ADD COLUMN `firstCheckedIn` DATETIME(3) NOT NULL;
