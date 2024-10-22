-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('ADMIN', 'USER', 'SUPERVISOR');

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "user_type" "user_type" NOT NULL,
    "department" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "_id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ServiceRequestStatus" (
    "_id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "ServiceRequestStatus_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ServiceRequestRating" (
    "_id" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestRating_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "_id" TEXT NOT NULL,
    "serviceRequestRatingId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ImplementationPlan" (
    "_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ImplementationPlan_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "_id" TEXT NOT NULL,
    "implementationPlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "checked" BOOLEAN NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Files" (
    "_id" TEXT NOT NULL,
    "implementationPlanId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Personnel" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PersonnelAssignment" (
    "_id" TEXT NOT NULL,
    "personnelId" TEXT NOT NULL,
    "implementationPlanId" TEXT NOT NULL,

    CONSTRAINT "PersonnelAssignment_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestStatus" ADD CONSTRAINT "ServiceRequestStatus_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestRating" ADD CONSTRAINT "ServiceRequestRating__id_fkey" FOREIGN KEY ("_id") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_serviceRequestRatingId_fkey" FOREIGN KEY ("serviceRequestRatingId") REFERENCES "ServiceRequestRating"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImplementationPlan" ADD CONSTRAINT "ImplementationPlan__id_fkey" FOREIGN KEY ("_id") REFERENCES "ServiceRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_implementationPlanId_fkey" FOREIGN KEY ("implementationPlanId") REFERENCES "ImplementationPlan"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_implementationPlanId_fkey" FOREIGN KEY ("implementationPlanId") REFERENCES "ImplementationPlan"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonnelAssignment" ADD CONSTRAINT "PersonnelAssignment_implementationPlanId_fkey" FOREIGN KEY ("implementationPlanId") REFERENCES "ImplementationPlan"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonnelAssignment" ADD CONSTRAINT "PersonnelAssignment_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
