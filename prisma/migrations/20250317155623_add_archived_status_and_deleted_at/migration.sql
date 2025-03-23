/*
  Warnings:

  - You are about to drop the column `archived` on the `ServiceRequest` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "status" ADD VALUE 'archived';

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "archived",
ADD COLUMN     "deleteAt" TIMESTAMP(3);
