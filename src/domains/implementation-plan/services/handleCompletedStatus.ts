import { prisma } from '../../../../src/lib/prisma';

export default async function handleCompletedStatus(serviceRequestId: string) {
  try {
    const status = await prisma.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: 'approved',

        timestamp: new Date()
      },
    });
    console.log("Resolved status added:", status);
    return status;
  } catch (error) {
    console.error("Error adding resolved status:", error);
    throw error;
  }
}
