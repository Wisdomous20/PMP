import { prisma } from "@/lib/prisma";
import addCompletedStatus from "@/domains/service-request/services/status/addCompletedStatus";

export default async function updateImplementationPlanStatus(
  serviceRequestId: string,
  status: string
) {
  try {
    console.log(`Updating implementation plan status for ID: ${serviceRequestId} to ${status}`);
  const existingPlan = await prisma.implementationPlan.findUnique({
    where: { serviceRequestId },
  });

    if (!existingPlan) {
      console.error('DB Service: Plan not found:', serviceRequestId);
      throw new Error('Implementation plan not found');
    }

    const updatedPlan = await prisma.implementationPlan.update({
      where: {
        serviceRequestId
      },
      data: {
        status: status
      },
      include: {
        serviceRequest: true,
        tasks: true
      }
    });

    if (status === "completed") {
      await addCompletedStatus(existingPlan.serviceRequestId);
    }    
    return updatedPlan;
  
  } catch (error) {
    console.error('DB Service: Update failed:', {
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}