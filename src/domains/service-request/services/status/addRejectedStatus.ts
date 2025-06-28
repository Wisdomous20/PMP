import { prisma } from "@/lib/prisma";

export default async function addRejectedStatus(serviceRequestId: string, note: string) {
  try {
    const status = await prisma.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "rejected",
        timestamp: new Date(),
        note: note
      },
    });
    return status;
  } catch (error) {
    console.error("Error adding rejected status:", error);
    throw error;
  }
}