import { prisma } from "@/lib/prisma";

export default async function createServiceRequest(userId: string, concern: string, details: string) {
  try {
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId,
        concern,
        details,
        status: {
          create: {
            status: "pending",
            timestamp: new Date(),
          },
        },
      },
    });

    return serviceRequest;
  } catch (error) {
    console.error("Error creating service request:", error);
    throw new Error("Failed to create service request");
  }
}
