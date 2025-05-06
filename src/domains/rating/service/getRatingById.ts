import { prisma } from "@/lib/prisma";

interface ServiceRequestDetails {
  id: string;
  userId: string;
  concern: string;
  details: string;
}

interface Rating {
  id: string;
  serviceRequestDetails: ServiceRequestDetails;
  ratingValue: number;
  comment: string;
}

export default async function getRatingById(serviceRequestId: string): Promise<Rating> {
  try {
    const rating = await prisma.serviceRequestRating.findUnique({
      where: { serviceRequestId },
      include: {
        serviceRequest: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!rating) {
      throw new Error(`Rating not found for service request ID: ${serviceRequestId}`);
    }

    const { id, serviceRequest, ratings: ratingValue, description: comment } = rating;

    const serviceRequestDetails: ServiceRequestDetails = {
      id: serviceRequest.id,
      userId: serviceRequest.userId,
      concern: serviceRequest.concern,
      details: serviceRequest.details,
    };

    return {
      id,
      serviceRequestDetails,
      ratingValue,
      comment,
    };
  } catch (error) {
    console.error("Error fetching rating by ID:", error);
    throw new Error("Failed to fetch rating. Please try again later.");
  }
}