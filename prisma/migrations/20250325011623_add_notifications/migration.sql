-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('inventory', 'service_request', 'implementation_plan', 'personnel');

-- CreateTable
CREATE TABLE "RatingQuestion" (
    "_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "serviceRequestRatingId" TEXT NOT NULL,

    CONSTRAINT "RatingQuestion_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "RatingQuestion" ADD CONSTRAINT "RatingQuestion_serviceRequestRatingId_fkey" FOREIGN KEY ("serviceRequestRatingId") REFERENCES "ServiceRequestRating"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
