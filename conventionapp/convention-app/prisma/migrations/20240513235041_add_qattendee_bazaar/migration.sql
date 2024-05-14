/*
  Warnings:

  - You are about to drop the column `quranComp` on the `attendee` table. All the data in the column will be lost.
  - You are about to drop the column `quranLevel` on the `attendee` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `attendee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `attendee` DROP COLUMN `quranComp`,
    DROP COLUMN `quranLevel`,
    ADD COLUMN `checkedIn` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `gender` ENUM('MALE', 'FEMALE') NOT NULL;

-- CreateTable
CREATE TABLE `QuranAttendee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `checkedIn` BOOLEAN NOT NULL DEFAULT false,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BazaarSponsor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `numberCheckedIn` INTEGER NOT NULL,
    `totalNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
