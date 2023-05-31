/*
  Warnings:

  - Added the required column `category` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Gaming', 'Electronic', 'Art', 'Antiques', 'Jewerly', 'Sports', 'Clothes', 'Toys', 'Books');

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "category" "CategoryType" NOT NULL;
