import { prisma } from "@/lib/prisma";

export default async function addApprovedStatus(serviceRequestId: string) {
  try {
    const status = await prisma.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "approved",
        timestamp: new Date()
      },
    });
    console.log("Approved status added:", status);
    return status;
  } catch (error) {
    console.error("Error adding approved status:", error);
    throw error;
  }
}