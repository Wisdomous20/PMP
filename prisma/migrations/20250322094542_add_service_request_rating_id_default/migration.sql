/*
  Warnings:

  - A unique constraint covering the columns `[serviceRequestId]` on the table `ServiceRequestRating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ServiceRequestRating" DROP CONSTRAINT "ServiceRequestRating__id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequestRating_serviceRequestId_key" ON "ServiceRequestRating"("serviceRequestId");

-- AddForeignKey
ALTER TABLE "ServiceRequestRating" ADD CONSTRAINT "ServiceRequestRating_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
