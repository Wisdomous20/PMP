/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `ServiceRequestRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratings` to the `ServiceRequestRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceRequestId` to the `ServiceRequestRating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_serviceRequestRatingId_fkey";

-- AlterTable
ALTER TABLE "ServiceRequestRating" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "ratings" INTEGER NOT NULL,
ADD COLUMN     "serviceRequestId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Rating";
