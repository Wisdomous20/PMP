import { prisma } from "@/lib/prisma";

export default async function addCompletedStatus(serviceRequestId: string, note: string) {

  try {
    const status = await prisma.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: "completed",
        timestamp: new Date(),
        note: note
      },
    });
    console.log("In Progress status added:", status);
    return status;
  } catch (error) {
    console.error("Error adding In Progress status:", error);
    throw error;
  }
}
