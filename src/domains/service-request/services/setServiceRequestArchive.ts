import { prisma } from "@/lib/prisma";

export default async function archiveServiceRequest(serviceRequestId: string) {
  try {
    const updatedServiceRequest = await prisma.serviceRequest.update({
      where: { id: serviceRequestId },
      data: { archived: true },
    });

    return updatedServiceRequest;
  } catch (error) {
    console.error("Error archiving service request:", error);
    throw new Error("Failed to archive service request");
  }
}