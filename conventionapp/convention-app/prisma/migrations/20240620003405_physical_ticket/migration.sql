/*
  Warnings:

  - You are about to drop the `quranattendee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `quranattendee`;

-- CreateTable
CREATE TABLE `physicalTicket` (
    `ticketNum` INTEGER NOT NULL,
    `ticketPrice` INTEGER NOT NULL,
    `alreadyPaid` BOOLEAN NOT NULL,

    PRIMARY KEY (`ticketNum`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
