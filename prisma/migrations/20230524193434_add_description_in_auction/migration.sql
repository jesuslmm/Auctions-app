/*
  Warnings:

  - Added the required column `description` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "description" TEXT NOT NULL;
