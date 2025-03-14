-- AlterEnum
ALTER TYPE "status" ADD VALUE 'archive';

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "deleteAt" TIMESTAMP(3);
