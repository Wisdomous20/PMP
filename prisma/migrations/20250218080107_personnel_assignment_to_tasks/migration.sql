/*
  Warnings:

  - You are about to drop the column `implementationPlanId` on the `PersonnelAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId,personnelId]` on the table `PersonnelAssignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `taskId` to the `PersonnelAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PersonnelAssignment" DROP CONSTRAINT "PersonnelAssignment_implementationPlanId_fkey";

-- AlterTable
ALTER TABLE "PersonnelAssignment" DROP COLUMN "implementationPlanId",
ADD COLUMN     "assignedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "taskId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PersonnelAssignment_taskId_personnelId_key" ON "PersonnelAssignment"("taskId", "personnelId");

-- AddForeignKey
ALTER TABLE "PersonnelAssignment" ADD CONSTRAINT "PersonnelAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
