/*
  Warnings:

  - You are about to drop the column `totalTickets` on the `ticketholder` table. All the data in the column will be lost.
  - Made the column `firstCheckedIn` on table `ticketholder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ticketholder` DROP COLUMN `totalTickets`,
    ADD COLUMN `checkedIn` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `firstCheckedIn` DATETIME(3) NOT NULL;
