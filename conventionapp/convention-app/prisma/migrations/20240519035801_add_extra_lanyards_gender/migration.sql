/*
  Warnings:

  - You are about to drop the column `numberCheckedIn` on the `bazaarsponsorgroup` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `bazaarsponsorgroup` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `gender` on the `quranattendee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to drop the column `numberCheckedIn` on the `speakerandgroup` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `speakerandgroup` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - Added the required column `extraLanyards` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraLanyards` to the `BazaarSponsorGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timesCheckedIn` to the `BazaarSponsorGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraLanyards` to the `OnlineGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraLanyards` to the `SpeakerAndGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timesCheckedIn` to the `SpeakerAndGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendee` ADD COLUMN `extraLanyards` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `bazaarsponsorgroup` DROP COLUMN `numberCheckedIn`,
    ADD COLUMN `extraLanyards` INTEGER NOT NULL,
    ADD COLUMN `timesCheckedIn` INTEGER NOT NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE') NOT NULL;

-- AlterTable
ALTER TABLE `onlinegroup` ADD COLUMN `extraLanyards` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `quranattendee` MODIFY `gender` ENUM('MALE', 'FEMALE') NOT NULL;

-- AlterTable
ALTER TABLE `speakerandgroup` DROP COLUMN `numberCheckedIn`,
    ADD COLUMN `extraLanyards` INTEGER NOT NULL,
    ADD COLUMN `timesCheckedIn` INTEGER NOT NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE') NOT NULL;
