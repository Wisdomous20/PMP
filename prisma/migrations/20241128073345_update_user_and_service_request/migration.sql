/*
  Warnings:

  - You are about to drop the column `title` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `concern` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellphoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `department` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "title",
ADD COLUMN     "concern" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "cellphoneNumber" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "localNumber" TEXT,
ALTER COLUMN "department" SET NOT NULL;
