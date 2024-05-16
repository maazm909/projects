/*
  Warnings:

  - Added the required column `email` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `QuranAttendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendee` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quranattendee` ADD COLUMN `email` VARCHAR(191) NOT NULL;
