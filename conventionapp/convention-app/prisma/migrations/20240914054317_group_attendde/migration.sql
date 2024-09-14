/*
  Warnings:

  - You are about to drop the column `age` on the `attendee` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `attendee` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `attendee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendee` DROP COLUMN `age`,
    DROP COLUMN `email`,
    DROP COLUMN `gender`;
