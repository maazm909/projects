/*
  Warnings:

  - You are about to drop the column `Age` on the `test` table. All the data in the column will be lost.
  - You are about to drop the column `Gender` on the `test` table. All the data in the column will be lost.
  - Added the required column `age` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `test` DROP COLUMN `Age`,
    DROP COLUMN `Gender`,
    ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL;
