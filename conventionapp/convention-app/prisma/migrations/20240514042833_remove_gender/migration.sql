/*
  Warnings:

  - You are about to alter the column `gender` on the `attendee` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to alter the column `gender` on the `bazaarsponsor` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `gender` on the `quranattendee` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `attendee` MODIFY `gender` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `bazaarsponsor` MODIFY `gender` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quranattendee` MODIFY `gender` VARCHAR(191) NOT NULL;
