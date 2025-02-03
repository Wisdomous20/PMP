-- CreateEnum
CREATE TYPE "equipment_status" AS ENUM ('Operational', 'Repairable', 'Scrap');

-- CreateTable
CREATE TABLE "Equipment" (
    "_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "datePurchased" TIMESTAMP(3) NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "status" "equipment_status" NOT NULL,
    "location" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "serviceRequestId" TEXT,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
