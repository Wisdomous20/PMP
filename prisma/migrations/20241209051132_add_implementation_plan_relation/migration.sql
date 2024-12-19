/*
  Warnings:

  - A unique constraint covering the columns `[serviceRequestId]` on the table `ImplementationPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceRequestId` to the `ImplementationPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImplementationPlan" DROP CONSTRAINT "ImplementationPlan__id_fkey";

-- AlterTable
ALTER TABLE "ImplementationPlan" ADD COLUMN     "serviceRequestId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ImplementationPlan_serviceRequestId_key" ON "ImplementationPlan"("serviceRequestId");

-- AddForeignKey
ALTER TABLE "ImplementationPlan" ADD CONSTRAINT "ImplementationPlan_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
