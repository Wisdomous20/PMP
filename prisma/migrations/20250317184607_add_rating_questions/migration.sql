/*
  Warnings:

  - You are about to drop the column `archived` on the `ServiceRequest` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "status" ADD VALUE 'archived';

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "archived",
ADD COLUMN     "deleteAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "RatingQuestion" (
    "_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "serviceRequestRatingId" TEXT NOT NULL,

    CONSTRAINT "RatingQuestion_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "RatingQuestion" ADD CONSTRAINT "RatingQuestion_serviceRequestRatingId_fkey" FOREIGN KEY ("serviceRequestRatingId") REFERENCES "ServiceRequestRating"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
