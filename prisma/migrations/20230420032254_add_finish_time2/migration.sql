/*
  Warnings:

  - Changed the type of `finishTime` on the `Auction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "finishTime",
ADD COLUMN     "finishTime" TIMESTAMP(3) NOT NULL;
