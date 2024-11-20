/*
  Warnings:

  - Changed the type of `status` on the `ServiceRequestStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('pending', 'approved', 'rejected', 'in_progress');

-- AlterTable
ALTER TABLE "ServiceRequestStatus" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL;
