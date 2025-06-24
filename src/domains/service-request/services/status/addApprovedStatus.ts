import { prisma } from "@/lib/prisma";

export default async function addApprovedStatus(serviceRequestId: string, note: string) {
  try {
    const status = await prisma.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "approved",
        timestamp: new Date(),
        note: note
      },
    });
    return status;
  } catch (error) {
    console.error("Error adding approved status:", error);
    throw error;
  }
}