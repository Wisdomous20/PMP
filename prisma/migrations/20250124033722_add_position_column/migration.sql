/*
  Warnings:

  - Added the required column `position` to the `Personnel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "position" TEXT NOT NULL;
