/*
  Warnings:

  - You are about to alter the column `gender` on the `attendee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `attendee` MODIFY `gender` ENUM('MALE', 'FEMALE') NOT NULL;
