import { prisma } from "@/lib/prisma";

interface RatingData {
  startOnTime: string;
  startReason: string | null;
  achievedResults: string;
  resultReason: string | null;
  satisfaction: number;
  feedback: string;
}

export default async function addRatingStatus(
  serviceRequestId: string,
  rating: number,
  description: string,
  ratingData: RatingData
) {
  try {
    const serviceRequestRating = await prisma.serviceRequestRating.create({
      data: {
        serviceRequestId,
        ratings: rating,
        description,
        questions: {
          create: [
            {
              question: "Did the project start on time?",
              answer: ratingData.startOnTime,
            },
            {
              question: "Reason for delay",
              answer: ratingData.startReason,
            },
            {
              question: "Did the plan achieve the desired results?",
              answer: ratingData.achievedResults,
            },
            {
              question: "Reason for not achieving results",
              answer: ratingData.resultReason,
            },
            {
              question: "How satisfied are you?",
              answer: ratingData.satisfaction?.toString() || "",
            },
            {
              question: "Additional feedback",
              answer: ratingData.feedback,
            },
          ],
        },
      },
    });

    return serviceRequestRating;
  } catch (error) {
    console.error("Failed to create service request rating:", error);
    throw new Error("Database operation failed. Please check the input data.");

    throw error;
  }
}
