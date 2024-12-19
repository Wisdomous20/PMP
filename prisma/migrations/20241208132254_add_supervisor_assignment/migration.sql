-- CreateTable
CREATE TABLE "SupervisorAssignment" (
    "_id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupervisorAssignment_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupervisorAssignment_serviceRequestId_key" ON "SupervisorAssignment"("serviceRequestId");

-- AddForeignKey
ALTER TABLE "SupervisorAssignment" ADD CONSTRAINT "SupervisorAssignment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisorAssignment" ADD CONSTRAINT "SupervisorAssignment_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
